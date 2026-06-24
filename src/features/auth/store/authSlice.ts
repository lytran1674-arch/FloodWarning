import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/authType";

// ==============================
// TYPE STATE
// ==============================
interface AuthState {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ==============================
// LOCAL STORAGE
// ==============================
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

// ==============================
// INITIAL STATE
// ==============================
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
};

// ==============================
// PAYLOAD LOGIN
// ==============================
interface SetCredentialsPayload {
  user: Partial<User> | null;
  token: string;
}

// ==============================
// SLICE
// ==============================
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // LOGIN
    setCredentials: (
      state,
      action: PayloadAction<SetCredentialsPayload>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // lưu localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );

      localStorage.setItem(
        "accessToken",
        action.payload.token
      );
    },

    // UPDATE USER
    updateUser: (
      state,
      action: PayloadAction<Partial<User>>
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(state.user)
        );
      }
    },

    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

// ==============================
// EXPORT ACTIONS
// ==============================
export const {
  setCredentials,
  updateUser,
  logout,
} = authSlice.actions;

// ==============================
// EXPORT REDUCER
// ==============================
export default authSlice.reducer;