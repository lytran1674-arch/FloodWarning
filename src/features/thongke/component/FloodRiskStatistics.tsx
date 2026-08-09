import {
  CalendarDays,
  ChevronDown,
  Info,
  ShieldAlert,
} from "lucide-react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* =========================================================
   TYPES
========================================================= */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type AIRiskSummary = {
  totalAreas?: number;
  lowRiskAreas?: number;
  mediumRiskAreas?: number;
  highRiskAreas?: number;
};

export type AITopRiskArea = {
  areaName: string;
  probability?: number;
};

export type AIoTRiskArea = {
  areaName: string;
  riskLevel?: RiskLevel;
  probability?: number;
  iotExceededRate?: number;
  waterRiseSpeed?: number;
};

export type AIoTSummary = {
  totalAreas?: number;
  lowRiskAreas?: number;
  mediumRiskAreas?: number;
  highRiskAreas?: number;
};

type FloodRiskStatisticsProps = {
  // ================= AI =================
  aiSummary?: AIRiskSummary;

  aiTopRiskAreas?: AITopRiskArea[];

  aiDate?: string;
  aiJobType?: string;

  onDateChange?: (date: string) => void;
  onJobTypeChange?: (jobType: string) => void;

  // ================= AI + IOT =================
  aiotSummary?: AIoTSummary;

  aiotTopRiskAreas?: AIoTRiskArea[];
};


/* =========================================================
   COMMON KPI CARD
========================================================= */

type RiskCardProps = {
  value?: number | string;
  title: string;
  level: RiskLevel | "TOTAL";
};

const RiskCard = ({
  value,
  title,
  level,
}: RiskCardProps) => {
  const config = {
    TOTAL: {
      valueColor: "text-blue-600",
      bg: "bg-blue-50/40",
    },

    LOW: {
      valueColor: "text-green-600",
      bg: "bg-green-50/40",
    },

    MEDIUM: {
      valueColor: "text-orange-500",
      bg: "bg-orange-50/40",
    },

    HIGH: {
      valueColor: "text-red-500",
      bg: "bg-red-50/40",
    },
  };

  const current = config[level];

  return (
    <div
      className={`flex h-[58px] flex-col items-center justify-center rounded-lg border border-slate-100 ${current.bg}`}
    >
      <span
        className={`text-[17px] font-semibold leading-none ${current.valueColor}`}
      >
        {value ?? "--"}
      </span>

      <span className="mt-1 text-[8px] leading-none text-slate-500">
        {title}
      </span>

      {level !== "TOTAL" && (
        <span
          className={`mt-1 text-[7px] font-medium ${current.valueColor}`}
        >
          ({level})
        </span>
      )}
    </div>
  );
};


/* =========================================================
   AI RISK DISTRIBUTION
========================================================= */

type AIRiskDistributionProps = {
  summary?: AIRiskSummary;
};

