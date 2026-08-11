import { useState, useEffect, useCallback } from 'react'
import type { FloodRiskData } from '../types/floodriskType'
import { FloodRiskDataApi } from '../api/floodriskApi'
import { FloodriskdataService } from '../services/floodriskService'
// import type { Option } from '../../../components/ui/Combobox'
// import { areaService } from '../../areas/services/areaService'


export const useFloodRiskData = () => {
  const [floodRiskData, setFloodRiskData] = useState<FloodRiskData[]>([])
  const [loading, setLoading] = useState(false)
  const [data,setData]=useState<FloodRiskData|null>(null);
  const [error,setError]=useState("")
   // const [areaOptions, setAreaOptions] = useState<Option[]>([]);
 const fetchFloodRiskData = useCallback(async () => {
    try {
      setLoading(true)
      const list = await FloodRiskDataApi.getAll()
      setFloodRiskData(list)
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false)
    }
  }, [])

  const getFloodDataByAreaId = useCallback(async (areaId: string) => {
    try{
      setLoading(true);
      const res=await FloodriskdataService.getListPredictById(areaId);
      // API trả về mảng (list-by-area) -> lấy bản ghi mới nhất (đầu mảng)
      setData(res?.[0] ?? null);
      return true;
    }catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    }finally{
      setLoading(false);
    }
  }, [])
    
  useEffect(() => {
    fetchFloodRiskData();
  }, [])

  return { error,floodRiskData, loading, fetchFloodRiskData ,data,getFloodDataByAreaId}
}