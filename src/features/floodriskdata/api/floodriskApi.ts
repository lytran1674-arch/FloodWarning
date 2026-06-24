import { axiosClient } from '@/api/axiosClient'
import type { FloodRiskAlert, FloodRiskData } from '../types/floodriskType'

const API_URL = "/predict"

export const FloodRiskDataApi = {
  async getAll(): Promise<FloodRiskData[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/list`)
      return response.data.result ?? response.data ?? []
    } catch (error) {
      console.error('❌ Lỗi khi gọi /predict/list:', error)
      return []
    }
  },

  async getPredictById(areaId: string): Promise<FloodRiskData[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/list-by-area`, {
        params: { areaId },
      })
      return response.data.result ?? response.data ?? []
    } catch (error) {
      console.error('❌ Lỗi khi gọi /predict/list-by-area:', error)
      return []
    }
  },

  async getALertHistoryByUserId(userId: string): Promise<FloodRiskAlert[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/alert/my-alerts/${userId}`)
      return response.data.result.content
    } catch (error) {
      console.error('❌ Lỗi khi gọi alert history:', error)
      return []
    }
  }
}