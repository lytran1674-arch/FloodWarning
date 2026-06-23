// features/map/hooks/useUserProvince.ts
//
// Luồng:
//  1. Lấy tọa độ GPS
//  2. Reverse-geocode (Nominatim) → tên phường/xã
//  3. Tìm area khớp tên  (areaService.searchArea)
//  4. Gọi area/detail/{id}  → lấy parent_id (khu vực cha)
//  5. Gọi area/list-by-parent?parentId={parent_id}  → danh sách khu vực con
//  6. Gọi polygon-by-id cho từng con  → vẽ map
//
import { useEffect, useState } from "react"
import { areaApi } from "../../areas/api/areaApi"
import type { Area } from "../../areas/types/areaType"
import type { Polygon, MultiPolygon } from "geojson"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AreaDetail {
  tenkhuvuc: string
  mota: string
  parent_id: string
}

interface UserProvinceState {
  /** Khu vực GPS tìm được (phường/xã) */
  gpsArea: Area | null
  /** Khu vực cha (quận/huyện) của gpsArea */
  parentArea: Area | null
  /** Danh sách khu vực con của parentArea */
  siblingAreas: Area[]
  /** Map id → geometry để vẽ polygon */
  polygons: Record<string, Polygon | MultiPolygon>
  currentLat: number | null
  currentLon: number | null
  loading: boolean
  error: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Lấy tọa độ GPS */
const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  )

/**
 * Reverse-geocode bằng Nominatim → trả về tên phường/xã
 * Nominatim response: address.quarter | address.suburb | address.village | address.town
 */
const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${lat}&lon=${lon}&format=json&accept-language=vi`

    const res = await fetch(url, {
      headers: { "Accept-Language": "vi" },
    })
    if (!res.ok) return null

    const data = await res.json()
    const addr = data.address ?? {}

    // Ưu tiên phường/xã cấp nhỏ nhất
    const ward =
      addr.quarter ??
      addr.suburb ??
      addr.borough ??
      addr.village ??
      addr.town ??
      addr.city_district ??
      null

    console.log("🗺️ Nominatim address:", addr)
    console.log("📍 Ward candidate:", ward)
    return ward
  } catch (err) {
    console.error("Nominatim error:", err)
    return null
  }
}

/**
 * Tìm area trong DB theo tên phường/xã
 * So sánh không dấu để tăng độ chính xác
 */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()

const findAreaByName = async (wardName: string): Promise<Area | null> => {
  try {
    const results = await areaApi.getArea(wardName)
    if (!results.length) return null

    const normWard = normalize(wardName)

    // Tìm exact match trước
    const exact = results.find(
      (a) => normalize(a.tenkhuvuc) === normWard
    )
    if (exact) return exact

    // Fallback: includes
    const partial = results.find((a) =>
      normalize(a.tenkhuvuc).includes(normWard) ||
      normWard.includes(normalize(a.tenkhuvuc))
    )
    return partial ?? results[0]
  } catch {
    return null
  }
}

/** Gọi area/detail/{id} → trả về AreaDetail có parent_id */
const getAreaDetail = async (areaId: string): Promise<AreaDetail | null> => {
  try {
    // areaApi.getByIdArea trả raw area; ta cần trực tiếp res.data.result
    const res = await fetch(
      `https://api-lulut.io.vn/area/detail/${areaId}`
    )
    if (!res.ok) return null
    const json = await res.json()
    return (json.result ?? null) as AreaDetail | null
  } catch {
    return null
  }
}

/** Lấy polygon theo id */
const fetchPolygon = async (
  id: string
): Promise<{ id: string; geometry: Polygon | MultiPolygon } | null> => {
  try {
    const data = await areaApi.getPolygonById(id)
    if (!data?.geometry) return null
    return { id, geometry: data.geometry }
  } catch {
    return null
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useUserProvince = () => {
  const [state, setState] = useState<UserProvinceState>({
    gpsArea: null,
    parentArea: null,
    siblingAreas: [],
    polygons: {},
    currentLat: null,
    currentLon: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: "Trình duyệt không hỗ trợ GPS",
      }))
      return
    }

    const run = async () => {
      try {
        // ── 1. Lấy GPS ────────────────────────────────────────────────────
        const pos = await getCurrentPosition()
        const { latitude: lat, longitude: lon } = pos.coords
        console.log("✅ GPS:", lat, lon)

        setState((s) => ({ ...s, currentLat: lat, currentLon: lon }))

        // ── 2. Reverse-geocode → tên phường/xã ───────────────────────────
        const wardName = await reverseGeocode(lat, lon)
        console.log("🏘️ Ward name from Nominatim:", wardName)

        if (!wardName) {
          setState((s) => ({
            ...s,
            loading: false,
            error: "Không xác định được tên phường/xã từ vị trí",
          }))
          return
        }

        // ── 3. Tìm area khớp tên trong DB ─────────────────────────────────
        const gpsArea = await findAreaByName(wardName)
        console.log("📍 gpsArea:", gpsArea?.tenkhuvuc, "| id:", gpsArea?.id)

        if (!gpsArea) {
          setState((s) => ({
            ...s,
            loading: false,
            error: `Không tìm thấy khu vực "${wardName}" trong hệ thống`,
          }))
          return
        }

        setState((s) => ({ ...s, gpsArea }))

        // ── 4. Gọi area/detail → lấy parent_id ───────────────────────────
        const detail = await getAreaDetail(gpsArea.id)
        console.log("📋 area detail:", detail)

        if (!detail?.parent_id) {
          // Không có cha → dùng chính area đó làm parent
          setState((s) => ({
            ...s,
            loading: false,
          }))
          return
        }

        const parentId = detail.parent_id

        // ── 5. Lấy danh sách khu vực con của cha ─────────────────────────
        const [siblingAreas, parentDetail] = await Promise.all([
          areaApi.getChildren(parentId),
          // lấy tên khu vực cha để hiển thị label
          getAreaDetail(parentId),
        ])
        console.log("👪 siblings:", siblingAreas.length)

        const parentArea: Area | null = parentDetail
          ? {
              id: parentId,
              tenkhuvuc: parentDetail.tenkhuvuc,
              mota: parentDetail.mota,
              // các field khác giữ nguyên nếu cần
            } as Area
          : null

        setState((s) => ({ ...s, siblingAreas, parentArea }))

        // ── 6. Lấy polygon cho từng khu vực con ──────────────────────────
        const polygonResults = await Promise.allSettled(
          siblingAreas.map((a) => fetchPolygon(a.id))
        )

        const polygons: Record<string, Polygon | MultiPolygon> = {}
        polygonResults.forEach((r) => {
          if (r.status === "fulfilled" && r.value) {
            polygons[r.value.id] = r.value.geometry
          }
        })
        console.log("🗺️ Polygons loaded:", Object.keys(polygons).length)

        setState((s) => ({
          ...s,
          polygons,
          loading: false,
          error: null,
        }))
      } catch (err: any) {
        console.error("❌ useUserProvince error:", err)
        setState((s) => ({
          ...s,
          loading: false,
          error: err?.message ?? "Lỗi khi lấy vị trí",
        }))
      }
    }

    run()
  }, [])

  return state
}