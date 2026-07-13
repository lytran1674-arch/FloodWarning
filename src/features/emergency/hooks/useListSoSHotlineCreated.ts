    import type { SoSResponse, SosStatus } from '@/features/sosrequest/types/sosType'
    import { useEffect, useState } from 'react'
    import { emergencyService } from '../services/emergencyService';
import type { UpdateSoSHotlinePayLoad } from '../types/emergencyType';
export type EditableFields = {
  sodt: boolean;
  lat: boolean;
  lon: boolean;
  diachi: boolean;
  victimCount: boolean;
  injured: boolean;
  trapped: boolean;
  vulnerable: boolean;
  mota: boolean;
};

export const getEdittableFields = (status: SosStatus): EditableFields => {
  switch (status) {
    case 'PENDING':
      return {
        sodt: true,
        lat: true,
        lon: true,
        diachi: true,
        victimCount: true,
        injured: true,
        trapped: true,
        vulnerable: true,
        mota: true,
      };

    case "ASSIGNED":
    case "PROCESSING":
      return {
        sodt: true,
        lat: false,
        lon: false,
        diachi: true,
        victimCount: false,
        injured: false,
        trapped: false,
        vulnerable: false,
        mota: true,
      };

    case 'DONE':
    case 'CANCELLED':
    default:
      return {
        sodt: true,
        lat: true,
        lon: true,
        diachi: true,
        victimCount: true,
        injured: true,
        trapped: true,
        vulnerable: true,
        mota: true,
      };
  }
};

    export const useListSoSHotlineCreated =()=> {
    const [soshotline,setSoSHotline]=useState<SoSResponse[]>([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    const ListSoSHotlineCreated=async()=>{
        try{
            setLoading(true);
            const res=await emergencyService.getListSoSHotlineCreated();
            setSoSHotline(res);
        }catch(error){
            console.error(error);
            setError("Lỗi tải danh sách sos");
        }finally{
            setLoading(false)
        }
    }

    // danh sách các field được update
   
    const updateSoSHotLine=async(sosId:string,payload:UpdateSoSHotlinePayLoad)=>{
        try{
            setLoading(true);
            const res=await emergencyService.soshotlineupdate(sosId,payload)
            return res;
        }catch(error){
            console.error(error);
            setError("Cập nhật SoS thất bại");
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        ListSoSHotlineCreated();
    },[])
    return {
        loading,
        error,
        soshotline,
        updateSoSHotLine,
        getEdittableFields,
    }
    }
