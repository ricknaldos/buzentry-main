import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';
import OnboardingEmail from '@/emails/onboarding';

// Lazy initialization to avoid build-time errors
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail(
  email: string,
  phoneNumber: string,
  dashboardUrl: string = process.env.NEXT_PUBLIC_APP_URL + '/dashboard'
) {
  const resend = getResendClient();
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzEntry <noreply@support.buzentry.com>',
      to: email,
      subject: 'Welcome to BuzEntry - Your Door System is Ready!',
      react: WelcomeEmail({ email, phoneNumber, dashboardUrl }),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendOnboardingEmail(email: string) {
  const resend = getResendClient();
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzEntry <noreply@support.buzentry.com>',
      to: email,
      subject: "Welcome to BuzEntry - You're almost there!",
      react: OnboardingEmail({ email }),
    });

    if (error) {
      console.error('Error sending onboarding email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionDisabledCallNotification(
  email: string,
  callerNumber: string,
  magicNumber: string,
  dashboardUrl: string = process.env.NEXT_PUBLIC_APP_URL + '/billing'
) {
  const resend = getResendClient();
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuzEntry <noreply@support.buzentry.com>',
      to: email,
      subject: 'Call Received - Subscription Inactive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Your BuzEntry Number Received a Call</h2>
          <p>Someone just called your BuzEntry number (<strong>${magicNumber}</strong>) from <strong>${callerNumber}</strong>, but your subscription is inactive.</p>

          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <h3 style="color: #991b1b; margin-top: 0;">Your Service is Disabled</h3>
            <p style="color: #7f1d1d; margin-bottom: 0;">Your door will not unlock and calls are not being answered or forwarded until you reactivate your subscription.</p>
          </div>

          <p><strong>To reactivate your service:</strong></p>
          <ol>
            <li>Visit your <a href="${dashboardUrl}" style="color: #2563eb;">billing dashboard</a></li>
            <li>Update your payment method or resubscribe</li>
            <li>Your service will resume immediately</li>
          </ol>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Questions?</strong> Contact us at <a href="mailto:support@buzentry.com" style="color: #2563eb;">support@buzentry.com</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending disabled call notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending disabled call notification:', error);
    return { success: false, error };
  }
}
