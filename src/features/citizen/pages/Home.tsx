// pages/Home/HomePage.tsx
import { useState, useMemo } from "react"
import { useUserProvince } from "../../map/hooks/useUserProvince"

import GeoMap from "../../map/components/GeoMap"
import { AreaFlood } from "../component/AreaFlood"
import type { AreaMapItem, AreaWithRisk } from "../../map/types/mapType"
import { RISK_COLORS } from "../../map/types/mapType"
import { HuongDan } from "../component/HuongDan"
import { WaterLevelWidget } from "../component/WaterLevelWidget"
import { useRegionalForecast } from "../hooks/useRegionalForecast"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { PredictCard } from "@/features/floodriskdata/components/PredictCard"
import { useDataEvalution } from "@/features/dataevaluation/hooks/useDataEvalution"


export const Home = () => {

    const [selected, setSelected] = useState<AreaMapItem | null>(null)

  // Lấy areaId từ Redux login
  const areaId = useSelector((state: RootState) => state.auth.user?.areaId ?? null)

  const {
    gpsArea,
    parentArea,
    currentLat,
    currentLon,
    loading: loadingGps,
  } = useUserProvince()

  const effectiveParentName = useMemo(() => {
    return parentArea?.tenkhuvuc ?? "Khu vực của bạn"
  }, [parentArea])

  // Dùng areaId từ login, hook sẽ tự lấy parent_id bên trong
  const { areas: riskAreas, loading: loadingMap } = useRegionalForecast(areaId)

  const loading = loadingGps || loadingMap

   return (
    <div className="p-3 md:p-4 space-y-4">

      {/* HEADER */}
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

      {/* LAYOUT CHÍNH */}
      <div className="flex flex-col xl:flex-row gap-4 items-start">

        {/* Cột trái: Map */}
        <div className="w-full xl:flex-1 space-y-3">
          <GeoMap
            areas={riskAreas}
            userAreaId={gpsArea?.id}
            selectedAreaId={undefined}
            provinceName={effectiveParentName}
            loading={loading}
            className="w-full h-[360px] md:h-[460px] xl:h-[520px] rounded-xl shadow"
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
                    {selected.id === gpsArea?.id && "📍 Khu vực của bạn"}
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
          {/* Card dự báo */}

        {/* Cột phải: Widget + AreaFlood */}
        <div className="w-full xl:w-[300px] flex flex-col gap-4">
          <WaterLevelWidget />
          <AreaFlood />
        </div>

      </div>
<PredictCard areaId={areaId ?? ""} />
      <HuongDan />
    </div>
  )
}