
import type { IoTAggregate } from '../types/waterlevelType'
import { axiosClient } from '@/api/axiosClient'

const API_URL=""
export const waterlevelApi= {
 async getIoTWaterSummary():Promise<IoTAggregate[]>{
    const response=await axiosClient.get(`${API_URL}/iot-aggregate`)
    return response.data.result;
 },
 async getWaterLevelsByArea(area_id:string):Promise<IoTAggregate[]>{
    const response=await axiosClient.get(`${API_URL}/iot-aggregate/${area_id}`)
    return response.data.result?.content ?? [];
 },
 async postIoTWaterSummary(): Promise<void> {
  await axiosClient.post(`${API_URL}/iot-device/all`);
}
}
