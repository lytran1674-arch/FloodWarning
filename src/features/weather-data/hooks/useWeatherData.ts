import { useCallback, useEffect, useMemo, useState } from "react";
import type { Weather_datas } from "../types/weatherdataType";
import { weatherdataService } from "../services/weatherdataservice";

export const useWeatherData = (area_id?: string) => {
  const [weatherdata, setWeatherData] = useState<Weather_datas[]>([]);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState<Weather_datas[]>([]);
  const [time, setTime] = useState<Weather_datas[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Weather_datas[]>([]);

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

  //************LỌC THEO KHU VỰC*****************//
  const FilterByArea = useCallback(async (areaId: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await weatherdataService.FilterWeatherDataByArea(areaId);
      setArea(res);
      setFilter(res);
      return res;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Lỗi lọc theo khu vực";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  //************LỌC THEO THỜI GIAN*****************//
  const FilterByTime = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await weatherdataService.FilterWeatherDataByTime(start,end);
      setTime(res);
      setFilter(res);
      return res;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Lỗi lọc theo thời gian";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  //************LỌC THEO THỜI GIAN VÀ KHU VỰC*****************//
  // Lưu ý: endpoint này chỉ nhận 1 mốc thời gian (start) + areaId,
  const FilterByTimeAndArea = useCallback(async (start: string, areaId: string,end:string) => {
    try {
      setLoading(true);
      setError("");
      const res = await weatherdataService.FilterWeatherDataByAreaAndTime(areaId, start,end);
      setFilter(res);
      return res;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Lỗi lọc theo khu vực và thời gian";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [area_id]);

  const latestWeather = useMemo(() => {
    if (weatherdata.length === 0) return null;
    return weatherdata.reduce((a, b) =>
      new Date(a.time) > new Date(b.time) ? a : b
    );
  }, [weatherdata]);

  return {
    weatherdata,
    loading,
    fetchWeatherData,
    latestWeather,
    area,
    FilterByArea,
    time,
    FilterByTime,
    filter,
    FilterByTimeAndArea,
    error,
  };
};