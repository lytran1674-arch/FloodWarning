import { weatherdataApi } from "../api/weatherdataAPI";
import type { Weather_datas } from "../types/weatherdataType";

export const weatherdataService = {
    async getWeatherDataById(area_id: string): Promise<Weather_datas[]> { 
        return await weatherdataApi.getById(area_id);
    },

    //lọc dữ liệu theo thời gian và khu vực 
    async FilterWeatherDataByAreaAndTime(areaId:string,start:string,end:string):Promise<Weather_datas[]>{
      return await weatherdataApi.FilterWeatherDataByAreaAndTime(areaId,start,end)
    },
    
    //lọc dữ liệu theo thời gian  
    async FilterWeatherDataByTime(end:string,start:string):Promise<Weather_datas[]>{
      return await weatherdataApi.FilterWeatherDataByTime(start,end)
    },
    //lọc dữ liệu theo khu vực 
    async FilterWeatherDataByArea(areaId:string):Promise<Weather_datas[]>{
      return await weatherdataApi.FilterWeatherDataByArea(areaId)
    },
    
}