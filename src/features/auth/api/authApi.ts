import axios from "axios";
import type { LoginPayLoad } from "../types/authType";

const API_URL = "https://api-lulut.io.vn";

export const authAPI = {
  login(data: LoginPayLoad) {
    return axios.post(`${API_URL}/auth/token`, data);
  },

  register(data: any) {
    return axios.post(`${API_URL}/user/register`, data);
  },

  forgotPassword(email: string) {
    return axios.post(`${API_URL}/forgotpwd`, { email });
  },

};