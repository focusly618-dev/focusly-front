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
  object_key: string;
  preview_url: string;
}

export const presignAvatarUpload = async (
  contentType: string,
): Promise<PresignAvatarUploadResponse> => {
  const response = await axios.post('/uploads/avatar/presign', {
    content_type: contentType,
  });
  return response.data;
};

export interface UploadedAvatar {
  // Host-agnostic key — this is what should be persisted via UserUpdate's
  // `picture` field, never the preview URL (the backend resolves the key
  // into a full URL on every read, so the DB never bakes in a storage host).
  objectKey: string;
  // Absolute URL for showing an immediate preview client-side only.
  previewUrl: string;
}

export const uploadAvatarFile = async (file: File): Promise<UploadedAvatar> => {
  const { upload_url, object_key, preview_url } =
    await presignAvatarUpload(file.type);

  await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  return { objectKey: object_key, previewUrl: preview_url };
};
