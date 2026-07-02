// features/sos/pages/RequestListPage.tsx

import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { SoSResponse, FilterStatus } from '../types/sosType'
import SosRequestCard from '../components/SosRequestCard'
import { axiosClient } from '@/api/axiosClient'
import { AlertCircle, X, ChevronLeft } from 'lucide-react'



const filterOptions: { key: FilterStatus; label: string }[] = [
  { key: 'ALL',        label: 'Tất cả'     },
  { key: 'PENDING',    label: 'Pending'    },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'DONE',       label: 'Done'       },
  { key: 'CANCELLED',  label: 'Cancelled'  },
]

export const RequestListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
    const [,   setModalOpen]   = useState(false)
  const [,  setSelectedId]  = useState<string | null>(null)
  const [requests,     setRequests]     = useState<SoSResponse[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL')

  // ── state từ navigate ──────────────────────────────────────────
  const highlightId        = location.state?.highlightId        as string | undefined
  const sosData            = location.state?.sosData
  const showExistingBanner = location.state?.showExistingBanner as boolean | undefined
  const showSuccessBanner  = location.state?.showSuccessBanner  as boolean | undefined

  const [existingBannerVisible, setExistingBannerVisible] = useState(!!showExistingBanner)
  const [successBannerVisible,  setSuccessBannerVisible]  = useState(!!showSuccessBanner)

  const highlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
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
    fetchRequests()
  }, [])

  // Scroll đến card highlight sau khi load xong
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

  return (
    <div className="p-3 sm:p-5 flex-1 flex flex-col">

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

      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3 w-fit transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* ── Heading ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-red-500 text-base">📄</span>
        <h2 className="text-sm sm:text-base font-medium text-gray-800">
          Danh sách yêu cầu đã gửi
        </h2>
      </div>

      {/* ── Filter chips — scroll ngang trên mobile ── */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`
              px-3.5 py-1 rounded-full text-xs border whitespace-nowrap flex-shrink-0 transition-colors
              ${activeFilter === opt.key
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Cards ── */}
      <div className="flex flex-col gap-2.5 flex-1">
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Đang tải...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">Không có yêu cầu nào</p>
          </div>
        )}
        {!loading && !error && filtered.map(req => (
          <div
            key={req.id}
            ref={req.id === highlightId ? highlightRef : null}
          >
            <SosRequestCard
              request={req}
              highlight={req.id === highlightId}
              sosData={req.id === highlightId ? sosData : undefined}
              onViewDetail={() => handleOpenDetail(req.id)} 
            />
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
    </div>
  )
}