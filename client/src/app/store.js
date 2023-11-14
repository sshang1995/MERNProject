import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../state/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
