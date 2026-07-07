
// API user/me

import { axiosClient } from "@/api/axiosClient"
import type { Account } from "../type/accountType"

const API_URL="/user/me"
export const AccountApi={

        //Lấy thông tin người dùng
    async getAccount():Promise<Account>{
        const response=await axiosClient.get(API_URL)
        return response.data.result;
    }
    ,
    //cập nhật thông tin người dùng
    async updateAccount():Promise<void>{
         await axiosClient.put(API_URL)
      
    }
}