// import axios from "axios"
// import type { Area } from "../types/areaType"

// const API_URL =
//   "https://api-lulut.io.vn/area"

// export const areaApi = {
//   async getAll(): Promise<Area[]> {
//   const response = await axios.get(`${API_URL}/list`);
//   return response.data.content ?? response.data; // ← thêm .content
// },

//  async getChildren(parentId: string): Promise<Area[]> {
//   const res = await axios.get<Area[]>(
//     `${API_URL}/list-by-parent`,
//     {
//       params: { parentId }
//     }
//   )

//   return res.data
// },

// async getArea(keyword: string): Promise<Area[]> {
//   const res = await axios.get(`${API_URL}/search`, { params: { keyword } });
//   return res.data.content ?? res.data; 
// },

// async getByIdArea(areaId: string): Promise<Area> {
//   const res = await axios.get(`${API_URL}/detail/${areaId}`)
//   return {
//     ...res.data.result,
//     id: areaId,  // response không trả id nên tự gán
//   }
// }
// }

// features/areas/apis/areaApi.ts

import axios from "axios"
import type { Area } from "../types/areaType"

const API_URL = "https://api-lulut.io.vn/area"

export const areaApi = {
  // ================= Lấy tất cả =================
  async getAll(): Promise<Area[]> {
    const res = await axios.get(`${API_URL}/list`)

    return Array.isArray(res.data)
      ? res.data
      : res.data.content ?? []
  },

  // ================= Lấy con theo parent =================
  async getChildren(parentId: string): Promise<Area[]> {
    if (!parentId) return []

    const res = await axios.get(`${API_URL}/list-by-parent`, {
      params: { parentId }
    })

    return Array.isArray(res.data)
      ? res.data
      : res.data.content ?? []
  },

  // ================= Search =================
  async getArea(keyword: string): Promise<Area[]> {
    const res = await axios.get(`${API_URL}/search`, {
      params: { keyword }
    })

    return Array.isArray(res.data)
      ? res.data
      : res.data.content ?? []
  },

  // ================= Detail =================
  async getByIdArea(areaId: string): Promise<Area> {
    const res = await axios.get(`${API_URL}/detail/${areaId}`)

    const data = res.data.result ?? res.data

    return {
      ...data,
      id: data.id ?? areaId
    }
  }
}