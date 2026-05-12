import { Temporal } from 'temporal-polyfill';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Temporal = Temporal;

import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { AppThemeProvider } from '@/context/ThemeContext';
import './index.css';
import './styles/notifications.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from '@/redux/store.ts';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/api/apollo';

import { ToastProvider } from '@/components/ui/Toast/ToastContext';
import { ConfirmProvider } from '@/components/ui/Confirm/ConfirmContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <AppThemeProvider>
    <CssBaseline />
    <ToastProvider>
      <ConfirmProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ApolloProvider client={client}>
            <Provider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Provider>
          </ApolloProvider>
        </GoogleOAuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  </AppThemeProvider>,
);
