export interface UserProfile {
  email: string;
  userId: string;
  signalwirePhoneNumber: string | null;
  doorCode: string | null;
  accessCode: string | null; // Security PIN callers must enter
  isPaused: boolean;
  pauseForwardingNumber: string | null; // Forward to this number when paused (instead of rejecting)
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing' | null;
  passcodes: Passcode[]; // Generated passcodes for one-time or temporary access
  // Notification preferences
  notifyEmail?: boolean; // Email notifications for unlock events
  notifySms?: boolean; // SMS notifications for unlock events
  notifyPhoneNumber?: string | null; // Phone number for SMS notifications
  // Quiet Hours
  quietHoursEnabled?: boolean;
  quietHoursStart?: string; // Format: "22:00"
  quietHoursEnd?: string; // Format: "07:00"
  createdAt: number;
  updatedAt: number;
}

export interface Passcode {
  id: string;
  code: string; // The passcode digits
  label: string; // Description (e.g., "Delivery", "Guest - John")
  createdAt: number;
  expiresAt: number | null; // null = never expires
  usageCount: number;
  maxUsages: number | null; // null = unlimited
  lastUsedAt: number | null;
  isActive: boolean;
}

export interface CallLog {
  id: string;
  userId: string;
  phoneNumber: string;
  timestamp: number;
  status: 'answered' | 'forwarded' | 'missed' | 'paused' | 'denied';
  duration?: number;
  forwardedTo?: string;
  passcodeUsed?: string; // Label of the passcode used (e.g., "Guest - John", "Delivery") - only for successful unlocks
  codeEntered?: string; // The actual code entered by caller (for all attempts, successful or not)
}

export interface UserAnalytics {
  totalCalls: number;
  successfulUnlocks: number;
  forwardedCalls: number;
  missedCalls: number;
  pausedCalls: number;
  deniedCalls: number;
  callsByDay: { date: string; count: number }[];
  recentCalls: CallLog[];
}
