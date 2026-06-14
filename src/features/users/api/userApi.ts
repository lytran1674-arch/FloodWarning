import axios from 'axios';
import type { Users } from '../types/userType';

 const API_URL="";
export const userApi = {
   async getAll():Promise<Users[]>{
    const response=await axios.get(`${API_URL}/list`);
    return response.data;
   }
   ,
   async getById(id:string):Promise<Users[]>{
    const response=await axios.get(`${API_URL}/list`,{
            params: id
    })
    return response.data;
   }
 
}
