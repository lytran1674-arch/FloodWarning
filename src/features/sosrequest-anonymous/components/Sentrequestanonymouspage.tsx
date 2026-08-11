// features/sos/pages/SentRequestAnonymousPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, Inbox, Loader2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { useSoS } from "../../sosrequest/hooks/useSoS";
import { usesosrequestanonymous } from "../hooks/usesosrequestanonymous";
import { toast } from "react-toastify";

// Cần khớp đúng key đã dùng lúc lưu ở FormSOSAnonymous.tsx
const DEVICE_ID_KEY = "deviceId";
const ANONYMOUS_SODT_KEY = "sos_anonymous_sodt";

// Chỉ có thể hủy khi yêu cầu chưa được điều phối (PENDING)
const CANCELLABLE_STATUSES = ["PENDING"];

export default function SentRequestAnonymousPage() {
  const navigate = useNavigate();
  const { request, loading, error, listAnonymousSosRequest, setRequest } = useSoS();
  const { cancelSosRequestAnonymous, loading: cancelLoading } = usesosrequestanonymous();

  const sodt = localStorage.getItem(ANONYMOUS_SODT_KEY);
  const clientDeviceId = localStorage.getItem(DEVICE_ID_KEY);
  const hasDeviceInfo = !!sodt && !!clientDeviceId;

  // ── Cancel modal state ──
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasDeviceInfo) return; // chưa từng gửi SOS nào trên thiết bị này → không gọi API
    listAnonymousSosRequest(sodt!, clientDeviceId!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeviceInfo]);

  const handleRequestCancel = (id: string) => {
    setCancelError(null);
    setCancelTargetId(id);
  };

  const confirmCancel = async () => {
    if (!cancelTargetId || !sodt || !clientDeviceId) return;
    setCancelError(null);

    const res = await cancelSosRequestAnonymous(cancelTargetId, sodt, clientDeviceId);

    if (res) {
      setRequest(prev =>
        prev.map(r => (r.id === cancelTargetId ? { ...r, status: "CANCELLED" as any } : r))
      );
      toast.success("Đã hủy yêu cầu SOS thành công");
      setCancelTargetId(null);
    } else {
      setCancelError("Yêu cầu có thể đã được điều phối, không thể hủy");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <h1 className="text-xl font-bold mb-1">Yêu cầu của bạn</h1>
      <p className="text-sm text-gray-500 mb-4">
        Danh sách yêu cầu SOS được gửi từ thiết bị này
      </p>

      {/* Gợi ý đăng nhập để xem thêm dữ liệu khác */}
      <div className="flex items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-5">
        <p className="text-sm text-indigo-700">
          Bạn đang xem với tư cách khách — chỉ thấy yêu cầu trên thiết bị
          này. Đăng nhập để xem toàn bộ lịch sử yêu cầu của bạn.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Đăng nhập
        </button>
      </div>

      {!hasDeviceInfo ? (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
          <Inbox className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">
            Chưa tìm thấy yêu cầu SOS nào được gửi từ thiết bị này
          </p>
        </div>
      ) : loading ? (
        <p className="text-sm text-gray-400">Đang tải...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : request.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
          <Inbox className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">Bạn chưa có yêu cầu SOS nào đang hoạt động</p>
        </div>
      ) : (
        <div className="space-y-3">
          {request.map((item) => {
            const canCancel = CANCELLABLE_STATUSES.includes(item.status as string);
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.mota || "Yêu cầu cứu hộ khẩn cấp"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      👥 {item.victimCount} nạn nhân
                    </p>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        📅 {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 shrink-0">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() =>
                      navigate(`/update-sos-anonymous/${item.id}`, {
                        state: { sosData: item },
                      })
                    }
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Cập nhật
                  </button>

                  {canCancel && (
                    <button
                      onClick={() => handleRequestCancel(item.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Hủy yêu cầu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal xác nhận hủy */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-semibold text-gray-800">Xác nhận hủy yêu cầu</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Bạn có chắc muốn hủy yêu cầu cứu hộ này? Hành động này không thể hoàn tác.
            </p>

            {cancelError && (
              <p className="text-xs text-red-500 mb-3">{cancelError}</p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setCancelTargetId(null); setCancelError(null) }}
                disabled={cancelLoading}
                className="px-3.5 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Không
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="px-3.5 py-1.5 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {cancelLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {cancelLoading ? "Đang hủy..." : "Hủy yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}