import { useState } from 'react';
import BaseLineChart from '../../../components/ui/LineChart';
import type { Weather_datas } from '../types/weatherdataType';

interface Props {
  weatherdata?: Weather_datas[];
}

const RANGE_OPTIONS = [
  { label: "7 ngày", value: 7 },
  { label: "14 ngày", value: 14 },
  { label: "30 ngày", value: 30 },
];

export const WeatherDataChart = ({ weatherdata = [] }: Props) => {
  const [range, setRange] = useState(7);

  // Lọc dữ liệu theo số ngày được chọn
  const filtered = weatherdata.filter((d) => {
    const date = new Date(d.time);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= range;
  });

  const chartData = {
    labels: filtered.map((d) => new Date(d.time).toLocaleDateString("vi-VN")),
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: filtered.map((d) => d.temperature),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
      },
      {
        label: "Độ ẩm (%)",
        data: filtered.map((d) => d.humidity),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
      },
       {
        label: "Lượng mưa (mm)",
        data: filtered.map((d) => d.rainfall),
        borderColor: "#1160FD",
        backgroundColor: "#1160FD",
      },
       {
        label: "Áp suất",
        data: filtered.map((d) => d.pressure),
        borderColor: "#AC14E3",
        backgroundColor: "#AC14E3",
      },
       {
        label: "Tốc độ gió",
        data: filtered.map((d) => d.wind_speed),
        borderColor: "#C1560A",
        backgroundColor: "#C1560A",
      },
       {
        label: "Bốc thoát hơi",
        data: filtered.map((d) => d.evapotranspiration),
        borderColor: "#FFC44A",
        backgroundColor: "#FFC44A",
      },
       {
        label: "Điểm sương",
        data: filtered.map((d) => d.dewpoint),
        borderColor: "#1E4DAF",
        backgroundColor: "#1E4DAF",
      },

    ],
  };

  if (weatherdata.length === 0) {
    return (
      <div className="w-full h-[350px] rounded-lg border bg-white p-4 flex items-center justify-center text-gray-400">
        Chọn khu vực để xem biểu đồ
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      {/* Bộ lọc thời gian */}
      <div className="flex gap-2 mb-4">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setRange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              range === opt.value
                ? "bg-[#1C5FE5] text-white border-[#1C5FE5]"
                : "bg-white text-black border-gray-300 hover:border-[#1C5FE5]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <BaseLineChart title="Biểu đồ thời tiết" data={chartData} />
    </div>
  );
};