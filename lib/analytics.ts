import { track } from '@vercel/analytics';

// Analytics events per spec v1.9
export const trackEvent = {
  // Landing page CTA
  ctaGetMagicNumberClicked: (variant?: string) => {
    track('cta_get_magic_number_clicked', { variant: variant || 'default' });
  },

  // How it works / Security pages viewed
  howItWorksViewed: () => {
    track('how_it_works_viewed');
  },

  securityViewed: () => {
    track('security_viewed');
  },

  // Signup flow
  signupPaidStarted: (utm: { source?: string; medium?: string; campaign?: string; content?: string }) => {
    track('signup_paid_started', utm);
  },

  signupPaidSucceeded: (plan: string, utm?: { source?: string; medium?: string; campaign?: string; content?: string }) => {
    track('signup_paid_succeeded', { plan, ...utm });
  },

  // Dashboard / App events
  numberAssigned: (carrier: string, latencyMs: number) => {
    track('number_assigned', { carrier, latency_ms: latencyMs });
  },

  doorCodeSaved: (valueMaskedLen: number) => {
    track('door_code_saved', { value_masked_len: valueMaskedLen });
  },

  pinEnabled: (fourDigits: boolean) => {
    track('pin_enabled', { '4digits': fourDigits });
  },

  systemPaused: (reason?: string) => {
    track('system_paused', { reason: reason || 'manual' });
  },

  systemResumed: (reason?: string) => {
    track('system_resumed', { reason: reason || 'manual' });
  },

  forwardSet: (valid: boolean) => {
    track('forward_set', { valid });
  },

  testSetupStart: () => {
    track('test_setup_start');
  },

  testSetupSuccess: () => {
    track('test_setup_success');
  },

  testSetupFail: (reason: string) => {
    track('test_setup_fail', { reason });
  },

  firstUnlock: (pinUsed: boolean, retries: number, latencyMs: number) => {
    track('first_unlock', { pin_used: pinUsed, retries, latency_ms: latencyMs });
  },

  guestPassCreated: (maxUses: number, expiresAt: string) => {
    track('guest_pass_created', { max_uses: maxUses, expires_at: expiresAt });
  },

  billingPortalOpened: () => {
    track('billing_portal_opened');
  },
};
