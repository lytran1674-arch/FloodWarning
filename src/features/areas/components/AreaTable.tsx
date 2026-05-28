import { useNavigate } from "react-router-dom";
import type { AreaTree } from "../types/areaType";
import { Table } from "../../../components/ui/Table";
import { usePagination } from "../../../hooks/usePagination";

interface Props {
  data: AreaTree[];
}

const flattenAreas = (areas: AreaTree[]): AreaTree[] => {
  return areas.flatMap((area) => [
    area,
    ...flattenAreas(area.children ?? []),
  ]);
};

export const AreaTable = ({ data }: Props) => {
  const navigate = useNavigate();
  const flatData = flattenAreas(data);
  const { page, setPage, totalPages, paginated } = usePagination(flatData, 5);

  const columns = [
    {
      title: "Tên khu vực",
      key: "tenkhuvuc" as keyof AreaTree,
      render: (item: AreaTree) => (
        <div style={{ paddingLeft: `${(item.level - 1) * 24}px` }}>
          {item.tenkhuvuc}
        </div>
      ),
    },
    { title: "Cấp độ", key: "level" as keyof AreaTree },
    { title: "Vĩ độ",  key: "lat"   as keyof AreaTree },
    { title: "Kinh độ", key: "lon"  as keyof AreaTree },
    {
      title: "Thao tác",
      key: "id" as keyof AreaTree,
      render: (item: AreaTree) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/areas-management/${item.id}`) }}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
            title="Xóa"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table<AreaTree>
        columns={columns}
        data={paginated}                              // ✅ dùng paginated thay flatData
        onRowClick={(item) => navigate(`/areas-management/${item.id}`)}
      />

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
        <span className="text-xs text-slate-400">
          {flatData.length === 0
            ? "Không có dữ liệu"
            : `${(page - 1) * 5 + 1}–${Math.min(page * 5, flatData.length)} / ${flatData.length} khu vực`
          }
        </span>

        <div className="flex gap-1">
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 rounded border text-sm disabled:opacity-30 hover:bg-slate-100 transition-colors"
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span
                  key={`dot-${i}`}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 text-sm"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-7 h-7 rounded border text-sm transition-colors ${
                    page === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              )
            )
          }

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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