import { useEffect } from 'react';
import {
  requestNotificationPermission,
  listenForegroundMessages,
  registerServiceWorker,
} from '@/context/firebase';
import axios from '@/api/axiosInstance';
import { useAppSelector } from '@/redux/hooks';

export const usePushNotifications = () => {
  const { user, isLogged } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLogged || !user?.id) return;

    const setupNotifications = async () => {
      try {
        const registration = await registerServiceWorker();
        const token = await requestNotificationPermission(registration);
        if (token) {
          console.log('FCM Token:', token);
          await axios.patch(`/users/${user.id}`, { fcmToken: token });
        }
      } catch (error) {
        // Silently ignore Firebase Installations permission errors (403).
        // This occurs when the Installations API is not enabled for the project
        // or the current domain is not authorized in Firebase Console.
        const isInstallationsError =
          error instanceof Error &&
          (error.message.includes('installations/request-failed') ||
            error.message.includes('PERMISSION_DENIED') ||
            ('code' in error &&
              (error as { code: string }).code ===
                'installations/request-failed'));

        if (!isInstallationsError) {
          console.error('Error in setupNotifications:', error);
        }
      }
    };

    setupNotifications();

    const unsubscribe = listenForegroundMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLogged, user?.id]);
};
