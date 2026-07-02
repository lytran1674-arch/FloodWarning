import { StatusCard } from "../../water-level/components/StatusCard";
import { WaterLevelTable } from "../../water-level/components/WaterLevelTable";
import { WaterChart } from "../../water-level/components/WaterChart";

import { useWaterLevel } from "../../water-level/hooks/useWaterLevel";


export const SumWaterPage = () => {
  const {
    data,
    loading,
  } = useWaterLevel();

  return (
    <div>
 

      <StatusCard data={data} />

      <div className="flex flex-col lg:flex-row lg:gap-2 lg:justify-between lg:mr-2 m-2">
        <WaterLevelTable
          data={data}
          loading={loading}
        />

        <WaterChart
          data={data}
        />
      </div>
    </div>
  );
};