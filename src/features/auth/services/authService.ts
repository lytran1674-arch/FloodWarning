import { authAPI } from "../api/authApi";
import type { LoginPayLoad, LoginResponse, RegisterPayload, RegisterResponse } from "../types/authType";

export const authService={
    async login(data:LoginPayLoad):Promise<LoginResponse>{
        const response=await authAPI.login(data)
        return response.data;
    },
    
    async register(data:RegisterPayload):Promise<RegisterResponse>{
        const response=await authAPI.register(data);
        return response.data;
    },
    async forgotpassword(email: string ){
        const response = await authAPI.forgotPassword(email)
        return response.data
    }
    
}