
import type { ResCue } from '../types/rescueType'
import { usePagination } from '../../../hooks/usePagination';
import { Table } from '../../../components/ui/Table';

interface Props{
  data?:ResCue[];
  onRowClick?:(rescue:ResCue)=>void;
  onSelectLeader?: (userId: string) => void;
  
}

export const RescuerTable = ({data,onRowClick,onSelectLeader}:Props) => {
 const safeData = Array.isArray(data) ? data : [];
  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);
   const columns = [
      {
        title: "UserID",
        key: "userId" as keyof ResCue,
        render: (item: ResCue) => item.userId || "--",
      },
      {
        title: "Họ và tên",
        key: "fullName" as keyof ResCue,
        render: (item: ResCue) => item.fullName || "--",
      },
      {
        title: "Số điện thoại",
        key: "phone" as keyof ResCue,
        render: (item: ResCue) => item.phone || "--",
      },
     
   {
  title: "Thao tác",
  key: "actions",
  render: (item: ResCue) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelectLeader?.(item.userId);
      }}
      className="rounded-lg bg-green-600 px-3 py-1 text-white hover:bg-green-700"
    >
      Chọn Leader
    </button>
  ),
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table<ResCue>
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
  }
