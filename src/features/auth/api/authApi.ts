
import type { LoginPayLoad } from "../types/authType";
import { axiosClient } from "@/api/axiosClient";

const API_URL = "https://api-lulut.io.vn";

export const authAPI = {
  login(data: LoginPayLoad) {
    return axiosClient.post(`${API_URL}/auth/token`, data);
  },

  register(data: any) {
    return axiosClient.post(`${API_URL}/user/register`, data);
  },

  forgotPassword(email: string) {
    return axiosClient.post(`${API_URL}/forgotpwd`, { email });
  },

};