import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import goalsReducer from '../features/goals/goalsSlice';
import notesReducer from '../features/notes/notesSlice';
import moodReducer from '../features/mood/moodSlice';
import statsReducer from '../features/stats/statsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    goals: goalsReducer,
    notes: notesReducer,
    mood: moodReducer,
    stats: statsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;