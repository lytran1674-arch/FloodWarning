// src/map/hooks/useRegionalForecast.ts
import { useState, useEffect, useRef } from "react"
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

// 2 phút / lần
const POLL_INTERVAL_MS = 2 * 60 * 1000

export const useRegionalForecast = (areaId: string | null) => {
  const [areas, setAreas] = useState<AreaMapItem[]>([])
  const [loading, setLoading] = useState(false)

  // Dùng ref để biết đây là lần load đầu tiên hay load ngầm (polling)
  const isFirstLoadRef = useRef(true)

  useEffect(() => {
    console.log("🔍 useRegionalForecast areaId:", areaId)
    if (!areaId) return

    // Mỗi khi areaId đổi, coi như bắt đầu lại từ lần load đầu
    isFirstLoadRef.current = true

    let cancelled = false

    const fetchAll = async () => {
      // Chỉ bật overlay "Đang tải bản đồ..." ở lần load đầu tiên.
      // Các lần polling sau chạy ngầm, giữ nguyên dữ liệu cũ trên map.
      if (isFirstLoadRef.current) {
        setLoading(true)
      }
      try {
        // Bước 1: lấy danh sách khu vực + riskLevel
        const forecastRes = await axiosClient.get(
          `/snapshot/regional-forecast?areaId=${areaId}`
        )

        const result: ForecastItem[] = forecastRes.data?.result ?? []
        console.log("📋 forecast items:", result)

        // Bước 2: fetch polygon song song
        const withGeometry: AreaMapItem[] = await Promise.all(
          result.map(async (item): Promise<AreaMapItem> => {

            // Log để kiểm tra riskLevel từng item
          const finalRiskLevel = (item.riskLevel ?? "UNKNOWN") as RiskLevel
            console.log("🎯", item.tenkhuvuc, "| predictionRiskLevel:", item.predictionRiskLevel, "| riskLevel:", item.riskLevel, "| final:", finalRiskLevel)

            try {
              const polyRes = await axiosClient.get(`/area/polygon-by-id`, {
                params: { id: item.areaId },
              })

              // Log để kiểm tra cấu trúc polygon response
              console.log("🗺️ polyRes.data for", item.tenkhuvuc, ":", JSON.stringify(polyRes.data).slice(0, 100))

              return {
                id: item.areaId,
                tenkhuvuc: item.tenkhuvuc,
                riskLevel: finalRiskLevel,
                geometry: polyRes.data?.geometry ?? polyRes.data ?? null,
              }
            } catch (_err) {
              console.log("❌ polygon failed:", item.areaId)
              return {
                id: item.areaId,
                tenkhuvuc: item.tenkhuvuc,
                riskLevel: finalRiskLevel, // giữ đúng riskLevel dù polygon fail
                geometry: null,
              }
            }
          })
        )

        console.log("✅ final areas:", withGeometry.map(a => ({
          name: a.tenkhuvuc,
          risk: a.riskLevel,
          hasGeometry: !!a.geometry,
        })))

        if (!cancelled) {
          setAreas(withGeometry)
        }
      } catch (err) {
        console.error("useRegionalForecast error:", err)
        // Lỗi ở lần polling ngầm: KHÔNG xoá dữ liệu cũ đang hiển thị,
        // chỉ log lỗi và để lần polling tiếp theo thử lại.
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
        isFirstLoadRef.current = false
      }
    }

    fetchAll()

    // Polling mỗi 2 phút, chạy ngầm không che dữ liệu
    const intervalId = setInterval(fetchAll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [areaId])

  return { areas, loading }
}