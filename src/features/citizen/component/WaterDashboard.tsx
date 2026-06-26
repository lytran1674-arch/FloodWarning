import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Droplets, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import axios from "axios";
import type { RootState } from "../../../app/store";

type WaterData = {
  area_id: string;
  tenkhuvuc: string;
  avgWater: number;
  maxWater: number;
  minWater: number;
  currentWater: number;
  totalDeviceCount: number;
  waterRiseRatePerMinute: number;
  dangerRatio: number;
  dangerDurationMinutes: number | null;
  recordedAt: string;
};

const getStatus = (ratio: number) => {
  if (ratio >= 0.8)
    return { text: "NGUY HIỂM", color: "bg-red-500", icon: <AlertTriangle size={16} /> };
  if (ratio >= 0.5)
    return { text: "CẢNH BÁO", color: "bg-yellow-500", icon: <AlertTriangle size={16} /> };
  return { text: "AN TOÀN", color: "bg-green-500", icon: <ShieldCheck size={16} /> };
};

const WaterDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const areaId = user?.areaId;

  const [data, setData] = useState<WaterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!areaId) {
      setLoading(false);
      setError("Không tìm thấy khu vực của bạn.");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://api-lulut.io.vn/iot-aggregate/areas/${areaId}/latest`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data.result);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu mực nước.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [areaId]);

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex items-center justify-center h-48 text-slate-400 text-sm">
        Đang tải dữ liệu...
      </div>
    );

  if (error || !data)
    return (
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex items-center justify-center h-48 text-slate-400 text-sm">
        {error ?? "Không có dữ liệu."}
      </div>
    );

  const status = getStatus(data.dangerRatio);

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 md:p-7 space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">
            Giám sát mực nước
          </p>
          <h2 className="font-bold text-slate-800 text-base sm:text-lg md:text-xl leading-tight">
            {data.tenkhuvuc}
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
            {new Date(data.recordedAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <div
          className={`${status.color} text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold flex-shrink-0 self-start`}
        >
          {status.icon}
          {status.text}
        </div>
      </div>

      {/* Mực nước hiện tại */}
      <div className="bg-blue-50 rounded-xl p-3 sm:p-4 flex items-center gap-3">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Droplets size={18} className="text-blue-600 sm:w-6 sm:h-6" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-blue-500 font-medium">Mực nước hiện tại</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
            {data.currentWater.toFixed(2)}
            <span className="text-sm sm:text-base font-normal ml-1">m</span>
          </p>
        </div>
      </div>

      {/* Thống kê min/max/avg */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">Thấp nhất</p>
          <p className="font-bold text-slate-700 text-xs sm:text-sm">{data.minWater.toFixed(2)}m</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">Trung bình</p>
          <p className="font-bold text-slate-700 text-xs sm:text-sm">{data.avgWater.toFixed(2)}m</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5">Cao nhất</p>
          <p className="font-bold text-slate-700 text-xs sm:text-sm">{data.maxWater.toFixed(2)}m</p>
        </div>
      </div>

      {/* Tốc độ tăng */}
      <div className="flex-wrap gap-2 bg-red-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex justify-start">
              <TrendingUp size={16} className="text-red-500 flex-shrink-0" />
        <p className="lg:text-[10px] sm:text-xs text-red-500 font-medium">Tốc độ tăng</p>
        </div>
      
        <p className="lg:text-[12px] sm:text-sm font-bold text-red-600 ml-auto">
          +{data.waterRiseRatePerMinute} m/phút
        </p>
      </div>

      {/* Thanh nguy hiểm */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] sm:text-xs">
          <span className="text-slate-500 font-medium">Mức nguy hiểm</span>
          <span className="font-bold text-slate-700">
            {(data.dangerRatio * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${status.color} rounded-full transition-all duration-500`}
            style={{ width: `${data.dangerRatio * 100}%` }}
          />
        </div>
      </div>

      {/* Cảnh báo thời gian */}
      {data.dangerDurationMinutes != null && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-[10px] sm:text-xs text-red-600 font-semibold">
            Nguy hiểm sau: {data.dangerDurationMinutes} phút
          </p>
        </div>
      )}

      {/* Số thiết bị */}
      <p className="text-[10px] sm:text-xs text-slate-400 text-right">
        {data.totalDeviceCount} thiết bị IoT đang hoạt động
      </p>
    </div>
  );
};

export default WaterDashboard;