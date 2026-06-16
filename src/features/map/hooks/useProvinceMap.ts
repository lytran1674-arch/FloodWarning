// features/map/hooks/useProvinceMap.ts
// ============================================================
// Hook lấy toàn bộ polygon + risk level của các khu vực
// trong 1 tỉnh để render lên map
// ============================================================
import { useEffect, useState } from "react"
import {areaService} from "../../areas/services/areaService"
import mapService from "../services/mapService"
import type { AreaWithRisk } from "../types/mapType"

interface ProvinceMapState {
  areas: AreaWithRisk[]
  loading: boolean
  error: string | null
}

export const useProvinceMap = (provinceId: string | null) => {
  const [state, setState] = useState<ProvinceMapState>({
    areas: [],
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!provinceId) return

    const load = async () => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        // 1. Lấy danh sách huyện/xã trong tỉnh
        const children = await areaService.getFilterChildren(provinceId)

        // 2. Song song: lấy polygon + risk level cho từng vùng
        const results = await Promise.allSettled(
          children.map(async (child) => {
            const [polygon, risk] = await Promise.allSettled([
              mapService.getPolygonById(child.id),
              mapService.getRiskLevel(child.id),
            ])

            return {
              ...child,
              geometry: polygon.status === "fulfilled"
                ? polygon.value?.geometry
                : null,
              riskLevel: risk.status === "fulfilled"
                ? risk.value
                : "UNKNOWN",
            } as AreaWithRisk
          })
        )

        // Lọc những vùng có polygon
        const areas = results
          .filter(r => r.status === "fulfilled")
          .map(r => (r as PromiseFulfilledResult<AreaWithRisk>).value)
          .filter(a => a.geometry != null)

        setState({ areas, loading: false, error: null })
      } catch (err: any) {
        setState(s => ({
          ...s,
          loading: false,
          error: err.message ?? "Lỗi tải bản đồ",
        }))
      }
    }

    load()
  }, [provinceId])

  return state
}