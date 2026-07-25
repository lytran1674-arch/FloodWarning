
import type { Area } from "../types/areaType"
import { axiosClient, publicApi } from "@/api/axiosClient"

const API_URL = "/area" // 

export const areaApi = {
  async getAll(): Promise<Area[]> {
    const res = await publicApi.get(`${API_URL}/list`)
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getChildren(parentId: string): Promise<Area[]> {
    if (!parentId) return []
    const res = await publicApi.get(`${API_URL}/list-by-parent`, {
      params: { parentId },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getArea(keyword: string): Promise<Area[]> {
    const res = await publicApi.get(`${API_URL}/search`, {
      params: { keyword },
    })
    return Array.isArray(res.data) ? res.data : res.data.content ?? []
  },

  async getByIdArea(areaId: string): Promise<Area> {
    const res = await publicApi.get(`${API_URL}/detail/${areaId}`)
    const data = res.data.result ?? res.data
    return { ...data, id: data.id ?? areaId }
  },

  async getPolygonById(id: string) {
  const res = await axiosClient.get(`${API_URL}/polygon-by-id`, { params: { id } })
  return res.data
}
}