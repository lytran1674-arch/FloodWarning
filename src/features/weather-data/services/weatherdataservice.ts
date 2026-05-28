import { weatherdataApi } from "../api/weatherdataAPI";
import type { Weather_datas } from "../types/weatherdataType";

export const weatherdataService={
    async getWeatherDataById(area_id:string):Promise<Weather_datas>{
        return await weatherdataApi.getById(area_id);
    }
}