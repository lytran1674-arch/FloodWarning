// features/sos/pages/RequestListPage.tsx

import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { SoSResponse, FilterStatus } from '../types/sosType'

import { axiosClient } from '@/api/axiosClient'
import { AlertCircle, X, ChevronLeft, Loader2, Inbox } from 'lucide-react'
import { useSoS } from '../hooks/useSoS'
import SosRequestCard from '../components/SosRequestCard'

const filterOptions: { key: FilterStatus; label: string }[] = [
  { key: 'ALL',        label: 'Tất cả'     },
  { key: 'PENDING',    label: 'Chờ xử lý'  },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'DONE',       label: 'Hoàn thành' },
  { key: 'CANCELLED',  label: 'Đã hủy'     },
]

export const RequestListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
   const [, setModalOpen] = useState(false)
   const [, setSelectedId] = useState<string | null>(null)

  const [requests, setRequests] = useState<SoSResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL')

  const { cancelSosRequest, loading: cancelLoading } = useSoS()

  // ── state cho modal xác nhận hủy ───────────────────────────────
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  // ── state từ navigate ──────────────────────────────────────────
  const highlightId        = location.state?.highlightId        as string | undefined
  const sosData            = location.state?.sosData
  const showExistingBanner = location.state?.showExistingBanner as boolean | undefined
  const showSuccessBanner  = location.state?.showSuccessBanner  as boolean | undefined

  const [existingBannerVisible, setExistingBannerVisible] = useState(!!showExistingBanner)
  const [successBannerVisible,  setSuccessBannerVisible]  = useState(!!showSuccessBanner)

  const highlightRef = useRef<HTMLDivElement | null>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosClient.get('/sos-request/my-sos')
      const data =
        response.data?.result?.content ??
        response.data?.content ??
        []
      setRequests(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (!loading && highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loading, highlightId])

  const dismissBanner = (type: 'existing' | 'success') => {
    if (type === 'existing') setExistingBannerVisible(false)
    else setSuccessBannerVisible(false)
    navigate(location.pathname, { replace: true, state: {} })
  }

  const filtered =
    activeFilter === 'ALL'
      ? requests
      : requests.filter(r => r.status === activeFilter)

  function handleOpenDetail(id: string) {
    setSelectedId(id)
    setModalOpen(true)
  }

  // ── Hủy yêu cầu ─────────────────────────────────────────────────
  const handleRequestCancel = (id: string) => {
    setCancelError(null)
    setCancelTargetId(id)
  }

  const confirmCancel = async () => {
    if (!cancelTargetId) return
    try {
      setCancelError(null)
      const res = await cancelSosRequest(cancelTargetId)
      if (res && res.code === 0) {
        // Cập nhật lại status trong list ngay, không cần fetch lại toàn bộ
        setRequests(prev =>
          prev.map(r =>
            r.id === cancelTargetId ? { ...r, status: 'CANCELLED' } : r
          )
        )
        setCancelTargetId(null)
      } else {
        setCancelError(res?.message || 'Không thể hủy yêu cầu này')
      }
    } catch (err: any) {
      setCancelError(
        err.response?.data?.message || 'Yêu cầu có thể đã được điều phối, không thể hủy'
      )
    }
  }

  return (
    <div className="p-3 sm:p-5 flex-1 flex flex-col max-w-3xl mx-auto w-full">

      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3 w-fit transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* ── Heading ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-lg">📄</span>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Danh sách yêu cầu đã gửi
          </h2>
        </div>
        <span className="text-xs text-gray-400">{requests.length} yêu cầu</span>
      </div>

      {/* ── Banner: đang có SOS chưa xử lý xong ── */}
      {existingBannerVisible && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3">
          <AlertCircle className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              Bạn đang có yêu cầu SOS chưa hoàn thành
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Không thể gửi yêu cầu mới. Vui lòng theo dõi hoặc cập nhật yêu cầu bên dưới.
            </p>
          </div>
          <button onClick={() => dismissBanner('existing')} className="text-amber-400 hover:text-amber-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Banner: gửi SOS thành công ── */}
      {successBannerVisible && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mb-3">
          <span className="text-green-600 text-base shrink-0">✅</span>
          <span className="text-sm font-medium text-green-700 flex-1 min-w-0">
            Yêu cầu cứu hộ của bạn đã được gửi thành công!
          </span>
          <button onClick={() => dismissBanner('success')} className="text-green-400 hover:text-green-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Filter chips ── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sticky top-0 bg-white/80 backdrop-blur z-10 py-1">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 transition-colors
              ${activeFilter === opt.key
                ? 'bg-red-500 text-white border-red-500 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Cards ── */}
      <div className="flex flex-col gap-3 flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-sm">Đang tải danh sách...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchRequests}
              className="text-xs text-red-600 underline hover:text-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Inbox className="w-8 h-8 text-gray-300" />
            <p className="text-sm">Không có yêu cầu nào</p>
          </div>
        )}

        {!loading && !error && filtered.map(req => (
          <div
            key={req.id}
            ref={req.id === highlightId ? highlightRef : null}
            className="relative"
          >
            <SosRequestCard
              request={req}
              highlight={req.id === highlightId}
              sosData={req.id === highlightId ? sosData : undefined}
             
            /> 

            {/* Nút hủy - chỉ hiện khi PENDING */}
            {req.status === 'PENDING' && (
              <div className="flex justify-end mt-1.5 px-1">
                <button
                  onClick={() => handleRequestCancel(req.id)}
                  className="text-xs font-medium text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Hủy yêu cầu
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>Hiển thị 1 – {filtered.length} trong {filtered.length} yêu cầu</span>
        <div className="flex gap-1">
          <button className="px-2.5 py-1 rounded-md bg-red-500 text-white text-xs">1</button>
        </div>
      </div>

      {/* ── Modal xác nhận hủy ── */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-semibold text-gray-800">
                Xác nhận hủy yêu cầu
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Bạn có chắc muốn hủy yêu cầu cứu hộ này? Hành động này không thể hoàn tác.
            </p>

            {cancelError && (
              <p className="text-xs text-red-500 mb-3">{cancelError}</p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelTargetId(null)}
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
                {cancelLoading ? 'Đang hủy...' : 'Hủy yêu cầu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}