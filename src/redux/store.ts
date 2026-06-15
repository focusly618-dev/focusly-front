import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import calendarReducer from './calendar/calendar.slice';
import taskReducer from './tasks/task.slice';
import schedulingReducer from './scheduling/scheduling.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    task: taskReducer,
    scheduling: schedulingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
