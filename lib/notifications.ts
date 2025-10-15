import { UserProfile } from './types';

interface UnlockEvent {
  type: 'successful_unlock' | 'wrong_pin' | 'guest_passcode_used' | 'rate_limited';
  phoneNumber: string;
  timestamp: Date;
  passcodeLabel?: string;
  enteredCode?: string;
  doorCode?: string;
}

/**
 * Check if we're in quiet hours
 */
function isQuietHours(profile: UserProfile): boolean {
  if (!profile.quietHoursEnabled || !profile.quietHoursStart || !profile.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const start = profile.quietHoursStart;
  const end = profile.quietHoursEnd;

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (start > end) {
    return currentTime >= start || currentTime < end;
  }

  // Handle same-day quiet hours (e.g., 13:00 - 15:00)
  return currentTime >= start && currentTime < end;
}

/**
 * Send unlock notification via email
 */
async function sendEmailNotification(profile: UserProfile, event: UnlockEvent): Promise<void> {
  // Skip if quiet hours
  if (isQuietHours(profile)) {
    console.log(`[Notifications] Skipping email - quiet hours active`);
    return;
  }

  // DEV MODE: Just log
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] Email notification would be sent:', {
      to: profile.email,
      event: event.type,
      phoneNumber: event.phoneNumber,
    });
    return;
  }

  try {
    // TODO: Implement actual email sending via Resend or similar
    // For now, just log
    console.log('Email notification:', {
      to: profile.email,
      subject: getEmailSubject(event),
      body: getEmailBody(event, profile),
    });

    // Example implementation:
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: profile.email,
    //     subject: getEmailSubject(event),
    //     html: getEmailBody(event, profile),
    //   }),
    // });
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Send unlock notification via SMS
 */
async function sendSmsNotification(profile: UserProfile, event: UnlockEvent): Promise<void> {
  if (!profile.notifyPhoneNumber) {
    return;
  }

  // Skip if quiet hours
  if (isQuietHours(profile)) {
    console.log(`[Notifications] Skipping SMS - quiet hours active`);
    return;
  }

  // DEV MODE: Just log
  if (process.env.DEV_MODE === 'true') {
    console.log('[DEV MODE] SMS notification would be sent:', {
      to: profile.notifyPhoneNumber,
      event: event.type,
      phoneNumber: event.phoneNumber,
    });
    return;
  }

  try {
    // TODO: Implement actual SMS sending via Twilio/SignalWire
    console.log('SMS notification:', {
      to: profile.notifyPhoneNumber,
      body: getSmsBody(event),
    });

    // Example implementation:
    // await twilioClient.messages.create({
    //   to: profile.notifyPhoneNumber,
    //   from: profile.signalwirePhoneNumber,
    //   body: getSmsBody(event),
    // });
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
}

function getEmailSubject(event: UnlockEvent): string {
  switch (event.type) {
    case 'successful_unlock':
      return '✅ Door Unlocked - BuzEntry';
    case 'wrong_pin':
      return '⚠️ Wrong PIN Attempt - BuzEntry';
    case 'guest_passcode_used':
      return '🔑 Guest Access Used - BuzEntry';
    case 'rate_limited':
      return '🚨 Security Alert: Rate Limit Triggered - BuzEntry';
    default:
      return 'BuzEntry Notification';
  }
}

function getEmailBody(event: UnlockEvent, profile: UserProfile): string {
  const time = event.timestamp.toLocaleTimeString();
  const date = event.timestamp.toLocaleDateString();

  switch (event.type) {
    case 'successful_unlock':
      return `
        <h2>Door Successfully Unlocked</h2>
        <p>Your door was unlocked at <strong>${time}</strong> on ${date}</p>
        <p><strong>Caller:</strong> ${event.phoneNumber}</p>
        ${event.doorCode ? `<p><strong>Door Code Used:</strong> ${event.doorCode}</p>` : ''}
      `;
    case 'wrong_pin':
      return `
        <h2>Wrong PIN Attempt</h2>
        <p>Someone attempted to unlock your door with an incorrect PIN at <strong>${time}</strong> on ${date}</p>
        <p><strong>Caller:</strong> ${event.phoneNumber}</p>
        ${event.enteredCode ? `<p><strong>Code Entered:</strong> ${event.enteredCode}</p>` : ''}
        <p style="color: #F59E0B;">⚠️ If you don't recognize this caller, consider changing your access code.</p>
      `;
    case 'guest_passcode_used':
      return `
        <h2>Guest Access Used</h2>
        <p>A guest passcode was used to unlock your door at <strong>${time}</strong> on ${date}</p>
        <p><strong>Caller:</strong> ${event.phoneNumber}</p>
        <p><strong>Passcode:</strong> ${event.passcodeLabel || 'Unknown'}</p>
      `;
    case 'rate_limited':
      return `
        <h2>Security Alert: Rate Limit Triggered</h2>
        <p>A caller has exceeded the maximum number of unlock attempts at <strong>${time}</strong> on ${date}</p>
        <p><strong>Caller:</strong> ${event.phoneNumber}</p>
        <p style="color: #EF4444;">🚨 This caller has been temporarily blocked for security reasons.</p>
        <p>They can try again after 15 minutes.</p>
      `;
    default:
      return 'BuzEntry notification';
  }
}

function getSmsBody(event: UnlockEvent): string {
  switch (event.type) {
    case 'successful_unlock':
      return `BuzEntry: Door unlocked by ${event.phoneNumber}`;
    case 'wrong_pin':
      return `BuzEntry Alert: Wrong PIN attempt from ${event.phoneNumber}`;
    case 'guest_passcode_used':
      return `BuzEntry: Guest "${event.passcodeLabel}" accessed from ${event.phoneNumber}`;
    case 'rate_limited':
      return `BuzEntry Security: ${event.phoneNumber} blocked - too many attempts`;
    default:
      return 'BuzEntry notification';
  }
}

/**
 * Main function to send unlock notifications
 */
export async function notifyUnlockEvent(profile: UserProfile, event: UnlockEvent): Promise<void> {
  const promises: Promise<void>[] = [];

  // Send email if enabled
  if (profile.notifyEmail) {
    promises.push(sendEmailNotification(profile, event));
  }

  // Send SMS if enabled
  if (profile.notifySms && profile.notifyPhoneNumber) {
    promises.push(sendSmsNotification(profile, event));
  }

  // Send all notifications concurrently
  await Promise.allSettled(promises);
}
