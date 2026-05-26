import axios from "axios"
import type { Weather_datas } from "../types/weatherdataType"

const API_URL=""

export const weatherdataApi={
    async getById(madulieu:string):Promise<Weather_datas>{
        const response=await axios.get<Weather_datas>(`${API_URL}/${madulieu}`)
        return response.data
    }
}