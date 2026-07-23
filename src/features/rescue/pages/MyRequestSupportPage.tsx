// pages/Home/HomePage.tsx
// import { useUserProvince } from "../../map/hooks/useUserProvince"
//import { StatusSoS } from "../components/StatusSoS"
//import AssigmentCard from "../components/AsssignGroup"
import ListMyRequestSupport from "@/features/province_operator/components/ListMyRequestSupport"
import SosDetailPanel from "../components/SosDetailMoPanel"
import { useState } from "react"

export const MyRequestSupportPage = () => {
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

   return (
    <div className="p-3 md:p-4 space-y-4">

   

 
        <div className="w-full xl:flex-1 gap-2 flex lg:justify-start">
          <div className="flex-wrap space-y-2">
           {/* <StatusSoS />*/}
            <ListMyRequestSupport
  onSelectSos={setSelectedSosId}
/>
           
              
            </div>
             <div className="w-full xl:w-1/2 xl:sticky xl:top-4">
          <SosDetailPanel sosId={selectedSosId} />
        </div>
       </div>
       </div>
        
  )
}
