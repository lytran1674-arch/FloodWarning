// features/map/services/mapService.ts

import type { AreaPolygon, RiskLevel } from "../types/mapType";
import { axiosClient } from "@/api/axiosClient";

const API_URL = "https://api-lulut.io.vn";


const mapService = {

  getPolygonById: async (id: string): Promise<AreaPolygon> => {

    const res = await axiosClient.get(
      `${API_URL}/area/polygon-by-id`,
      {
        params: { id }
      }
    );

    console.log("POLYGON API:", res.data);

    return res.data.result ?? res.data;
  },


  getRiskByAreaId: async (
    areaId: string,
    lead: 1 | 2 | 3 = 1
  ): Promise<RiskLevel> => {

    try {

      const res = await axiosClient.get(
        `${API_URL}/predict/list-by-area`,
        {
          params: { areaId }
        }
      );

      const predictions = res.data.result ?? res.data;


      if (!Array.isArray(predictions) || !predictions.length) {
        return "LOW";
      }


      const latest = predictions.sort(
        (a: any, b: any) =>
          new Date(b.predictedAt).getTime() -
          new Date(a.predictedAt).getTime()
      )[0];


      const level = latest?.[`lead${lead}`];


      if (level === "HIGH") return "HIGH";
      if (level === "MEDIUM") return "MEDIUM";

      return "LOW";


    } catch (err) {

      console.error("Risk API error:", err);
      return "LOW";

    }
  },

};

export default mapService;