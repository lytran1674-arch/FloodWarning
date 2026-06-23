// import axios from 'axios'
// import type { FloodRiskData } from '../types/floodriskdataType'

// const API_URL= "https://api-lulut.io.vn/predict"
// export const FloodRiskDataApi ={
//   async getAll(): Promise<FloodRiskData[]> {
//     const token = localStorage.getItem('token')

//     const response = await axios.get(`${API_URL}/list`, {
//       headers: {
//         Authorization: `Bearer ${token}`  
//       }
//     })

//     return response.data.result ?? response.data
//   },
//   async getPredictById(areaId:string):Promise<FloodRiskData[]>{
//     const response=await axios.get(`${API_URL}/list-by-area`,{
//       params:(areaId)
//     })
//     return response.data;
//   }
// }
// features/flood-risk/api/floodriskdataApi.ts
import axios from 'axios'
import type { FloodRiskAlert, FloodRiskData } from '../types/floodriskType'

const API_URL = "https://api-lulut.io.vn/predict"

export const FloodRiskDataApi = {
  async getAll(): Promise<FloodRiskData[]> {
    const token = localStorage.getItem('accessToken')
    
    // Nếu chưa có token → không gọi API, trả về mảng rỗng
    if (!token) {
      console.warn('⚠️ Chưa có token, bỏ qua gọi API /predict/list')
      return []
    }

    try {
      const response = await axios.get(`${API_URL}/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.result ?? response.data ?? []
    } catch (error) {
      console.error('❌ Lỗi khi gọi /predict/list:', error)
      return [] // Trả về mảng rỗng thay vì throw để UI không bị crash
    }
  },

  async getPredictById(areaId: string): Promise<FloodRiskData[]> {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.warn('⚠️ Chưa có token, bỏ qua gọi API /predict/list-by-area')
      return []
    }

    try {
      const response = await axios.get(`${API_URL}/list-by-area`, {
        params: { areaId }, // ← sửa: phải là object params
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.result ?? response.data ?? []
    } catch (error) {
      console.error('❌ Lỗi khi gọi /predict/list-by-area:', error)
      return []
    }
  },
  async getALertHistoryByUserId(userId: string):Promise<FloodRiskAlert[]>{
    const response=await axios.get(`${API_URL}/alert/my-alerts/${userId}`)
    return response.data.result.content;
  }
}