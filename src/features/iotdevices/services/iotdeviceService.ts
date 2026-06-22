import { DeviceApi } from "../api/deviceApi";
import type {Device } from "../types/deviceType";

export const DeviceService={

     async getDevices():Promise<Device[]>{
        return await DeviceApi.getAll();
    },
    async patchApprove(id:string,adminId:string):Promise<Device>{
        return await DeviceApi.patchApprove(id,adminId);
    },
    async patchReject(id:string):Promise<Device>{
        return await DeviceApi.patchPreject(id);
    }
    
}