// features/water-level/components/WaterLevelOverview.tsx
import { useEffect, useMemo, useState } from "react"
import { useWaterLevel } from "@/features/water-level/hooks/useWaterLevel"

import { useAppSelector } from "@/hooks/redux.hooks"

import {
  TrendingUp, TrendingDown, Minus,
  TriangleAlert, Clock, Gauge, Activity, Droplets,
  ChevronRight, MapPin, ChevronDown, Search, X, Loader2,
} from "lucide-react"
import type { AreaTree } from "@/features/areas/types/areaType"
import { useAreaContext } from "@/features/areas/components/AreaContext"

// ── Ngưỡng mực nước (cm) ──
const THRESHOLD_SAFE    = 10
const THRESHOLD_WARNING = 12

type RiskLevel = "SAFE" | "WARNING" | "DANGER"

const getRisk = (level: number): RiskLevel => {
  if (level > THRESHOLD_WARNING) return "DANGER"
  if (level > THRESHOLD_SAFE)    return "WARNING"
  return "SAFE"
}

const RISK_CONFIG: Record<RiskLevel, {
  label: string; bg: string; border: string; text: string; bar: string; dot: string; desc: string
}> = {
  SAFE:    { label: "AN TOÀN",   bg: "bg-green-50", border: "border-green-300", text: "text-green-700", bar: "bg-green-400", dot: "bg-green-500", desc: "Mực nước trong ngưỡng an toàn" },
  WARNING: { label: "CẢNH BÁO",  bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", bar: "bg-amber-400", dot: "bg-amber-500", desc: "Mực nước đang tăng dần"         },
  DANGER:  { label: "NGUY HIỂM", bg: "bg-red-50",   border: "border-red-300",   text: "text-red-600",   bar: "bg-red-500",   dot: "bg-red-500",   desc: "Mực nước vượt ngưỡng an toàn"  },
}

// ── Làm phẳng cây khu vực để search + tra cứu tên khu vực cha ──
type FlatArea = { area_id: string; tenkhuvuc: string; depth: number; parentName?: string }

const flattenAreas = (nodes: AreaTree[], depth = 0, parentName?: string): FlatArea[] => {
  const result: FlatArea[] = []
  nodes.forEach((node: any) => {
    const area_id   = node.area_id ?? node.id
    const tenkhuvuc = node.tenkhuvuc ?? node.name
    result.push({ area_id, tenkhuvuc, depth, parentName })
    if (node.children?.length) {
      result.push(...flattenAreas(node.children, depth + 1, tenkhuvuc))
    }
  })
  return result
}

export const WaterLevelOverview = () => {
  const { data, loading } = useWaterLevel()
  const { areas, loading: areasLoading } = useAreaContext()
  const user = useAppSelector(s => s.auth.user)
  const userAreaId = (user as any)?.areaId ?? (user as any)?.area_id

  const flatAreas = useMemo(() => flattenAreas(areas), [areas])

  const [selectedAreaId, setSelectedAreaId] = useState("")
  useEffect(() => {
    if (!selectedAreaId && flatAreas.length > 0) {
      const defaultId = userAreaId && flatAreas.some(a => a.area_id === userAreaId)
        ? userAreaId
        : flatAreas[0].area_id
      setSelectedAreaId(defaultId)
    }
  }, [flatAreas, userAreaId, selectedAreaId])

  const selectedArea = flatAreas.find(a => a.area_id === selectedAreaId)
  const current = data.find(item => item.area_id === selectedAreaId)

  // ── Map đúng field từ IoTAggregate, không tự phát sinh dữ liệu ──
  const level    = current?.currentWater          ?? 0
  const avg      = current?.avgWater              ?? 0
  const max      = current?.maxWater              ?? 0
  const min      = current?.minWater              ?? 0
  const rate     = current?.waterRiseRatePerMinute ?? 0
  const danger   = current?.dangerRatio           ?? 0
  const duration = current?.dangerDurationMinutes ?? 0
  const devices  = current?.totalDeviceCount      ?? 0
  const updated  = current?.recordedAt            ?? "—"

  const risk = getRisk(level)
  const cfg  = RISK_CONFIG[risk]

  const maxDisplay = Math.max(THRESHOLD_WARNING * 2, level + rate, max) || THRESHOLD_WARNING * 2
  const pct        = (v: number) => Math.min(Math.max((v / maxDisplay) * 100, 0), 100)
  const pctSafe    = pct(THRESHOLD_SAFE)
  const pctWarn    = pct(THRESHOLD_WARNING)

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} h`
  }

  const formatDate = (iso: string) => {
    if (iso === "—") return "—"
    try {
      return new Date(iso).toLocaleString("vi-VN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    } catch { return iso }
  }

  // Cập nhật cách đây bao lâu — tính từ recordedAt thật, không bịa số liệu
  const formatRelative = (iso: string) => {
    if (iso === "—") return null
    try {
      const diffMs = Date.now() - new Date(iso).getTime()
      const mins = Math.floor(diffMs / 60000)
      if (mins < 1) return "Vừa cập nhật"
      if (mins < 60) return `Cập nhật ${mins} phút trước`
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return `Cập nhật ${hrs} giờ trước`
      return `Cập nhật ${Math.floor(hrs / 24)} ngày trước`
    } catch { return null }
  }

  // ── Điểm dữ liệu cho biểu đồ so sánh ngưỡng (chỉ dùng dữ liệu đã có) ──
  const chartPoints = [
    { label: "T.BÌNH",    value: avg,              color: "#60a5fa" },
    { label: "HIỆN TẠI",  value: level,            color: risk === "DANGER" ? "#ef4444" : risk === "WARNING" ? "#f59e0b" : "#22c55e" },
    { label: "DỰ KIẾN",   value: level + rate,     color: "#94a3b8" },
    { label: "NGUY HIỂM", value: THRESHOLD_WARNING, color: "#fca5a5" },
  ]
  const chartYFor = (v: number) => 150 - Math.min(Math.max(v / maxDisplay, 0), 1) * 120
  const chartXs = [40, 160, 280, 360]

  return (
    <div className=" max-w-5xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-wider">
        <span>Khu vực giám sát</span>
        {selectedArea?.parentName && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span>{selectedArea.parentName}</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:justify-between lg:items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
          {loading || areasLoading ? "Đang tải..." : selectedArea?.tenkhuvuc ?? "Chưa chọn khu vực"}
        </h1>

        <div className="flex flex-col lg:justify-end gap-2 lg:items-center sm:items-end w-full sm:w-auto">
          <AreaCombobox
            areas={flatAreas}
            value={selectedAreaId}
            onChange={setSelectedAreaId}
            loading={areasLoading}
          />
          {current && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border} self-start sm:self-end mb-2`}>
              <TriangleAlert className={`w-4 h-4 ${cfg.text} shrink-0`} />
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wide ${cfg.text}`}>
                  TRẠNG THÁI: {cfg.label}
                </p>
                <p className={`text-xs ${cfg.text}`}>{cfg.desc}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : !current ? (
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          Không có dữ liệu mực nước cho khu vực này
        </div>
      ) : (
        <>
          {/* Main grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Current water level card */}
            <div className="rounded-2xl bg-blue-600 text-white p-4 relative overflow-hidden">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-10">
                <Droplets className="w-24 h-24" />
              </div>

              <p className="text-xs text-blue-200 uppercase tracking-widest mb-2">
                MỰC NƯỚC HIỆN TẠI
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl sm:text-6xl font-bold tabular-nums">
                  {level.toFixed(1)}
                </span>
                <span className="text-xl text-blue-200 mb-1">cm</span>
              </div>

              {formatRelative(updated) && (
                <p className="text-[11px] text-blue-200 mb-2">{formatRelative(updated)}</p>
              )}

              <div className="flex items-center gap-1.5">
                {rate > 0
                  ? <TrendingUp   className="w-4 h-4 text-red-300"   />
                  : rate < 0
                  ? <TrendingDown className="w-4 h-4 text-green-300" />
                  : <Minus        className="w-4 h-4 text-blue-200"  />
                }
                <span className={`text-sm font-semibold ${
                  rate > 0 ? "text-red-300" : rate < 0 ? "text-green-300" : "text-blue-200"
                }`}>
                  {rate > 0 ? "+" : ""}{rate.toFixed(1)} cm/h
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <MiniStat label="Trung bình" value={`${avg.toFixed(1)} cm`} />
                <MiniStat label="Đỉnh điểm"  value={`${max.toFixed(1)} cm`} />
              </div>
            </div>

            {/* Threshold comparison chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  So sánh ngưỡng an toàn
                </p>
                <span className="text-xs text-slate-400">HÔM NAY</span>
              </div>

              <svg viewBox="0 0 400 180" className="w-full h-40">
                {/* Dashed reference lines */}
                <line x1="0" y1={chartYFor(THRESHOLD_WARNING)} x2="360" y2={chartYFor(THRESHOLD_WARNING)}
                  stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
                <text x="365" y={chartYFor(THRESHOLD_WARNING) + 3} fontSize="9" fill="#ef4444">
                  NGUY HIỂM (&gt;{THRESHOLD_WARNING}cm)
                </text>

                <line x1="0" y1={chartYFor(THRESHOLD_SAFE)} x2="360" y2={chartYFor(THRESHOLD_SAFE)}
                  stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
                <text x="365" y={chartYFor(THRESHOLD_SAFE) + 3} fontSize="9" fill="#d97706">
                  CẢNH BÁO ({THRESHOLD_SAFE}-{THRESHOLD_WARNING}cm)
                </text>

                {/* Connecting line */}
                <polyline
                  points={chartPoints.map((p, i) => `${chartXs[i]},${chartYFor(p.value)}`).join(" ")}
                  fill="none" stroke="#cbd5e1" strokeWidth="1.5"
                />

                {/* Points */}
                {chartPoints.map((p, i) => (
                  <g key={p.label}>
                    <circle cx={chartXs[i]} cy={chartYFor(p.value)} r="5" fill={p.color} />
                    <text x={chartXs[i]} y={chartYFor(p.value) - 10} fontSize="10" fontWeight="600"
                      textAnchor="middle" fill="#334155">
                      {p.value.toFixed(1)}
                    </text>
                    <text x={chartXs[i]} y="172" fontSize="9" textAnchor="middle" fill="#94a3b8">
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Segmented threshold bar with current-value marker */}
              <div className="space-y-1.5 pt-1">
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-green-400 rounded-l-full" style={{ width: `${pctSafe}%` }} />
                  <div className="absolute top-0 h-full bg-amber-400" style={{ left: `${pctSafe}%`, width: `${pctWarn - pctSafe}%` }} />
                  <div className="absolute top-0 right-0 h-full bg-red-400 rounded-r-full" style={{ left: `${pctWarn}%` }} />
                  <div className="absolute top-0 h-full w-1 bg-white shadow-md transition-all duration-500"
                    style={{ left: `calc(${pct(level)}% - 2px)` }} />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-green-600">AN TOÀN (&lt;{THRESHOLD_SAFE}cm)</span>
                  <span className="text-amber-600">CẢNH BÁO</span>
                  <span className="text-red-500">NGUY HIỂM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            <StatCard icon={<TrendingUp   className="w-4 h-4 text-blue-500"  />} label="Trung bình"        value={`${avg.toFixed(1)} cm`} />
            <StatCard icon={<TrendingUp   className="w-4 h-4 text-red-500"   />} label="Đỉnh điểm"         value={`${max.toFixed(1)} cm`} />
            <StatCard icon={<TrendingDown className="w-4 h-4 text-green-500" />} label="Thấp nhất"         value={`${min.toFixed(1)} cm`} />
            <StatCard icon={<Clock        className="w-4 h-4 text-amber-500" />} label="Thời gian đã vượt" value={formatDuration(duration)} />
          </div>

          {/* Sensor detail */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold text-slate-700">Chi tiết trạm quan trắc</p>
            </div>
            <div className="space-y-2.5">
              <SensorRow label="Cập nhật lần cuối" value={formatDate(updated)} bold />
              <SensorRow label="Tổng thiết bị"      value={`${devices} thiết bị`} />
              <SensorRow label="Tỉ lệ nguy hiểm"
                value={
                  <span className={danger > 0.5 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {(danger * 100).toFixed(0)}%
                  </span>
                }
              />
              {/* <SensorRow label="Tình trạng"
                value={
                  <span className="flex items-center gap-1.5 justify-end">
                    <span className={`w-2 h-2 rounded-full ${risk === "SAFE" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={risk === "SAFE" ? "text-green-600" : "text-red-500"}>
                      {risk === "SAFE" ? "Hoạt động tốt" : cfg.label}
                    </span>
                  </span>
                }
              /> */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Combobox chọn khu vực có search ──
