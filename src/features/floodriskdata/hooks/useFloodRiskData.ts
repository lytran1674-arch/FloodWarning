import { useState, useEffect } from 'react'
import type { FloodRiskData } from '../types/floodriskdataType'
import { FloodRiskDataApi } from '../api/floodriskdataApi'
import type { Option } from '../../../components/ui/Combobox'
import { areaService } from '../../areas/services/areaService'


export const useFloodRiskData = () => {
  const [floodRiskData, setFloodRiskData] = useState<FloodRiskData[]>([])
  const [loading, setLoading] = useState(false)
    const [areaOptions, setAreaOptions] = useState<Option[]>([]);
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

    
  useEffect(() => {
    fetchFloodRiskData();
 
  }, [])

  return { floodRiskData, loading, fetchFloodRiskData }
}