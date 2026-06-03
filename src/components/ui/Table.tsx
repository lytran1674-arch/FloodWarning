type Column<T>={
    title: string
    key: keyof T
    render?: (item:T)=>React.ReactNode;
}

type TableProps<T>={
    columns:Column<T>[];
    data: T[];
    onRowClick?:(item:T)=>void
}


export function Table<T>({columns,data,onRowClick}:TableProps<T>){
    return (
       <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr >
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border p-3 text-left"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="border p-3"
                  >
                    {col.render
                      ? col.render(item)
                      : String(item[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    )
}