import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser as updateReduxUser } from '@/redux/auth/auth.slice';
import axios from '@/api/axiosInstance';
import { uploadAvatarFile } from '@/api/User/apiUser';
import { sileo, getFriendlyErrorMessage } from '@/utils';

interface UseProfileCompletionProps {
  onNext: () => void;
}

export const useProfileCompletion = ({ onNext }: UseProfileCompletionProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  
  const [fullName, setFullName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState((user?.jobTitle as string) || '');
  const [bio, setBio] = useState((user?.bio as string) || '');
  const [profileImage, setProfileImage] = useState(user?.picture || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadAvatarFile(file);
      setProfileImage(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      sileo.error({
        title: 'No se pudo subir la imagen',
        description: getFriendlyErrorMessage(
          error,
          'Intenta con otra imagen o vuelve a intentarlo.',
        ),
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleContinue = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const updateData = {
        name: fullName,
        jobTitle,
        bio,
        picture: profileImage
      };

      // Send to backend
      const response = await axios.patch(`/users/${user.id}`, updateData);
      
      // Update Redux with the response from server
      dispatch(updateReduxUser(response.data));
      
      onNext();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Optional: show toast error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    bio,
    setBio,
    profileImage,
    fileInputRef,
    isLoading,
    isUploadingImage,
    handleImageClick,
    handleFileChange,
    handleContinue
  };
};
