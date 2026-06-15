// hooks/usePolygon.ts
import { useEffect, useState } from "react";

export interface AreaPolygon {
  id: string;
  tenkhuvuc: string;
  geometry: any; // MultiPolygon hoặc GeometryCollection
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
        const res = await fetch(`https://api-lulut.io.vn/area/polygon-by-id?id=${areaId}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        if (!text) throw new Error("Empty response");

        const data = JSON.parse(text);
        setPolygon(data);
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