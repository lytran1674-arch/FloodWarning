import { areaApi } from "../api/areaApi"

export const areaService = {
  async getAreas() {
    return await areaApi.getAll()
  },
}