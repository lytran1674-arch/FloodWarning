import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/authType";

interface AuthState {
  user: Partial<User> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem("user");
const savedaccessToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedaccessToken || null,
  isAuthenticated: !!savedaccessToken,
};

interface SetCredentialsPayload {
  user: Partial<User> | null;
  accessToken: string;
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
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    // ✅ Chỉ cập nhật token mới, giữ nguyên user
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
    },
  },
});

export const { setCredentials, updateUser, refreshToken, logout } = authSlice.actions;
export default authSlice.reducer;