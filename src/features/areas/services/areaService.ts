import { areaApi } from "../../areas/api/areaApi"
import type { Area, AreaTree } from "../../areas/types/areaType"

export const areaService = {
  async getAreas(): Promise<AreaTree[]> {
    return await areaApi.getAll()
  },

  async getFilterChildren(
    parent_id: string
  ): Promise<Area[]> {
    return await areaApi.getChildren(parent_id)
  },

  async getSearchArea(
    keyword: string
  ): Promise<Area[]> {
    return await areaApi.getArea(keyword)
  },

  async getById(areaId: string): Promise<Area> {
    return await areaApi.getByIdArea(areaId)
  },
   async getPolygonById(areaId: string): Promise<{ geometry: GeoJSON.Geometry } | null> {
    return await areaApi.getPolygonById(areaId)
  },
}