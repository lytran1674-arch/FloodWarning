// features/sos/pages/SentRequestAnonymousPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, Inbox } from "lucide-react";
import { useSoS } from "../../sosrequest/hooks/useSoS";

// Cần khớp đúng key đã dùng lúc lưu ở FormSOSAnonymous.tsx
const DEVICE_ID_KEY = "deviceId";
const ANONYMOUS_SODT_KEY = "sos_anonymous_sodt";

export default function SentRequestAnonymousPage() {
  const navigate = useNavigate();
  const { request, loading, error, listAnonymousSosRequest } = useSoS();

  const sodt = localStorage.getItem(ANONYMOUS_SODT_KEY);
  const clientDeviceId = localStorage.getItem(DEVICE_ID_KEY);
  const hasDeviceInfo = !!sodt && !!clientDeviceId;

  useEffect(() => {
    if (!hasDeviceInfo) return; // chưa từng gửi SOS nào trên thiết bị này → không gọi API
    listAnonymousSosRequest(sodt!, clientDeviceId!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeviceInfo]);

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
          {request.map((item) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}