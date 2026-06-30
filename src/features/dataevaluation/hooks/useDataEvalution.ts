
import { useEffect, useState } from 'react';
import type { SnapShot } from '../types/dataevaluationType';
import type { Area } from '@/features/areas/types/areaType';
import { dataevaluationService } from '../services/dataevaluationService';
import { toast } from 'react-toastify';

export const useDataEvalution = (areaId:string) => {
  
  const [data,setData]=useState<SnapShot|null>(null);
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  //const [selected,setSelected]=useState<Area[]>

  useEffect(()=>{
    loadData();
  })

  const loadData=async()=>{
    try{
        setLoading(true);
        const result=await dataevaluationService.getSnapShotSumById(areaId);
        setData(result)
    }catch(error){
        console.error(error)
        setError("Không thể tải dữ liệu")
    }finally{
        setLoading(false)
    }
  }

  const handleSnapShot=async()=>{
    try{
        await dataevaluationService.buttonSnapShot();
        await loadData();
        toast.success("Tổng hợp dữ liệu đánh giá thành công")
    }catch(err){
        console.error(err)
        toast.error("Không thể tổng hợp dữ liệu")
    }
  }

  return {
    data,
    loading,
    error,
    reload:loadData,
    handleSnapShot,

  }
}


