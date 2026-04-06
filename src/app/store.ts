import {configureStore} from "@reduxjs/toolkit";

import authSlice from "../features/auth/authSlice.ts";
import tasksSlice from "../features/tasks/tasksSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        tasks: tasksSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;