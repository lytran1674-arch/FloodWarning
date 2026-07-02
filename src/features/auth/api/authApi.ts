import type { LoginPayLoad } from "../types/authType";

import {
  axiosClient,
  publicApi,
} from "@/api/axiosClient";

export const authAPI = {

  // ================= LOGIN =================
  login(data: LoginPayLoad) {
    return axiosClient.post(
      "/auth/token",
      data
    );
  },

  // ================= REGISTER =================
  register(data: any) {
    return axiosClient.post(
      "/user/register",
      data
    );
  },

  // ================= FORGOT PASSWORD =================
  forgotPassword(email: string) {
    return publicApi.post(
      "/forgotpwd",
      { email }
    );
  },

  // ================= REFRESH TOKEN =================
  refreshToken() {

    const refreshToken =
      localStorage.getItem("refreshToken");

    return publicApi.post(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
  },

  // ================= LOGOUT =================
  logout() {
    return axiosClient.post(
      "/auth/logout"
    );
  },
};