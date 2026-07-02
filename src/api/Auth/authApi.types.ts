import type { UserResponse } from '../User/apiUser.types';

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
