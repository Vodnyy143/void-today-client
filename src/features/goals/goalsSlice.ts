import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../app/api';
import type { Goal, GoalLevel } from '../../types';

interface GoalsState {
  items: Goal[];
  loading: boolean;
}

const initialState: GoalsState = {
  items: [],
  loading: false,
};

export const fetchGoals = createAsyncThunk(
  'goals/fetchAll',
  async (level?: GoalLevel) => {
    const { data } = await api.get('/goals', { params: level ? { level } : {} });
    return data as Goal[];
  }
);

export const createGoal = createAsyncThunk(
  'goals/create',
  async (dto: {
    title: string;
    level: GoalLevel;
    deadline?: string;
    categoryId?: string;
    parentId?: string;
  }) => {
    const { data } = await api.post('/goals', dto);
    return data as Goal;
  }
);

export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, ...dto }: { id: string; title?: string; progress?: number; deadline?: string }) => {
    const { data } = await api.patch(`/goals/${id}`, dto);
    return data as Goal;
  }
);

export const deleteGoal = createAsyncThunk('goals/delete', async (id: string) => {
  await api.delete(`/goals/${id}`);
  return id;
});

export const linkTask = createAsyncThunk(
  'goals/linkTask',
  async ({ goalId, taskId }: { goalId: string; taskId: string }) => {
    const { data } = await api.post(`/goals/${goalId}/tasks/${taskId}`);
    return data as Goal;
  }
);

export const unlinkTask = createAsyncThunk(
  'goals/unlinkTask',
  async ({ goalId, taskId }: { goalId: string; taskId: string }) => {
    await api.delete(`/goals/${goalId}/tasks/${taskId}`);
    return { goalId, taskId };
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      })
      .addCase(linkTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default goalsSlice.reducer;