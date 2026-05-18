import { authAPI } from "../api/authApi";

export const authService={
    async login(data:any){
        const response=await authAPI.login(data)
        return response.data;
    },
    
    async register(data:any){
        const response=await authAPI.register(data);
        return response.data;
    },
    
    
}