import axios from "axios"
import type { Area } from "../types/areaType"

const API_URL =
  "https://68270d92397e48c91318625b.mockapi.io/areas"

export const areaApi = {
  async getAll(): Promise<Area[]> {
    const response = await axios.get<Area[]>(API_URL)

    return response.data
  },
}