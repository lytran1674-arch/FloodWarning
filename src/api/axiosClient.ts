// src/api/axiosClient.ts
import axios from "axios";
import { store } from "@/app/store";

import {
  refreshToken as setAccessToken,
  logout,
} from "@/features/auth/store/authSlice";

import { authAPI } from "@/features/auth/api/authApi";
import { clearFcmTokenOnLogout } from "@/utils/firebaseNotification";

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
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= SINGLE-FLIGHT REFRESH LOGIC =================
// Cờ đánh dấu đang có 1 request refresh chạy
let isRefreshing = false;

// Hàng đợi các request đang chờ token mới
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

function subscribeTokenRefresh(
  resolve: (token: string) => void,
  reject: (err: any) => void
) {
  refreshSubscribers.push({ resolve, reject });
}

function onRefreshSuccess(newToken: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
  refreshSubscribers = [];
}

function onRefreshFailed(err: any) {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
}

function forceLogout() {
  store.dispatch(logout());
  clearFcmTokenOnLogout().finally(() => {
    window.location.href = "/";
  });
}

// ================= RESPONSE INTERCEPTOR =================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Không có response (lỗi mạng...) hoặc không phải 401 -> reject luôn
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Request này đã retry rồi mà vẫn 401 -> không retry nữa, logout luôn
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Nếu đã có 1 request khác đang refresh -> đứng chờ, không gọi refresh lần nữa
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(
          (newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosClient(originalRequest));
          },
          (err) => reject(err)
        );
      });
    }

    isRefreshing = true;

    try {
      const res = await authAPI.refreshToken();

      const newAccessToken = res.data.result.accessToken;
      const newRefreshToken = res.data.result.refreshToken;

      // update redux + localStorage (localStorage được set trong reducer)
      store.dispatch(setAccessToken(newAccessToken));

      // refreshToken không có trong Redux state, lưu trực tiếp vào localStorage
      localStorage.setItem("refreshToken", newRefreshToken);

      isRefreshing = false;

      // giải phóng tất cả request đang chờ, cho dùng token mới
      onRefreshSuccess(newAccessToken);

      // gắn token mới và gọi lại request gốc
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (refreshError) {
      isRefreshing = false;

      // báo lỗi cho tất cả request đang chờ
      onRefreshFailed(refreshError);

      forceLogout();

      return Promise.reject(refreshError);
    }
  }
);