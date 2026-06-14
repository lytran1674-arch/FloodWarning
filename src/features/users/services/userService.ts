import type {Users} from "../types/userType";
import { userApi } from "../api/userApi";

export const userService={
    async getAll():Promise<Users[]>{
        return await userApi.getAll();
    },

    
}