import axios from '@/api/axiosInstance';
import type { UserResponse } from '../User/apiUser';

export interface GoogleLoginResponse {
  user: UserResponse;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface VerifyMagicLinkResponse {
  user: UserResponse;
}

export const loginWithGoogle = async (
  code: string,
  redirectUri?: string,
): Promise<GoogleLoginResponse> => {
  const response = await axios.post(
    '/auth/google',
    { code },
    {
      headers: redirectUri ? { Origin: redirectUri } : undefined,
    },
  );
  return response.data;
};

export const requestMagicLink = async (
  email: string,
  fullName?: string,
): Promise<MagicLinkResponse> => {
  const response = await axios.post('/auth/magic-link', { email, fullName });
  return response.data;
};

export const verifyMagicLink = async (
  token: string,
): Promise<VerifyMagicLinkResponse> => {
  const response = await axios.post('/auth/magic-link/verify', { token });
  return response.data;
};

export const logoutUser = async (
  userId?: string,
): Promise<{ message: string }> => {
  const response = await axios.post('/auth/logout', { userId });
  return response.data;
};

export const refreshSession = async (
  userId: string,
): Promise<{ success: boolean }> => {
  const response = await axios.post('/auth/refresh', { userId });
  return response.data;
};
