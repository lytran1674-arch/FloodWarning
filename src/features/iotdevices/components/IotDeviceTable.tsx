import { Table } from "../../../components/ui/Table";
import { usePagination } from "../../../hooks/usePagination";
import type { IotDevice } from "../types/iotdeviceType";

interface Props {
  data?: IotDevice[];
  onRowClick?: (iotdevice: IotDevice) => void;
  onApprove?: (iotdevice: IotDevice) => void;
  onReject?: (iotdevice: IotDevice) => void;
}

export const IotDeviceTable = ({
  data = [],
  onRowClick,
  onApprove,
  onReject,
}: Props) => {
  const safeData = Array.isArray(data) ? data : [];

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);

  // const formatDate = (date?: string | null) => {
  //   if (!date) return "--";

  //   return new Date(date).toLocaleString("vi-VN", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });
  // };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const columns = [
    {
      title: "MAC Address",
      key: "device_code" as keyof IotDevice,
      render: (item: IotDevice) => item.device_code || "--",
    },
    {
      title: "Tên thiết bị",
      key: "ten_thietbi" as keyof IotDevice,
      render: (item: IotDevice) => item.ten_thietbi || "--",
    },
    {
      title: "Khu vực",
      key: "tenkhuvuc" as keyof IotDevice,
      render: (item: IotDevice) => item.tenkhuvuc || "--",
    },
    {
      title: "Trạng thái",
      key: "trang_thai" as keyof IotDevice,
      render: (item: IotDevice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            item.trang_thai
          )}`}
        >
          {item.trang_thai || "--"}
        </span>
      ),
    },
    {
      title: "Ngưỡng cảnh báo",
      key: "nguong_canh_bao" as keyof IotDevice,
      render: (item: IotDevice) =>
        item.nguong_canh_bao != null ? `${item.nguong_canh_bao} cm` : "--",
    },
    {
      title: "Đăng ký lúc",
      key: "createdAt" as keyof IotDevice,
      render: (item: IotDevice) => item.createdAt,
    },
    {
      title: "Thao tác",
      key: "id" as keyof IotDevice,
      render: (item: IotDevice) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(item);
            }}
            disabled={item.trang_thai === "ACTIVE"}
            className="px-3 py-1 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Phê duyệt
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(item);
            }}
            disabled={item.trang_thai === "ACTIVE"}
            className="px-3 py-1 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Từ chối
          </button>
        </div>
      ),
    },
  ];

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p) => {
      const last = acc[acc.length - 1];

      if (typeof last === "number" && p - last > 1) {
        acc.push("...");
      }

      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Table<IotDevice>
        columns={columns}
        data={paginated}
        onRowClick={onRowClick}
      />

      <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
        <span className="text-xs text-slate-400">
          {safeData.length === 0
            ? "Không có dữ liệu"
            : `${(page - 1) * 5 + 1}–${Math.min(
                page * 5,
                safeData.length
              )} / ${safeData.length} bản ghi`}
        </span>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-7 h-7 rounded border text-sm disabled:opacity-30 hover:bg-slate-100 transition-colors"
          >
            ‹
          </button>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span
                key={`dot-${i}`}
                className="w-7 h-7 flex items-center justify-center text-slate-400 text-sm"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded border text-sm transition-colors ${
                  page === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="w-7 h-7 rounded border text-sm disabled:opacity-30 hover:bg-slate-100 transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};