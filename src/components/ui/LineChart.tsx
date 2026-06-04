import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  type ChartData,
  type ChartOptions,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface LineChartProps {
  title?: string;
  data: ChartData<"line", number[], string>;
  options?: ChartOptions<"line">;
  className?: string;
}

export const BaseLineChart = ({
  title,
  data,
  options,
  className = "",
}: LineChartProps) => {
  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return (
    <div className={`w-full h-[350px] rounded-lg border bg-white p-4 ${className}`}>
      <Line data={data} options={options || defaultOptions} />
    </div>
  );
};

export default BaseLineChart;