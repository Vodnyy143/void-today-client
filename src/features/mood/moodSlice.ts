import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../app/api';
import type { Mood, MoodType } from '../../types';

interface MoodState {
  today: Mood | null;
}

const initialState: MoodState = {
  today: null,
};

export const fetchMoodToday = createAsyncThunk('mood/fetchToday', async () => {
  const { data } = await api.get('/mood/today');
  return data as Mood | null;
});

export const setMood = createAsyncThunk('mood/set', async (value: MoodType) => {
  const { data } = await api.post('/mood', { value });
  return data as Mood;
});

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodToday.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(setMood.fulfilled, (state, action) => {
        state.today = action.payload;
      });
  },
});

export default moodSlice.reducer;