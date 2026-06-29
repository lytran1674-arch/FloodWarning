import { store } from "@/app/store";
import { authAPI } from "@/features/auth/api/authApi";
import { refreshToken } from "@/features/auth/store/authSlice";
import axios from "axios";

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

// interceptor chỉ cho private
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

// axiosClient.ts
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const res = await authAPI.refreshToken();
      const newToken = res.data.accessToken;

      store.dispatch(refreshToken(newToken));
      original.headers["Authorization"] = `Bearer ${newToken}`;

      return axiosClient(original);
    }

    return Promise.reject(error);
  }
);