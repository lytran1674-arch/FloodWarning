// pages/Home/HomePage.tsx
// import { useUserProvince } from "../../map/hooks/useUserProvince"
//import { StatusSoS } from "../components/StatusSoS"
//import AssigmentCard from "../components/AsssignGroup"
import ListMyRequestSupport from "@/features/province_operator/components/ListMyRequestSupport"
import SosDetailPanel from "../components/SosDetailMoPanel"
import { useState } from "react"
import { ListSoSSupportCard } from "@/features/grouprescue/components/ListSoSSupportCard";

export const MyRequestSupportPage = () => {
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

   return (
    <div className="md:p-4 ">
        <div className="w-full xl:flex-1 gap-2 flex lg:justify-start">
          <div className="flex-wrap space-y-1">
           {/* <StatusSoS />*/}
            <ListMyRequestSupport
  onSelectSos={setSelectedSosId}
/>
           
              
        
            <ListSoSSupportCard/>
                 </div>
             <div className="w-full xl:w-1/2 xl:sticky xl:top-4 lg:mt-11">
          <SosDetailPanel sosId={selectedSosId} />
        </div>
       </div>
       </div>
  
        
  )
}
