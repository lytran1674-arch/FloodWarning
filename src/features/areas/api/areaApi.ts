import axios from "axios"
import type { Polygon, MultiPolygon } from "geojson"  // ← thêm
import type { Area } from "../types/areaType"

const API_URL = "https://api-lulut.io.vn/area"

export const areaApi = {
  async getAll(): Promise<Area[]> {
    const res = await axios.get(`${API_URL}/list`)
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getChildren(parentId: string): Promise<Area[]> {
    if (!parentId) return []
    const res = await axios.get(`${API_URL}/list-by-parent`, {
      params: { parentId },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getArea(keyword: string): Promise<Area[]> {
    const res = await axios.get(`${API_URL}/search`, {
      params: { keyword },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getByIdArea(areaId: string): Promise<Area> {
    const res = await axios.get(`${API_URL}/detail/${areaId}`)
    const data = res.data.result ?? res.data
    return { ...data, id: data.id ?? areaId }
  },

  async getPolygonById(id: string): Promise<{ geometry: Polygon | MultiPolygon } | null> {
    const res = await fetch(`${API_URL}/polygon-by-id?id=${id}`)  // ← bỏ /area thừa
    if (!res.ok) return null
    return res.json()
  },
}