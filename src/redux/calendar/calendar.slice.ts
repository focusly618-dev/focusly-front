import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GoogleCalendarEvent } from './calendar.types';

type CalendarEvent = GoogleCalendarEvent;

interface CalendarState {
  reduxEvents: CalendarEvent[];
  syncVersion: number;
}

const initialState: CalendarState = {
  reduxEvents: [],
  syncVersion: 0,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.reduxEvents = action.payload;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.reduxEvents.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.reduxEvents.findIndex(
        (e) => e.id === action.payload.id,
      );
      if (index !== -1) {
        state.reduxEvents[index] = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<{ id: string }>) => {
      state.reduxEvents = state.reduxEvents.filter(
        (e) => e.id !== action.payload.id,
      );
    },
    incrementSyncVersion: (state) => {
      state.syncVersion = (state.syncVersion || 0) + 1;
    },
    resetCalendar: (state) => {
      state.reduxEvents = [];
      state.syncVersion = 0;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  removeEvent,
  incrementSyncVersion,
  resetCalendar,
} = calendarSlice.actions;

export default calendarSlice.reducer;
