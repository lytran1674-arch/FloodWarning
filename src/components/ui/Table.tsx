import type React from "react";

export type Column<T> = {
  title: string;
  key: string;
   width?: string;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className1?:string
  className2?:string
};

export function Table<T>({
  columns,
  data,
  onRowClick,
  className1,
  className2
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-200 ${className1} `}>
      <table className={`w-full table-auto min-w-[700px] border-collapse text-xs sm:text-sm ${className2}`}>
        <thead className="bg-slate-100">
          <tr>
            {columns.map((col, index) => (
              <th
            
  key={`${col.key}-${index}`}
  style={{ width: col.width }}
                className=" border p-2 text-left font-semibold sm:p-3"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick ? "cursor-pointer" : ""
                } hover:bg-slate-50`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={`${col.key}-${colIndex}`}
                    className="whitespace-nowrap border p-2 sm:p-3"
                  >
                    {col.render
                      ? col.render(item)
                      : String(
                          (item as Record<string, unknown>)[
                            col.key
                          ] ?? "—"
                        )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-slate-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}