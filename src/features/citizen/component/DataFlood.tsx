// features/floodriskdata/components/DataFlood.tsx
import { useEffect, useMemo, useState } from "react"
import { useFloodRiskData } from "@/features/floodriskdata/hooks/useFloodRiskData"
import type { FloodRiskData } from "@/features/floodriskdata/types/floodriskType"
import {
  ChartColumn, MapPin, ShieldCheck, ShieldAlert, ShieldMinus,
  Clock, Calendar, ArrowRight, Map as MapIcon, Database,
  ChevronDown, Search, X, Loader2, Activity, AlertCircle,
} from "lucide-react"
import { useAppSelector } from "@/hooks/redux.hooks"
import { useAreaContext } from "@/features/areas/components/AreaContext"
import type { AreaTree } from "@/features/areas/types/areaType"

type MucDo = "LOW" | "MEDIUM" | "HIGH"
type LeadKey = 1 | 2 | 3

const RISK_LABEL: Record<MucDo, string> = {
  LOW: "THẤP",
  MEDIUM: "TRUNG BÌNH",
  HIGH: "CAO",
}

const RISK_CONFIG: Record<MucDo, {
  badgeBg: string; badgeText: string; icon: React.ReactNode; bar: string
}> = {
  LOW:    { badgeBg: "bg-green-50", badgeText: "text-green-600", icon: <ShieldCheck className="w-4 h-4" />, bar: "bg-blue-800"   },
  MEDIUM: { badgeBg: "bg-amber-50", badgeText: "text-amber-600", icon: <ShieldMinus className="w-4 h-4" />, bar: "bg-amber-500" },
  HIGH:   { badgeBg: "bg-red-50",   badgeText: "text-red-600",   icon: <ShieldAlert className="w-4 h-4" />, bar: "bg-red-500"   },
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    })
  } catch { return iso }
}

const formatShortDate = (iso?: string) => {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch { return iso }
}

// Ngày mai/kia/mốt = weatherFrom + (leadKey - 1) ngày
const dateForLead = (weatherFrom: string | undefined, leadKey: LeadKey) => {
  if (!weatherFrom) return undefined
  try {
    const d = new Date(weatherFrom)
    d.setDate(d.getDate() + (leadKey - 1))
    const weekday = d.toLocaleDateString("vi-VN", { weekday: "long" })
    const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
    return `${capWeekday}, ${formatShortDate(d.toISOString())}`
  } catch { return undefined }
}

// ── Làm phẳng cây khu vực để search + tra cứu ──
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

