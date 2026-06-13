import { Table } from "../../../components/ui/Table";
import { usePagination } from "../../../hooks/usePagination";
import type { FloodRiskData } from "../types/floodriskdataType";


interface Props {
  data?: FloodRiskData[];
  onRowClick?: (floodriskdata: FloodRiskData) => void;
}

export const FloodRiskTable = ({
  data = [],
  onRowClick,

}: Props) => {
  const safeData = Array.isArray(data) ? data : [];

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);

//   const formatDate = (date?: string | null) => {
//     if (!date) return "--";

//     return new Date(date).toLocaleString("vi-VN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };


const columns = [
  {
    title: "Khu vực",
    key: "tenKhuVuc" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.tenKhuVuc || "--",
  },
  {
    title: "Mức nguy cơ lũ sau 1 ngày",
    key: "lead1" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.lead1 || "--",
  },
  {
    title: "Xác suất lũ ngày 1",
    key: "lead1Probability" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.lead1Probability || "--",
  },
  {
    title: "Mức nguy cơ lũ sau 2 ngày",
    key: "lead2" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.lead2 || "--",
  },
  {
    title: "Xác suất lũ ngày 2",
    key: "lead2Probability" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.lead2Probability || "--",
  },
  {
    title: "Mức nguy cơ lũ sau 3 ngày",
    key: "lead3" as keyof FloodRiskData,         // ✅ sửa lead1 → lead3
    render: (item: FloodRiskData) => item.lead3 || "--",  // ✅ sửa
  },
  {
    title: "Xác suất lũ ngày 3",
    key: "lead3Probability" as keyof FloodRiskData,
    render: (item: FloodRiskData) => item.lead3Probability || "--",
  },
  {
    title: "Thao tác",
    key: "area_id" as keyof FloodRiskData,  // ✅ sửa AreaTree → FloodRiskData
    render: () => (
      <div className="flex gap-2">
        <button
          type="button"
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
          title="Chỉnh sửa"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
          title="Xóa"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
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
      <Table<FloodRiskData>
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