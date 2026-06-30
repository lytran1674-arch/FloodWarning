import { StatusCard } from "../components/StatusCard";
import { WaterLevelTable } from "../components/WaterLevelTable";
import { WaterChart } from "../components/WaterChart";
import { Button } from "@/components/ui/Button";
import { useWaterLevel } from "../hooks/useWaterLevel";
import { ChartColumnBig } from "lucide-react";

export const SummaryWaterPage = () => {
  const {
    data,
    loading,
    handleAggregate,
  } = useWaterLevel();

  return (
    <div>
    <div className="flex justify-end mt-8 mr-5">
  <Button
    onClick={handleAggregate}
    className="rounded-md lg:text-xl border  text-white bg-green-500 lg:p-2"
  >
    <ChartColumnBig />
    Tổng hợp mực nước
  </Button>
</div>

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