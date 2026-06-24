import { useState } from "react"
import type { ListSOS, SoSRequest } from "../types/sosType"
import { sosService } from "../services/sosService"


export const useSoS = () => {
  const [loading, setLoading]=useState(false)
  const [error,setError]=useState("")
  const [request, setRequest]=useState<ListSOS[]>([]);

  const createSoS=async (payload:SoSRequest)=>{
    try{
        setLoading(true)
        setError("")

        return await sosService.createsos(payload);
    }catch(error:any){
        setError(error?.response?.data?.message||"Không thể gửi SOS")
        throw error
    }finally{
        setLoading(false)
    }
  }

  const listSosRequest=async ()=>{
    try{
        setLoading(true);
        setError("")
        const data= await sosService.getListSosRequest();
        setRequest(data)
    }catch(error){
        console.log(error)
    
    }finally{
        setLoading(false)
    }
  }
  return {
    listSosRequest,
    createSoS,
    loading,
    error
  }
}
