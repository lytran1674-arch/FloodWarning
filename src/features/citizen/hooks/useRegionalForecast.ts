// src/map/hooks/useRegionalForecast.ts
import { useState, useEffect } from "react"
import { axiosClient } from "@/api/axiosClient"
import type { AreaMapItem, RiskLevel } from "../../map/types/mapType"

interface ForecastItem {
  areaId: string
  tenkhuvuc: string
  riskLevel: string
  predictionRiskLevel: string
  predictionProbability: number
  snapshotAt: string
}
export const useRegionalForecast = (areaId: string | null) => {
  const [areas, setAreas] = useState<AreaMapItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("🔍 useRegionalForecast areaId:", areaId)
    if (!areaId) return

    const fetchAll = async () => {
      setLoading(true)
      try {
        // Bước 1: lấy danh sách khu vực + riskLevel bằng areaId từ login luôn
        const forecastRes = await axiosClient.get(
          `/snapshot/regional-forecast?areaId=${areaId}`
        )
        console.log("📊 forecast result:", forecastRes.data)

        const result: ForecastItem[] = forecastRes.data?.result ?? []
        console.log("📋 forecast items count:", result.length)

        // Bước 2: fetch polygon song song
        const withGeometry: AreaMapItem[] = await Promise.all(
          result.map(async (item): Promise<AreaMapItem> => {
            try {
              const polyRes = await axiosClient.get(`/area/polygon-by-id`, {
                params: { id: item.areaId },
              })
              return {
                id: item.areaId,
                tenkhuvuc: item.tenkhuvuc,
                riskLevel: (item.predictionRiskLevel ?? "UNKNOWN") as RiskLevel,
                geometry: polyRes.data?.geometry ?? null,
              }
            } catch (_err) {
              return {
                id: item.areaId,
                tenkhuvuc: item.tenkhuvuc,
                riskLevel: "UNKNOWN" as RiskLevel,
                geometry: null,
              }
            }
          })
        )

        console.log("✅ areasWithGeometry:", withGeometry.length)
        setAreas(withGeometry)
      } catch (err) {
        console.error("useRegionalForecast error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [areaId])

  return { areas, loading }
}