const AreaCombobox = ({ areas, value, onChange, loading }: {
  areas: FlatArea[]; value: string; onChange: (id: string) => void; loading: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selected = areas.find(a => a.area_id === value)
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return areas
    return areas.filter(a => a.tenkhuvuc?.toLowerCase().includes(keyword))
  }, [areas, query])

  return (
    <div className="relative w-full sm:w-72">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200
                   bg-white px-3 py-2.5 text-sm font-medium text-slate-700
                   hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
      >
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {loading ? "Đang tải khu vực..." : selected?.tenkhuvuc ?? "-- Chọn khu vực --"}
        </span>
        {loading
          ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
          : <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        }
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm khu vực..."
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-400 text-center">Không tìm thấy khu vực</p>
            ) : (
              filtered.map(area => (
                <button
                  key={area.area_id}
                  type="button"
                  onClick={() => { onChange(area.area_id); setOpen(false); setQuery("") }}
                  style={{ paddingLeft: `${12 + area.depth * 14}px` }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors
                    ${area.area_id === value ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700"}`}
                >
                  {area.tenkhuvuc}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub components ──
const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/15 rounded-xl p-2.5">
    <p className="text-[10px] text-blue-200 mb-0.5">{label}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>
)

const StatCard = ({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: string
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[11px] text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-base font-bold text-slate-800">{value}</p>
  </div>
)

const SensorRow = ({ label, value, bold }: {
  label: string; value: React.ReactNode; bold?: boolean
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-slate-400 shrink-0">{label}</span>
    <span className={`text-xs text-right ${bold ? "font-bold text-slate-800" : "text-slate-600"}`}>
      {value}
    </span>
  </div>
)