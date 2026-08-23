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

interface PresignAvatarUploadResponse {
  upload_url: string;
  public_url: string;
}

export const presignAvatarUpload = async (
  contentType: string,
): Promise<PresignAvatarUploadResponse> => {
  const response = await axios.post('/uploads/avatar/presign', {
    content_type: contentType,
  });
  return response.data;
};

export const uploadAvatarFile = async (file: File): Promise<string> => {
  const { upload_url, public_url } = await presignAvatarUpload(file.type);

  await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  return public_url;
};
