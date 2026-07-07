import { usePagination } from "@/hooks/usePagination";
import type { PredictionJobs } from "../../types/floodriskType"
import {
  ChevronRight,
  ChevronLeft,
  EyeIcon,
  Sun,
  Moon,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  MapPin,
  Inbox,
  X,
} from "lucide-react";

import { Table } from "@/components/ui/Table";
import { usePredictionJobs } from "../../hooks/usePredictionJobs";
import { useState } from "react";

interface Props{
  data?:PredictionJobs[]
  onRowClick?:(predictionjob:PredictionJobs)=>void;
}

// ======================================================
// SHIFT TOKENS
// Toàn bộ giao diện xoay quanh 1 sợi chỉ thị giác: chu kỳ
// sáng/tối của 2 ca dự báo mỗi ngày. Amber = ca sáng, Indigo =
// ca tối. Dùng xuyên suốt từ badge trong bảng đến header modal.
// ======================================================

const SHIFT_TOKENS: Record<
  string,
  { label: string; icon: typeof Sun; text: string; bg: string; ring: string }
> = {
  MORNING: {
    label: "Buổi sáng",
    icon: Sun,
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  EVENING: {
    label: "Buổi tối",
    icon: Moon,
    text: "text-indigo-700",
    bg: "bg-indigo-50",
    ring: "ring-indigo-200",
  },
};

// ======================================================
// STATUS TOKENS
// Icon + màu đi cùng nhau để trạng thái quét được bằng mắt
// ngay cả khi không đọc chữ (quan trọng cho màn hình vận hành).
// ======================================================

const STATUS_TOKENS: Record<
  string,
  { label: string; icon: typeof CheckCircle2; text: string; bg: string; ring: string; spin?: boolean }
> = {
  SUCCESS: {
    label: "Thành công",
    icon: CheckCircle2,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  RUNNING: {
    label: "Đang chạy",
    icon: Loader2,
    text: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    spin: true,
  },
  PARTIAL_SUCCESS: {
    label: "Hoàn thành một phần",
    icon: AlertTriangle,
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  FAILED: {
    label: "Thất bại",
    icon: XCircle,
    text: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
  },
};

// ======================================================
// HELPERS
// ======================================================

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return "--";
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return "--";

  const diffMin = Math.round((e - s) / 60000);
  if (diffMin < 60) return `${diffMin} phút`;

  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export const PredictionJobTable = ({data,onRowClick}:Props) => {
  const safeData = Array.isArray(data) ? data : [];

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);
  const {detail,getDetailPredictionJob}=usePredictionJobs()
  const [open,setOpen]=useState(false)

  const handleViewDetail = async (id: string) => {
    await getDetailPredictionJob(id);
    setOpen(true);
  };

  // ======================================================
  // BADGES
  // ======================================================

  const ShiftBadge = ({ type }: { type?: string }) => {
    const token = type ? SHIFT_TOKENS[type] : undefined;
    const Icon = token?.icon ?? Sun;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
          token
            ? `${token.bg} ${token.text} ${token.ring}`
            : "bg-slate-50 text-slate-500 ring-slate-200"
        }`}
      >
        <Icon size={13} strokeWidth={2.5} />
        {token?.label ?? type ?? "--"}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status?: string }) => {
    const token = status ? STATUS_TOKENS[status] : undefined;
    const Icon = token?.icon ?? AlertTriangle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
          token
            ? `${token.bg} ${token.text} ${token.ring}`
            : "bg-slate-50 text-slate-500 ring-slate-200"
        }`}
      >
        <Icon size={13} strokeWidth={2.5} className={token?.spin ? "animate-spin" : ""} />
        {token?.label ?? status ?? "--"}
      </span>
    );
  };

  // ======================================================
  // MODAL SUB-COMPONENTS
  // ======================================================

  const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    tone = "neutral",
  }: {
    title: string;
    value: React.ReactNode;
    icon: typeof MapPin;
    tone?: "neutral" | "warning" | "danger";
  }) => {
    const toneClasses =
      tone === "danger"
        ? "border-red-200 bg-red-50"
        : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-slate-200 bg-slate-50";

    const iconToneClasses =
      tone === "danger"
        ? "text-red-500"
        : tone === "warning"
        ? "text-amber-500"
        : "text-slate-400";

    const valueToneClasses =
      tone === "danger" ? "text-red-600" : tone === "warning" ? "text-amber-600" : "text-blue-600";

    return (
      <div className={`rounded-xl border p-4 ${toneClasses}`}>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${valueToneClasses}`}>{value}</span>
          <Icon size={18} className={iconToneClasses} />
        </div>
        <div className="mt-2 text-xs font-medium text-slate-500">{title}</div>
      </div>
    );
  };

  // ======================================================
  // COLUMNS
  // ======================================================

  const columns = [
    {
      title: "Ngày chạy",
      key: "date" as keyof PredictionJobs,
      render: (item: PredictionJobs) => (
        <span className="font-medium text-slate-700 whitespace-nowrap">
          {item.date}
        </span>
      ),
    },

    {
      title: "Ca dự báo",
      key: "jobType" as keyof PredictionJobs,
      render: (item: PredictionJobs) => (
        <ShiftBadge type={item.jobType} />
      ),
    },

    {
      title: "Trạng thái",
      key: "status" as keyof PredictionJobs,
      render: (item: PredictionJobs) => (
        <StatusBadge status={item.status} />
      ),
    },

    {
      title: "Thông tin",
      key: "id" as keyof PredictionJobs,
      render: (item: PredictionJobs) => (
        <button
          type="button"
          onClick={(e) => {
            // Chặn nổi bọt sự kiện lên hàng để không kích hoạt
            // đồng thời onRowClick của Table.
            e.stopPropagation();
            handleViewDetail(item.id);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 hover:border-blue-300"
        >
          <EyeIcon size={16} />
          <span className="hidden sm:inline">Chi tiết</span>
          <ChevronRight size={15} />
        </button>
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

  const progressPercent =
    detail && detail.totalAreas > 0
      ? Math.round((detail.processedAreas / detail.totalAreas) * 100)
      : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER + LEGEND */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
       
          <p className="mt-0.5 text-xs text-slate-400">
            Theo dõi tình trạng các phiên chạy mô hình dự báo lũ theo ca
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sun size={13} className="text-amber-500" />
            Ca sáng
          </span>
          <span className="flex items-center gap-1.5">
            <Moon size={13} className="text-indigo-500" />
            Ca tối
          </span>
        </div>
      </div>

      {/* TABLE OR EMPTY STATE */}
      {safeData.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-14 text-center">
          <Inbox size={28} className="text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            Chưa có phiên dự báo nào được ghi nhận
          </p>
          <p className="text-xs text-slate-400">
            Dữ liệu sẽ xuất hiện sau khi hệ thống chạy phiên dự báo đầu tiên
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table<PredictionJobs>
            columns={columns}
            data={paginated}
            onRowClick={onRowClick}
          />
        </div>
      )}

      {/* PAGINATION */}
      {safeData.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <span className="text-xs text-slate-400">
            {`${(page - 1) * 5 + 1}–${Math.min(page * 5, safeData.length)} / ${safeData.length} bản ghi`}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={15} />
            </button>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span
                  key={`dot-${i}`}
                  className="flex h-7 w-7 items-center justify-center text-sm text-slate-300"
                >
                  ···
                </span>
              ) : (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-lg border text-sm font-medium transition-colors ${
                    page === p
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL CHI TIẾT ================= */}
      {open && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm ">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl mt-10">
            {/* MODAL HEADER — nhuộm màu theo ca chạy */}
            <div
              className={`flex items-start justify-between gap-3 rounded-t-2xl border-b px-6 py-5 ${
                SHIFT_TOKENS[detail.jobType]?.bg ?? "bg-slate-50"
              } ${SHIFT_TOKENS[detail.jobType]?.ring ?? "border-slate-200"}`}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Chi tiết phiên dự báo
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <ShiftBadge type={detail.jobType} />
                  <StatusBadge status={detail.status} />
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              {/* THỜI GIAN */}
              <div className="grid grid-cols-3 gap-4 rounded-xl border border-slate-200 p-4">
                <Info label="Bắt đầu" value={detail.startedAt ?? "--"} />
                <Info label="Hoàn thành" value={detail.finishedAt ?? "--"} />
                <Info
                  label="Thời lượng"
                  value={formatDuration(detail.startedAt, detail.finishedAt)}
                />
              </div>

              {/* TIẾN ĐỘ — số quan trọng nhất, đưa lên đầu và trực quan hoá */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Tiến độ xử lý
                  </h3>
                  <span className="text-sm font-bold text-blue-600">
                    {progressPercent}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <StatCard title="Tổng khu vực" value={detail.totalAreas} icon={MapPin} />
                  <StatCard title="Đã dự báo" value={detail.processedAreas} icon={CheckCircle2} />
                  <StatCard title="Còn thiếu" value={detail.remainingMissing} icon={RefreshCw} />
                </div>
              </div>

              {/* CHẤT LƯỢNG & SỰ CỐ — nhóm riêng vì đây là các chỉ số cảnh báo */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">
                  Chất lượng &amp; sự cố
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    title="Nguy cơ cao"
                    value={detail.highRiskAreas}
                    icon={AlertTriangle}
                    tone="warning"
                  />
                  <StatCard
                    title="Lỗi"
                    value={detail.errors}
                    icon={XCircle}
                    tone={detail.errors > 0 ? "danger" : "neutral"}
                  />
                  <StatCard
                    title="Recovery"
                    value={detail.recoveryAttempts}
                    icon={RefreshCw}
                  />
                </div>
              </div>

              {/* THÔNG BÁO */}
              {detail.message && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-800">
                    Thông báo hệ thống
                  </h3>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    {detail.message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}