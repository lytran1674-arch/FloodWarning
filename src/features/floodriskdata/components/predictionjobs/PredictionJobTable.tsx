import React from 'react';
import {
  Clock3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Eye,
} from 'lucide-react';
import type { PredictionJobsDetail, StatusPredict } from '../../types/floodriskType';
import { usePagination } from '@/hooks/usePagination';

interface Props {
  data?: PredictionJobsDetail[];
}

// ======================================================
// HELPER: cấu hình hiển thị badge theo trạng thái
// ⚠️ GIẢ ĐỊNH: nếu bạn đã có sẵn hàm này ở file khác (ví dụ
// utils/predictionUtils.ts), hãy XÓA hàm bên dưới và import
// lại từ file gốc thay vì dùng bản định nghĩa local này.
// ======================================================
function getStatusConfig(status: StatusPredict) {
  switch (status) {
    case 'SUCCESS':
      return {
        label: 'Thành công',
        className: 'bg-green-100 text-green-700',
      };
    case 'PARTIAL_SUCCESS':
      return {
        label: 'Thiếu dữ liệu',
        className: 'bg-orange-100 text-orange-700',
      };
    case 'FAILED':
      return {
        label: 'Thất bại',
        className: 'bg-red-100 text-red-700',
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-700',
      };
  }
}

// ======================================================
// HELPER: tính % tiến độ = số khu vực đã xử lý / tổng số khu vực
// ======================================================
function getProgressPercent(item: PredictionJobsDetail) {
  if (!item.totalAreas || item.totalAreas === 0) return 0;
  return Math.round((item.processedAreas / item.totalAreas) * 100);
}

// ======================================================
// HELPER: format ngày giờ hiển thị
// ======================================================
function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ======================================================
// HELPER: tính thời gian chạy (finishedAt - startedAt)
// ======================================================
function getDuration(startedAt?: string, finishedAt?: string) {
  if (!startedAt || !finishedAt) return '—';

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();

  if (isNaN(start) || isNaN(end) || end < start) return '—';

  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  return `${minutes} phút ${seconds} giây`;
}

export const PredictionJobTable = ({ data = [] }: Props) => {
  const safeData = Array.isArray(data) ? data : [];

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 5);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | '...')[]>((acc, p) => {
      const last = acc[acc.length - 1];

      if (typeof last === 'number' && p - last > 1) {
        acc.push('...');
      }

      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Ca dự báo</th>
              <th className="px-6 py-4">Thời gian chạy</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Tiến độ</th>
              <th className="px-6 py-4">Kết quả tổng quan</th>
              <th className="px-6 py-4">Recovery</th>
              <th className="px-6 py-4 text-center">Thông tin</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginated.map((item) => {
                const status = getStatusConfig(item.status);
                const progress = getProgressPercent(item);

                return (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    {/* JOB TYPE */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-50 p-2">
                            <Clock3 className="h-4 w-4 text-blue-600" />
                          </div>

                          <p className="font-bold text-blue-700">
                            {item.jobType === 'MORNING' ? 'CA SÁNG' : 'CA CHIỀU'}
                          </p>
                        </div>

                        <p className="max-w-[180px] truncate text-sm text-gray-500">
                          {item.id}
                        </p>
                      </div>
                    </td>

                    {/* TIME */}
                    <td className="px-6 py-5">
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{formatDate(item.startedAt)}</p>

                        <p>→ {formatDate(item.finishedAt)}</p>

                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock3 className="h-4 w-4" />
                          <span>{getDuration(item.startedAt, item.finishedAt)}</span>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        <p className="text-sm text-gray-700">
                          {item.status === 'SUCCESS'
                            ? 'Thành công'
                            : item.status === 'PARTIAL_SUCCESS'
                            ? 'Thiếu dữ liệu'
                            : 'Thất bại'}
                        </p>
                      </div>
                    </td>

                    {/* PROGRESS */}
                    <td className="px-6 py-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-[140px] overflow-hidden rounded-full bg-gray-200">
                            <div
                              style={{ width: `${progress}%` }}
                              className={`h-full rounded-full ${
                                item.status === 'FAILED'
                                  ? 'bg-red-500'
                                  : item.status === 'PARTIAL_SUCCESS'
                                  ? 'bg-orange-500'
                                  : 'bg-blue-600'
                              }`}
                            />
                          </div>

                          <span className="text-sm font-semibold">{progress}%</span>
                        </div>

                        <p className="text-sm text-gray-700">
                          {item.processedAreas}/{item.totalAreas} khu vực
                        </p>
                      </div>
                    </td>

                    {/* RESULT */}
                    <td className="px-6 py-5">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>High: {item.highRiskAreas}</span>
                        </div>

                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Thành công: {item.processedAreas}</span>
                        </div>

                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span>Lỗi: {item.errors}</span>
                        </div>
                      </div>
                    </td>

                    {/* RECOVERY */}
                    <td className="px-6 py-5">
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{item.recoveryAttempts} lần</p>

                        <div className="flex items-center gap-2 text-green-600">
                          <RefreshCcw className="h-4 w-4" />
                          <span>Thành công: {item.recoveredAreass}</span>
                        </div>

                        <p className="text-orange-600">
                          Còn thiếu: {item.remainingMissing}
                        </p>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-center">
                      <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{paginated.length}</span> trên mỗi trang
        </div>

        <div className="flex items-center gap-2">
          {pageNumbers.map((item, index) =>
            item === '...' ? (
              <span key={index} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(item)}
                className={`h-9 w-9 rounded-lg border text-sm font-medium ${
                  page === item
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};