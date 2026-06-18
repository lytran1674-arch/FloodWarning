import { useEffect, useState } from "react"
import { rescueService } from "../services/rescueService";
import { type ResGroup } from "../types/rescueType";

export const useResCue=(teamId:string)=>{
    const [rescue,setResCue]=useState<ResGroup[]>([]);
    const [loading,setLoading]=useState(false);
  
    const fetchResCue=async()=>{
    if(!teamId){
        setResCue([]);
        return
    }
        try{
            setLoading(true);
            const data= await rescueService.getTeamMembersWithoutGroup(teamId);
           
            console.log("Danh sách thành viên chưa có group:",data);
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