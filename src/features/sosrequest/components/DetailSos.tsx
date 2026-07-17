// features/sosrequest/pages/SosDetailCitizenPage.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Hash,
  Phone,
  Users,
  MapPin,
  Clock,
  ShieldAlert,
  HeartPulse,
  Lock,
  Loader2,
} from "lucide-react";


import type { SosStatus } from "../types/sosType";
import { useSoS } from "../hooks/useSoS";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ tiếp nhận",
  PROCESSING: "Đang xử lý",
  ASSIGNED: "Đã điều phối",
  DONE: "Đã hoàn tất",
  CANCELLED: "Đã huỷ",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-indigo-100 text-indigo-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

const ASSIGNMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  ACCEPTED: "Đã nhận nhiệm vụ",
  ON_THE_WAY: "Đang di chuyển",
  DONE: "Hoàn tất",
  FAILED: "Không thành công",
};

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function DetailSos() {
  const { sosId } = useParams<{ sosId: string }>();
  const navigate = useNavigate();
  const { detail, loading, error, fetchDetail } = useSoS();

  useEffect(() => {
    if (sosId) fetchDetail(sosId);
  }, [sosId, fetchDetail]);

  const flags = detail
    ? [
        detail.injured && {
          key: "injured",
          label: "Có người bị thương",
          icon: HeartPulse,
          style: "bg-red-50 text-red-700 border-red-200",
        },
        detail.trapped && {
          key: "trapped",
          label: "Bị mắc kẹt",
          icon: Lock,
          style: "bg-orange-50 text-orange-700 border-orange-200",
        },
        detail.vulnerable && {
          key: "vulnerable",
          label: "Có đối tượng dễ bị tổn thương",
          icon: ShieldAlert,
          style: "bg-purple-50 text-purple-700 border-purple-200",
        },
      ].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p className="text-sm">Đang tải chi tiết yêu cầu...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : !detail ? (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-400">
            Không tìm thấy yêu cầu SOS này
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header: mã theo dõi + trạng thái */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Hash className="w-3.5 h-3.5" />
                    Mã theo dõi
                  </p>
                  <p className="mt-0.5 text-2xl font-bold tracking-wide">
                    {detail.trackingCode}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                    STATUS_STYLE[detail.status as SosStatus] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_LABELS[detail.status] ?? detail.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Gửi lúc {formatDateTime(detail.createdAt)}
              </div>
            </div>

            {/* Thông tin tình huống */}
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Thông tin tình huống
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{detail.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {detail.victimCount} người gặp nạn
                  </span>
                </div>
              </div>

              {(detail.lat != null || detail.address) && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    {detail.address ||
                      `${detail.lat.toFixed(5)}, ${detail.lon.toFixed(5)}`}
                  </span>
                </div>
              )}

              {flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {flags.map((flag: any) => (
                    <span
                      key={flag.key}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${flag.style}`}
                    >
                      <flag.icon className="w-3.5 h-3.5" />
                      {flag.label}
                    </span>
                  ))}
                </div>
              )}

              {detail.description && (
                <p className="text-sm text-gray-600 border-t pt-3">
                  {detail.description}
                </p>
              )}
            </div>

            {/* Đội cứu hộ được điều phối */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">
                Đội cứu hộ được điều phối
              </h2>

              {detail.assignments.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Chưa có đội cứu hộ nào được điều phối cho yêu cầu này
                </p>
              ) : (
                <div className="space-y-2">
                  {detail.assignments.map((a, idx) => (
                    <div
                      key={`${a.groupName}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-slate-50 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {a.groupName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Trưởng nhóm: {a.groupLeaderName} · {a.groupLeaderPhone}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-white border text-gray-600">
                        {ASSIGNMENT_STATUS_LABELS[a.status] ?? a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}