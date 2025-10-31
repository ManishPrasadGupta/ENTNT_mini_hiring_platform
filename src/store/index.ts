import { configureStore } from "@reduxjs/toolkit";
import { jobsReducer } from "./features/Jobs/jobsSlice";
import { candidatesReducer } from "./features/candidates/candidatesSlice";
import { assessmentsReducer } from "./features/assessments/assessmentsSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    candidates: candidatesReducer,
    assessments: assessmentsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
console.log("CANDIDATES REDUCER DEBUG", candidatesReducer);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
