import { useEffect, useState } from "react"
import { rescueService } from "../services/rescueService";
import { type ResCue } from "../types/rescueType";

export const useResCue=(teamId:string)=>{
    const [rescue,setResCue]=useState<ResCue[]>([]);
    const [loading,setLoading]=useState(false);
  
    const fetchResCue=async()=>{
    if(!teamId){
        setResCue([]);
        return
    }
        try{
            setLoading(true);
            const data= await rescueService.getTeamMembersWithoutGroup(teamId);
           
             setResCue(data);

        }catch(error){
            console.log("Lỗi lấy danh sách:",error);
            setResCue([]);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchResCue();

    },[teamId]);

    return {rescue,loading,fetchResCue};
}