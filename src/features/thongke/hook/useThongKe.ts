import { useCallback, useState } from "react";
import { AiFloodPredictions, AIIoT, Overview } from "../type/thongkeType";
import { ThongKeService } from "../service/thongkeService";

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
            setCount
        }
    })
}