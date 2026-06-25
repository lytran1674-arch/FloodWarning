import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SoSResponse, FilterStatus } from '../types/sosType';
import SosRequestCard from '../components/SosRequestCard';
import { axiosClient } from '@/api/axiosClient';

const filterOptions: { key: FilterStatus; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'DONE', label: 'Done' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export const RequestListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State cho dữ liệu
  const [requests, setRequests] = useState<SoSResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy banner từ location.state (khi điều hướng từ SuccessPage)
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    location.state?.showSuccessBanner || false
  );

  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

 useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosClient.get(
        '/sos-request/my-sos'
      )

      // axios data nằm trong response.data
      const data =
  response.data?.result?.content ??
  response.data?.content ??
  []

      console.log("SOS RESPONSE:", response.data)

      setRequests(Array.isArray(data) ? data : [])

    } catch (err: any) {

      console.error("❌ Fetch SOS error:", err)

      setError(
        err.response?.data?.message ||
        err.message ||
        'Đã xảy ra lỗi khi tải dữ liệu'
      )

    } finally {
      setLoading(false)
    }
  }

  fetchRequests()
}, [])

  // Đóng banner và xóa state khỏi location
  const handleDismissBanner = () => {
    setShowSuccessBanner(false);
    navigate(location.pathname, { replace: true, state: {} });
  };

  // Quay lại trang trước
  const handleBack = () => navigate(-1);

  // Lọc danh sách theo trạng thái
  const filtered =
    activeFilter === 'ALL'
      ? requests
      : requests.filter((r) => r.status === activeFilter);

  return (
    <div className="p-5 flex-1 flex flex-col">
      {/* Success banner */}
      {showSuccessBanner && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4">
          <span className="text-green-600 text-base">✅</span>
          <span className="text-sm font-medium text-green-700 flex-1">
            Yêu cầu cứu hộ của bạn đã được gửi thành công!
          </span>
          <button
            onClick={handleDismissBanner}
            className="text-xs text-green-600 underline hover:no-underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 w-fit transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Quay lại
      </button>

      {/* Page heading */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-500 text-base">📄</span>
        <h2 className="text-base font-medium text-gray-800">
          Danh sách yêu cầu đã gửi
        </h2>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`px-3.5 py-1 rounded-full text-xs border transition-colors ${
              activeFilter === opt.key
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Request cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {loading && (
          <div className="text-center py-12 text-gray-400">Đang tải...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">Không có yêu cầu nào</p>
          </div>
        )}
        {!loading &&
          !error &&
          filtered.map((req) => (
            <SosRequestCard key={req.id} request={req} />
          ))}
      </div>

      {/* Pagination (tạm thời giữ nguyên) */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>
          Hiển thị 1 – {filtered.length} trong {filtered.length} yêu cầu
        </span>
        <div className="flex gap-1">
          <button className="px-2.5 py-1 rounded-md bg-red-500 text-white text-xs">
            1
          </button>
        </div>
      </div>
    </div>
  );
};