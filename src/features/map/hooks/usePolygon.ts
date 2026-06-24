import { axiosClient } from "@/api/axiosClient";
import { useEffect, useState } from "react";

export interface AreaPolygon {
  id: string;
  tenkhuvuc: string;
  geometry: any;
}

export const useAreaPolygon = (areaId?: string) => {
  const [polygon, setPolygon] = useState<AreaPolygon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!areaId) {
      setPolygon(null);
      return;
    }

    const fetchPolygon = async () => {
      try {
        setLoading(true);
        // ✅ axiosClient trả về res.data trực tiếp, không cần .text() hay JSON.parse
        const res = await axiosClient.get(`/area/polygon-by-id`, {
          params: { id: areaId },
        });
        setPolygon(res.data ?? null);
      } catch (error) {
        console.log("Lỗi lấy polygon:", error);
        setPolygon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPolygon();
  }, [areaId]);

  return { polygon, loading };
};