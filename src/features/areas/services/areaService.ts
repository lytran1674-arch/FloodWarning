import { areaApi } from "../api/areaApi"
import type { Area, AreaTree } from "../types/areaType"

export const areaService = {
  async getAreas(): Promise<AreaTree[]> {  
    return await areaApi.getAll()
  },

   

  async getFilterChildren(parent_id: string):Promise<Area[]>{
    return await areaApi.getChildren(parent_id);
  },
  async getSearchArea(keyword:string):Promise<Area[]>{
    return await areaApi.getArea(keyword);
  }
}