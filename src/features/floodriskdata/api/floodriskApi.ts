import { axiosClient } from '@/api/axiosClient'
import type { FloodRiskAlert, FloodRiskData, PredictionJobs, PredictionJobsDetail } from '../types/floodriskType'

const API_URL = "/predict"
const Endpoint="/prediction-jobs"
export const FloodRiskDataApi = {
  async getAll(): Promise<FloodRiskData[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/list`)
      return response.data.result ?? response.data ?? []
    } catch (error) {
     
      return []
    }
  },

  async getPredictById(areaId: string): Promise<FloodRiskData> {

      const response = await axiosClient.get(`${API_URL}/list-by-area`, {
        params: { areaId },
      })
      return response.data??[];
    
  },

  async getALertHistoryByUserId(userId: string): Promise<FloodRiskAlert[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/alert/my-alerts/${userId}`)
      return response.data.result.content
    } catch (error) {
      console.error('❌ Lỗi khi gọi alert history:', error)
      return []
    }
  },

  // lấy danh sách lịch sử chạy dự báo
  async getPredictJob():Promise<PredictionJobs[]>{
    const response=await axiosClient.get(Endpoint);
    return response.data.result?.content??[]
  }
  
  ,
  // lấy chi tiết của 1 lịch sử dự báo
  async getPredictionJobDetail(id:string):Promise<PredictionJobsDetail>{
    const response=await axiosClient.get(`${Endpoint}/${id}`)
    return response.data.result;
  }
}