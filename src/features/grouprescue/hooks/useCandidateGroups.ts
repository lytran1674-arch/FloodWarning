import  { useState } from 'react'
import type { GroupSupport } from '../types/groupType';
import { groupService } from '../services/groupService';

    
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
        }catch (err:any) {
      const message: string = err.response?.data?.message??"Có lỗi xảy ra";
      setError(message)
      throw err;
        }finally{
            setLoading(false)
        }

     }
     
        return {loading, error,candidate,CandidateGroupSupport}
    }
    