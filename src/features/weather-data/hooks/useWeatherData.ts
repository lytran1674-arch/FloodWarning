import { useEffect, useState } from "react";
import type { Weather_datas } from "../types/weatherdataType";
import { weatherdataService } from "../services/weatherdataservice";

export const useWeatherData = (area_id?: string) => {
  const [weatherdata, setWeatherData] = useState<Weather_datas[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    if (!area_id) {
      setWeatherData([]);
      return;
    }

    try {
      setLoading(true);

      const data = await weatherdataService.getWeatherDataById(area_id);

      console.log("Dữ liệu thời tiết:", data);

      setWeatherData(data);
    } catch (error) {
      console.log("Lỗi lấy dữ liệu thời tiết:", error);
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [area_id]);

  return { weatherdata, loading, fetchWeatherData };
};