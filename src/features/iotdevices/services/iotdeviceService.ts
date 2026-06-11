import { iotdeviceApi } from "../api/iotdeviceApi";
import type { IotDevice } from "../types/iotdeviceType";

export const iotdeviceService={
    async getIotDevices():Promise<IotDevice[]>{
        return await iotdeviceApi.getAll();
    }
}