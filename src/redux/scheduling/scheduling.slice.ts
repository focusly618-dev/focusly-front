import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  SchedulingConstraints,
  SchedulingResult,
} from './scheduling.types';

export interface SchedulingState {
  constraints: SchedulingConstraints | null;
  result: SchedulingResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchedulingState = {
  constraints: null,
  result: null,
  loading: false,
  error: null,
};

export const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {
    setConstraints: (state, action: PayloadAction<SchedulingConstraints>) => {
      state.constraints = action.payload;
    },
    setSchedulingResult: (state, action: PayloadAction<SchedulingResult>) => {
      state.result = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSchedulingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSchedulingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetScheduling: (state) => {
      state.constraints = null;
      state.result = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setConstraints,
  setSchedulingResult,
  setSchedulingLoading,
  setSchedulingError,
  resetScheduling,
} = schedulingSlice.actions;

export default schedulingSlice.reducer;
