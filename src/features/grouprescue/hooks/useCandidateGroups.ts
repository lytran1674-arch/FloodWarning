import  { useState } from 'react'
import type { GroupSupport } from '../types/groupType';
import { groupService } from '../services/groupService';
import { toast } from 'react-toastify';
    
    export const useCandidateGroups = () => {
     const [loading, setLoading]=useState(false);
     const [error,setError]=useState("");
     const [candidate,setCandidate]=useState<GroupSupport[]>([])

     const CandidateGroupSupport=async(supportRequestItemId:string)=>{
        try{
            setLoading(true);
            const res=await groupService.CandidateGroupSupport(supportRequestItemId);
            setCandidate(res);
            return true
        }catch(error){
            console.error(error);
            setError("Lỗi không thể lấy đươc nhóm phù hợp");
            return false;
        }finally{
            setLoading(false)
        }

     }
     
        return {loading, error,candidate,CandidateGroupSupport}
    }
    