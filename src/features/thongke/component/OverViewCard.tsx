import {
  LifeBuoy,
  CalendarDays,
  Clock3,
  UsersRound,
  RefreshCw,
  CircleCheck,
  CircleX,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type OverviewCardProps = {
  title: string;
  value?: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  valueColor: string;
};

const OverviewCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  valueColor,
}: OverviewCardProps) => {
  return (
    <div className="group flex min-h-[96px] items-center rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]">
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon
          className={`h-5 w-5 ${iconColor}`}
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}
      <div className="ml-2 min-w-0">
        <p className="truncate text-[11px] font-medium text-slate-500">
          {title}
        </p>

        <p
          className={`mt-1 text-[22px] font-semibold leading-none ${valueColor}`}
        >
          {value ?? "--"}
        </p>

        {description && (
          <p className="mt-1.5 truncate text-[10px] text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

type OverviewCardsProps = {
  totalSos?: number | string;
  todaySos?: number | string;
  pendingSos?: number | string;
  assignedSos?: number | string;
  processingSos?: number | string;
  completedSos?: number | string;
  cancelledSos?: number | string;
};

export const OverviewCards = ({
  totalSos,
  todaySos,
  pendingSos,
  assignedSos,
  processingSos,
  completedSos,
  cancelledSos,
}: OverviewCardsProps) => {
  return (
    <section className="w-full">
      {/* Section title */}
      <div className="mb-3 flex items-center gap-1">
        <LifeBuoy
          className="h-4 w-4 text-blue-600"
          strokeWidth={2}
        />

        <h2 className="text-[12px] font-semibold uppercase tracking-wide text-slate-700">
          Tổng quan hệ thống
        </h2>
      </div>

      {/* 7 cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {/* 1. Tổng SOS */}
        <OverviewCard
          title="Tổng SOS"
          value={totalSos}
          description="Tổng số yêu cầu cứu hộ"
          icon={LifeBuoy}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          valueColor="text-blue-600"
        />

        {/* 2. SOS hôm nay */}
        <OverviewCard
          title="SOS hôm nay"
          value={todaySos}
          description="Số yêu cầu hôm nay"
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          valueColor="text-blue-600"
        />

        {/* 3. Chờ xử lý */}
        <OverviewCard
          title="Chờ xử lý"
          value={pendingSos}
          description="SOS đang chờ xử lý"
          icon={Clock3}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
          valueColor="text-amber-500"
        />

        {/* 4. Đã phân công */}
        <OverviewCard
          title="Đã phân công"
          value={assignedSos}
          description="SOS đã được phân công"
          icon={UsersRound}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          valueColor="text-purple-600"
        />

        {/* 5. Đang xử lý */}
        <OverviewCard
          title="Đang xử lý"
          value={processingSos}
          description="SOS đang được xử lý"
          icon={RefreshCw}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          valueColor="text-blue-600"
        />

        {/* 6. Hoàn thành */}
        <OverviewCard
          title="Hoàn thành"
          value={completedSos}
          description="SOS đã hoàn thành"
          icon={CircleCheck}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          valueColor="text-green-600"
        />

        {/* 7. Đã hủy */}
        <OverviewCard
          title="Đã hủy"
          value={cancelledSos}
          description="SOS đã bị hủy"
          icon={CircleX}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          valueColor="text-red-500"
        />
      </div>
    </section>
  );
};