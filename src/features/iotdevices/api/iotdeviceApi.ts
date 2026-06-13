import axios from "axios"
import type { IotDevice } from "../types/iotdeviceType"

 const API_URL="https://api-lulut.io.vn/iot-device"



export const iotdeviceApi={
    
    async getAll():Promise<IotDevice[]>{
        const response=await axios.get(`${API_URL}/list-device`)
        return response.data.result
    },
    async patchApprove(device_id: string,adminId:string):Promise<IotDevice>{
        const response= await axios.patch(`${API_URL}/${device_id}/approve?adminId=${adminId}`)
        return response.data;
    },
    async patchPreject(device_id:string):Promise<IotDevice>{
        const response= await axios.patch(`${API_URL}/${device_id}/reject`)
        return response.data;
    }
  
}