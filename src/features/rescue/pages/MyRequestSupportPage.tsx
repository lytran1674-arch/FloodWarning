// pages/Home/HomePage.tsx
import { useState, useMemo } from "react"
import { useUserProvince } from "../../map/hooks/useUserProvince"

import GeoMap from "../../map/components/GeoMap"

import type { AreaMapItem } from "../../map/types/mapType"
import { RISK_COLORS } from "../../map/types/mapType"



import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"

import { useRegionalForecast } from "@/features/citizen/hooks/useRegionalForecast"

//import { StatusSoS } from "../components/StatusSoS"
import AssigmentCard from "../components/AsssignGroup"
import ListMyRequestSupport from "@/features/province_operator/components/ListMyRequestSupport"





export const MyRequestSupportPage = () => {

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

 
        <div className="w-full xl:flex-1 gap-2 flex lg:justify-start">
          <div className="flex-wrap space-y-2">
           {/* <StatusSoS />*/}
            <ListMyRequestSupport/>
            <AssigmentCard/>
            </div>
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

       </div>
       </div>
        
  )
}