export const DataFlood = () => {
  const { areas, loading: areasLoading } = useAreaContext()
  const user = useAppSelector((state) => state.auth.user)
  const userAreaId = (user as any)?.areaId ?? (user as any)?.area_id

  // Hook lấy dữ liệu
  const { data, loading, getFloodDataByAreaId } = useFloodRiskData()
  const [selectedLead, setSelectedLead] = useState<LeadKey>(1)
  
  // State quản lý khu vực đang chọn
  const [selectedAreaId, setSelectedAreaId] = useState("")
  // State lưu dữ liệu hiển thị thực tế, tránh hiển thị dữ liệu cũ
  const [currentData, setCurrentData] = useState<FloodRiskData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const flatAreas = useMemo(() => flattenAreas(areas), [areas])

  // ── Mặc định chọn khu vực của user hoặc khu vực đầu tiên ──
  useEffect(() => {
    if (!selectedAreaId && flatAreas.length > 0) {
      const defaultId = userAreaId && flatAreas.some(a => a.area_id === userAreaId)
        ? userAreaId
        : flatAreas[0].area_id
      setSelectedAreaId(defaultId)
    }
  }, [flatAreas, userAreaId, selectedAreaId])

  // ── Gọi API khi đổi khu vực ──
  useEffect(() => {
    if (!selectedAreaId) return

    // Reset dữ liệu cũ và lỗi
    setCurrentData(null)
    setError(null)

    const fetchData = async () => {
      try {
        await getFloodDataByAreaId(selectedAreaId)
      } catch (err) {
        setError("Không thể tải dữ liệu dự báo. Vui lòng thử lại.")
        console.error(err)
      }
    }

    fetchData()
  }, [selectedAreaId, getFloodDataByAreaId])

  // ── Cập nhật currentData khi data từ hook thay đổi và khớp area ──
  useEffect(() => {
    if (data && data.area_id === selectedAreaId) {
      setCurrentData(data)
      setError(null)
    }
  }, [data, selectedAreaId])

  // ── Xác định dữ liệu hiển thị ──
  const displayData = currentData
  const displayLoading = loading || (selectedAreaId && !displayData && !error)

  const selectedArea = flatAreas.find(a => a.area_id === selectedAreaId)

  const LEAD_TITLE: Record<LeadKey, string> = { 1: "Ngày mai", 2: "Ngày kia", 3: "Ngày mốt" }

  const getLead = (d: FloodRiskData | null | undefined, lead: LeadKey) => {
    if (!d) return { level: "LOW" as MucDo, probability: 0 }
    if (lead === 1) return { level: d.lead1, probability: d.lead1Probability }
    if (lead === 2) return { level: d.lead2, probability: d.lead2Probability }
    return { level: d.lead3, probability: d.lead3Probability }
  }

  const selected = getLead(displayData, selectedLead)
  const selectedCfg = RISK_CONFIG[selected.level] ?? RISK_CONFIG.LOW
  const selectedPct = Math.min(Math.max(selected.probability, 0), 100)

  return (
    <div className="lg:m-5 space-y-4">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <span>Dashboard</span>
        <span>›</span>
        <span>Dự báo lũ</span>
        <span>›</span>
        <span className="text-slate-600 font-medium">{displayData?.tenKhuVuc ?? selectedArea?.tenkhuvuc ?? "—"}</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
            <p className="text-black text-sm lg:text-lg font-medium">
              Chi tiết dự báo: {displayData?.tenKhuVuc ?? selectedArea?.tenkhuvuc ?? "—"}
            </p>
          </div>

          <div className="flex items-center gap-2 border rounded-md bg-white border-slate-200 px-3 py-1.5 w-fit">
            <Clock className="w-4 h-4 text-blue-700 shrink-0" />
            <p className="text-slate-600 text-xs lg:text-sm">
              Cập nhật lần cuối: {formatDateTime(displayData?.predictedAt)}
              {displayData?.weatherFrom && displayData?.weatherTo && (
                <> · {formatShortDate(displayData.weatherFrom)} - {formatShortDate(displayData.weatherTo)}</>
              )}
            </p>
          </div>
        </div>

        {/* Combobox chọn khu vực */}
        <AreaCombobox
          areas={flatAreas}
          value={selectedAreaId}
          onChange={setSelectedAreaId}
          loading={areasLoading}
        />
      </div>

      {/* Trạng thái loading / error / empty */}
      {displayLoading && (
        <div className="flex items-center justify-center h-32 text-slate-400 gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!displayLoading && !error && !displayData && (
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
          Không có dữ liệu dự báo cho khu vực này
        </div>
      )}

      {displayData && !error && (
        <>
          {/* 3 FORECAST CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([1, 2, 3] as LeadKey[]).map((leadKey) => {
              const { level, probability } = getLead(displayData, leadKey)
              const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.LOW
              const pct = Math.min(Math.max(probability, 0), 100)
              const isSelected = leadKey === selectedLead

              return (
                <button
                  key={leadKey}
                  type="button"
                  onClick={() => setSelectedLead(leadKey)}
                  className={`text-left rounded-2xl p-4 border transition-all
                    ${isSelected
                      ? "border-blue-600 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-200"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isSelected ? "text-blue-700" : "text-slate-600"}`} />
                      <span className={`text-sm font-semibold ${isSelected ? "text-blue-800" : "text-slate-800"}`}>
                        {LEAD_TITLE[leadKey]}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
                      {RISK_LABEL[level]}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2">
                    {dateForLead(displayData?.weatherFrom, leadKey) ?? "—"}
                  </p>

                  <p className="text-sm text-slate-500 mb-3">
                    <span className="text-xl font-bold text-slate-800">{pct.toFixed(0)}%</span>{" "}
                    xác suất
                  </p>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:gap-2 transition-all">
                      Chi tiết vận hành
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* BOTTOM: Analysis card + Map placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Analysis card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-700 p-2.5 shrink-0">
                    <ChartColumn className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-slate-800 font-semibold text-base sm:text-lg">
                    Phân Tích Xác Suất Xảy Ra Lũ
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 w-fit ${selectedCfg.badgeBg}`}>
                  <span className={selectedCfg.badgeText}>{selectedCfg.icon}</span>
                  <p className={`text-sm font-bold ${selectedCfg.badgeText}`}>
                    Mức nguy cơ: {RISK_LABEL[selected.level]}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Chỉ số rủi ro tổng hợp ({LEAD_TITLE[selectedLead]})
                  </p>
                  <p className="text-2xl font-bold text-blue-800 tabular-nums">{selectedPct.toFixed(0)}%</p>
                </div>

                <div className="relative h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${selectedCfg.bar}`}
                    style={{ width: `${selectedPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span>0% AN TOÀN</span>
                  <span>{selectedPct.toFixed(0)}%</span>
                  <span>100% CẢNH BÁO</span>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-3">
                <MapIcon className="w-4 h-4 text-blue-500" />
                Vị trí trạm đo
              </p>
              <div className="flex-1 min-h-[160px] rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                <p className="text-xs text-slate-400 text-center px-4">
                  Bản đồ chưa được tích hợp
                </p>
              </div>
            </div>
          </div>

          {/* Thông số kỹ thuật chi tiết */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-700" />
              <p className="text-sm font-semibold text-slate-700">Thông số kỹ thuật chi tiết</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <TechField label="Mã khu vực" value={displayData.area_id} />
              <TechField label="Tên khu vực" value={displayData.tenKhuVuc} />
              <TechField
                label="Trạng thái dự báo ngày mai"
                value={<RiskTag level={displayData.lead1} />}
              />
              <TechField label="Xác suất ngày mai" value={`${displayData.lead1Probability.toFixed(1)}%`} />
              <TechField
                label="Trạng thái dự báo ngày kia"
                value={<RiskTag level={displayData.lead2} />}
              />
              <TechField label="Xác suất ngày kia" value={`${displayData.lead2Probability.toFixed(1)}%`} />
              <TechField label="Thời điểm dự báo" value={formatDateTime(displayData.predictedAt)} />
              <TechField
                label="Khoảng thời gian dữ liệu"
                value={`${formatShortDate(displayData.weatherFrom)} — ${formatShortDate(displayData.weatherTo)}`}
              />
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
const TechField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
    <p className="text-[11px] text-slate-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
)

const RiskTag = ({ level }: { level: MucDo }) => {
  const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.LOW
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
      {RISK_LABEL[level]}
    </span>
  )
}