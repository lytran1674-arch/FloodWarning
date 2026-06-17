// features/map/services/mapService.ts
import axios from "axios"

import type { AreaPolygon, RiskLevel } from "../types/mapType"

const mapService = {
  getPolygonById: async (id: string): Promise<AreaPolygon> => {
    const res = await axios.get("/area/polygon-by-id", { params: { id } })
    return res.data
  },

  getRiskByAreaId: async (areaId: string, lead: 1 | 2 | 3 = 1): Promise<RiskLevel> => {
    try {
      const res = await axios.get("/predict/list-by-area", {
        params: { areaId },
      })
      const predictions = res.data
      if (!Array.isArray(predictions) || !predictions.length) return "LOW"

      const latest = predictions.sort(
        (a: any, b: any) =>
          new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
      )[0]

      const level = latest?.[`lead${lead}`]
      if (level === "HIGH") return "HIGH"
      if (level === "MEDIUM") return "MEDIUM"
      return "LOW"
    } catch {
      return "LOW"
    }
  },
}

export default mapService