import { useEffect, useState } from "react"
import { areaApi } from "../../areas/api/areaApi"
import type { Area } from "../../areas/types/areaType"
import type { Polygon, MultiPolygon } from "geojson"
import { axiosClient } from "@/api/axiosClient"

interface AreaDetail {
  tenkhuvuc: string
  mota: string
  parent_id: string
}

interface UserProvinceState {
  gpsArea: Area | null
  parentArea: Area | null
  siblingAreas: Area[]
  polygons: Record<string, Polygon | MultiPolygon>
  currentLat: number | null
  currentLon: number | null
  loading: boolean
  error: string | null
}

const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  )

const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${lat}&lon=${lon}&format=json&accept-language=vi`

    const res = await fetch(url, { headers: { "Accept-Language": "vi" } })
    if (!res.ok) return null

    const data = await res.json()
    const addr = data.address ?? {}

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

const normalize = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()

const findAreaByName = async (wardName: string): Promise<Area | null> => {
  try {
    const results = await areaApi.getArea(wardName)
    if (!results.length) return null

    const normWard = normalize(wardName)
    const exact = results.find((a) => normalize(a.tenkhuvuc) === normWard)
    if (exact) return exact

    const partial = results.find((a) =>
      normalize(a.tenkhuvuc).includes(normWard) ||
      normWard.includes(normalize(a.tenkhuvuc))
    )
    return partial ?? results[0]
  } catch {
    return null
  }
}

// ✅ Sửa: dùng axiosClient đúng cách
const getAreaDetail = async (areaId: string): Promise<AreaDetail | null> => {
  try {
    const res = await axiosClient.get(`/area/detail/${areaId}`)
    return (res.data.result ?? null) as AreaDetail | null
  } catch {
    return null
  }
}

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
      setState((s) => ({ ...s, loading: false, error: "Trình duyệt không hỗ trợ GPS" }))
      return
    }

    const run = async () => {
      try {
        // 1. GPS
        const pos = await getCurrentPosition()
        const { latitude: lat, longitude: lon } = pos.coords
        console.log("✅ GPS:", lat, lon)
        setState((s) => ({ ...s, currentLat: lat, currentLon: lon }))

        // 2. Reverse-geocode
        const wardName = await reverseGeocode(lat, lon)
        console.log("🏘️ Ward name from Nominatim:", wardName)

        if (!wardName) {
          setState((s) => ({ ...s, loading: false, error: "Không xác định được tên phường/xã từ vị trí" }))
          return
        }

        // 3. Tìm area theo tên
        const gpsArea = await findAreaByName(wardName)
        console.log("📍 gpsArea:", gpsArea?.tenkhuvuc, "| id:", gpsArea?.id)

        if (!gpsArea) {
          setState((s) => ({ ...s, loading: false, error: `Không tìm thấy khu vực "${wardName}" trong hệ thống` }))
          return
        }

        setState((s) => ({ ...s, gpsArea }))

        // 4. Lấy parent_id
        const detail = await getAreaDetail(gpsArea.id)
        console.log("📋 area detail:", detail)

        if (!detail?.parent_id) {
          setState((s) => ({ ...s, loading: false }))
          return
        }

        const parentId = detail.parent_id

        // 5. Lấy siblings và parent
        const [siblingAreas, parentDetail] = await Promise.all([
          areaApi.getChildren(parentId),
          getAreaDetail(parentId),
        ])
        console.log("👪 siblings:", siblingAreas.length)

        const parentArea: Area | null = parentDetail
          ? { id: parentId, tenkhuvuc: parentDetail.tenkhuvuc, mota: parentDetail.mota } as Area
          : null

        setState((s) => ({ ...s, siblingAreas, parentArea }))

        // 6. Lấy polygons
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

        setState((s) => ({ ...s, polygons, loading: false, error: null }))
      } catch (err: any) {
        console.error("❌ useUserProvince error:", err)
        setState((s) => ({ ...s, loading: false, error: err?.message ?? "Lỗi khi lấy vị trí" }))
      }
    }

    run()
  }, [])

  return state
}