import type { User } from "../../../types";
import { userApi } from "../api/userApi";

export const userService={
    async getAll():Promise<User[]>{
        return await userApi.getAll();
    },

    
}