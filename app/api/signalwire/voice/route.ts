import { NextRequest, NextResponse } from 'next/server';
import { logCall } from '@/lib/user-db';
import { kv } from '@vercel/kv';

/**
 * SignalWire Voice Webhook Handler
 * This endpoint is called when someone calls a user's SignalWire number
 *
 * Flow with access code:
 * 1. Initial call → Prompt for access code
 * 2. Gather digits → Verify access code
 * 3. If correct → Send door code
 * 4. If wrong → Deny access
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract call information from SignalWire
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const callSid = formData.get('CallSid') as string;
    const digits = formData.get('Digits') as string | null; // Access code entered by caller via keypad
    const speechResult = formData.get('SpeechResult') as string | null; // Access code spoken by caller

    console.log(`[SignalWire] Call from ${from} to ${to} (CallSid: ${callSid}, Digits: ${digits || 'none'}, Speech: ${speechResult || 'none'})`);

    // If digits or speech are provided, this is a callback from Gather - verify access code
    if (digits || speechResult) {
      const enteredCode = (digits || speechResult) as string;
      const callerNumber = (from || 'unknown') as string;
      return await handleAccessCodeVerification(callSid, enteredCode, callerNumber);
    }

    // Initial call - find user and determine response
    const user = await findUserByPhoneNumber(to);

    if (!user) {
      console.error(`[SignalWire] No user found for phone number: ${to}`);
      return new NextResponse(
        generateTwiML('We\'re sorry, this number is not configured. Please contact support.'),
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // Check subscription status - must be active or trialing
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing') {
      console.log(`[SignalWire] Subscription inactive for user ${user.email}: ${user.subscriptionStatus}`);

      // Send email notification
      const { sendSubscriptionDisabledCallNotification } = await import('@/lib/email');
      await sendSubscriptionDisabledCallNotification(
        user.email,
        from || 'Unknown',
        to || user.signalwirePhoneNumber || 'your number',
      ).catch(err => console.error('Failed to send subscription disabled email:', err));

      // Log the call
      await logCall({
        userId: user.userId,
        phoneNumber: from,
        timestamp: Date.now(),
        status: 'denied',
      });

      return new NextResponse(
        generateTwiML('This service is currently unavailable. The account holder has been notified. Please contact them directly.'),
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // Check if service is paused
    if (user.isPaused) {
      console.log(`[SignalWire] Service paused for user ${user.email}`);

      // If pause forwarding is set, forward to that number
      if (user.pauseForwardingNumber) {
        console.log(`[SignalWire] Forwarding paused call to ${user.pauseForwardingNumber}`);

        await logCall({
          userId: user.userId,
          phoneNumber: from,
          timestamp: Date.now(),
          status: 'forwarded',
          forwardedTo: user.pauseForwardingNumber,
        });

        return new NextResponse(
          generateForwardTwiML([user.pauseForwardingNumber]),
          { headers: { 'Content-Type': 'text/xml' } }
        );
      }

      // Otherwise reject
      await logCall({
        userId: user.userId,
        phoneNumber: from,
        timestamp: Date.now(),
        status: 'paused',
      });

      return new NextResponse(
        generateTwiML('This service is temporarily paused. Please contact the resident directly.'),
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // Auto-answer flow - check if door code is set
    if (!user.doorCode) {
      console.warn(`[SignalWire] No door code set for user ${user.email}`);
      return new NextResponse(
        generateTwiML('Door code not configured. Please set your door code in the dashboard.'),
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // If access code OR active passcodes exist, prompt for code
    const now = Date.now();
    const hasActivePasscodes = user.passcodes && user.passcodes.some((p: any) => {
      if (!p.isActive) return false;
      if (p.expiresAt && p.expiresAt < now) return false;
      if (p.maxUsages && p.usageCount >= p.maxUsages) return false;
      return true;
    });

    if (user.accessCode || hasActivePasscodes) {
      console.log(`[SignalWire] Code verification enabled for user ${user.email}`);

      // Store user info temporarily for verification callback
      await kv.set(`call:${callSid}:verification`, {
        userId: user.userId,
        accessCode: user.accessCode,
        passcodes: user.passcodes || [],
        doorCode: user.doorCode,
        from,
      }, { ex: 300 }); // Expires in 5 minutes

      return new NextResponse(
        generateAccessCodePromptTwiML(!!user.accessCode),
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // No access code or passcodes - proceed with door unlock
    console.log(`[SignalWire] Auto-answering and sending door code: ${user.doorCode}`);

    // Note: Call will be logged by status webhook when completed
    return new NextResponse(
      generateAutoAnswerTwiML(user.doorCode),
      { headers: { 'Content-Type': 'text/xml' } }
    );

  } catch (error) {
    console.error('[SignalWire] Error processing call:', error);
    return new NextResponse(
      generateTwiML('An error occurred. Please try again.'),
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
}

/**
 * Handle access code verification callback
 */
