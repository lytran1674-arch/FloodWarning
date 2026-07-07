// features/flood-risk/components/FloodRisk.tsx
import { useFloodRiskData } from '../hooks/useFloodRiskData'
import image from "../../../assets/BCO.28c1b972-eb93-4270-878b-8ce369928a0c.png"
import { Combobox } from '../../../components/ui/Combobox'
import { useWeatherData } from '../../weather-data/hooks/useWeatherData'
import { useEffect, useMemo, useState } from 'react'
import { useAreaOptions } from '../../areas/hooks/useAreaOption'
import { Cloud, CloudRainWind, Droplet, Gauge, Thermometer, Timer } from 'lucide-react'
import { FaArrowRight } from 'react-icons/fa'
import { Button } from '../../../components/ui/Button'
import GeoMap from '@/features/map/components/GeoMap'
import { useUserProvince } from '@/features/map/hooks/useUserProvince'
import { useProvinceMap } from '@/features/map/hooks/useProvinceMap'
import { PredictionJobTable } from '../components/predictionjobs/PredictionJobTable'
import { usePredictionJobs } from '../hooks/usePredictionJobs'
//import type { AreaWithRisk } from '@/features/map/types/mapType'

export const FloodRisk = () => {
  const { loading } = useFloodRiskData()
  const areaOption = useAreaOptions()
  const { predictjobs } = usePredictionJobs();
  const [areaId, setAreaId] = useState("")
  const [userHasSelected, setUserHasSelected] = useState(false)
  const [lead] = useState<1 | 2 | 3>(1)
  //const [//selected, setSelected] = useState<AreaWithRisk | null>(null)

  // ── GPS → phường → detail → parentId → siblings → polygons ──────────────
  const {
    gpsArea,       // phường/xã hiện tại
    parentArea,    // quận/huyện cha
    //siblingAreas,  // các phường/xã cùng quận
    polygons,      // polygon của từng sibling
    currentLat,
    currentLon,
    loading: loadingGps,
  } = useUserProvince()

  // Khi GPS xong + user chưa tự chọn → tự set combobox về xã GPS
  useEffect(() => {
    if (!loadingGps && gpsArea?.id && !userHasSelected) {
      setAreaId(gpsArea.id)
    }
  }, [loadingGps, gpsArea?.id, userHasSelected])

  // parentId để truyền vào useProvinceMap (lấy risk theo từng area con)
  const effectiveParentId = useMemo(() => {
    if (areaId) {
      // Khi combobox chọn một phường → lấy parent_id của nó
      const opt = areaOption.find(a => a.value === areaId)
      return opt?.parent_id ?? null
    }
    // Mặc định dùng parent từ GPS
    return parentArea?.id ?? null
  }, [areaId, areaOption, parentArea])

  // Tên khu vực cha để hiển thị trên map
  const effectiveParentName = useMemo(() => {
    if (areaId) {
      const opt = areaOption.find(a => a.value === areaId)
      return opt?.parent_name ?? null
    }
    return parentArea?.tenkhuvuc ?? null
  }, [areaId, areaOption, parentArea])

  // Weather: dùng areaId combobox hoặc gpsArea
  const weatherAreaId = areaId || gpsArea?.id || ""
  const { latestWeather, loading: weatherLoading } = useWeatherData(weatherAreaId)

  // Lấy danh sách area con kèm risk level
  const { areas: riskAreas, loading: loadingMap } = useProvinceMap(
    effectiveParentId,
    lead
  )

  // Ghép polygon từ GPS vào riskAreas (polygon đã load sẵn từ useUserProvince)
  const areasWithGeometry = useMemo(() => {
    if (!Object.keys(polygons).length) return riskAreas
    return riskAreas.map(area => ({
      ...area,
      geometry: polygons[area.id] ?? area.geometry ?? null,
    }))
  }, [riskAreas, polygons])

  // Thống kê
  const statistics = useMemo(() => ({
    safe:    riskAreas.filter(a => a.riskLevel === "LOW").length,
    warning: riskAreas.filter(a => a.riskLevel === "MEDIUM").length,
    danger:  riskAreas.filter(a => a.riskLevel === "HIGH").length,
    total:   riskAreas.length,
  }), [riskAreas])

  if (loading) return <div>Đang tải dữ liệu...</div>

  return (
    <>
      <div className="mb-4 flex justify-start items-center gap-1 lg:mt-1">
        <img src={image} className="text-black w-12" />
        <h1 className="text-xl font-semibold text-black">
          Quản lý dữ liệu nguy cơ lũ lụt
        </h1>
      </div>

      <div className='flex justify-start gap-3 lg:ml-2 sm:m-2 m-1'>
        {/* CỘT TRÁI */}
        <div className='flex-shrink-0'>
          <div className='border border-[#E5E7EB] p-1 rounded-md'>
            <p className='text-black lg:text-[20px] sm:text-sm text-xs font-bold'>
              DỮ LIỆU THỜI TIẾT (MỚI NHẤT)
            </p>
            <Combobox
              label="Khu vực"
              options={areaOption}
              value={areaId}
              onChange={(value) => {
                setAreaId(value)
                setUserHasSelected(true)
              }}
            />
            {weatherLoading && <p>Đang tải...</p>}
            {latestWeather && (
              <div className="rounded-md p-1 mt-2 lg:text-sm sm:text-xs text-[9px] text-black">
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex justify-start gap-2 items-center'>
                    <CloudRainWind className='w-4' stroke="#1C5FE5" /> Lượng mưa:
                  </div>
                  <p>{latestWeather.rainfall}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex justify-start gap-2 items-center'>
                    <Thermometer className='w-4 text-[#EE0F0F]' stroke='#EE0F0F' /> Nhiệt độ:
                  </div>
                  <p>{latestWeather.temperature}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex justify-start gap-2 items-center'>
                    <Droplet className='w-4' stroke="#1C5FE5" /> Độ ẩm:
                  </div>
                  <p>{latestWeather.humidity}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex justify-start gap-2 items-center'>
                    <Cloud className='w-4' stroke="#1C5FE5" /> Độ phủ mây:
                  </div>
                  <p>{latestWeather.dewpoint}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex justify-start gap-2 items-center'>
                    <Gauge className='w-4' stroke='#AC14E3' /> Áp suất:
                  </div>
                  <p>{latestWeather.pressure}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex justify-start gap-2 items-center'>
                    <Timer className='w-4 text-[#31D239]' /> Thời gian:
                  </div>
                  <p>{new Date(latestWeather.time).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className='border border-[#E5E7EB] mt-2 p-1 rounded-md'>
            <p className='font-medium text-sm sm:text-sm lg:text-xl text-black'>
              THỐNG KÊ DỰ ĐOÁN
            </p>
            <div className='lg:mt-5 sm:mt-3 mt-2 flex justify-start items-center gap-2'>
              <div className='flex-wrap justify-center border border-[#BEF4C1] bg-[#BEF4C1] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
                <p className='font-bold text-[#165E19] text-[8px] lg:text-sm'>An toàn</p>
                <p className='lg:mt-3 lg:mb-3 lg:text-xl sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.safe}</p>
                <p className='font-bold text-[10px] lg:text-sm'>khu vực</p>
              </div>
              <div className='flex-wrap justify-center border border-[#FBDD9F] bg-[#FBDD9F] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
                <p className='font-bold text-[#D97706] text-[8px] lg:text-sm'>Nguy cơ</p>
                <p className='lg:mt-3 lg:mb-3 lg:text-xl sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.warning}</p>
                <p className='font-bold text-[10px] lg:text-sm'>khu vực</p>
              </div>
              <div className='flex-wrap justify-center border border-[#F69595] bg-[#F69595] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
                <p className='font-bold text-[#A91A1A] text-[8px] lg:text-sm'>Nguy hiểm</p>
                <p className='lg:mt-3 lg:mb-3 lg:text-xl sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.danger}</p>
                <p className='font-bold text-[10px] lg:text-sm'>khu vực</p>
              </div>
            </div>
            <p className='text-xs sm:text-sm lg:text-xl text-black lg:mt-5'>
              Tổng số khu vực: {statistics.total}
            </p>
          </div>
        </div>

        {/* MAP */}
        <div className='lg:w-[580px] lg:h-[500px] sm:w-[300px] w-[250px] h-[500px] sm:h-[400px]'>
          <GeoMap
            areas={areasWithGeometry}
            userAreaId={gpsArea?.id}
            selectedAreaId={areaId}
            provinceName={effectiveParentName ?? undefined}
            loading={loadingGps || loadingMap}
           // onAreaClick={setSelected}
            currentLat={currentLat}
            currentLon={currentLon}
            showCurrentPin={true}
            centerOnUser={!areaId && currentLat != null}
          />
        </div>

        {/* CỘT PHẢI */}
        <div className='border border-[#E5E7EB] lg:p-2 rounded-md p-1 flex-shrink-0'>
          <p className='font-bold lg:text-[16px] sm:text-[10px] text-black text-[7px]'>
            MỨC ĐỘ NGUY CƠ THEO KHU VỰC
          </p>
          <div className='flex justify-between items-center text-black'>
            <div>
              <p className='text-[6px] sm:text-[10px] lg:text-[16px]'>Khu vực</p>
            </div>
            <div>
              <p className='text-[6px] sm:text-[10px] lg:text-[16px]'>Mức độ nguy cơ</p>
            </div>
          </div>
          <Button className='lg:ml-5 border border-[#1C5FE5] rounded-sm lg:p-2 text-[#1C5FE5] sm:text-sm sm:p-1 text-[10px] px-[2px] hover:bg-blue-500 hover:text-white'>
            Xem tất cả khu vực
            <FaArrowRight />
          </Button>
        </div>
      </div>

      {/* LỊCH SỬ DỰ ĐOÁN */}
      <div className='border lg:p-4 sm:p-2 m-2 rounded-md p-1'>
          <p className='text-black font-bold  mb-2'>Lịch sử dự đoán</p>
      
          <PredictionJobTable data={predictjobs}/>

      </div>
    </>
  )
}