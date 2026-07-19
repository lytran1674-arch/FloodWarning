// src/features/auth/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/authType";

interface AuthState {
  user: Partial<User> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem("user");
const savedAccessToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedAccessToken || null,
  isAuthenticated: !!savedAccessToken,
};

interface SetCredentialsPayload {
  user: Partial<User> | null;
  accessToken: string;
  refreshToken?: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);

      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    refreshToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, updateUser, refreshToken, logout } =
  authSlice.actions;
export default authSlice.reducer;