
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { IoTAggregate } from "../types/waterlevelType";

const getBarColor = (value: number) => {
  if (value >= 12) return "#EF4444"; // đỏ
  if (value >= 10) return "#F59E0B"; // vàng
  return "#3B82F6";                  // xanh
};
interface Props {
  data: IoTAggregate[];
}
export const WaterChart = ({ data }: Props) => {


  if (!data || data.length === 0)
    return <div className="bg-white rounded-xl shadow p-5">Không có dữ liệu</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full lg:w-[500px] lg:shrink-0">
      <h2 className="text-base font-semibold mb-3">So sánh mực nước</h2>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="40%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tenkhuvuc" tick={{ fontSize: 11 }} />
          <YAxis
            domain={[0, 20]}
            ticks={[0, 4, 8, 12, 16, 20]}
            tick={{ fontSize: 11 }}
            label={{ value: "Mét", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
          />
          <Tooltip />
          <Legend
  wrapperStyle={{ fontSize: 11 }}
  content={() => (
    <div className="flex gap-3 justify-center mt-1">
      {[
        { color: '#3B82F6', label: 'An toàn (< 10)' },
        { color: '#F59E0B', label: 'Cảnh báo (10–12)' },
        { color: '#EF4444', label: 'Nguy hiểm (≥ 12)' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1">
          <span style={{ background: color }} className="w-3 h-3 rounded-sm inline-block" />
          <span style={{ fontSize: 11, color: '#6B7280' }}>{label}</span>
        </div>
      ))}
    </div>
  )}
/>
          <ReferenceLine
            y={14.5}
            stroke="red"
            strokeDasharray="5 5"
            label={{ value: "Ngưỡng", fontSize: 11 }}
          />
          <Bar dataKey="currentWater" name="Mực nước hiện tại" radius={[4, 4, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.currentWater ?? 0)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};