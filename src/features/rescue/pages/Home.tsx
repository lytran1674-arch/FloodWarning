// pages/Home/HomePage.tsx
import { useState } from "react";
import SoSCard from "./SoSCard";
import AssigmentCard from "../components/AsssignGroup";
import SosDetailPanel from "../components/SosDetailMoPanel";



export const HomeRescue = () => {

  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* HEADER */}
      <div>
       <p>trang chủ</p>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-4 items-start">
        {/* CỘT TRÁI: danh sách */}
        <div className="w-full xl:w-1/2 space-y-2">
          <SoSCard />
          <AssigmentCard
            selectedSosId={selectedSosId}
            onSelectSos={setSelectedSosId}
          />
        </div>

        {/* CỘT PHẢI: chi tiết SOS */}
        <div className="w-full xl:w-1/2 xl:sticky xl:top-4">
          <SosDetailPanel sosId={selectedSosId} />
        </div>
      </div>
    </div>
  );
};