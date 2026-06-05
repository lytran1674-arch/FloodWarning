import axios from 'axios';
import type { User } from '../../../types';

 const API_URL="";
export const userApi = {
   async getAll():Promise<User[]>{
    const response=await axios.get(`${API_URL}/list`);
    return response.data;
   }
   ,
   async getById(id:string):Promise<User[]>{
    const response=await axios.get(`${API_URL}/list`,{
            params: id
    })
    return response.data;
   }
 
}
