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
  async refreshToken() {

    const response =
      await authAPI.refreshToken();

    return response.data;
  },

  // ================= LOGOUT =================
  async logout(payload:LogoutPayload) {

    const response =
      await authAPI.logout(payload);

    return response.data;
  },
};