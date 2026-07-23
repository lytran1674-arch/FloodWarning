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
      "/forgotpwd",
      { email }
    );
  },

  // ================= REFRESH TOKEN =================
   refreshToken(refreshToken: string) {
    return axiosClient.post("/auth/refresh", { refreshToken });
  },

  // ================= LOGOUT =================
  logout(payload:LogoutPayload) {
    return axiosClient.post(
      "/auth/logout",payload
      
    );
   
  },
};