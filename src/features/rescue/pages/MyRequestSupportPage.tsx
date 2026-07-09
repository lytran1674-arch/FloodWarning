// pages/Home/HomePage.tsx
import { useUserProvince } from "../../map/hooks/useUserProvince"
//import { StatusSoS } from "../components/StatusSoS"
import AssigmentCard from "../components/AsssignGroup"
import ListMyRequestSupport from "@/features/province_operator/components/ListMyRequestSupport"

export const MyRequestSupportPage = () => {

  const {
    gpsArea,
    parentArea,
  } = useUserProvince()

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
       </div>
       </div>
        
  )
}