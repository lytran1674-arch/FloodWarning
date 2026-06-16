// features/map/services/mapService.ts
import axios from "axios"

import type { AreaPolygon, RiskLevel } from "../types/mapType"

const mapService = {
  /** Lấy polygon của 1 khu vực theo id */
  getPolygonById: async (id: string): Promise<AreaPolygon> => {
    const res = await axios.get("/area/polygon-by-id", {
      params: { id },
    })
    return res.data
  },

getRiskLevel: async (id: string): Promise<RiskLevel> => {
  try {
    const res = await axios.get("/predict/list");

    const predictions = res.data?.result || [];

    if (!predictions.length) return "LOW";

    // lấy dữ liệu mới nhất
    const latest = predictions.sort(
      (a: any, b: any) =>
        new Date(b.predictedAt).getTime() -
        new Date(a.predictedAt).getTime()
    )[0];

    const lead1 = latest?.lead1;

    if (lead1 === "HIGH") return "HIGH";
    if (lead1 === "MEDIUM") return "MEDIUM";

    return "LOW";
  } catch {
    return "LOW";
  }
}
}

export default mapService