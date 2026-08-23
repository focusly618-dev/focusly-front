import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser as updateReduxUser } from '@/redux/auth/auth.slice';
import { uploadAvatarFile, UserUpdate } from '@/api/User/apiUser';
import { sileo, getFriendlyErrorMessage } from '@/utils';

// Shared by every place in the app that lets the user change their profile
// picture (onboarding, /profile, Settings > Account) — saves immediately on
// selection rather than waiting on a surrounding form's own "Save" action,
// since not every one of those forms is guaranteed to be wired up.
export const useAvatarUpload = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingImage(true);
    try {
      const { objectKey } = await uploadAvatarFile(file);
      const updated = await UserUpdate(user.id, { picture: objectKey });
      dispatch(updateReduxUser(updated));
      sileo.success({ title: 'Foto de perfil actualizada' });
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

  const handleRemoveImage = async () => {
    if (!user?.id || !user.picture) return;

    setIsUploadingImage(true);
    try {
      const updated = await UserUpdate(user.id, { picture: null });
      dispatch(updateReduxUser(updated));
      sileo.success({ title: 'Foto de perfil eliminada' });
    } catch (error) {
      console.error('Error removing avatar:', error);
      sileo.error({
        title: 'No se pudo eliminar la imagen',
        description: getFriendlyErrorMessage(error, 'Intenta de nuevo.'),
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    fileInputRef,
    isUploadingImage,
    handleImageClick,
    handleFileChange,
    handleRemoveImage,
  };
};
