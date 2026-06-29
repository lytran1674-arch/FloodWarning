import type { Polygon, MultiPolygon } from "geojson"
import type { Area } from "../types/areaType"
import { axiosClient } from "@/api/axiosClient"

const API_URL = "/area" // 

export const areaApi = {
  async getAll(): Promise<Area[]> {
    const res = await axiosClient.get(`${API_URL}/list`)
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getChildren(parentId: string): Promise<Area[]> {
    if (!parentId) return []
    const res = await axiosClient.get(`${API_URL}/list-by-parent`, {
      params: { parentId },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getArea(keyword: string): Promise<Area[]> {
    const res = await axiosClient.get(`${API_URL}/search`, {
      params: { keyword },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getByIdArea(areaId: string): Promise<Area> {
    const res = await axiosClient.get(`${API_URL}/detail/${areaId}`)
    const data = res.data.result ?? res.data
    return { ...data, id: data.id ?? areaId }
  },

  async getPolygonById(id: string): Promise<{ geometry: Polygon | MultiPolygon } | null> {
    // fetch gốc không có interceptor, cần gắn token thủ công
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`https://api-lulut.io.vn${API_URL}/polygon-by-id?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) return null
    return res.json()
  },
}