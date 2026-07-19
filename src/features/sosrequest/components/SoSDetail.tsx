import { useNavigate, useParams } from "react-router-dom";
import { useSoS } from "../hooks/useSoS";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pen,
  Users,
  FileText,
  UserPlus,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { DetailSoSCitizenItem } from "../types/sosType";
import GeoMap from "@/features/map/components/GeoMap";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ tiếp nhận",
  PROCESSING: "Đang xử lý",
  ASSIGNED: "Đã điều phối",
  DONE: "Đã hoàn tất",
  CANCELLED: "Đã hủy",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-indigo-100 text-indigo-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

// Mirrors the `status` field on DetailSoSCitizen (PENDING → PROCESSING →
// ASSIGNED → DONE). CANCELLED is a terminal state handled separately below,
// not shown as a step in this forward timeline.
const TIMELINE_STEPS: { key: string; label: string }[] = [
  { key: "PENDING", label: "Yêu cầu SOS đã tạo" },
  { key: "PROCESSING", label: "Điều phối viên đang xử lý" },
  { key: "ASSIGNED", label: "Đội cứu hộ đã được phân công" },
  { key: "DONE", label: "Cứu hộ hoàn tất" },
];

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
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

// Reverse geocoding via OSM Nominatim — free, no API key, but rate-limited
// (~1 req/sec) and not meant for heavy production traffic. Only called when
// the backend didn't already give us `detail.address` (see effect below).
const fetchReverseGeocode = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1&accept-language=vi`;
  const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
  if (!res.ok) return null;
  return res.json() as Promise<{
    display_name?: string;
    address?: Record<string, string>;
  }>;
};

export const SoSDetail = () => {
  const { sosId } = useParams<{ sosId: string }>();
  const navigate = useNavigate();
  const { detail, loading, error, fetchDetail, cancelSosRequest } = useSoS();

  const [gpsAddress, setGpsAddress] = useState<string | null>(null);
  const [gpsAddressLoading, setGpsAddressLoading] = useState(false);

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  // Separate from the page's `loading` (used for the initial fetch) — this
  // one only covers the cancel action itself, so we don't blank out the
  // whole page (including the confirm modal) while cancelling.
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (sosId) fetchDetail(sosId);
  }, [sosId, fetchDetail]);

  // Only ask Nominatim when the backend didn't already give us an address —
  // no point paying the network round-trip if `detail.address` is already set.
  useEffect(() => {
    if (!detail || detail.address || detail.lat == null || detail.lon == null) {
      return;
    }

    let cancelled = false;
    setGpsAddressLoading(true);

    fetchReverseGeocode(detail.lat, detail.lon).then((result) => {
      if (cancelled) return;
      setGpsAddress(result?.display_name ?? null);
      setGpsAddressLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [detail?.address, detail?.lat, detail?.lon]);

  const displayAddress = detail?.address || gpsAddress;

  const handleClickUpdate = () => {
    navigate(`/update-sos/${sosId}`);
  };

  // Opens the confirm modal — does NOT cancel anything by itself.
  const handleRequestCancel = () => {
    if (!detail?.id) return;
    setCancelError(null);
    setCancelTargetId(detail.id);
  };

  // Runs the actual cancel call — only triggered from inside the confirm modal.
  const confirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      setIsCancelling(true);
      setCancelError(null);
      const res = await cancelSosRequest(cancelTargetId);
      if (res && res.code === 0) {
        setCancelTargetId(null);
        if (sosId) fetchDetail(sosId); // reload so status/timeline reflect CANCELLED
      } else {
        setCancelError(res?.message || "Không thể hủy yêu cầu này");
      }
    } catch (err: any) {
      setCancelError(
        err?.response?.data?.message ||
          "Yêu cầu có thể đã được điều phối, không thể hủy"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:m-8 m-4 text-sm text-gray-500">Đang tải...</div>
    );
  }

  if (error) {
    return (
      <div className="lg:m-8 m-4 text-sm text-red-600">
        Không thể tải chi tiết yêu cầu. Vui lòng thử lại.
      </div>
    );
  }

  const statusKey = detail?.status ?? "PENDING";
  const isCancelled = statusKey === "CANCELLED";
  // index of current status within the timeline, used to mark completed steps
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === statusKey);

  return (
    <div className="lg:m-8 m-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center shrink-0 border border-blue-200 bg-blue-100 hover:bg-blue-200 transition-colors rounded-full p-1.5 text-blue-700"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-black font-semibold text-base lg:text-2xl break-words">
            Chi tiết yêu cầu của tôi
          </p>
          <span className="border border-blue-200 bg-blue-50 rounded-md px-2 py-0.5 text-xs lg:text-sm text-blue-700 font-medium shrink-0">
            #{detail?.trackingCode}
          </span>
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
              STATUS_STYLE[statusKey] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUS_LABELS[statusKey] ?? statusKey}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-2 text-xs lg:text-sm font-medium"
            onClick={handleClickUpdate}
            disabled={isCancelled}
          >
            <Pen size={14} />
            Cập nhật
          </Button>
          <button
            className="flex-1 sm:flex-none border border-red-500 text-red-600 hover:bg-red-50 transition-colors rounded-md px-3 py-2 font-medium text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRequestCancel}
            disabled={isCancelling || isCancelled}
          >
            Hủy yêu cầu SoS
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact info */}
          <section className="border border-gray-200 rounded-md p-3 lg:p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-blue-600" size={20} />
              <p className="text-black text-sm lg:text-lg font-semibold">
                Thông tin liên hệ
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] lg:text-xs text-gray-500 tracking-wide">
                  SỐ ĐIỆN THOẠI
                </p>
                <p className="text-xs lg:text-sm text-blue-600 font-bold break-words">
                  {detail?.phoneNumber ?? "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] lg:text-xs text-gray-500 tracking-wide">
                  ĐỊA CHỈ
                </p>
                <p className="text-xs lg:text-sm text-black font-bold break-words">
                  {displayAddress ||
                    (gpsAddressLoading ? "Đang tra địa chỉ..." : "Chưa có địa chỉ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] lg:text-xs text-gray-500 tracking-wide">
                  MÃ THEO DÕI
                </p>
                <p className="text-xs lg:text-sm text-black font-bold break-words">
                  {detail?.trackingCode ?? "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] lg:text-xs text-gray-500 tracking-wide">
                  TỌA ĐỘ GPS
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-xs lg:text-sm text-blue-600 font-bold">
                    Lat: {detail?.lat ?? "—"}
                  </p>
                  <p className="text-xs lg:text-sm text-black font-bold">
                    Long: {detail?.lon ?? "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-[11px] lg:text-xs text-gray-500 tracking-wide">
                  THỜI GIAN TẠO
                </p>
                <p className="text-xs lg:text-sm text-black font-bold">
                  {formatDateTime(detail?.createdAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Status of the person */}
          <section className="border border-gray-200 rounded-md p-3 lg:p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-blue-600" size={20} />
              <p className="text-black text-sm lg:text-lg font-semibold">
                Tình trạng của bạn
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Số lượng" value={detail?.victimCount ?? "—"} />
              <BoolCard label="Có bị thương?" value={!!detail?.injured} />
              <BoolCard label="Đang bị kẹt" value={!!detail?.trapped} />
              <BoolCard label="Đối tượng ưu tiên" value={!!detail?.vulnerable} />
            </div>
          </section>

          {/* Description */}
          <section className="border border-gray-200 rounded-md p-3 lg:p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-blue-600" size={20} />
              <p className="text-black text-sm lg:text-lg font-semibold">
                Mô tả chi tiết
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-500 min-h-[48px] break-words">
              {detail?.description || "Không có mô tả."}
            </div>
          </section>

          {/* Rescue team support */}
          <section className="border border-gray-200 rounded-md p-3 lg:p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="text-blue-600" size={20} />
              <p className="text-black text-sm lg:text-lg font-semibold">
                Đội cứu hộ hỗ trợ
              </p>
            </div>
            {detail?.assignments && detail.assignments.length > 0 ? (
              <div className="space-y-2">
                {detail.assignments.map((a: DetailSoSCitizenItem, i: number) => (
                  <div
                    key={`${a.groupName}-${i}`}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-2 border border-gray-100 rounded-md"
                  >
                    <div className="rounded-full bg-blue-100 text-blue-700 p-2 shrink-0">
                      <Users size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black break-words">
                        {a.groupName}
                      </p>
                      <p className="text-xs text-gray-500 break-words">
                        Nhóm trưởng: {a.groupLeaderName} · {a.groupLeaderPhone}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        STATUS_STYLE[a.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[a.status] ?? a.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
                <div className="rounded-full bg-gray-100 text-gray-400 p-3">
                  <UserPlus size={22} />
                </div>
                <p className="text-xs lg:text-sm text-gray-500 max-w-xs">
                  Hệ thống đang điều phối đội cứu hộ đến vị trí của bạn. Vui
                  lòng giữ bình tĩnh.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: 1/3 width */}
        <div className="space-y-4">
          {/* Map */}
          <section className="border border-gray-200 rounded-md bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <MapPin className="text-blue-600" size={18} />
              <p className="text-black text-sm font-semibold">Vị trí SOS</p>
            </div>
            <GeoMap
              currentLat={detail?.lat}
              currentLon={detail?.lon}
              showCurrentPin
              centerOnUser
              loading={loading}
              className="h-56 sm:h-64 lg:h-96 w-full"
            />
            {(detail?.lat == null || detail?.lon == null) && (
              <p className="px-3 py-2 text-xs text-gray-400">
                Chưa có tọa độ GPS
              </p>
            )}
          </section>

          {/* Timeline */}
          <section className="border border-gray-200 rounded-md p-3 lg:p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-blue-600" size={18} />
              <p className="text-black text-sm lg:text-lg font-semibold">
                Tình trạng của bạn
              </p>
            </div>
            {isCancelled && (
              <div className="mb-3 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
                <span className="text-xs font-semibold text-gray-600">
                  Yêu cầu này đã bị hủy
                </span>
              </div>
            )}
            <ol className="relative border-l border-gray-200 ml-2 space-y-5">
              {TIMELINE_STEPS.map((step, i) => {
                const isDone =
                  !isCancelled &&
                  currentStepIndex >= 0 &&
                  (i < currentStepIndex ||
                    (i === currentStepIndex && statusKey === "DONE"));
                const isCurrent =
                  !isCancelled &&
                  i === currentStepIndex &&
                  statusKey !== "DONE";
                return (
                  <li key={step.key} className="ml-4">
                    <span
                      className={`absolute -left-[9px] flex items-center justify-center rounded-full ${
                        isDone
                          ? "text-green-600"
                          : isCurrent
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="bg-white" />
                      ) : (
                        <Circle size={18} className="bg-white" />
                      )}
                    </span>
                    <p
                      className={`text-xs lg:text-sm font-medium break-words ${
                        isDone || isCurrent ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isDone && (
                      <>
                        <p className="text-[11px] text-gray-400">
                          {formatDateTime(detail?.createdAt)}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-green-600 bg-green-50 rounded px-1.5 py-0.5">
                          COMPLETED
                        </span>
                      </>
                    )}
                    {isCurrent && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-yellow-600 bg-yellow-50 rounded px-1.5 py-0.5">
                        WAITING
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>

      {/* Modal xác nhận hủy */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="text-sm font-semibold text-gray-800">
                Xác nhận hủy yêu cầu
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Bạn có chắc muốn hủy yêu cầu cứu hộ này? Hành động này không thể
              hoàn tác.
            </p>

            {cancelError && (
              <p className="text-xs text-red-500 mb-3">{cancelError}</p>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => setCancelTargetId(null)}
                disabled={isCancelling}
                className="px-3.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Không
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className="px-3.5 py-1.5 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isCancelling ? "Đang hủy..." : "Hủy yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-md p-3 bg-blue-50/40">
    <p className="text-xl lg:text-2xl font-bold text-blue-700">{value}</p>
    <p className="text-[11px] lg:text-xs text-gray-500 text-center">
      {label}
    </p>
  </div>
);

const BoolCard = ({ label, value }: { label: string; value: boolean }) => (
  <div className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-md p-3">
    <span
      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
        value ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {value ? "✓" : "✕"}
    </span>
    <p className="text-[11px] lg:text-xs text-gray-500 text-center">
      {label}
    </p>
  </div>
);