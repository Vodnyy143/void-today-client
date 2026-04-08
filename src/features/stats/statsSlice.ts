import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../app/api';
import type { DashboardData, Task } from '../../types';

interface StatsState {
  dashboard: DashboardData | null;
  weekly: { day: string; count: number }[];
  graveyard: Task[];
  loading: boolean;
}

const initialState: StatsState = {
  dashboard: null,
  weekly: [],
  graveyard: [],
  loading: false,
};

export const fetchDashboard = createAsyncThunk('stats/dashboard', async () => {
  const { data } = await api.get('/stats/dashboard');
  return data as DashboardData;
});

export const fetchWeekly = createAsyncThunk('stats/weekly', async () => {
  const { data } = await api.get('/stats/weekly');
  return data as { day: string; count: number }[];
});

export const fetchGraveyard = createAsyncThunk('stats/graveyard', async () => {
  const { data } = await api.get('/stats/graveyard');
  return data as Task[];
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchWeekly.fulfilled, (state, action) => {
        state.weekly = action.payload;
      })
      .addCase(fetchGraveyard.fulfilled, (state, action) => {
        state.graveyard = action.payload;
      });
  },
});

export default statsSlice.reducer;