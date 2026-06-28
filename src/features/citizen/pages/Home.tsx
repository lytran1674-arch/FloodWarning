// pages/Home/HomePage.tsx
import { useState, useMemo } from "react"
import { useUserProvince } from "../../map/hooks/useUserProvince"
import { useProvinceMap } from "../../map/hooks/useProvinceMap"
import GeoMap from "../../map/components/GeoMap"
import { AreaFlood } from "../component/AreaFlood"
import type { AreaWithRisk } from "../../map/types/mapType"
import { RISK_COLORS } from "../../map/types/mapType"
import { HuongDan } from "../component/HuongDan"
import { WaterLevelWidget } from "../component/WaterLevelWidget"


export const Home = () => {
  const [lead, setLead] = useState<1 | 2 | 3>(1)
  const [selected, setSelected] = useState<AreaWithRisk | null>(null)

  const {
    gpsArea,
    parentArea,
    polygons,
    currentLat,
    currentLon,
    loading: loadingGps,
  } = useUserProvince()

  const effectiveParentId = useMemo(() => parentArea?.id ?? null, [parentArea])

  const effectiveParentName = useMemo(() => {
    return parentArea?.tenkhuvuc ?? "Khu vực của bạn"
  }, [parentArea])

  const { areas: riskAreas, loading: loadingMap } = useProvinceMap(
    effectiveParentId,
    lead
  )

  const areasWithGeometry = useMemo(() => {
    if (!Object.keys(polygons).length) return riskAreas
    return riskAreas.map(area => ({
      ...area,
      geometry: polygons[area.id] ?? area.geometry ?? null,
    }))
  }, [riskAreas, polygons])

  const riskCount = areasWithGeometry.reduce((acc, a) => {
    acc[a.riskLevel] = (acc[a.riskLevel] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const loading = loadingGps || loadingMap

  return (
    <div className="p-4 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Bản đồ nguy cơ lũ lụt
          </h2>
          <p className="text-sm text-slate-400">
            {parentArea
              ? `Quận/Huyện ${parentArea.tenkhuvuc}`
              : gpsArea
              ? `Phường/Xã ${gpsArea.tenkhuvuc}`
              : "Đang xác định khu vực..."}
          </p>
        </div>

        {/* Badge thống kê */}
        <div className="flex gap-2">
          {(["HIGH", "MEDIUM", "LOW"] as const).map(level =>
            riskCount[level] ? (
              <div
                key={level}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: RISK_COLORS[level].fill,
                  color: RISK_COLORS[level].stroke,
                  border: `1px solid ${RISK_COLORS[level].stroke}`,
                }}
              >
                {riskCount[level]} {RISK_COLORS[level].label}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* 3 nút chọn ngày */}
      <div className="flex gap-2">
        {([1, 2, 3] as const).map(day => (
          <button
            key={day}
            onClick={() => setLead(day)}
            className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              lead === day
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}
          >
            {day === 1 ? "Ngày mai" : day === 2 ? "Ngày kia" : "Ngày mốt"}
          </button>
        ))}
      </div>

      {/* 3 CỘT CHÍNH: WaterDashboard | GeoMap | AreaFlood */}
      <div className="grid grid-cols-[280px_1fr_280px] gap-4 items-start">

        {/* Cột trái: WaterDashboard */}
        <div className="min-w-0">

<WaterLevelWidget  />
        </div>

        {/* Cột giữa: Map + detail khi click */}
        <div className="min-w-0 space-y-3">
          <GeoMap
            areas={areasWithGeometry}
            userAreaId={gpsArea?.id}
            selectedAreaId={undefined}
            provinceName={effectiveParentName}
            loading={loading}
            className="w-full h-[420px] lg:h-[520px] rounded-xl shadow"
            onAreaClick={setSelected}
            currentLat={currentLat}
            currentLon={currentLon}
            showCurrentPin={true}
            centerOnUser={currentLat != null}
          />

          {/* Chi tiết khi click vào vùng */}
          {selected && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-slate-800">{selected.tenkhuvuc}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selected.id === gpsArea?.id && "📍 Khu vực của bạn · "}
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: RISK_COLORS[selected.riskLevel].fill,
                    color: RISK_COLORS[selected.riskLevel].stroke,
                    border: `1px solid ${RISK_COLORS[selected.riskLevel].stroke}`,
                  }}
                >
                  {RISK_COLORS[selected.riskLevel].label}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Khu vực của bạn */}
          {gpsArea && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium">Khu vực của bạn</p>
                <p className="text-sm text-blue-800 font-semibold">{gpsArea.tenkhuvuc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: AreaFlood */}
        <div className="min-w-0">
          <AreaFlood />
        </div>
      </div>

      <HuongDan />
    </div>
  )
}