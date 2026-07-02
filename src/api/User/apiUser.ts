import axios from '@/api/axiosInstance';
import type { UserResponse } from './apiUser.types';

export * from './apiUser.types';

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
