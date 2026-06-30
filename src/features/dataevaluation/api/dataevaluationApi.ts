import { axiosClient } from '@/api/axiosClient'
import type { SnapShot } from '../types/dataevaluationType';

const API_URL="/snapshot"
export const dataevaluationApi =  {
  async buttonSnapShot():Promise<void>{
    return await axiosClient.post(`${API_URL}/generate-all`);
  }
  ,
  async getSnapShotSumById(areaId:string):Promise<SnapShot>{
    const respone=await axiosClient.get(`${API_URL}/snapshot-lastest/${areaId}`)
    return respone.data.result
  }
  ,
  async getSnapShotSumOneDay(areaId:string):Promise<SnapShot[]>{
    const response=await axiosClient.get(`${API_URL}/list-snapshot-by-areaId/${areaId}`)
    return response.data.result?.content??[]
  }
}
