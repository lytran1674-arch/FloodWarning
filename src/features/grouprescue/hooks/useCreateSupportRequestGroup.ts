    import  { useState } from 'react'
import type { LeaderCreateSupport } from '../types/groupType';
import { groupService } from '../services/groupService';
import { toast } from 'react-toastify';
    
    export const useCreateSupportRequestGroup = () => {
     const [loading, setLoading]=useState(false);
     const [error,setError]=useState("");
     const [create,setCreate]=useState<string | undefined>("")

     const CreateSupportRequestGroup=async(assignmentId:string,payload:LeaderCreateSupport)=>{
        try{
            setLoading(true);
            const res=await groupService.GroupLeaderCreatedSupport(assignmentId,payload);
            setCreate(res);
            toast.success("Tạo yêu cầu thành công");
            return true;
        }catch(error){
            console.error(error);
            setError("Lỗi không thể tạo yêu cầu hỗ trợ");
            return false;
        }finally{
            setLoading(false)
        }

     }
     
        return {loading, error,create,CreateSupportRequestGroup}
    }
    