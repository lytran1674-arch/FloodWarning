// pages/Home/HomePage.tsx
import { useState } from "react";
import { useUserProvince } from "../../map/hooks/useUserProvince";

import SoSCard from "./SoSCard";
import AssigmentCard from "../components/AsssignGroup";
import SosDetailPanel from "../components/SosDetailMoPanel";


export const HomeRescue = () => {
  const { gpsArea, parentArea } = useUserProvince();
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

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