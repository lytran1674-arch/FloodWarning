import { useState } from 'react';
import BaseLineChart from '../../../components/ui/LineChart';
import type { Weather_datas } from '../types/weatherdataType';

interface Props {
  weatherdata?: Weather_datas[];
}

const RANGE_OPTIONS = [
  { label: "3 ngày", value: 3 },
  { label: "9 ngày", value: 9 },
];

export const WeatherDataChart = ({ weatherdata = [] }: Props) => {
  const [range, setRange] = useState(3);

  const filtered = weatherdata.filter((d) => {
    const diffDays = (Date.now() - new Date(d.time).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= range;
  });

  // Group by ngày, lấy trung bình
  const grouped = (() => {
    const map = new Map<string, Weather_datas[]>();

    filtered.forEach((d) => {
      const day = new Date(d.time).toLocaleDateString("vi-VN");
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(d);
    });

    return Array.from(map.entries()).map(([day, items]) => {
      const avg = (key: keyof Weather_datas) =>
        items.reduce((s, i) => s + Number(i[key]), 0) / items.length;

      return {
        day,
        temperature:        avg("temperature"),
        humidity:           avg("humidity"),
        rainfall:           avg("rainfall"),
        pressure:           avg("pressure"),
        wind_speed:         avg("wind_speed"),
        evapotranspiration: avg("evapotranspiration"),
        dewpoint:           avg("dewpoint"),
      };
    });
  })();

  const chartData = {
    labels: grouped.map((d) => d.day),
    datasets: [
      { label: "Nhiệt độ (°C)",  data: grouped.map((d) => +d.temperature.toFixed(1)),        borderColor: "#ef4444", backgroundColor: "#ef4444" },
      { label: "Độ ẩm (%)",      data: grouped.map((d) => +d.humidity.toFixed(1)),            borderColor: "#22c55e", backgroundColor: "#22c55e" },
      { label: "Lượng mưa (mm)", data: grouped.map((d) => +d.rainfall.toFixed(1)),            borderColor: "#1160FD", backgroundColor: "#1160FD" },
      { label: "Áp suất",        data: grouped.map((d) => +d.pressure.toFixed(1)),            borderColor: "#AC14E3", backgroundColor: "#AC14E3" },
      { label: "Tốc độ gió",     data: grouped.map((d) => +d.wind_speed.toFixed(1)),          borderColor: "#C1560A", backgroundColor: "#C1560A" },
      { label: "Bốc thoát hơi",  data: grouped.map((d) => +d.evapotranspiration.toFixed(1)), borderColor: "#FFC44A", backgroundColor: "#FFC44A" },
      { label: "Điểm sương",     data: grouped.map((d) => +d.dewpoint.toFixed(1)),            borderColor: "#1E4DAF", backgroundColor: "#1E4DAF" },
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