import { useEffect, useState } from "react";

import { groupApi } from "../api/groupApi";

import type {
  AvailableStatus,
} from "../types/groupType";

interface Props {
  assignmentId: string;
  currentStatus: string;
  onUpdated?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Đã giao",
  ACKNOWLEDGED: "Đã nhận",
  MOVING: "Đang di chuyển",
  ARRIVED: "Đã tới nơi",
  RESCUING: "Đang cứu hộ",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
};

export default function AssignmentStatusSelect({
  assignmentId,
  currentStatus,
  onUpdated,
}: Props) {

  const [statuses, setStatuses] =
    useState<AvailableStatus[]>([]);

  const [selected, setSelected] =
    useState(currentStatus);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    setSelected(currentStatus);

  }, [currentStatus]);

  useEffect(() => {

    fetchStatuses();

  }, [assignmentId]);

  const fetchStatuses = async () => {

    try {

      const data =
        await groupApi.getAvailableStatuses(
          assignmentId
        );

      console.log(
        "AVAILABLE STATUSES:",
        data
      );

      setStatuses(data ?? []);

    } catch (err) {

      console.error(
        "FETCH STATUS ERROR:",
        err
      );
    }
  };

  const handleChange = async (
    value: string
  ) => {

    if (!value || value === selected) {
      return;
    }

    try {

      setLoading(true);

      await groupApi.updateStatus(
        assignmentId,
        value
      );

      setSelected(value);

      await fetchStatuses();

      onUpdated?.();

    } catch (err) {

      console.error(
        "UPDATE STATUS ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">

      <label
        className="
        text-sm
        font-medium
        text-slate-600
        "
      >
        Cập nhật trạng thái
      </label>

      <select
        value=""
        disabled={
          loading || statuses.length === 0
        }
        onChange={(e) =>
          handleChange(e.target.value)
        }
        className="
        w-full
        border
        border-slate-200
        rounded-xl
        px-3
        py-2.5
        text-sm
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        disabled:opacity-60
        "
      >

        {/* CURRENT STATUS */}
        <option value="" disabled>

          Hiện tại:
          {" "}
          {STATUS_LABELS[selected]
            || selected}

        </option>

        {/* AVAILABLE STATUS */}
        {statuses.map((status) => (

          <option
            key={status.code}
            value={status.code}
          >

            {status.name}

          </option>

        ))}

      </select>

      {/* EMPTY */}
      {!loading &&
        statuses.length === 0 && (

        <p className="text-xs text-slate-400">

          Không có trạng thái khả dụng

        </p>

      )}

    </div>
  );
}