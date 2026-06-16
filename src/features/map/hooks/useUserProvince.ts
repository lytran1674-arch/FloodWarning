

// features/map/hooks/useUserProvince.ts
// ============================================================
// Hook tự động tìm tỉnh của user từ area_id
// Flow: xã → huyện → tỉnh (leo lên đến level 1)
// ============================================================
import { useEffect, useState } from "react"
import { useAppSelector } from "../../../hooks/redux.hooks";
import {areaService} from "../../areas/services/areaService"
import type { Area } from "../../areas/types/areaType"

interface UserProvinceState {
  province: Area | null       // tỉnh của user
  userArea: Area | null       // xã/phường của user (để highlight)
  loading: boolean
  error: string | null
}

// Leo lên tìm tỉnh (level 1) từ bất kỳ area nào
const findProvince = async (areaId: string): Promise<Area | null> => {
  try {
    const area = await areaService.getById(areaId)
    if (!area) return null

    // Đã là tỉnh → dừng
    if (area.level === 1) return area

    // Chưa phải tỉnh → leo lên parent
    if (area.parent_id) return findProvince(area.parent_id)

    return area // fallback
  } catch {
    return null
  }
}

export const useUserProvince = () => {
  const user = useAppSelector(state => state.auth.user)

  const [state, setState] = useState<UserProvinceState>({
    province: null,
    userArea: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!user?.area_id) return

    const load = async () => {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        // Song song: lấy xã của user + leo lên tìm tỉnh
        const [userArea, province] = await Promise.all([
          areaService.getById(user.area_id!),
          findProvince(user.area_id!),
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
  }, [user?.area_id])

  return state
}