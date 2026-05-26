import { weatherdataApi } from "../api/weatherdataAPI";
import type { Weather_datas } from "../types/weatherdataType";

export const weatherdataService={
    async getWeatherDataById(madulieu:string):Promise<Weather_datas>{
        return await weatherdataApi.getById(madulieu);
    }
}