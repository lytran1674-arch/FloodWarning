import { useState, useEffect } from "react";
import { Table } from "../../../components/ui/Table";
import { usePagination } from "../../../hooks/usePagination";
import { useIotDevice } from "../hooks/useIotDevice";
import type { Device } from "../types/deviceType";
import {
  X,
  Cpu,
  MapPin,
  Clock3,
  Activity,
  Wifi,
  Pencil,
} from "lucide-react";

interface Props {
  data?: Device[];
  onRowClick?: (Device: Device) => void;
  onApprove?: (Device: Device) => void;
  onReject?: (Device: Device) => void;
  onUpdate?: (Device: Device) => void;
}

export const DeviceTable = ({
  data = [],
  onRowClick,
  onApprove,
  onReject,
  onUpdate,
}: Props) => {
  const safeData = Array.isArray(data) ? data : [];
  const { detailIot, DetailIotDevice, updateIoTDevice } = useIotDevice();

  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    ten_thietbi: "",
    nguong_canh_bao: "",
  });

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);

  // Đồng bộ dữ liệu form mỗi khi mở chế độ sửa
  useEffect(() => {
    if (detailIot && isEditMode) {
      setFormData({
        ten_thietbi: detailIot.ten_thietbi ?? "",
        nguong_canh_bao: detailIot.nguong_canh_bao?.toString() ?? "",
      });
      setFormError("");
    }
  }, [detailIot, isEditMode]);

  // Mở modal xem chi tiết (chế độ đọc)
  const handleRowClick = async (device: Device) => {
    try {
      await DetailIotDevice(device.id);
      setIsEditMode(false);
      setOpen(true);
      onRowClick?.(device);
    } catch (error) {
      console.error(error);
    }
  };

  // Mở modal ở chế độ sửa
  const handleUpdateClick = async (device: Device) => {
    try {
      await DetailIotDevice(device.id);
      setIsEditMode(true);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

 const handleSave = async () => {
  if (!detailIot) return;

  if (!formData.ten_thietbi.trim()) {
    setFormError("Tên thiết bị không được để trống");
    return;
  }

  const nguongValue = Number(formData.nguong_canh_bao);
  if (isNaN(nguongValue) || nguongValue <= 0) {
    setFormError("Ngưỡng cảnh báo phải là số dương");
    return;
  }

  setSaving(true);
  setFormError("");
  try {
    const updated = await updateIoTDevice(detailIot.id, {
      tenThietBi: formData.ten_thietbi.trim(),
      nguongCanhBao: nguongValue,
      lat: detailIot.lat,
      lon: detailIot.lon,
    });
    setIsEditMode(false);
    setOpen(false);
    onUpdate?.(updated);
  } catch (error) {
    console.error(error);
    setFormError("Cập nhật thất bại, vui lòng thử lại");
  } finally {
    setSaving(false);
  }
};

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setOpen(false);
  };

  // Format ngày an toàn, tránh crash khi date null/undefined/không hợp lệ
  const formatDate = (date?: string | null) => {
    if (!date) return "--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--";

    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const getStatusBadgeDot = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "ONLINE";
      case "PENDING":
        return "PENDING";
      case "REJECTED":
        return "REJECTED";
      default:
        return status || "--";
    }
  };

  const Item = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-none">
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-700 mt-0.5 break-all text-sm">
          {value}
        </p>
      </div>
    </div>
  );

  const EditableItem = ({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: "text" | "number";
  }) => (
    <div className="py-2 border-b last:border-none">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const columns = [
    {
      title: "MAC Address",
      key: "device_code" as keyof Device,
      render: (item: Device) => item.device_code || "--",
    },
    {
      title: "Tên thiết bị",
      key: "ten_thietbi" as keyof Device,
      render: (item: Device) => item.ten_thietbi || "--",
    },
    {
      title: "Khu vực",
      key: "tenkhuvuc" as keyof Device,
      render: (item: Device) => item.tenkhuvuc || "--",
    },
    {
      title: "Trạng thái",
      key: "trang_thai" as keyof Device,
      render: (item: Device) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
            item.trang_thai
          )}`}
        >
          {item.trang_thai || "--"}
        </span>
      ),
    },
    {
      title: "Ngưỡng cảnh báo",
      key: "nguong_canh_bao" as keyof Device,
      render: (item: Device) =>
        item.nguong_canh_bao != null ? `${item.nguong_canh_bao} cm` : "--",
    },
    {
      title: "Đăng ký lúc",
      key: "createdAt" as keyof Device,
      render: (item: Device) => (
        <span className="whitespace-nowrap">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "id" as keyof Device,
      render: (item: Device) => (
        <div className="flex flex-wrap gap-2">
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateClick(item);
            }}
            className="px-3 py-1 rounded-lg text-xs bg-slate-600 text-white hover:bg-slate-700 transition-colors"
          >
            Cập nhật
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
      <div className="overflow-x-auto">
        <Table<Device>
          columns={columns}
          data={paginated}
          onRowClick={handleRowClick}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 border-t mt-2">
        <span className="text-xs text-slate-400 order-2 sm:order-1">
          {safeData.length === 0
            ? "Không có dữ liệu"
            : `${(page - 1) * 5 + 1}–${Math.min(
                page * 5,
                safeData.length
              )} / ${safeData.length} bản ghi`}
        </span>

        <div className="flex flex-wrap justify-center gap-1 order-1 sm:order-2">
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

      {open && detailIot && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="relative overflow-hidden border-b">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-60" />

              <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 relative">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg">
                    <Cpu size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-800">
                        {isEditMode ? "Chỉnh sửa thiết bị" : "Chi tiết thiết bị"}
                      </h2>

                      <span
                        className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusStyle(
                          detailIot.trang_thai
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusBadgeDot(
                            detailIot.trang_thai
                          )}`}
                        />
                        {getStatusLabel(detailIot.trang_thai)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-slate-500 text-xs sm:text-sm">
                      {isEditMode
                        ? "Chỉnh sửa thông tin thiết bị IoT"
                        : "Thông tin chi tiết và trạng thái hiện tại của thiết bị IoT"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => (isEditMode ? handleCancelEdit() : setOpen(false))}
                  className="shrink-0 rounded-full p-1.5 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 p-4 sm:p-5">
              {/* Row 1 */}
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                {/* Card trạng thái */}
                <div
                  className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white shadow-lg ${
                    detailIot.trang_thai === "ACTIVE"
                      ? "bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400"
                      : detailIot.trang_thai === "PENDING"
                      ? "bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-400"
                      : detailIot.trang_thai === "REJECTED"
                      ? "bg-gradient-to-br from-red-600 via-rose-500 to-red-400"
                      : "bg-gradient-to-br from-slate-500 via-slate-400 to-slate-300"
                  }`}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                  <div className="absolute -right-4 bottom-4 h-16 w-16 rounded-full border border-white/20" />

                  <div className="relative flex h-full flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-white/80">
                          Trạng thái thiết bị
                        </p>

                        <div className="mt-1.5 flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${getStatusBadgeDot(
                              detailIot.trang_thai
                            )} ${
                              detailIot.trang_thai === "ACTIVE" ? "animate-pulse" : ""
                            }`}
                          />
                          <h3 className="text-xl sm:text-2xl font-bold">
                            {detailIot.trang_thai}
                          </h3>
                        </div>
                      </div>

                      <div className="rounded-full bg-white/15 p-2.5 backdrop-blur">
                        <Wifi size={22} />
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="shrink-0" />
                        <span className="font-medium text-xs sm:text-sm">
                          {detailIot.trang_thai === "ACTIVE"
                            ? "Thiết bị đang hoạt động bình thường"
                            : detailIot.trang_thai === "PENDING"
                            ? "Thiết bị đang chờ phê duyệt"
                            : detailIot.trang_thai === "REJECTED"
                            ? "Thiết bị đã bị từ chối"
                            : "Không xác định trạng thái"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card định danh */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <Cpu className="text-blue-600 w-4 h-4" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold">
                        Thông tin định danh
                      </h3>
                    </div>

                    {!isEditMode && (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Pencil size={14} />
                        Sửa
                      </button>
                    )}
                  </div>

                  <Item label="ID thiết bị" value={detailIot.id} />
                  <Item label="Mã thiết bị (MAC)" value={detailIot.device_code} />

                  {isEditMode ? (
                    <EditableItem
                      label="Tên thiết bị"
                      value={formData.ten_thietbi}
                      onChange={(v) =>
                        setFormData((f) => ({ ...f, ten_thietbi: v }))
                      }
                    />
                  ) : (
                    <Item label="Tên thiết bị" value={detailIot.ten_thietbi} />
                  )}
                </div>
              </div>

              {/* Card khu vực */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <MapPin className="text-blue-600 w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold">
                    Thông tin khu vực
                  </h3>
                </div>

                <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                  <div>
                    <Item label="ID khu vực" value={detailIot.area_id} />
                    <Item label="Tên khu vực" value={detailIot.tenkhuvuc} />
                  </div>

                  <div>
                    {isEditMode ? (
                      <EditableItem
                        label="Ngưỡng cảnh báo (m)"
                        value={formData.nguong_canh_bao}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, nguong_canh_bao: v }))
                        }
                        type="number"
                      />
                    ) : (
                      <div className="flex items-center justify-between border-b py-2">
                        <div>
                          <p className="text-xs text-slate-500">
                            Ngưỡng cảnh báo
                          </p>
                          <p className="mt-0.5 text-lg sm:text-xl font-bold text-blue-600">
                            {detailIot.nguong_canh_bao} m
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-xs text-slate-500">Trạng thái</p>
                        <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 text-xs">
                          {detailIot.trang_thai}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card thời gian & vị trí */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Clock3 className="text-blue-600 w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold">
                    Thông tin thời gian & vị trí
                  </h3>
                </div>

                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3 border">
                    <p className="text-xs text-slate-500">Vĩ độ</p>
                    <p className="mt-1 text-sm font-semibold break-all">
                      {detailIot.lat}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border">
                    <p className="text-xs text-slate-500">Kinh độ</p>
                    <p className="mt-1 text-sm font-semibold break-all">
                      {detailIot.lon}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border">
                    <p className="text-xs text-slate-500">Ngày tạo</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatDate(detailIot.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border">
                    <p className="text-xs text-slate-500">Cập nhật cuối</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatDate(detailIot.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-2 border-t pt-3">
                {formError && (
                  <p className="text-xs text-red-600 text-right">{formError}</p>
                )}
                <div className="flex justify-end gap-2">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 text-sm text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
                      >
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 text-sm text-white font-semibold shadow-md hover:shadow-lg transition"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};