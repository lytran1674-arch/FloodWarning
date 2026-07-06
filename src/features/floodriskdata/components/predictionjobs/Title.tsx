import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Input } from "@/components/ui/Input";

import { CalendarDays } from "lucide-react";
import { IoReload } from "react-icons/io5";

const predictionTypeOptions = [
  {
    label: "Tất cả dự báo",
    value: "ALL",
  },
  {
    label: "Dự báo sáng",
    value: "MORNING",
  },
  {
    label: "Dự báo chiều",
    value: "EVENING",
  },
];

const statusOptions = [
  {
    label: "Tất cả trạng thái",
    value: "ALL",
  },
  {
    label: "Thành công",
    value: "SUCCESS",
  },
  {
    label: "Một phần",
    value: "PARTIAL_SUCCESS",
  },
  {
    label: "Thất bại",
    value: "FAILED",
  },
];

interface TitleProps {
  date: string;
  jobType: string;
  status: string;

  onDateChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;

  onRefresh: () => void;
}

export const Title = ({
  date,
  jobType,
  status,
  onDateChange,
  onJobTypeChange,
  onStatusChange,
  onRefresh,
}: TitleProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div>
        <p className="text-lg font-bold text-black lg:text-2xl">
          LỊCH SỬ DỰ BÁO
        </p>

        <p className="mt-1 text-xs text-gray-500 lg:text-sm">
          Theo dõi kết quả các lần chạy dự báo và recovery dữ liệu
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:items-center">
        {/* DATE */}
        <div className="min-w-[180px]">
          <Input
            type="date"
            value={date}
            icon={CalendarDays}
          onChange={(value) => onJobTypeChange(value)}
              
            
          />
        </div>

        {/* JOB TYPE */}
        <div className="min-w-[180px]">
          <Combobox
            options={predictionTypeOptions}
            value={jobType}
            placeholder="Tất cả dự báo"
            onChange={(value) =>
              onJobTypeChange(value)
            }
          />
        </div>

        {/* STATUS */}
        <div className="min-w-[180px]">
          <Combobox
            options={statusOptions}
            value={status}
            placeholder="Tất cả trạng thái"
            onChange={(value) =>
              onStatusChange(value)
            }
          />
        </div>

        {/* REFRESH */}
        <Button
          onClick={onRefresh}
          className="flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <IoReload className="text-base" />
          Làm mới
        </Button>
      </div>
    </div>
  );
};