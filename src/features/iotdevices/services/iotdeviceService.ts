import { DeviceApi } from "../api/deviceApi";
import type {Device, UpdateDevicePayload } from "../types/deviceType";

export const DeviceService={

     async getDevices():Promise<Device[]>{
        return await DeviceApi.getAll();
    },
    async patchApprove(id:string,adminId:string):Promise<Device>{
        return await DeviceApi.patchApprove(id,adminId);
    },
    async patchReject(id:string):Promise<Device>{
        return await DeviceApi.patchPreject(id);
    },
        // cập nhật thông tin thiết bị 
        async updateIotDevice(deviceId:string,payload:UpdateDevicePayload):Promise<Device>{
         return await DeviceApi.updateIotDevice(deviceId,payload)
        }
        ,
        //chi tiết thông tin về thiết bị iot
        async DetailIotDevice(deviceId:string):Promise<Device>{
           return await DeviceApi.DetailIotDevice(deviceId);
        }
    
}