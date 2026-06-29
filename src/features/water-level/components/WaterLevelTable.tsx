
import { Table } from '@/components/ui/Table'
import type { IoTAggregate } from '../types/waterlevelType'
import { usePagination } from '@/hooks/usePagination'

interface Props {
  data: IoTAggregate[];
  loading: boolean;
}

export const WaterLevelTable = ({ data, loading }: Props) => {
  
     const { page, setPage, totalPages, paginated } = usePagination(data, 5);
    
      const columns = [
        {
          title: "Khu vực",
          key: "tenkhuvuc" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.tenkhuvuc}`,
        },
        {
          title: "Hiện tại(cm)",
          key: "currentWater" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.currentWater} `,
        },
        {
          title: "Trung bình (cm)",
          key: "avgWater" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.avgWater} `,
        },
        {
          title: "Cao nhất (cm)",
          key: "maxWater" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.maxWater} `,
        },
        {
          title: "Thấp nhất",
          key: "minWater" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.minWater} `,
        },
        {
          title: "Tăng/phút",
          key: "waterRiseRatePerMinute" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.waterRiseRatePerMinute}`,
        },
       
       {
  title: "Tỷ lệ số thiết bị vượt ngưỡng",
  key: "dangerRatio" as keyof IoTAggregate,
  render: (item: IoTAggregate) => `${Math.round((item.dangerRatio ?? 0) * 100)}%`,
},
 {
          title: "Thời gian vượt ngưỡng",
          key: "dangerDurationMinutes" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.dangerDurationMinutes}`,
        },
        {
          title: "Cập nhật lúc",
          key: "recordedAt" as keyof IoTAggregate,
          render: (item: IoTAggregate) => `${item.recordedAt} mm`,
        }
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

    if(loading)
        <div>.........Loading</div>
  return (
    <div>
    <Table<IoTAggregate> columns={columns} data={paginated} className1='lg:w-[750px] lg:ml-5 ' className2='lg:text-[10px] p-0'/>
      <div className="flex items-center justify-start lg:gap-[520px] px-3 py-2 ">
        <span className="text-xs text-slate-400">
          {data.length === 0
            ? "Không có dữ liệu"
            : `${(page - 1) * 5 + 1}–${Math.min(
                page * 5,
                data.length
              )} / ${data.length} bản ghi`}
        </span>

        <div className="flex gap-1 ">
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
                className={`w-6 h-6 rounded border text-sm transition-colors ${
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
