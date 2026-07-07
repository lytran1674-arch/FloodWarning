import { axiosClient } from "@/api/axiosClient"
import type { Emergency } from "../types/emergencyType"

const API_URL = "/res-team"

export const emergencyApi = {
  // lấy hotline đội theo lat lon của người dân
  async getHotline(lat: number, lon: number): Promise<Emergency> {
    const response = await axiosClient.get(`${API_URL}/emergency-contact`, {
      params: { lat, lon },
    })
    return response.data.result
  },
}