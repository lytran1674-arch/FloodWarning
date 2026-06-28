// features/dashboard/components/WaterLevelWidget.tsx
// Hiển thị mực nước mới nhất của khu vực user — dùng trên Dashboard
// API: GET /iot-aggregate/areas/{areaId}/latest
// areaId lấy từ redux state.auth.user.areaId

import { useEffect, useState } from "react"
import { axiosClient } from "@/api/axiosClient"
import { useAppSelector } from "@/hooks/redux.hooks"
import {
  Droplets, TrendingUp, AlertTriangle,
  Clock, Wifi, WifiOff, RefreshCw,
} from "lucide-react"

interface WaterData {
  area_id:                string
  tenkhuvuc:              string
  avgWater:               number
  maxWater:               number
  minWater:               number
  currentWater:           number
  totalDeviceCount:       number
  waterRiseRatePerMinute: number
  dangerRatio:            number
  dangerDurationMinutes:  number
  recordedAt:             string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
  })
}

function GaugeArc({ ratio }: { ratio: number }) {
  const clamped = Math.min(1, Math.max(0, ratio))
  const r       = 40
  const cx      = 50
  const cy      = 55
  const circ    = Math.PI * r
  const offset  = circ * (1 - clamped)

  const fillColor =
    clamped >= 0.8 ? "#ef4444" :
    clamped >= 0.5 ? "#f97316" :
    clamped >= 0.3 ? "#eab308" : "#22c55e"

  return (
    <svg viewBox="0 0 100 60" className="w-full max-w-[160px]">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={fillColor} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle"
        fontSize="13" fill={fillColor} fontWeight="700">
        {Math.round(clamped * 100)}%
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="6.5" fill="#9ca3af">
        nguy hiểm
      </text>
    </svg>
  )
}

export const WaterLevelWidget = () => {
  // ✅ Lấy areaId trực tiếp từ redux — không cần prop
  const user   = useAppSelector(state => state.auth.user)
  const areaId = user?.areaId

  const [data,    setData]    = useState<WaterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchData = async () => {
    if (!areaId) {
      setError("Không tìm thấy khu vực của bạn")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await axiosClient.get(`/iot-aggregate/areas/${areaId}/latest`)
      setData(res.data?.result ?? res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải dữ liệu mực nước")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, 60_000)
    return () => clearInterval(timer)
  }, [areaId])

  const dangerLevel =
    !data ? null :
    data.dangerRatio >= 0.8 ? { label: "Nguy hiểm cao",  color: "text-red-600",    bg: "bg-red-50 border-red-200"       } :
    data.dangerRatio >= 0.5 ? { label: "Cảnh báo",        color: "text-orange-600", bg: "bg-orange-50 border-orange-200" } :
    data.dangerRatio >= 0.3 ? { label: "Theo dõi",        color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
                               { label: "An toàn",         color: "text-green-600",  bg: "bg-green-50 border-green-200"   }

  // ── Loading skeleton ──
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-24 bg-gray-100 rounded-xl mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-4">
        <div className="flex items-center gap-2 text-red-500 mb-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Không thể tải dữ liệu</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-3 h-3" /> Thử lại
        </button>
      </div>
    )
  }

  if (!data) return null

  const isRising = data.waterRiseRatePerMinute > 0

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${dangerLevel?.bg}`}>

      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Mực nước
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-800 truncate">
            {data.tenkhuvuc}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Gauge + current */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <div className="flex flex-col items-center">
          <GaugeArc ratio={data.dangerRatio} />
          <span className={`text-[11px] font-semibold mt-1 ${dangerLevel?.color}`}>
            {dangerLevel?.label}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Hiện tại</p>
            <p className="text-2xl font-black text-gray-800 leading-none">
              {data.currentWater.toFixed(2)}
              <span className="text-sm font-medium text-gray-400 ml-1">m</span>
            </p>
          </div>

          <div className={`flex items-center gap-1 text-xs font-medium ${isRising ? "text-red-500" : "text-green-500"}`}>
            <TrendingUp className={`w-3.5 h-3.5 ${!isRising ? "rotate-180" : ""}`} />
            {isRising ? "+" : ""}{(data.waterRiseRatePerMinute * 60).toFixed(4)} m/h
          </div>

          {data.dangerDurationMinutes > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Nguy hiểm {data.dangerDurationMinutes} phút
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[
          { label: "Trung bình", value: data.avgWater.toFixed(2) + " m"  },
          { label: "Cao nhất",   value: data.maxWater.toFixed(2) + " m"  },
          { label: "Thấp nhất",  value: data.minWater.toFixed(2) + " m"  },
        ].map(stat => (
          <div key={stat.label} className="bg-white/80 rounded-xl px-2.5 py-2 text-center border border-gray-100">
            <p className="text-[10px] text-gray-400 mb-0.5">{stat.label}</p>
            <p className="text-xs font-bold text-gray-700">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100/80 bg-white/50">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Wifi className="w-3 h-3" />
          {data.totalDeviceCount} thiết bị
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock className="w-3 h-3" />
          {formatTime(data.recordedAt)}
        </div>
      </div>
    </div>
  )
}