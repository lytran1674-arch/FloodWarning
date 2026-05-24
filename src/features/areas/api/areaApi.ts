import axios from "axios"
import type { Area, AreaTree } from "../types/areaType"

const API_URL =
  "/api/area/list"

export const areaApi = {
  async getAll(): Promise<AreaTree[]> {
    const response = await axios.get<Area[]>(API_URL)

    return response.data
  },
}