
import type { Alert } from '../types/alertType'
import { axiosClient } from '@/api/axiosClient'


const API_URL="/alert"
export const alertApi = {
  async getMyAlertById(userId:string):Promise<Alert[]>{
    const respone=await axiosClient.get(`${API_URL}/my-alerts/${userId}`)
    return respone.data.result?.content??[]
  }
}
