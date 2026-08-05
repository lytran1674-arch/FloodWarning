import { authAPI, type LogoutPayload } from "../api/authApi";

import type {
  LoginPayLoad,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types/authType";

export const authService = {

  // ================= LOGIN =================
  async login(
    data: LoginPayLoad
  ): Promise<LoginResponse> {

    const response =
      await authAPI.login(data);

    return response.data;
  },

  // ================= REGISTER =================
  async register(
    data: RegisterPayload
  ): Promise<RegisterResponse> {

    const response =
      await authAPI.register(data);

    return response.data;
  },

  // ================= FORGOT PASSWORD =================
  async forgotpassword(email: string) {

    const response =
      await authAPI.forgotPassword(email);

    return response.data;
  },

  // ================= REFRESH TOKEN =================
  async refreshToken(refreshToken:string) {

    const response =
      await authAPI.refreshToken(refreshToken);

    return response.data;
  },

  // ================= LOGOUT =================
  async logout(payload:LogoutPayload) {

    const response =
      await authAPI.logout(payload);

    return response.data;
  },

    // ================= FORGOT PASSWORD =================
    async resetpassword(email: string,token:string,newPassword:string) {
       const response =
      await authAPI.resetpassword(email,token,newPassword);

    return response.data;
    },
  
    // ================= KHÓA TÀI KHOẢN =================
    async lockAccount(){
      const response=await authAPI.lockAccount();
      return response.data.result;
    },
      // ================= GỬI MÃ MỞ KHÓA =================
    async sendUnlockCode(email: string) {
      const response = await authAPI.sendUnlockCode(email);
      return response.data;
    },

    // ================= MỞ KHÓA TÀI KHOẢN =================
    async unlockAccount(email: string, otp: string) {
      const response = await authAPI.unlockAccount(email, otp);
      return response.data;
    },

  
     // ================= ĐỔI MẬT KHẨU =================
    async changepassword(oldPassword: string, newPassword: string) {
     const response=await authAPI.changepassword(oldPassword,newPassword)
     return response.data
    },

    
};