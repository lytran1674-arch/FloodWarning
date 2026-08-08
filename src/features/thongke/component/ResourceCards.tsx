import {
  ShieldCheck,
  UsersRound,
  UserRound,
  RadioTower,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type ResourceCardProps = {
  title: string;
  value?: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

const ResourceCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: ResourceCardProps) => {
  return (
    <div className="flex h-[54px] items-center rounded-lg border border-slate-100 bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-sm">
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon
          className={`h-[18px] w-[18px] ${iconColor}`}
          strokeWidth={1.8}
        />
      </div>

      {/* Nội dung */}
      <div className="ml-3 flex min-w-0 flex-col justify-center">
        <span className="text-[10px] font-medium leading-none text-slate-500">
          {title}
        </span>

        <span
          className={`mt-1 text-[19px] font-semibold leading-none ${iconColor}`}
        >
          {value ?? "--"}
        </span>
      </div>
    </div>
  );
};

type ResourceCardsProps = {
  totalTeams?: number | string;
  totalGroups?: number | string;
  totalMembers?: number | string;
  totalDevices?: number | string;
};

export const ResourceCards = ({
  totalTeams,
  totalGroups,
  totalMembers,
  totalDevices,
}: ResourceCardsProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-3">
      <ResourceCard
        title="Đội cứu hộ"
        value={totalTeams}
        icon={ShieldCheck}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />

      <ResourceCard
        title="Nhóm cứu hộ"
        value={totalGroups}
        icon={UsersRound}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
      />

      <ResourceCard
        title="Thành viên"
        value={totalMembers}
        icon={UserRound}
        iconColor="text-cyan-500"
        iconBg="bg-cyan-50"
      />

      <ResourceCard
        title="Thiết bị IoT"
        value={totalDevices}
        icon={RadioTower}
        iconColor="text-orange-500"
        iconBg="bg-orange-50"
      />
    </div>
  );
};