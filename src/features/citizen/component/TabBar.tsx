import { AlertTriangle, ArrowRight, CloudRain, Droplets, Gauge, GlassWater, Thermometer, WavesHorizontal } from 'lucide-react'
import { Button } from '../../../components/ui/Button'


export const TabBar = () => {
  return (
    <>
    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3 lg:w-[900px] lg:mt-5 m-2">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-red-600 w-8 h-8" stroke="#EE0F0F" />
        <div>
          <p className="font-bold text-[#EE0F0F] text-sm sm:text-base">CẢNH BÁO NGUY HIỂM</p>
          <p className="text-black text-xs sm:text-sm">
            Nhiều khu vực đang ở mức NGUY HIỂM do nguy cơ ngập lụt cao
          </p>
        </div>
      </div>
      <Button className="border-red-300 text-red-700
       hover:bg-red-100 border border-[#EE0F0F] rounded-md p-1">
        Xem chi tiết
        <ArrowRight className="ml-1 w-4 h-4" />
      </Button>
    </div>
 {/**Phần giữa */}
   
    </>
  )
}