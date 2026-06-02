import axios from "axios"
import type { Area } from "../types/areaType"

const API_URL =
  "/api/area"

export const areaApi = {
  async getAll(): Promise<Area[]> {
    const response = await axios.get<Area[]>(`${API_URL}/list`)

    return response.data
  },

 async getChildren(parentId: string): Promise<Area[]> {
  const res = await axios.get<Area[]>(
    `${API_URL}/list-by-parent`,
    {
      params: { parentId }
    }
  )

  return res.data
}
}