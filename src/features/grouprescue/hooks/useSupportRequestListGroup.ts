import { useEffect, useState } from "react";
import type { SupportRequestGroupLeader } from "../types/groupType";
import { groupService } from "../services/groupService";


export const useSupportRequestListGroup = () => {
    const [loading, setLoading]=useState(false);
    const [error,setError]=useState("");
    const [sossupport, setSosSupport]=useState<SupportRequestGroupLeader[]>([]);

    const ListSupportRequestGroup=async()=>{
        try{
            setLoading(true);
            const res=await groupService.ListSupportGroupLeader();
            setSosSupport(res);
            
        }catch(error){
            console.error(error);
            setError("Lỗi không thể tải danh sách yêu cầu hỗ trợ ");
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        ListSupportRequestGroup()
    })
    return {loading,error,sossupport}

}
