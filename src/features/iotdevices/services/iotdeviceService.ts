import { iotdeviceApi } from "../api/iotdeviceApi";
import type { IotDevice } from "../types/iotdeviceType";

export const iotdeviceService={

     async getIotDevices():Promise<IotDevice[]>{
        return await iotdeviceApi.getAll();
    },
    async patchApprove(device_id:string,adminId:string):Promise<IotDevice>{
        return await iotdeviceApi.patchApprove(device_id,adminId);
    },
    async patchReject(device_id:string):Promise<IotDevice>{
        return await iotdeviceApi.patchPreject(device_id);
    }
    
}