import axios from "axios"
import type { Weather_datas } from "../types/weatherdataType"

const API_URL="/api/weather-data"

export const weatherdataApi={
    async getById(area_id:string):Promise<Weather_datas>{
        const response=await axios.get<Weather_datas>(`${API_URL}/find-by-area-id/${area_id}`)
        return response.data
    }
}