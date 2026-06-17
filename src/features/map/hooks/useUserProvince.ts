// features/map/hooks/useUserProvince.ts
import { useEffect, useState } from "react"
import { useAppSelector } from "../../../hooks/redux.hooks";
import { areaService } from "../../areas/services/areaService"
import type { Area } from "../../areas/types/areaType"

interface UserProvinceState {
  province: Area | null
  userArea: Area | null
  loading: boolean
  error: string | null
}

const findProvince = async (areaId: string): Promise<Area | null> => {
  try {
    const area = await areaService.getById(areaId)
    if (!area) return null
    if (area.level === 1) return area
    if (area.parent_id) return findProvince(area.parent_id)
    return area
  } catch {
    return null
  }
}

export const useUserProvince = () => {
  const user = useAppSelector(state => state.auth.user)

  // ⚠️ User object dùng "areaId" (camelCase) từ login response,
  //    KHÔNG phải "area_id" (snake_case) như Area entity
  const areaId = user?.areaId

  const [state, setState] = useState<UserProvinceState>({
    province: null,
    userArea: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!areaId) return

    const load = async () => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        const [userArea, province] = await Promise.all([
          areaService.getById(areaId),
          findProvince(areaId),
        ])

        setState({ province, userArea, loading: false, error: null })
      } catch (err: any) {
        setState(s => ({
          ...s,
          loading: false,
          error: err.message ?? "Lỗi tải khu vực",
        }))
      }
    }

    load()
  }, [areaId])

  return state
}