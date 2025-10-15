// @ts-ignore - SignalWire types have export resolution issues
import { RestClient } from '@signalwire/compatibility-api';

// Initialize SignalWire client
export function getSignalWireClient() {
  const projectId = process.env.SIGNALWIRE_PROJECT_ID;
  const authToken = process.env.SIGNALWIRE_API_TOKEN;
  const spaceUrl = process.env.SIGNALWIRE_SPACE_URL;

  if (!projectId || !authToken || !spaceUrl) {
    throw new Error('SignalWire credentials not configured. Please set SIGNALWIRE_PROJECT_ID, SIGNALWIRE_API_TOKEN, and SIGNALWIRE_SPACE_URL environment variables.');
  }

  return new RestClient(projectId, authToken, { signalwireSpaceUrl: spaceUrl });
}

/**
 * Provisions a new phone number for a user
 * Purchases a real phone number from SignalWire
 */
export async function provisionPhoneNumber(userId: string, preferredAreaCodes?: string[], userEmail?: string): Promise<string> {
  const client = getSignalWireClient();

  try {
    // Use preferred area codes if provided, otherwise fall back to default Houston & Dallas codes
    const areaCodes = preferredAreaCodes || ['281', '713', '832', '346', '469', '214', '972'];
    let availableNumbers: any[] = [];

    for (const areaCode of areaCodes) {
      console.log(`[SignalWire] Searching for numbers in area code ${areaCode}...`);
      availableNumbers = await client.availablePhoneNumbers('US').local.list({
        areaCode,
        limit: 1,
      });

      if (availableNumbers.length > 0) {
        console.log(`[SignalWire] Found available number in ${areaCode}`);
        break;
      }
    }

    if (!availableNumbers.length) {
      console.error('[SignalWire] No available phone numbers found in any area code');
      throw new Error('No available phone numbers found. Please contact support.');
    }

    const phoneNumber = availableNumbers[0].phoneNumber;
    console.log(`[SignalWire] Purchasing phone number: ${phoneNumber}`);

    // Purchase the phone number with full webhook configuration
    const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
      phoneNumber,
      voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/voice`,
      voiceMethod: 'POST',
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/status`,
      statusCallbackMethod: 'POST',
    });

    // Update with friendlyName (create() ignores it, so we need to update separately)
    // Store email in friendlyName for easy identification in SignalWire dashboard
    await client.incomingPhoneNumbers(incomingPhoneNumber.sid).update({
      friendlyName: `BuzEntry - ${userEmail || userId}`,
    });

    console.log(`[SignalWire] ✅ Provisioned phone number ${incomingPhoneNumber.phoneNumber} for user ${userEmail || userId}`);
    return incomingPhoneNumber.phoneNumber;
  } catch (error) {
    console.error('[SignalWire] Error provisioning phone number:', error);
    throw error;
  }
}

/**
 * Release/delete a phone number
 */
export async function releasePhoneNumber(phoneNumber: string): Promise<boolean> {
  const client = getSignalWireClient();

  try {
    const numbers = await client.incomingPhoneNumbers.list({
      phoneNumber,
    });

    if (numbers.length > 0) {
      await client.incomingPhoneNumbers(numbers[0].sid).remove();
      console.log(`Released phone number ${phoneNumber}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error releasing phone number:', error);
    return false;
  }
}

/**
 * Manually assign an existing phone number to a user
 * This is used when you want to assign a specific phone number instead of auto-provisioning
 */
export async function assignPhoneNumberToUser(userId: string, phoneNumber: string, userEmail?: string): Promise<boolean> {
  const client = getSignalWireClient();

  try {
    // Check if the phone number exists in SignalWire
    const numbers = await client.incomingPhoneNumbers.list({
      phoneNumber,
    });

    if (numbers.length === 0) {
      // Phone number doesn't exist, try to purchase it
      console.log(`Phone number ${phoneNumber} not found, attempting to purchase...`);

      const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
        phoneNumber,
        voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/voice`,
        voiceMethod: 'POST',
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/status`,
        statusCallbackMethod: 'POST',
      });

      // Update with friendlyName (create() ignores it, so we need to update separately)
      await client.incomingPhoneNumbers(incomingPhoneNumber.sid).update({
        friendlyName: `BuzEntry - ${userEmail || userId}`,
      });

      console.log(`Purchased and assigned phone number ${incomingPhoneNumber.phoneNumber} to user ${userEmail || userId}`);
      return true;
    }

    // Update existing phone number configuration
    const phoneNumberSid = numbers[0].sid;
    await client.incomingPhoneNumbers(phoneNumberSid).update({
      voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/voice`,
      voiceMethod: 'POST',
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/signalwire/status`,
      statusCallbackMethod: 'POST',
      friendlyName: `BuzEntry - ${userEmail || userId}`,
    });

    console.log(`Updated phone number ${phoneNumber} for user ${userEmail || userId}`);
    return true;
  } catch (error) {
    console.error('Error assigning phone number:', error);
    throw error;
  }
}
