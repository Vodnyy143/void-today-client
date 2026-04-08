import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../app/api';
import type { Category } from '../../types';

interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [],
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const { data } = await api.get('/categories');
  return data as Category[];
});

export const createCategory = createAsyncThunk(
  'categories/create',
  async (dto: { name: string; color: string; icon?: string }) => {
    const { data } = await api.post('/categories', dto);
    return data as Category;
  }
);

export const deleteCategory = createAsyncThunk('categories/delete', async (id: string) => {
  await api.delete(`/categories/${id}`);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;