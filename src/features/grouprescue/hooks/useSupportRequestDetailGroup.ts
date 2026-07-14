import  { useState } from 'react'
import type { DetailSupportRequestGroupLeader } from '../types/groupType';
import { groupService } from '../services/groupService';

export const useSupportRequestDetailGroup = () => {
    const [loading, setLoading]=useState(false);
    const [error,setError]=useState("");
    const [detail,setDetail]=useState<DetailSupportRequestGroupLeader | undefined>();

    const DetailSupportRequestrGroup=async(supportRequestId:string)=>{
        try{
            setLoading(true);
            const res=await groupService.DetailSupportRequest(supportRequestId);
            setDetail(res);
            return true;
        }catch(error){
            console.error(error);
            setError("Lỗi không thể xem chi tiết yêu cầu");
            return false
        }
        finally{
            setLoading(false)
        }
    }
  
    return {
        loading,
        error,
        detail,
        DetailSupportRequestrGroup
    }
}
