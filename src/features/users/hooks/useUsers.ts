import React, { useEffect, useState } from 'react'
import type { User } from '../../../types'
import { userService } from '../services/userService';

export const useUsers = () => {
    const [users,setUsers]=useState<User[]>([]);
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

