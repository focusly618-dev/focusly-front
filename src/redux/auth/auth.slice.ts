import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { logoutUser } from '@/api/Auth/authApi';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import { resetTask } from '@/redux/tasks/task.slice';
import { resetCalendar } from '@/redux/calendar/calendar.slice';

interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}

interface AuthState {
  isLogged: boolean;
  user: User | null;
  authProvider: AuthProviders | null;
  onboardingCompleted: boolean;
  sessionExpiredNotice: boolean;
}

type LogoutReason = 'manual' | 'expired';

const getInitialState = (): AuthState => {
  const user = localStorage.getItem('user');
  const authProvider = localStorage.getItem('authProvider');
  const onboardingCompleted =
    localStorage.getItem('onboardingCompleted') === 'true';

  if (user) {
    try {
      const parsedUser = JSON.parse(user) as User;
      return {
        isLogged: true,
        user: parsedUser,
        authProvider: authProvider as AuthProviders,
        onboardingCompleted,
        sessionExpiredNotice: false,
      };
    } catch (e) {
      console.error(
        '[DEBUG] authSlice: Error parsing user from localStorage',
        e,
      );
    }
  }

  return {
    isLogged: false,
    user: null,
    authProvider: null,
    onboardingCompleted,
    sessionExpiredNotice: false,
  };
};

export const logout = createAsyncThunk<void, LogoutReason | undefined>(
  'auth/logout',
  async (reason = 'manual', { dispatch, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;

      await logoutUser(userId);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(setSessionExpiredNotice(reason === 'expired'));
      dispatch(clearAuth());
      dispatch(resetTask());
      dispatch(resetCalendar());
      // Prevent the next login (possibly a different account) from
      // momentarily rendering this session's cached queries/entities.
      // Dynamic import: apollo.ts imports the store itself (to read auth
      // state for its link chain), so a static import here would create
      // store.ts -> auth.slice.ts -> apollo.ts -> store.ts, a circular
      // import that throws "Cannot access 'authReducer' before
      // initialization" at module load. The dynamic import defers
      // resolution until the thunk actually runs, after both modules have
      // finished initializing.
      const { client } = await import('@/api/apollo');
      await client.clearStore();
    }
  },
);

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        provider: AuthProviders;
        isLogged: boolean;
      }>,
    ) => {
      state.isLogged = action.payload.isLogged;
      state.user = action.payload.user;
      state.authProvider = action.payload.provider;
      state.sessionExpiredNotice = false;

      localStorage.setItem('authProvider', action.payload.provider);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearAuth: (state) => {
      state.isLogged = false;
      state.user = null;
      state.authProvider = null;

      localStorage.removeItem('user');
      localStorage.removeItem('authProvider');
    },
    setSessionExpiredNotice: (state, action: PayloadAction<boolean>) => {
      state.sessionExpiredNotice = action.payload;
    },
    dismissSessionExpiredNotice: (state) => {
      state.sessionExpiredNotice = false;
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      localStorage.setItem('onboardingCompleted', 'true');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  login,
  clearAuth,
  setSessionExpiredNotice,
  dismissSessionExpiredNotice,
  completeOnboarding,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
