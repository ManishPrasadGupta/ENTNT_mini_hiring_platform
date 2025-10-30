import { configureStore } from "@reduxjs/toolkit";
import { jobsReducer } from "./features/Jobs/jobsSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
