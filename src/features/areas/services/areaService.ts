import { areaApi } from "../api/areaApi"
import type { AreaTree } from "../types/areaType"

export const areaService = {
  async getAreas(): Promise<AreaTree[]> {  // ← thêm return type
    return await areaApi.getAll()
  },
}