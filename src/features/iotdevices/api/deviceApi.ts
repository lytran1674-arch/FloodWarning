
import type { Device, IotData } from "../types/deviceType"
import { axiosClient } from "@/api/axiosClient"

 const API_URL="https://api-lulut.io.vn"



export const DeviceApi={
    
    async getAll():Promise<Device[]>{
        const response=await axiosClient.get(`${API_URL}/iot-device/list-device`)
        return response.data.result
    },
    async patchApprove(id: string,adminId:string):Promise<Device>{
        const response= await axiosClient.patch(`${API_URL}/iot-device/${id}/approve?adminId=${adminId}`)
        return response.data;
    },
    async patchPreject(id:string):Promise<Device>{
        const response= await axiosClient.patch(`${API_URL}/${id}/iot-device/reject`)
        return response.data;
    },
    async getDataIotTongHop():Promise<IotData>{
        const response=await axiosClient.get(`${API_URL}/iot-aggregate`)
        return response.data;
    },
    // cập nhật thông tin thiết bị 
    async updateIotDevice(deviceId:string,payload:string):Promise<Device>{
        const res=await axiosClient.put(`/iot-device/update/${deviceId}`,payload)
        return res.data.result;
    }
    ,
    //chi tiết thông tin về thiết bị iot
    async DetailIotDevice(deviceId:string):Promise<Device>{
        const res=await axiosClient.get(`/iot-device/detail/${deviceId}`)
        return res.data.result;
    }
  
}