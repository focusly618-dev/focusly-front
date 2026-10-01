export interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface WorkHoursConfig {
  selectedDays: string[];
  startTime: string;
  endTime: string;
}

export interface UserSettings {
  breakDurationPref: number;
  workHoursConfig: WorkHoursConfig;
  notificationsEnabled: boolean;
  blockedAppsList: string[];
  focusDurationPref: number;
  calendarConnected: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  passwordHash?: string;
  authProvider: string;
  subscriptionStatus: 'active' | 'inactive';
  settings: UserSettings;
  createdAt: Timestamp;
  lastSyncAt: Timestamp;
  // Terms/Privacy version the user accepted; the backend owns the current one.
  termsVersion?: string | null;
  termsAcceptedAt?: string | null;
  needsTermsAcceptance?: boolean;
  [key: string]: unknown;
}
