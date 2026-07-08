// features/map/hooks/useGeocodeAddress.ts
import { useState, useCallback } from "react";

interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export const useGeocodeAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = useCallback(
    async (fullAddress: string): Promise<GeocodeResult | null> => {
      if (!fullAddress.trim()) {
        setError("Vui lòng nhập địa chỉ");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const query = encodeURIComponent(`${fullAddress}, Vietnam`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=vn`,
          {
            headers: {
              "Accept-Language": "vi",
            },
          }
        );

        if (!res.ok) throw new Error("Lỗi kết nối dịch vụ định vị");

        const data = await res.json();

        if (!data || data.length === 0) {
          setError("Không tìm thấy địa chỉ này, vui lòng nhập chi tiết hơn");
          return null;
        }

        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          displayName: result.display_name,
        };
      } catch (err: any) {
        setError(err.message || "Không thể xác định vị trí từ địa chỉ");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { geocode, loading, error };
};