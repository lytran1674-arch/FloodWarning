import axios from "axios"
import type { IotDevice } from "../types/iotdeviceType"

 const API_URL="https://api-lulut.io.vn/iot-device"



export const iotdeviceApi={
    
    async getAll():Promise<IotDevice[]>{
        const response=await axios.get(`${API_URL}/list-device`)
        return response.data.result
    },
    async patchApprove(id: string,adminId:string):Promise<IotDevice>{
        const response= await axios.patch(`${API_URL}/${id}/approve?adminId=${adminId}`)
        return response.data;
    },
    async patchPreject(id:string):Promise<IotDevice>{
        const response= await axios.patch(`${API_URL}/${id}/reject`)
        return response.data;
    }
  
}