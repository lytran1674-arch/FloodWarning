import axios from 'axios'
import type { FloodRiskData } from '../types/floodriskdataType'

const API_URL= "https://api-lulut.io.vn/predict"
export const FloodRiskDataApi ={
  async getAll(): Promise<FloodRiskData[]> {
    const token = localStorage.getItem('token')

    const response = await axios.get(`${API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    })

    return response.data.result ?? response.data
  }
}
