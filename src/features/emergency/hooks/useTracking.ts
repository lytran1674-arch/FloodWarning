import type { SoSResponse } from "@/features/sosrequest/types/sosType";
import { useState } from "react";
import { emergencyService } from "../services/emergencyService";
import { sosService } from "@/features/sosrequest/services/sosService";
import type { StatusHotLineSoS } from "../types/emergencyType";

export const useTracking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const [statusOptions, setStatusOptions] = useState<StatusHotLineSoS[]>([]);
  // Kết quả kênh operator (hotline) — luôn là danh sách
  const [search, setSearch] = useState<SoSResponse[]>([]);

  // Kết quả kênh dân — luôn là 1 bản ghi đơn
  const [trackingCode, setTrackingCode] = useState<SoSResponse>();

  // ----- Kênh operator (hotline), cần token -----

  // Tra cứu theo từ khóa (tracking code hoặc SĐT)
  const KeyWord = async (keyword: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await emergencyService.trackingCode(keyword); // ✅ sửa: gọi đúng hàm KeyWord, không phải trackingCode
      setSearch(res);
    } catch (error) {
      console.error(error);
      setError("Lỗi! Vui lòng nhập mã tra cứu lại!");
    } finally {
      setLoading(false);
    }
  };

  // Tra cứu theo trạng thái
  const searchStatus = async (status: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await emergencyService.Status(status);
      setSearch(res);
    } catch (error) {
      console.error(error);
      setError("Lỗi. Vui lòng tra cứu lại!");
    } finally {
      setLoading(false);
    }
  };

  // Tra cứu theo từ khóa và trạng thái
  const KeywordandStatus = async (status: string, keyword: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await emergencyService.KeywordandStatus(keyword, status); // ✅ sửa: đúng tên hàm KeyWordAndStatus
      setSearch(res);
    } catch (error) {
      console.error(error);
      setError("Lỗi. Vui lòng tra cứu lại!");
    } finally {
      setLoading(false);
    }
  };

  // ----- Kênh dân, public, không cần login -----

  // Tra cứu công khai theo tracking code
  const searchTrackingCode = async (code: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await sosService.trackingCode(code);
      setTrackingCode(res); // ✅ set vào state riêng "trackingCode", không đụng "search"
    } catch (error) {
      console.error(error);
      setError("Lỗi. Vui lòng nhập mã tra cứu lại!");
    } finally {
      setLoading(false);
    }
  };

  const getStaus=async()=>{
    try{
      setLoading(true);
      const res=await emergencyService.getStatus();
      setStatusOptions(res)
    }catch(error){
      console.error(error);
      setError("Lỗi.Không thể hiển thị danh sách trạng thái!")
    }finally{
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    search,          // TraCuuSoS.tsx dùng (operator, danh sách)
    trackingCode,    // Tracking.tsx dùng (dân, 1 bản ghi)
    searchStatus,
    searchTrackingCode,
    KeyWord,
    KeywordandStatus,
    statusOptions,
        getStaus
  };
};