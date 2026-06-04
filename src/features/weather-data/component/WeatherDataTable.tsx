import { Table } from "../../../components/ui/Table";
import { usePagination } from "../../../hooks/usePagination";
import type { Weather_datas } from "../types/weatherdataType";

interface Props {
  data: Weather_datas[];
  onRowClick?: (weather: Weather_datas) => void;
}

export const WeatherDataTable = ({ data, onRowClick }: Props) => {
  const { page, setPage, totalPages, paginated } = usePagination(data, 5);

  const columns = [
    {
      title: "Lượng mưa",
      key: "rainfall" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.rainfall} mm`,
    },
    {
      title: "Nhiệt độ",
      key: "temperature" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.temperature} °C`,
    },
    {
      title: "Điểm sương",
      key: "dewpoint" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.dewpoint} °C`,
    },
    {
      title: "Áp suất",
      key: "pressure" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.pressure} hPa`,
    },
    {
      title: "Tốc độ gió",
      key: "wind_speed" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.wind_speed} m/s`,
    },
    {
      title: "Hướng gió",
      key: "wind_direction" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.wind_direction}°`,
    },
    {
      title: "Độ ẩm",
      key: "humidity" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.humidity}%`,
    },
    {
      title: "Bốc thoát hơi",
      key: "evapotranspiration" as keyof Weather_datas,
      render: (item: Weather_datas) => `${item.evapotranspiration} mm`,
    },
    {
      title: "Thời gian ghi nhận",
      key: "time" as keyof Weather_datas,
      render: (item: Weather_datas) =>
        new Date(item.time).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "id" as keyof Weather_datas,
      render: () => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
            title="Chỉnh sửa"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
            title="Xóa"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
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
    <div>
      <Table<Weather_datas>
        columns={columns}
        data={paginated}
        onRowClick={onRowClick}
      />

      <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
        <span className="text-xs text-slate-400">
          {data.length === 0
            ? "Không có dữ liệu"
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
  );
};