# BuzEntry - New Features Documentation

## Overview

This document describes the new features added to BuzEntry for enhanced call handling, speech recognition, and event tracking.

## SignalWire Configuration

### Credentials Added

Your SignalWire credentials have been properly configured in `.env.local`:

- **Project ID**: `PT6461249e11881a5efd71f312882d0e4fee482aa143cf506b`
- **API Token**: `9b915745-4360-4fb3-9958-0886722526a5`
- **Space URL**: `rowship.signalwire.com`
- **Signing Key**: `PSK_WzbrJfMRHuzfibjCzBnSZpe9`

### Phone Number Assignment

Russell's phone number has been linked:
- **Email**: russell@rowship.com
- **User ID**: user_1760372935734_puwe7h
- **Phone Number**: +1 (281) 892-8899

## New Features

### 1. Manual Phone Number Assignment

**API Endpoint**: `POST /api/user/phone-number`

Users can now manually assign or update their phone numbers instead of relying solely on auto-provisioning.

**Usage Example**:
```bash
curl -X POST https://buzentry.com/api/user/phone-number \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+12818928899"
  }'
```

**Features**:
- Validates phone number format (E.164)
- Checks for duplicate assignments
- Updates SignalWire configuration
- Creates phone number index for lookups

**Script Usage**:
```bash
npx tsx scripts/link-phone-number.ts <email> <phoneNumber>

# Example:
npx tsx scripts/link-phone-number.ts russell@rowship.com +12818928899
```

---

### 2. Speech Recognition for Access Codes

**Location**: `app/api/signalwire/voice/route.ts`

Callers can now enter access codes by either:
- **Typing on keypad (DTMF)**: Press 4 digits followed by # key
- **Speaking the code**: Say the 4-digit code clearly

**Implementation**:
```xml
<Gather input="dtmf speech"
        numDigits="4"
        timeout="10"
        finishOnKey="#"
        speechTimeout="auto"
        speechModel="numbers_and_commands">
  <Say voice="alice">
    Please enter or speak your 4 digit passcode to unlock the door.
  </Say>
</Gather>
```

**How it works**:
1. Caller calls the BuzEntry number
2. System prompts for access code
3. Caller can either:
   - Press digits on keypad: `1234#`
   - Speak the code: "one two three four"
4. System verifies the code
5. If correct → Door unlocks automatically
6. If incorrect → Access denied

---

### 3. Webhook Event Tracking

#### Status Webhook

**Endpoint**: `POST /api/signalwire/status`

Receives call status updates from SignalWire:

**Events Tracked**:
- `initiated` - Call created
- `ringing` - Call is ringing
- `in-progress` - Call in progress
- `completed` - Call completed successfully ✅
- `failed` - Call failed ❌
- `no-answer` - No answer ❌
- `busy` - Busy signal ❌
- `canceled` - Call canceled

**Data Logged**:
```javascript
{
  callSid: "CA123...",
  callStatus: "completed",
  from: "+12818928899",
  to: "+15555780456",
  duration: 15, // seconds
  timestamp: 1760372935734
}
```

#### Custom Events Webhook

**Endpoint**: `POST /api/signalwire/events`

Tracks custom events for door unlock operations:

**Events**:
- `unlock_success` - Door code sent successfully
- `unlock_failure` - Door code failed to send
- `access_denied` - Access code verification failed
- `access_granted` - Access code verification succeeded

**Usage**:
```javascript
// Send event from your application
await fetch('https://buzentry.com/api/signalwire/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'unlock_success',
    userId: 'user_123',
    phoneNumber: '+12818928899',
    callSid: 'CA123...',
    timestamp: Date.now(),
    details: { doorCode: '4' }
  })
});
```

#### External Webhook Forwarding

Events are automatically forwarded to your main domain webhook endpoint:

**Configuration** (in `.env.local`):
```bash
WEBHOOK_URL="https://buzentry.com/webhooks"
```

**Endpoints that receive events**:
- Status updates: `https://buzentry.com/webhooks` (POST)
- Custom events: `https://buzentry.com/webhooks/events` (POST)

**Payload Format**:
```json
{
  "event": "call_status",
  "callSid": "CA123...",
  "callStatus": "completed",
  "from": "+12818928899",
  "to": "+15555780456",
  "duration": 15,
  "timestamp": 1760372935734,
  "userId": "user_1760372935734_puwe7h"
}
```

---

## Call Flow with New Features

