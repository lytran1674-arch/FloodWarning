import { useCallback, useState } from "react";
import { type AiFloodPredictions,type AIIoT,type Overview } from "../type/thongkeType";
import { ThongKeService } from "../service/thongkeService";
import type { JobType } from "@/features/floodriskdata/types/floodriskType";

export const useThongKe=()=>{
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("")
    const [count,setCount]=useState<Overview>();
    const [result,setResult]=useState<AiFloodPredictions>();
    const [snapshot,setSnapshot]=useState<AIIoT>();

    const getDashboardStats=useCallback(async()=>{
        try{
            setLoading(true);
            const res=await ThongKeService.getDashboardStats();
            setCount(res);
            return res;
        }catch(err){
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        }finally{
            setLoading(false);
        }
    },[])

    const getAiFloodPredictionsLatest=useCallback(async()=>{
        try{
            setLoading(false)
            const res=await ThongKeService.getAiFloodPredictionsLatest();
            setResult(res);
            return res;    
        }catch(err){
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        }finally{
            setLoading(false);
        }
    },[])

      const getAiFloodPredictions=useCallback(async(date:string,jobType:JobType)=>{
        try{
            setLoading(false)
            const res=await ThongKeService.getAiFloodPredictions(date,jobType);
            setResult(res);
            return res;    
        }catch(err){
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        }finally{
            setLoading(false);
        }
    },[])

       const getAiIotFloodRisk=useCallback(async()=>{
        try{
            setLoading(false)
            const res=await ThongKeService.getAiIotFloodRisk();
            setSnapshot(res);
            return res;    
        }catch(err){
            console.error(err);
            setError("Có lỗi xảy ra!");
            throw err;
        }finally{
            setLoading(false);
        }
    },[])

    return {loading,error,result,count,snapshot,getDashboardStats,getAiFloodPredictionsLatest,
        getAiFloodPredictions,
        getAiIotFloodRisk
    }
}