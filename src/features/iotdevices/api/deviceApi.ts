import axios from "axios"
import type { Device, IotData } from "../types/deviceType"

 const API_URL="https://api-lulut.io.vn"



export const DeviceApi={
    
    async getAll():Promise<Device[]>{
        const response=await axios.get(`${API_URL}/iot-device/list-device`)
        return response.data.result
    },
    async patchApprove(id: string,adminId:string):Promise<Device>{
        const response= await axios.patch(`${API_URL}/${id}/iot-device/approve?adminId=${adminId}`)
        return response.data;
    },
    async patchPreject(id:string):Promise<Device>{
        const response= await axios.patch(`${API_URL}/${id}/iot-device/reject`)
        return response.data;
    },
    async getDataIotTongHop():Promise<IotData>{
        const response=await axios.get(`${API_URL}/iot-aggregate`)
        return response.data;
    }
  
}