### Standard Unlock Flow

```
1. Caller dials +1 (281) 892-8899
   ↓
2. System prompts: "Please enter or speak your 4 digit code"
   ↓
3a. Caller types: 1234#     OR    3b. Caller says: "one two three four"
   ↓                                    ↓
4. System verifies code
   ↓
5a. If CORRECT:                  5b. If INCORRECT:
   - Says: "Welcome!"              - Says: "Invalid code"
   - Sends door code (4)           - Logs access_denied event
   - Says: "Door unlocked"         - Hangs up
   - Logs unlock_success
   - Hangs up
```

### Auto-Update Door Code Feature

The system supports auto-updating door codes. When you change the door code in the dashboard:

1. Go to Dashboard → Settings
2. Update "Door Code" field
3. Click "Save"
4. New code takes effect immediately
5. All subsequent calls will use the new code

**Code Location**: `app/dashboard/page.tsx:530-552`

---

## Webhook Payload Examples

### Success Event
```json
{
  "event": "unlock_success",
  "userId": "user_1760372935734_puwe7h",
  "phoneNumber": "+12818928899",
  "callSid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
  "timestamp": 1760372935734,
  "details": {
    "doorCode": "4",
    "method": "auto",
    "verificationRequired": false
  }
}
```

### Failure Event
```json
{
  "event": "access_denied",
  "userId": "user_1760372935734_puwe7h",
  "phoneNumber": "+12818928899",
  "callSid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
  "timestamp": 1760372935734,
  "details": {
    "reason": "invalid_code",
    "attemptsRemaining": 0
  }
}
```

### Status Callback
```json
{
  "event": "call_status",
  "callSid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
  "callStatus": "completed",
  "from": "+12818928899",
  "to": "+15555780456",
  "duration": 15,
  "timestamp": 1760372935734,
  "userId": "user_1760372935734_puwe7h"
}
```

---

## Testing

### Test Speech Recognition

1. Call +1 (281) 892-8899
2. When prompted, speak clearly: "one two three four"
3. System should recognize and process the code

### Test DTMF Input

1. Call +1 (281) 892-8899
2. When prompted, type on keypad: `1234#`
3. System should process the code

### Test Webhook Events

Check your webhook endpoint at `https://buzentry.com/webhooks` to verify:
- Call status events are being received
- Custom events are being logged
- All required fields are present

### Monitor Logs

```bash
# View SignalWire logs
grep '\[SignalWire\]' logs/app.log

# View webhook logs
grep 'webhook' logs/app.log
```

---

## Configuration Checklist

- ✅ SignalWire credentials configured
- ✅ Phone number assigned to russell@rowship.com
- ✅ Speech recognition enabled
- ✅ DTMF input enabled
- ✅ Status webhooks configured
- ✅ Custom event webhooks created
- ✅ External webhook forwarding set up
- ⚠️ **TODO**: Configure your webhook endpoint at `https://buzentry.com/webhooks`

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user/phone-number` | POST | Assign phone number to user |
| `/api/signalwire/voice` | POST | Handle incoming calls (TwiML) |
| `/api/signalwire/status` | POST | Receive call status updates |
| `/api/signalwire/events` | POST | Log custom door unlock events |

---

## File Changes Summary

### New Files Created:
1. `app/api/user/phone-number/route.ts` - Phone number management API
2. `app/api/signalwire/status/route.ts` - Status callback handler
3. `app/api/signalwire/events/route.ts` - Custom events handler
4. `scripts/link-phone-number.ts` - CLI tool for linking phone numbers

### Modified Files:
1. `lib/signalwire.ts` - Added `assignPhoneNumberToUser()` function
2. `app/api/signalwire/voice/route.ts` - Added speech recognition support
3. `.env.local` - Added SignalWire credentials and webhook URL
4. `.env.local.example` - Updated with new environment variables

---

## Support

For issues or questions:
1. Check logs in console: `[SignalWire]` tags
2. Verify environment variables are loaded
3. Test webhooks using curl or Postman
4. Contact russell@rowship.com for assistance

---

## Next Steps

1. **Deploy to production** - Push changes to your hosting environment
2. **Configure SignalWire webhooks** - Set voice URL and status callback URL in SignalWire dashboard
3. **Set up buzentry.com webhook endpoint** - Create endpoint to receive event data
4. **Test end-to-end** - Make test calls and verify all features work
5. **Monitor events** - Check webhook logs for success/failure tracking
