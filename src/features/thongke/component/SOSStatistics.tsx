import {
  CalendarDays,
  CheckCircle2,
  CircleX,
  Clock3,
  LifeBuoy,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================================================
   TYPES
========================================================= */

export type SOSChartItem = {
  date: string;
  totalSos?: number;
};

type SOSStatisticsProps = {
  totalSos?: number | string;
  completedSos?: number | string;
  processingSos?: number | string;
  cancelledSos?: number | string;

  chartData?: SOSChartItem[];

  fromDate?: string;
  toDate?: string;

  onFromDateChange?: (date: string) => void;
  onToDateChange?: (date: string) => void;
  onApply?: () => void;
};


/* =========================================================
   STAT CARD
========================================================= */

type SOSStatCardProps = {
  title: string;
  value?: number | string;
  icon: React.ReactNode;
  valueColor: string;
  iconColor: string;
  iconBg: string;
};

const SOSStatCard = ({
  title,
  value,
  icon,
  valueColor,
  iconColor,
  iconBg,
}: SOSStatCardProps) => {
  return (
    <div
      className={`flex h-[52px] flex-col justify-center rounded-lg border px-3 ${iconBg}`}
    >
      <div className="flex items-center gap-2">
        <div className={iconColor}>{icon}</div>

        <span
          className={`text-[17px] font-semibold leading-none ${valueColor}`}
        >
          {value ?? "--"}
        </span>
      </div>

      <span className="mt-1 text-[8px] text-slate-500">
        {title}
      </span>
    </div>
  );
};


/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
  }>;
  label?: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-[9px] font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-semibold text-blue-600">
        {payload[0]?.value ?? 0} SOS
      </p>
    </div>
  );
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export const SOSStatistics = ({
  totalSos,
  completedSos,
  processingSos,
  cancelledSos,

  chartData = [],

  fromDate,
  toDate,

  onFromDateChange,
  onToDateChange,
  onApply,
}: SOSStatisticsProps) => {
  return (
    <section className="w-full rounded-xl border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Title */}
        <div className="flex items-center gap-2">
          <LifeBuoy
            className="h-3.5 w-3.5 text-red-500"
            strokeWidth={2}
          />

          <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Thống kê yêu cầu cứu hộ (SOS)
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">

          {/* Từ ngày */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-slate-400">
              Từ ngày
            </span>

            <div className="relative">
              <input
                type="date"
                value={fromDate ?? ""}
                onChange={(e) =>
                  onFromDateChange?.(e.target.value)
                }
                className="h-7 w-[108px] rounded-md border border-slate-200 bg-white px-2 pr-7 text-[8px] text-slate-600 outline-none transition focus:border-blue-400"
              />

              <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Đến ngày */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-slate-400">
              Đến ngày
            </span>

            <div className="relative">
              <input
                type="date"
                value={toDate ?? ""}
                onChange={(e) =>
                  onToDateChange?.(e.target.value)
                }
                className="h-7 w-[108px] rounded-md border border-slate-200 bg-white px-2 pr-7 text-[8px] text-slate-600 outline-none transition focus:border-blue-400"
              />

              <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Apply */}
          <button
            type="button"
            onClick={onApply}
            className="h-7 rounded-md bg-blue-600 px-4 text-[8px] font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Áp dụng
          </button>
        </div>
      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[165px_1fr]">

        {/* ===================================================
            LEFT - 4 STAT CARDS
        =================================================== */}

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">

          {/* Tổng SOS */}
          <SOSStatCard
            title="Tổng SOS"
            value={totalSos}
            icon={
              <LifeBuoy
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            }
            valueColor="text-blue-600"
            iconColor="text-blue-500"
            iconBg="border-blue-100 bg-blue-50/30"
          />

          {/* Hoàn thành */}
          <SOSStatCard
            title="Hoàn thành"
            value={completedSos}
            icon={
              <CheckCircle2
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            }
            valueColor="text-green-600"
            iconColor="text-green-500"
            iconBg="border-green-100 bg-green-50/30"
          />

          {/* Đang xử lý */}
          <SOSStatCard
            title="Đang xử lý"
            value={processingSos}
            icon={
              <Clock3
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            }
            valueColor="text-orange-500"
            iconColor="text-orange-500"
            iconBg="border-orange-100 bg-orange-50/30"
          />

          {/* Đã hủy */}
          <SOSStatCard
            title="Đã hủy"
            value={cancelledSos}
            icon={
              <CircleX
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            }
            valueColor="text-red-500"
            iconColor="text-red-500"
            iconBg="border-red-100 bg-red-50/30"
          />
        </div>


        {/* ===================================================
            RIGHT - CHART
        =================================================== */}

        <div className="min-w-0">

          <h3 className="mb-1 text-[9px] font-semibold text-slate-600">
            SỐ LƯỢNG YÊU CẦU CỨU HỘ THEO NGÀY
          </h3>

          <div className="h-[125px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 8,
                    right: 10,
                    left: -18,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 7,
                      fill: "#94a3b8",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (!value) return "";

                      const parts = String(value).split("-");

                      if (parts.length >= 3) {
                        return `${parts[2]}/${parts[1]}`;
                      }

                      return value;
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 7,
                      fill: "#94a3b8",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={25}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Line
                    type="monotone"
                    dataKey="totalSos"
                    stroke="#2563eb"
                    strokeWidth={1.5}
                    dot={{
                      r: 2.5,
                      fill: "#2563eb",
                      stroke: "#ffffff",
                      strokeWidth: 1,
                    }}
                    activeDot={{
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200">
                <span className="text-[9px] text-slate-400">
                  Chưa có dữ liệu
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};