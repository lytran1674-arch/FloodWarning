import { usePagination } from '@/hooks/usePagination';

import type { SnapShot } from '../types/dataevaluationType';
import { Table } from '@/components/ui/Table';

interface Props{
  data:SnapShot[];

}
export const DataEvaluationTable = ({data}:Props) => {
  
  const { page, setPage, totalPages, paginated } = usePagination(data, 5);
 const getRiskClass = (risk?: string) => {
  switch (risk?.toUpperCase()) {
    case "LOW":
      return "bg-green-100 text-green-700";

    case "MEDIUM":
      return "bg-yellow-100 text-orange-700";

    case "HIGH":
      return "bg-orange-100 text-red-700";

    

    default:
      return "bg-gray-100 text-gray-600";
  }
};
   const columns = [
     {
       title: "Khu vực ",
       key: "tenkhuvuc" as keyof SnapShot,
       render: (item: SnapShot) => `${item.tenkhuvuc} `,
     },
     {
       title: "Mức rủi ro",
       key: "riskLevel" as keyof SnapShot,
      render: (item: SnapShot) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskClass(
        item.riskLevel
      )}`}
    >
      {item.riskLevel}
    </span>
  ),
     },
     {
       title: "Xác xuất",
       key: "predictionProbaility" as keyof SnapShot,
       render: (item: SnapShot) => `${item.predictionProbability} `,
     },
     {
       title: "Tỷ lệ nguy hiểm ",
       key: "dangerRatio" as keyof SnapShot,
       render: (item: SnapShot) => `${item.dangerRatio} `,
     },
     {
       title: "Thời gian nguy hiểm",
       key: "dangerDuraionMinutes" as keyof SnapShot,
       render: (item: SnapShot) => `${item.dangerDuraionMinutes}`,
     },
     {
       title: "Tốc độ nước dâng ",
       key: "waterRiseRatePerMinute" as keyof SnapShot,
       render: (item: SnapShot) => `${item.waterRiseRatePerMinute}`,
     },
     {
       title: "% Nguy hiểm",
       key: "dangerPercent" as keyof SnapShot,
       render: (item: SnapShot) => `${item.dangerPercent}%`,
     },
      {
       title: "Mức rủi ro dự đoán",
       key: "predictionRiskLevel" as keyof SnapShot,
       render: (item: SnapShot) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskClass(
        item.predictionRiskLevel
      )}`}
    >
      {item.predictionRiskLevel}
    </span>
  ),
     },
     {
       title: "Thời gian tổng hợp",
       key: "time" as keyof SnapShot,
       render: (item: SnapShot) =>
         new Date(item.snapshotAt).toLocaleString("vi-VN"),
     },
    ]

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
      <div>
        
        <Table<SnapShot> columns={columns} data={paginated}/>

          <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
        <span className="text-xs text-slate-400">
          {data.length === 0
            ? "Chưa có dữ liệu tổng hợp khu vực này"
            : `${(page - 1) * 5 + 1}–${Math.min(
                page * 5,
                data.length
              )} / ${data.length} bản ghi`}
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
    )
}
