import { useEffect, useState } from "react"
import type { Area } from "../features/areas/types/areaType"
import { areaService } from "../features/areas/services/areaService"


export const useArea = () => {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAreas = async () => {
    try {
      setLoading(true)
      const data = await areaService.getAreas()
      setAreas(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  return {
    areas,
    loading,
    fetchAreas,
  }
}