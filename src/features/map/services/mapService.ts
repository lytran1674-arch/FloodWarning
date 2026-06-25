// features/map/services/mapService.ts

import { axiosClient } from "@/api/axiosClient"

import type {
  AreaPolygon,
  RiskLevel,
} from "../types/mapType"

const mapService = {

  // ================= POLYGON =================
  async getPolygonById(
    id: string
  ): Promise<AreaPolygon | null> {

    try {

      const res = await axiosClient.get(
        "/area/polygon-by-id",
        {
          params: { id },
        }
      )

      console.log(
        "🗺️ POLYGON API:",
        res.data
      )

      return res.data.result ?? res.data

    } catch (err) {

      console.error(
        "❌ Polygon API error:",
        err
      )

      return null
    }
  },



  // ================= RISK =================
  async getRiskByAreaId(
    areaId: string,
    lead: 1 | 2 | 3 = 1
  ): Promise<RiskLevel> {

    try {

      const res = await axiosClient.get(
        "/predict/list-by-area",
        {
          params: { areaId },
        }
      )

      console.log(
        "⚠️ RISK API:",
        res.data
      )

      const predictions =
        res.data.result ?? res.data

      if (
        !Array.isArray(predictions) ||
        !predictions.length
      ) {
        return "LOW"
      }

      // lấy prediction mới nhất
      const latest = predictions.sort(
        (a: any, b: any) =>
          new Date(b.predictedAt).getTime() -
          new Date(a.predictedAt).getTime()
      )[0]

      const level = latest?.[`lead${lead}`]

      if (level === "HIGH") {
        return "HIGH"
      }

      if (level === "MEDIUM") {
        return "MEDIUM"
      }

      return "LOW"

    } catch (err) {

      console.error(
        "❌ Risk API error:",
        err
      )

      // fallback an toàn
      return "LOW"
    }
  },

}

export default mapService