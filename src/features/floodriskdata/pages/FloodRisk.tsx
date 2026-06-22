import { useFloodRiskData } from '../hooks/useFloodRiskData'
import image from "../../../assets/BCO.28c1b972-eb93-4270-878b-8ce369928a0c.png"
import { Combobox } from '../../../components/ui/Combobox'
import { useWeatherData } from '../../weather-data/hooks/useWeatherData'
import { useMemo, useState, /*useMemo*/ } from 'react'
import { useAreaOptions } from '../../areas/hooks/useAreaOption'
//import { useArea } from '../../areas/hooks/useArea'
//import { useAreaPolygon } from '../../map/hooks/usePolygon'
import { Cloud, CloudRainWind, Droplet, Gauge, Thermometer, Timer } from 'lucide-react'
import { FaArrowRight } from 'react-icons/fa'
import { Button } from '../../../components/ui/Button'
import GeoMap from '@/features/map/components/GeoMap'
import { useUserProvince } from '@/features/map/hooks/useUserProvince'
import { useProvinceMap } from '@/features/map/hooks/useProvinceMap'
import type { AreaWithRisk } from '@/features/map/types/mapType'

export const FloodRisk = () => {
  const { loading } = useFloodRiskData()
  const areaOption = useAreaOptions()
  //const { areas } = useArea()
  const [areaId, setAreaId] = useState("")
   // const { polygon } = useAreaPolygon(areaId);
  const { latestWeather, loading: weatherLoading } = useWeatherData(areaId)

  const handleChange = (value: string) => {
    setAreaId(value)
  }
  const { province, userArea, loading: loadingProvince } = useUserProvince()
  
    const [lead, setLead] = useState<1 | 2 | 3>(1)
  
 const { areas, loading: loadingMap } = useProvinceMap(
  province?.id ?? null,
  lead,

)
    const [selected, setSelected] = useState<AreaWithRisk | null>(null)

  const statistics = useMemo(() => {

  return {
    safe: areas.filter(a => a.riskLevel === "LOW").length,

    warning: areas.filter(
      a => a.riskLevel === "MEDIUM"
    ).length,

    danger: areas.filter(
      a => a.riskLevel === "HIGH"
    ).length,

    total: areas.length,
  }

}, [areas])



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
      <div className=''>
        <div className='  border border-[#E5E7EB] p-1 rounded-md'>
          <p className='text-black lg:text-[20px] sm:text-sm text-xs font-bold'>DỮ LIỆU THỜI TIẾT (MỚI NHẤT)</p>
          <Combobox
            label="Khu vực"
            options={areaOption}
            value={areaId}
            onChange={handleChange}
          />

          {weatherLoading && <p>Đang tải...</p>}

          {latestWeather && (
            <div className="rounded-md p-1 mt-2 lg:text-sm sm:text-xs text-[9px] text-black">
              <div className='flex justify-between items-center gap-4 '>
                <div className='flex justify-start gap-2 items-center '>  
                  <CloudRainWind className='w-4' stroke="#1C5FE5"/> Lượng mưa:
                  </div>
                <p>{latestWeather.rainfall}</p>
              </div>
              <div className='flex justify-between items-center'>
                 <div className='flex justify-start gap-2 items-center'>  
                  <Thermometer  className='w-4 text-[#EE0F0F]' stroke='#EE0F0F'/> Nhiệt độ: 
                  </div>
                <p> {latestWeather.temperature}</p>
              </div>
              <div className='flex justify-between items-center'>
                 <div className='flex justify-start gap-2 items-center'>  
                  <Droplet className='w-4'  stroke="#1C5FE5"/> Độ ẩm:
                  </div>
                <p>{latestWeather.humidity}</p>
              </div>
              <div className='flex justify-between items-center'>
                 <div className='flex justify-start gap-2 items-center'>  
                  <Cloud className='w-4' stroke="#1C5FE5"/> Độ phủ mây:
                  </div>
                <p> {latestWeather.dewpoint}</p>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex justify-start gap-2 items-center'>  
                  <Gauge className='w-4' stroke='#AC14E3'/> Áp suất: 
                  </div>
                <p>{latestWeather.pressure}</p>
              </div>
               <div className='flex justify-between items-center'>
                <div className='flex justify-start gap-2 items-center'>  
                  <Timer className='w-4 text-[#31D239]'/>Thời gian:
                  </div>
              <p> {new Date(latestWeather.time).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
        <div  className='border border-[#E5E7EB] lg: mt-2 p-1 rounded-md'>
          <p className='font-medium text-sm sm:text-sm lg:text-xl 
           text-black  '>THỐNG KÊ DỰ ĐOÁN</p>
           <div className='lg:mt-5 sm:mt-3 mt-2 flex justify-start items-center gap-2'>
            <div className=' flex-wrap justify-center border border-[#BEF4C1]
             bg-[#BEF4C1] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
              <p className='font-bold text-[#165E19] text-[8px] lg:text-sm'>
                An toàn 
              </p>
              <p className='text-[35px] lg:mt-3 
              lg:mb-3 lg:text-xl
              sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.safe}</p>
              <p className='font-bold text-[10px] lg:text-sm'>khu vực </p>
            </div>
            <div className=' flex-wrap justify-center border border-[#FBDD9F]
             bg-[#FBDD9F] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
              <p className='font-bold text-[#D97706] text-[8px] lg:text-sm'>
                Nguy cơ
              </p>
              <p className='text-[35px] lg:mt-3 
              lg:mb-3 lg:text-xl
              sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.warning}</p>
              <p className='font-bold text-[10px] lg:text-sm'>khu vực </p>
            </div>
            <div className=' flex-wrap justify-center border border-[#F69595]
             bg-[#F69595] lg:w-24 sm:w-20 w-14 p-1 rounded-lg text-black'>
              <p className='font-bold text-[#A91A1A] text-[8px] lg:text-sm'>
                Nguy hiểm
              </p>
              <p className='text-[35px] lg:mt-3 
              lg:mb-3 lg:text-xl
              sm:mt-2 sm:mb-2 mb-[2px] mt-[2px] font-bold text-black text-[15px]'>{statistics.danger}</p>
              <p className='font-bold text-[10px] lg:text-sm'>khu vực </p>
            </div>
           </div>
           <p className='text-xs sm:text-sm lg:text-xl text-black lg:mt-5'>
            Tổng số khu vực: {statistics.total}</p>
        </div>
      </div>

      <div className=' lg:w-[580px] sm:w-[300px] w-[250px] '>
<GeoMap
  areas={areas}
  userAreaId={userArea?.id}
  provinceName={province?.tenkhuvuc}
  loading={loadingMap}
  onAreaClick={setSelected}
  selectedAreaId={areaId}
/>
      </div>
      <div className='border border-[#E5E7EB] lg:p-2 rounded-md p-1'>
      <p className='font-bold lg:text-[16px] sm:text-[10px] text-black text-[7px]'>MỨC ĐỘ NGUY CƠ THEO KHU VỰC</p>
      <div className='flex justify-between items-center text-black'>
        <div>
          <p className='text-[6px] sm:text-[10px] lg:text-[16px]'>Khu vực</p>

          {/*điền các khu vực có các mức độ}*/}
        </div>
        <div>
          <p className='text-[6px] sm:text-[10px] lg:text-[16px]'>Mức độ nguy cơ</p>
           {/*điền các mức độ}*/}
        </div>
      </div>
      <Button className='lg:ml-5 border border-[#1C5FE5]
       rounded-sm lg:p-2 text-[#1C5FE5]
       sm:text-sm sm:p-1
       text-[10px] px-[2px] 
        hover:bg-blue-500 hover:text-white'>Xem tất cả khu vực
        <FaArrowRight/>
        </Button> 
      </div>
      </div>

      {/*Lịch sử dự đoán*/}
      <div className='border lg:p-4 sm:p-2 m-2 rounded-md lg:p-3 sm:p-2 p-1'>
        <div className='flex justify-between text-black font-medium'>
           <p>Lịch sử dự đoán</p>
           <FaArrowRight/>
        </div>
        {/*Tiêu đề */}
        <div className='flex justify-between items-center mt-2 text-black border-black border-b'>
        <p>Thời gian dự đoán</p>
        <p>Khu vực</p>
        <p>Mức độ nguy cơ</p>
        <p>Xác xuất</p>
        <p>Trạng thái</p>
        </div>
       
      </div>
    </>
  )
}