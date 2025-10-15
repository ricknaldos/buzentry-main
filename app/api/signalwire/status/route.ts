import { NextRequest, NextResponse } from 'next/server';
import { logCall } from '@/lib/user-db';
import { kv } from '@vercel/kv';

/**
 * SignalWire Status Callback Handler
 * This endpoint receives status updates for calls (success, failure, etc.)
 *
 * Status events:
 * - initiated: Call has been created
 * - ringing: The call is ringing
 * - in-progress: Call is in progress
 * - completed: Call completed normally
 * - busy: Callee was busy
 * - failed: Call failed
 * - no-answer: Callee did not answer
 * - canceled: Call was canceled
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract status information
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const duration = formData.get('CallDuration') as string;
    const timestamp = formData.get('Timestamp') as string;

    console.log(`[SignalWire Status] CallSid: ${callSid}, Status: ${callStatus}, From: ${from}, To: ${to}, Duration: ${duration}`);

    // Find user by phone number
    const userId = await kv.get<string>(`phone:${to}`);

    if (userId) {
      // Log significant status events
      if (callStatus === 'completed') {
        // Retrieve the entered code (if any code verification happened)
        const enteredCode = await kv.get<string>(`call:${callSid}:enteredCode`);

        // Check if this call was denied (wrong code entered)
        const wasDenied = await kv.get(`call:${callSid}:denied`);

        if (wasDenied) {
          // Log as denied instead of answered
          await logCall({
            userId,
            phoneNumber: from,
            timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
            status: 'denied',
            duration: duration ? parseInt(duration) : 0,
            codeEntered: enteredCode || undefined,
          });

          // Clean up the flags
          await kv.del(`call:${callSid}:denied`);
          if (enteredCode) await kv.del(`call:${callSid}:enteredCode`);

          console.log(`[SignalWire Status] Call completed but access was denied for user ${userId}, code entered: ${enteredCode || 'none'}`);
        } else {
          // Check if a passcode was used
          const passcodeLabel = await kv.get<string>(`call:${callSid}:passcode`);

          // Normal successful call
          await logCall({
            userId,
            phoneNumber: from,
            timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
            status: 'answered',
            duration: duration ? parseInt(duration) : 0,
            passcodeUsed: passcodeLabel || undefined,
            codeEntered: enteredCode || undefined,
          });

          // Clean up the flags if they exist
          if (passcodeLabel) {
            await kv.del(`call:${callSid}:passcode`);
          }
          if (enteredCode) {
            await kv.del(`call:${callSid}:enteredCode`);
          }

          console.log(`[SignalWire Status] Call completed successfully for user ${userId} using ${passcodeLabel || 'no code'}, code entered: ${enteredCode || 'none'}`);
        }
      } else if (callStatus === 'failed') {
        await logCall({
          userId,
          phoneNumber: from,
          timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
          status: 'missed',
        });

        console.log(`[SignalWire Status] Call failed for user ${userId}`);
      } else if (callStatus === 'no-answer') {
        await logCall({
          userId,
          phoneNumber: from,
          timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
          status: 'missed',
        });

        console.log(`[SignalWire Status] No answer for user ${userId}`);
      } else if (callStatus === 'busy') {
        await logCall({
          userId,
          phoneNumber: from,
          timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
          status: 'missed',
        });

        console.log(`[SignalWire Status] Busy signal for user ${userId}`);
      }
    }

    // Optional: Send webhook to external service (buzentry.com)
    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'call_status',
            callSid,
            callStatus,
            from,
            to,
            duration: duration ? parseInt(duration) : 0,
            timestamp: timestamp ? new Date(timestamp).getTime() : Date.now(),
            userId,
          }),
        });
      } catch (webhookError) {
        console.error('[SignalWire Status] Failed to send webhook:', webhookError);
      }
    }

    // Return 200 OK
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('[SignalWire Status] Error processing status callback:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
