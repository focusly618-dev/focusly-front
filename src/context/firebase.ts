import { initializeApp } from 'firebase/app';

import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';
import 'animate.css';
import { store } from '@/redux/store';
import { soundPlayer } from '@/utils/notificationSounds';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface showNotificationProps {
  title: string;
  body: string;
  icon: string;
  tag: string;
  renotify: boolean;
}
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async (
  registration?: ServiceWorkerRegistration | null,
) => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  console.log('VAPID Key loaded:', !!import.meta.env.VITE_FIREBASE_VAPID_KEY);

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration || undefined,
  });

  return token;
};

export const listenForegroundMessages = () => {
  return onMessage(messaging, (payload) => {
    const state = store.getState();
    const pushEnabled = state.auth.user?.pushEnabled !== false;

    if (!pushEnabled) {
      console.log(
        'Notificación recibida pero ignorada por preferencia del usuario.',
      );
      return;
    }

    console.log('Mensaje recibido en Focusly:', payload);

    // Play notification sound for upcoming task alerts
    soundPlayer.playTaskUpcoming();

    // Data-only messages: title/body are in payload.data
    const data = payload.data as Record<string, string>;
    const taskTitle = data?.taskTitle || data?.title || 'Upcoming Task! 🚀';
    const taskId = data?.taskId || 'new-task';
    const deadlineStr = data?.deadline;
    let timeFormatted = '';

    if (deadlineStr) {
      const date = new Date(deadlineStr);
      timeFormatted = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // 1. System notification (shows over other tabs)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        void registration.showNotification(taskTitle, {
          body: `Empieza a las ${timeFormatted}`,
          icon: '/Focusly.png',
          tag: taskId,
          renotify: true,
        } as showNotificationProps);
      });
    }

    // 2. Premium in-app toast (only when tab is visible) - Motion/Notion style
    if (document.visibilityState === 'visible') {
      void Swal.fire({
        html: `
          <div style="display: flex; align-items: center; gap: 16px; font-family: inherit;">
            <div class="motion-notification-icon-wrapper">⏰</div>
            <div style="flex: 1; min-width: 0; text-align: left;">
              <div class="motion-notification-title">${taskTitle}</div>
              <div class="motion-notification-body">Starts at ${timeFormatted}</div>
            </div>
          </div>
        `,
        toast: true,
        position: 'top-end',
        timer: 5000,
        timerProgressBar: false,
        showConfirmButton: false,
        showCloseButton: false,
        showDenyButton: false,
        background: 'transparent',
        padding: '0',
        customClass: {
          popup: 'motion-notification',
        },
        showClass: {
          popup: 'motion-slide-in',
        },
        hideClass: {
          popup: 'motion-slide-out',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      }).then((result) => {
        if (result.isDismissed || result.isDenied) {
          Swal.close();
        }
      });
    }
  });
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const params = new URLSearchParams({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }).toString();

    try {
      await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${params}`,
      );
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (err) {
      console.error('Service Worker registration failed:', err);
      return null;
    }
  }
  return null;
};
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
