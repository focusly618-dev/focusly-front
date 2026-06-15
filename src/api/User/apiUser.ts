import axios from '@/api/axiosInstance';

export interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface UserSettings {
  breakDurationPref: number;
  workHoursConfig: Record<string, unknown>;
  notificationsEnabled: boolean;
  blockedAppsList: string[];
  focusDurationPref: number;
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
  [key: string]: unknown;
}

export const UserPost = async (
  userResponse: UserResponse,
): Promise<UserResponse> => {
  const response = await axios.post('/users', userResponse);
  return response.data;
};

export const UserGet = async (id: string): Promise<UserResponse> => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const UserUpdate = async (
  id: string,
  userData: Partial<UserResponse>,
): Promise<UserResponse> => {
  const response = await axios.patch(`/users/${id}`, userData);
  return response.data;
};
