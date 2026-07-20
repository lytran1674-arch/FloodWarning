
import { toast } from "react-toastify";

import { waterlevalService } from "../services/waterlevalService";
import type { IoTAggregate } from "../types/waterlevelType";
import { waterlevelApi } from "../api/waterlevelApi";
import { useEffect, useMemo, useState } from "react";

export const useWaterLevel = () => {
  const [data, setData] = useState<IoTAggregate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const [search,setSearch]=useState("");
  const [water,setWater]=useState<IoTAggregate|null>(null)

useEffect(()=>{
    loadData();
},[])
  const loadData = async () => {
    try {
      setLoading(true);

      const result = await waterlevalService.getIoTWaterSummary();
         console.log("GET Aggregate:", result);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Tổng hợp mực nước
  const handleAggregate = async () => {
  try {
    await waterlevelApi.postIoTWaterSummary();

    console.log("POST xong");

    await loadData();

    toast.success("Tổng hợp mực nước thành công");
  } catch (err) {
    console.error(err);
    toast.error("Không thể tổng hợp dữ liệu");
  }
};

const searchResult=useMemo(()=>{
  if(search.trim()==="") return null;

  const keyword=search.trim().toLowerCase()
  return data.filter(
    (item)=>
      item.tenkhuvuc?.toLowerCase().includes(keyword)

  )
},[data,search])

const getIoTWaterSummaryByAreaId=async(area_id:string)=>{
  try{
    setLoading(true);
    const res=await waterlevalService.getWaterLevelsByArea(area_id);
    setWater(res);
    return true;
    
  }catch(error){
    console.error(error)
    return false;
  }
  finally{
    setLoading(false)
  }
}

  return {
    data,
    loading,
    error,
    reload: loadData,
    handleAggregate,
    search,setSearch
    ,searchResult,
    water,
    getIoTWaterSummaryByAreaId
  };
};