import axios from "axios"
import type { Area } from "../types/areaType"

const API_URL =
  "https://api-lulut.io.vn/area"

export const areaApi = {
  async getAll(): Promise<Area[]> {
  const response = await axios.get(`${API_URL}/list`);
  return response.data.content ?? response.data; // ← thêm .content
},

 async getChildren(parentId: string): Promise<Area[]> {
  const res = await axios.get<Area[]>(
    `${API_URL}/list-by-parent`,
    {
      params: { parentId }
    }
  )

  return res.data
},

async getArea(keyword: string): Promise<Area[]> {
  const res = await axios.get(`${API_URL}/search`, { params: { keyword } });
  return res.data.content ?? res.data; 
}
,
async getAreaById(id:string):Promise<Area>{
  const res= await axios.get(`${API_URL}/search`)
  return res.data;
}
}