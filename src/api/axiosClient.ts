import axios from "axios";
import { store } from "@/app/store";

import {
  refreshToken as setAccessToken,
  logout,
} from "@/features/auth/store/authSlice";

import { authAPI } from "@/features/auth/api/authApi";

const BASE_URL = "https://api-lulut.io.vn";

// ================= PUBLIC API =================
export const publicApi = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ================= PRIVATE API =================
export const axiosClient = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
axiosClient.interceptors.request.use(
  (config) => {

    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // token hết hạn
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const res =
          await authAPI.refreshToken();

        const newAccessToken =
          res.data.result.accessToken;

        const newRefreshToken =
          res.data.result.refreshToken;

        // update redux
        store.dispatch(
          setAccessToken(newAccessToken)
        );

        // update localStorage
        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );

        // gắn token mới
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // gọi lại request cũ
        return axiosClient(originalRequest);

      } catch (refreshError) {

        // refresh fail -> logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        store.dispatch(logout());

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);