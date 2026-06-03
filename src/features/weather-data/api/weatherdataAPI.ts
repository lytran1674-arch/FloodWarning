import axios from "axios"
import type { Weather_datas } from "../types/weatherdataType"

const API_URL="https://api-lulut.io.vn/weather-data/find-by-area-id?area_id=019e5af2-5b2d-75c7-80cd-75d7300dfcc9"

export const weatherdataApi={
    async getById(area_id:string):Promise<Weather_datas>{
        const response=await axios.get<Weather_datas>(`${API_URL}/find-by-area-id/${area_id}`)
        return response.data
    }
}