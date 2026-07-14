import { useState } from 'react'
import { sosassignmentService } from '../services/sosassignmentService';

export const useSoSAssignment = () => {
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [failed,setFailed]=useState("");

  const FailedAssignment=async(assignmentId:string,failedReason:string,failedNote:string):Promise<boolean>=>{
    try{
        setLoading(true);
        const res=await sosassignmentService.FailedAssignment(assignmentId,failedReason,failedNote);
        setFailed(res);
        return true;
    }catch(error){
        console.error(error)
        setError("Lỗi báo thất bại đến Leader!");
        return false;
    }finally{
        setLoading(false)
    }
  }
  return {loading,error,failed,FailedAssignment}
}