const AIRiskDistribution = ({
  summary,
}: AIRiskDistributionProps) => {
  const total = summary?.totalAreas ?? 0;

  const data = [
    {
      name: "LOW",
      value: summary?.lowRiskAreas ?? 0,
      color: "#4CAF50",
    },
    {
      name: "MEDIUM",
      value: summary?.mediumRiskAreas ?? 0,
      color: "#FFC107",
    },
    {
      name: "HIGH",
      value: summary?.highRiskAreas ?? 0,
      color: "#EF4444",
    },
  ];

  const getPercent = (value: number) => {
    if (!total) return "0.0";

    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="h-full rounded-lg border border-slate-100 bg-white p-3">
      <h3 className="text-[10px] font-semibold text-slate-700">
        Phân bố nguy cơ
      </h3>

      <div className="mt-2 flex items-center gap-3">
        {/* Donut */}
        <div className="h-[105px] w-[105px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={47}
                paddingAngle={1}
                strokeWidth={1}
                stroke="#fff"
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  value,
                  "Khu vực",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center information */}
        <div className="flex-1">
          <p className="text-center text-[17px] font-semibold text-slate-700">
            {summary?.totalAreas ?? "--"}
          </p>

          <p className="text-center text-[8px] text-slate-400">
            Tổng khu vực
          </p>

          <div className="mt-2 space-y-1.5">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-1.5"
              >
                <span
                  className="mt-[2px] h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <div className="min-w-0">
                  <p className="text-[8px] font-medium text-slate-600">
                    {item.name} ({getPercent(item.value)}%)
                  </p>

                  <p className="text-[7px] text-slate-400">
                    {item.value.toLocaleString()} khu vực
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================
   AI TOP 10
========================================================= */

type AITopRiskTableProps = {
  data?: AITopRiskArea[];
};

const AITopRiskTable = ({
  data = [],
}: AITopRiskTableProps) => {
  return (
    <div className="h-full rounded-lg border border-slate-100 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold text-slate-700">
          Top 10 khu vực nguy cơ cao nhất
        </h3>

        <span className="text-[8px] text-slate-400">
          Xác suất dự báo
        </span>
      </div>

      <div className="mt-2">
        {/* Header */}
        <div className="grid grid-cols-[28px_1fr_110px_40px] items-center border-b border-slate-100 pb-1 text-[7px] text-slate-400">
          <span>#</span>
          <span>Khu vực</span>
          <span></span>
          <span className="text-right">%</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {data.slice(0, 10).map((item, index) => {
            const probability = item.probability ?? 0;

            return (
              <div
                key={`${item.areaName}-${index}`}
                className="grid h-[25px] grid-cols-[28px_1fr_110px_40px] items-center"
              >
                <span className="text-[7px] text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="truncate text-[8px] text-slate-600">
                  {item.areaName}
                </span>

                <div className="px-2">
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${Math.min(
                          probability,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="text-right text-[7px] text-slate-500">
                  {item.probability !== undefined
                    ? `${item.probability}%`
                    : "--"}
                </span>
              </div>
            );
          })}

          {data.length === 0 && (
            <div className="flex h-[125px] items-center justify-center">
              <span className="text-[9px] text-slate-400">
                Chưa có dữ liệu
              </span>
            </div>
          )}
        </div>

        {data.length > 0 && (
          <div className="mt-1 text-right">
            <button
              type="button"
              className="text-[8px] font-medium text-blue-500 hover:text-blue-600"
            >
              Xem tất cả →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


/* =========================================================
   AI + IOT TOP 10
========================================================= */

type AIoTTableProps = {
  data?: AIoTRiskArea[];
};

const AIoTTable = ({
  data = [],
}: AIoTTableProps) => {
  const getRiskClass = (level?: RiskLevel) => {
    switch (level) {
      case "LOW":
        return "bg-green-50 text-green-600";

      case "HIGH":
        return "bg-red-50 text-red-500";

      default:
        return "bg-orange-50 text-orange-500";
    }
  };

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <h3 className="text-[10px] font-semibold text-slate-700">
        Top 10 khu vực nguy cơ cao nhất
      </h3>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[440px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="w-[28px] pb-2 text-[7px] font-medium text-slate-400">
                #
              </th>

              <th className="pb-2 text-[7px] font-medium text-slate-400">
                Khu vực
              </th>

              <th className="pb-2 text-center text-[7px] font-medium text-slate-400">
                Mức nguy cơ
              </th>

              <th className="pb-2 text-center text-[7px] font-medium text-slate-400">
                Xác suất AI (%)
              </th>

              <th className="pb-2 text-center text-[7px] font-medium text-slate-400">
                IoT vượt ngưỡng (%)
              </th>

              <th className="pb-2 text-center text-[7px] font-medium text-slate-400">
                Tốc độ tăng
                <br />
                (cm/phút)
              </th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <tr
                key={`${item.areaName}-${index}`}
                className="border-b border-slate-50"
              >
                <td className="py-2 text-[7px] text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </td>

                <td className="max-w-[130px] truncate py-2 text-[8px] text-slate-600">
                  {item.areaName}
                </td>

                <td className="py-2 text-center">
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-[7px] font-medium ${getRiskClass(
                      item.riskLevel
                    )}`}
                  >
                    {item.riskLevel ?? "--"}
                  </span>
                </td>

                <td className="py-2 text-center text-[7px] text-slate-500">
                  {item.probability !== undefined
                    ? `${item.probability}%`
                    : "--"}
                </td>

                <td className="py-2 text-center text-[7px] text-slate-500">
                  {item.iotExceededRate !== undefined
                    ? `${item.iotExceededRate}%`
                    : "--"}
                </td>

                <td className="py-2 text-center text-[7px] text-slate-500">
                  {item.waterRiseSpeed !== undefined
                    ? item.waterRiseSpeed
                    : "--"}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="h-[100px] text-center text-[9px] text-slate-400"
                >
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export const FloodRiskStatistics = ({
  aiSummary,
  aiTopRiskAreas = [],
  aiDate,
  aiJobType,
  onDateChange,
  onJobTypeChange,
  aiotSummary,
  aiotTopRiskAreas = [],
}: FloodRiskStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">

      {/* =====================================================
          LEFT: AI
      ===================================================== */}
      <section className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">

          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />

            <h2 className="text-[10px] font-semibold uppercase text-slate-700">
              Dự báo lũ bằng AI
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5">

            {/* Date */}
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={aiDate ?? ""}
                onChange={(e) =>
                  onDateChange?.(e.target.value)
                }
                className="h-7 w-[105px] rounded border border-slate-200 bg-white pl-7 pr-1 text-[8px] text-slate-600 outline-none focus:border-blue-400"
              />
            </div>

            {/* Job type */}
            <div className="relative">
              <select
                value={aiJobType ?? ""}
                onChange={(e) =>
                  onJobTypeChange?.(e.target.value)
                }
                className="h-7 min-w-[105px] appearance-none rounded border border-slate-200 bg-white pl-2 pr-6 text-[8px] text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="">
                  Chọn phiên
                </option>

                <option value="MORNING">
                  Sáng (MORNING)
                </option>

                <option value="EVENING">
                  Tối (EVENING)
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="mt-3 grid grid-cols-3 gap-2">

          <RiskCard
            value={aiSummary?.totalAreas}
            title="Tổng khu vực dự báo"
            level="TOTAL"
          />

          <RiskCard
            value={aiSummary?.lowRiskAreas}
            title="Khu vực nguy cơ thấp"
            level="LOW"
          />

          <RiskCard
            value={aiSummary?.mediumRiskAreas}
            title="Khu vực nguy cơ trung bình"
            level="MEDIUM"
          />

          <RiskCard
            value={aiSummary?.highRiskAreas}
            title="Khu vực nguy cơ cao"
            level="HIGH"
          />
        </div>

        {/* Chart + Top */}
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">

          <AIRiskDistribution
            summary={aiSummary}
          />

          <AITopRiskTable
            data={aiTopRiskAreas}
          />

        </div>
      </section>


      {/* =====================================================
          RIGHT: AI + IOT
      ===================================================== */}
      <section className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-green-600" />

            <h2 className="text-[10px] font-semibold uppercase text-slate-700">
              Nguy cơ lũ hiện tại (AI + IoT)
            </h2>
          </div>

          <span className="flex items-center gap-1 text-[7px] text-slate-400">
            <Info className="h-2.5 w-2.5" />
            Dữ liệu mới nhất từ cảm biến IoT
          </span>
        </div>

        {/* KPI */}
        <div className="mt-3 grid grid-cols-4 gap-2">

          <RiskCard
            value={aiotSummary?.totalAreas}
            title="Khu vực có dữ liệu AI + IoT"
            level="TOTAL"
          />

          <RiskCard
            value={aiotSummary?.lowRiskAreas}
            title="Nguy cơ thấp"
            level="LOW"
          />

          <RiskCard
            value={aiotSummary?.mediumRiskAreas}
            title="Nguy cơ trung bình"
            level="MEDIUM"
          />

          <RiskCard
            value={aiotSummary?.highRiskAreas}
            title="Nguy cơ cao"
            level="HIGH"
          />
        </div>

        {/* Table */}
        <div className="mt-2">
          <AIoTTable
            data={aiotTopRiskAreas}
          />
        </div>

        {/* Information */}
        <div className="mt-2 flex gap-2 rounded-lg border border-blue-100 bg-blue-50/50 p-2.5">

          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />

          <p className="text-[8px] leading-relaxed text-slate-500">
            AI + IoT kết hợp dữ liệu dự báo AI và dữ liệu
            cảm biến thực tế để đánh giá nguy cơ hiện tại.
            Chỉ hiển thị các khu vực có dữ liệu tích hợp
            từ AI và thiết bị IoT.
          </p>
        </div>
      </section>
    </div>
  );
};