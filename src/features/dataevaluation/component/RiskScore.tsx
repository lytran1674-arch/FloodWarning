    import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts";
import type { SnapShot } from "../types/dataevaluationType";

interface Props{
  data:SnapShot[];
}
export const RiskScore = ({data}:Props) => {
    const chartData =
data.map(item=>({

 time:
 new Date(item.snapshotAt)
 .toLocaleTimeString("vi-VN",{
  hour:"2-digit",
  minute:"2-digit"
 }),

 score:item.dangerPercent

}));
  return (


<ResponsiveContainer
 width="100%"
 height={300}
>

<LineChart data={chartData}>


<XAxis dataKey="time"/>


<YAxis
 domain={[0,1]}
/>


<Tooltip/>


<Line
 type="monotone"
 dataKey="score"
/>


</LineChart>

</ResponsiveContainer>
  )
}
