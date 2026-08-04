import type { LoginPayLoad } from "../types/authType";

import {
  axiosClient,
  publicApi,
} from "@/api/axiosClient";

export interface LogoutPayload{
  accessToken:string;
  refreshToken:string
  fcmToken:string | null;
}
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
      "/auth/forgot-password",
      { email }
    );
  },

  // ================= FORGOT PASSWORD =================
  resetpassword(email: string,token:string,newPassword:string) {
    return publicApi.post(
      "/auth/forgot-password",
      { email ,token,newPassword}
    );
  },

  // ================= REFRESH TOKEN =================
   refreshToken(refreshToken: string) {
    return publicApi.post("/auth/refresh", { refreshToken });
  },

  // ================= LOGOUT =================
  logout(payload:LogoutPayload) {
    // Dùng publicApi (không gắn Authorization, không có interceptor
    // auto-refresh) — vì logout có thể được gọi ngay cả khi accessToken đã
    // hết hạn/invalid (vd từ forceLogout), nên không nên phụ thuộc vào
    // axiosClient để tránh lặp/đệ quy interceptor, tương tự lý do refreshToken().
    return publicApi.post(
      "/auth/logout",payload
      
    );
   
  },
};