import { useEffect, useState } from 'react'
import type { Users } from '../types/userType'
import { userService } from '../services/userService';

export const useUsers = () => {
    const [users,setUsers]=useState<Users[]>([]);
    const [loading,setLoading]=useState(false);

    const fetchUsers=async()=>{
       try{
        setLoading(true);
        const data=await userService.getAll();
        setUsers(data);
       }catch(error){
        console.log(error);
       }finally{
        setLoading(false);
       }
    };

    useEffect(()=>{
        fetchUsers();
    })
 
    return {users,loading,fetchUsers};
}

