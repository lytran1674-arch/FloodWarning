
import type { Alert, PopupAlert } from '../types/alertType'
import { axiosClient } from '@/api/axiosClient'


const API_URL="/alert"
export const alertApi = {
  async getMyAlertById(userId:string):Promise<Alert[]>{
    const respone=await axiosClient.get(`${API_URL}/my-alerts/${userId}`)
    return respone.data.result?.content??[]
  },

  async getPopupAlert():Promise<PopupAlert[]>{
    const response=await axiosClient.get(`${API_URL}/popup`)
    return response.data.result?.content ?? response.data.result ?? []
  
    }  ,

  async markAlertRead(alertId:string):Promise<PopupAlert>{
    const response=await axiosClient.put(`${API_URL}/${alertId}/read`)
   return response.data.result?.content ?? response.data.result ?? []
  }
}
