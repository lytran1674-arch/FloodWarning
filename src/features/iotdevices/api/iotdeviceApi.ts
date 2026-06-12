import axios from "axios"
import type { IotDevice } from "../types/iotdeviceType"

 const API_URL="https://api-lulut.io.vn/iot-device"



export const iotdeviceApi={
    // async getAll():Promise<IotDevice[]>{
    //     const response= await axios.get(`${API_URL}/list-iotdevice`);
    //     return response.data;
    // },
    async getAllPending():Promise<IotDevice[]>{
        const response=await axios.get(`${API_URL}/pending`)
        return response.data;
    }
  
}