async function handleAccessCodeVerification(
  callSid: string,
  enteredCode: string,
  from: string
): Promise<NextResponse> {
  // Retrieve stored verification data
  const verificationData = await kv.get<{
    userId: string;
    accessCode: string | null;
    passcodes: any[];
    doorCode: string;
    from: string;
  }>(`call:${callSid}:verification`);

  if (!verificationData) {
    console.error(`[SignalWire] No verification data found for call ${callSid}`);
    return new NextResponse(
      generateTwiML('Session expired. Please call again.'),
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }

  // Check if entered code matches access code
  let isValid = false;
  let matchedPasscode: any = null;

  if (verificationData.accessCode && enteredCode === verificationData.accessCode) {
    isValid = true;
    console.log(`[SignalWire] Access code verified for user ${verificationData.userId}`);
  } else {
    // Check if entered code matches any active passcode
    const now = Date.now();
    const activePasscodes = (verificationData.passcodes || []).filter((p: any) => {
      if (!p.isActive) return false;
      if (p.expiresAt && p.expiresAt < now) return false;
      if (p.maxUsages && p.usageCount >= p.maxUsages) return false;
      return true;
    });

    matchedPasscode = activePasscodes.find((p: any) => p.code === enteredCode);
    if (matchedPasscode) {
      isValid = true;
      console.log(`[SignalWire] Passcode verified for user ${verificationData.userId}: ${matchedPasscode.label}`);

      // Update passcode usage
      const { updateUserProfile } = await import('@/lib/user-db');
      const { getUserProfile } = await import('@/lib/user-db');
      const userProfile = await getUserProfile(verificationData.userId);

      if (userProfile) {
        const updatedPasscodes = userProfile.passcodes.map(p =>
          p.id === matchedPasscode.id
            ? { ...p, usageCount: p.usageCount + 1, lastUsedAt: now }
            : p
        );
        await updateUserProfile(verificationData.userId, { passcodes: updatedPasscodes });
      }
    }
  }

  // Always store the entered code for logging purposes
  await kv.set(`call:${callSid}:enteredCode`, enteredCode, { ex: 300 });

  if (isValid) {
    // If a passcode was used, store it for the status webhook to log
    if (matchedPasscode) {
      await kv.set(`call:${callSid}:passcode`, matchedPasscode.label, { ex: 300 });
    } else {
      // Access code was used (not a guest passcode)
      await kv.set(`call:${callSid}:passcode`, 'Access Code', { ex: 300 });
    }

    // Clean up verification data
    await kv.del(`call:${callSid}:verification`);

    // Send door code (call will be logged by status webhook)
    return new NextResponse(
      generateAutoAnswerTwiML(verificationData.doorCode),
      { headers: { 'Content-Type': 'text/xml' } }
    );
  } else{
    console.log(`[SignalWire] Invalid code for user ${verificationData.userId}`);

    // Mark this call as denied for status webhook to handle
    await kv.set(`call:${callSid}:denied`, verificationData.userId, { ex: 300 });

    // Clean up verification data
    await kv.del(`call:${callSid}:verification`);

    // Deny access
    return new NextResponse(
      generateTwiML('Invalid code. Access denied.'),
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
}

/**
 * Find user by their SignalWire phone number
 */
async function findUserByPhoneNumber(phoneNumber: string) {
  const userId = await kv.get<string>(`phone:${phoneNumber}`);

  if (!userId) {
    return null;
  }

  const { getUserProfile } = await import('@/lib/user-db');
  return await getUserProfile(userId);
}

/**
 * Generate TwiML for prompting access code or passcode
 * Supports both DTMF (keypad) and speech input
 * Auto-submits after 4 digits (no # required)
 */
function generateAccessCodePromptTwiML(requiresAccessCode: boolean): string {
  const message = requiresAccessCode
    ? 'Welcome. Please enter your 4 digit access code using your keypad, or speak your code to unlock the door.'
    : 'Welcome. Please enter or speak your 4 digit passcode to unlock the door.';

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf speech" numDigits="4" timeout="10" speechTimeout="auto" speechModel="numbers_and_commands">
    <Say voice="alice">${message}</Say>
  </Gather>
  <Say voice="alice">No code entered. Goodbye.</Say>
  <Hangup/>
</Response>`;
}

/**
 * Generate TwiML for auto-answering and sending DTMF code
 */
function generateAutoAnswerTwiML(doorCode: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Welcome.</Say>
  <Pause length="1"/>
  <Play digits="${doorCode}w"/>
  <Pause length="2"/>
  <Say voice="alice">Thanks for using BuzEntry. Door unlocked.</Say>
  <Hangup/>
</Response>`;
}

/**
 * Generate TwiML for forwarding the call
 */
function generateForwardTwiML(forwardingNumbers: string[]): string {
  const dialNumbers = forwardingNumbers
    .map(number => `    <Number>${number}</Number>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting your call</Say>
  <Dial timeout="30" callerId="\${From}">
${dialNumbers}
  </Dial>
  <Say voice="alice">The resident is not available. Please try again later.</Say>
  <Hangup/>
</Response>`;
}

/**
 * Generate TwiML for speaking a message
 */
function generateTwiML(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
  <Hangup/>
</Response>`;
}
