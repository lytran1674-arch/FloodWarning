// pages/Home/HomePage.tsx
import { useState } from "react";
import SoSCard from "./SoSCard";
import AssigmentCard from "../components/AsssignGroup";
import SosDetailPanel from "../components/SosDetailMoPanel";
import { useAppSelector } from "@/hooks/redux.hooks";

export const HomeRescue = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isLeaderGroup = user?.isGroupLeader === true;

  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* HEADER */}

      <div className="w-full flex flex-col xl:flex-row gap-4 items-start">
        {/* CỘT TRÁI: danh sách */}
        <div className="w-full xl:w-1/2 space-y-2">
          <SoSCard
            selectedSosId={selectedSosId}
            onSelectSos={setSelectedSosId}
          />
          {isLeaderGroup && (
            <AssigmentCard
              selectedSosId={selectedSosId}
              onSelectSos={setSelectedSosId}
            />
          )}
        </div>

        {/* CỘT PHẢI: chi tiết SOS */}
        <div className="w-full xl:w-1/2 xl:sticky xl:top-4">
          <SosDetailPanel sosId={selectedSosId} />
        </div>
      </div>
    </div>
  );
};