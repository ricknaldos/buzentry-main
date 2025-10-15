import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * SignalWire Events Webhook Handler
 * This endpoint receives custom events for door unlock success/failure
 *
 * Events:
 * - unlock_success: Door code was successfully sent
 * - unlock_failure: Door code verification failed
 * - access_denied: Access code verification failed
 * - access_granted: Access code verification succeeded
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, userId, phoneNumber, callSid, timestamp, details } = body;

    console.log(`[SignalWire Events] Event: ${event}, User: ${userId}, Phone: ${phoneNumber}, CallSid: ${callSid}`);

    // Store event in KV for analytics
    const eventId = `event:${callSid}:${Date.now()}`;
    await kv.set(eventId, {
      event,
      userId,
      phoneNumber,
      callSid,
      timestamp: timestamp || Date.now(),
      details,
    }, { ex: 86400 * 30 }); // Expire after 30 days

    // Add to user's event list
    if (userId) {
      await kv.zadd(`user:${userId}:events`, {
        score: timestamp || Date.now(),
        member: eventId,
      });
    }

    // Optional: Forward to external webhook (buzentry.com)
    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(`${process.env.WEBHOOK_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            userId,
            phoneNumber,
            callSid,
            timestamp: timestamp || Date.now(),
            details,
          }),
        });
      } catch (webhookError) {
        console.error('[SignalWire Events] Failed to forward webhook:', webhookError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SignalWire Events] Error processing event:', error);
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 });
  }
}
