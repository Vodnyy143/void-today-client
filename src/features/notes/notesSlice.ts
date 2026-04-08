import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../app/api';
import type { Note, NoteType } from '../../types';

interface NotesState {
  items: Note[];
  loading: boolean;
  activeType: string;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  activeType: 'ALL',
};

export const fetchNotes = createAsyncThunk(
  'notes/fetchAll',
  async (type?: NoteType) => {
    const { data } = await api.get('/notes', { params: type ? { type } : {} });
    return data as Note[];
  }
);

export const createNote = createAsyncThunk(
  'notes/create',
  async (dto: {
    type: NoteType;
    title?: string;
    content?: string;
    url?: string;
    tags?: string[];
    price?: number;
    imageUrl?: string;
  }) => {
    const { data } = await api.post('/notes', dto);
    return data as Note;
  }
);

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, ...dto }: { id: string; title?: string; content?: string; done?: boolean }) => {
    const { data } = await api.patch(`/notes/${id}`, dto);
    return data as Note;
  }
);

export const deleteNote = createAsyncThunk('notes/delete', async (id: string) => {
  await api.delete(`/notes/${id}`);
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setActiveType: (state, action: PayloadAction<string>) => {
      state.activeType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      });
  },
});

export const { setActiveType } = notesSlice.actions;
export default notesSlice.reducer;