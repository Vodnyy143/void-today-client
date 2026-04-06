import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

interface Checkpoint {
    id: string;
    title: string;
    done: boolean;
    order: number;
}

interface Task {
    id: string;
    title: string;
    type: 'MICRO' | 'MACRO';
    status: 'TODO' | 'DONE' | 'ARCHIVED';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string | null;
    repeat: 'DAILY' | 'WEEKLY' | 'NONE';
    categoryId: string | null;
    goalId: string | null;
    createdAt: string;
    completedAt: string | null;
    checkpoints: Checkpoint[];
    category: { id: string; name: string; color: string } | null;
}

interface TasksState {
    items: Task[];
    chaos: Task | null;
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    items: [],
    chaos: null,
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (params: { status?: string; categoryId?: string; goalId?: string } = {}) => {
        const { data } = await api.get('/tasks', { params });
        return data as Task[];
    }
);

export const fetchChaos = createAsyncThunk('tasks/chaos', async () => {
    const { data } = await api.get('/tasks/chaos');
    return data as Task | null;
});

export const createTask = createAsyncThunk(
    'tasks/create',
    async (dto: {
        title: string;
        type?: 'MICRO' | 'MACRO';
        priority?: 'HIGH' | 'MEDIUM' | 'LOW';
        dueDate?: string;
        repeat?: 'DAILY' | 'WEEKLY' | 'NONE';
        categoryId?: string;
        goalId?: string;
        checkpoints?: { title: string; order?: number }[];
    }) => {
        const { data } = await api.post('/tasks', dto);
        return data as Task;
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, ...dto }: { id: string; status?: string; priority?: string; title?: string }) => {
        const { data } = await api.patch(`/tasks/${id}`, dto);
        return data as Task;
    }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
    await api.delete(`/tasks/${id}`);
    return id;
});

export const toggleCheckpoint = createAsyncThunk(
    'tasks/toggleCheckpoint',
    async ({ taskId, cpId }: { taskId: string; cpId: string }) => {
        const { data } = await api.patch(`/tasks/${taskId}/checkpoints/${cpId}`);
        return { taskId, checkpoint: data as Checkpoint };
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.loading = false;
                state.error = 'Ошибка загрузки задач';
            })

            .addCase(fetchChaos.fulfilled, (state, action) => {
                state.chaos = action.payload;
            })

            .addCase(createTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(updateTask.fulfilled, (state, action) => {
                const idx = state.items.findIndex((t) => t.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })

            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter((t) => t.id !== action.payload);
            })

            .addCase(toggleCheckpoint.fulfilled, (state, action) => {
                const task = state.items.find((t) => t.id === action.payload.taskId);
                if (task) {
                    const cpIdx = task.checkpoints.findIndex((c) => c.id === action.payload.checkpoint.id);
                    if (cpIdx !== -1) task.checkpoints[cpIdx] = action.payload.checkpoint;
                }
            });
    },
});

export default tasksSlice.reducer;