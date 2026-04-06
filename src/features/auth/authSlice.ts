import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../app/api.ts";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const signUp = createAsyncThunk(
    '/auth/sign-up',
    async (dto: {email: string; password: string, name: string}, {rejectWithValue} ) => {
        try {
            const {data} = await api.post('auth/sign-up', dto);
            return data as User;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message || 'Error sign-in');
        }
    }
);

export const signIn = createAsyncThunk(
    '/auth/sign-in',
    async (dto: {email: string; password: string}, {rejectWithValue} ) => {
        try {
            const {data} = await api.post('auth/sign-in', dto);
            return data as User;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message || 'Error sign-in');
        }
    }
);

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth/me');
            return data as User;
        } catch {
            return rejectWithValue(null);
        }
    }
);


export const logout = createAsyncThunk('auth/logout', async () => {
    await api.post('/auth/logout').catch(() => {});
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled , (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signUp.rejected , (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(signIn.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled , (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signIn.rejected , (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.user = null;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export const {clearError} = authSlice.actions;
export default authSlice.reducer;