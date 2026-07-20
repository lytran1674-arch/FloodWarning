import { useState, useEffect } from 'react'
import type { FloodRiskData } from '../types/floodriskType'
import { FloodRiskDataApi } from '../api/floodriskApi'
import { FloodriskdataService } from '../services/floodriskService'
// import type { Option } from '../../../components/ui/Combobox'
// import { areaService } from '../../areas/services/areaService'


export const useFloodRiskData = () => {
  const [floodRiskData, setFloodRiskData] = useState<FloodRiskData[]>([])
  const [loading, setLoading] = useState(false)
  const [data,setData]=useState<FloodRiskData|null>(null);
   // const [areaOptions, setAreaOptions] = useState<Option[]>([]);
  const fetchFloodRiskData = async () => {
    try {
      setLoading(true)
      const data = await FloodRiskDataApi.getAll()
      setFloodRiskData(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getFloodDataByAreaId=async(areaId:string)=>{
    try{
      setLoading(true);
      const res=await FloodriskdataService.getListPredictById(areaId);
      setData(res);
      return true;
    }catch(error){
      console.error(error)
      return false;
    }finally{
      setLoading(false);
    }
  }
    
  useEffect(() => {
    fetchFloodRiskData();
  }, [])

  return { floodRiskData, loading, fetchFloodRiskData ,data,getFloodDataByAreaId}
}