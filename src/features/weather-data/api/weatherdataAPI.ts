import axios from "axios"
import type { Weather_datas } from "../types/weatherdataType"
import { axiosClient } from "@/api/axiosClient";

const API_URL="https://api-lulut.io.vn/weather-data"

export const weatherdataApi={
   async getById(area_id: string): Promise<Weather_datas[]> {
    const response = await axios.get<Weather_datas[]>(
        `${API_URL}/find-by-area-id?area_id=${area_id}` 
    );
    return response.data;
},

//lọc dữ liệu theo thời gian và khu vực 
async FilterWeatherDataByAreaAndTime(areaId:string,start:string,end:string):Promise<Weather_datas[]>{
    const res=await axiosClient.get(`${API_URL}/filter`,{
        params:{areaId,start,end}
    })
    return res.data.result?.content??[];
},

//lọc dữ liệu theo thời gian  
async FilterWeatherDataByTime(start:string,end:string):Promise<Weather_datas[]>{
    const res=await axiosClient.get(`${API_URL}/filter`,{
        params:{start,end}
    })
    return res.data.result?.content??[];
},
//lọc dữ liệu theo khu vực 
async FilterWeatherDataByArea(areaId:string):Promise<Weather_datas[]>{
    const res=await axiosClient.get(`${API_URL}/filter`,{
        params:{areaId}
    })
    return res.data.result?.content??[];
},


}