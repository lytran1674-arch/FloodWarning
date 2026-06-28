// features/alert/pages/AlertHistoryPage.tsx
// Trang lịch sử cảnh báo của user
// API: GET /alert/my-alerts/{userId}

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosClient } from "@/api/axiosClient"
import { useAppSelector } from "@/hooks/redux.hooks"
import {
  Bell, BellOff, ChevronLeft, RefreshCw,
  Mail, Globe, MessageSquare, Clock, MapPin,
  AlertTriangle, ShieldCheck, Info,
} from "lucide-react"

interface AlertItem {
  tenkhuvuc:  string
  riskLevel:  "HIGH" | "MEDIUM" | "LOW" | string
  channel:    "EMAIL" | "WEB_PUSH" | "SMS" | string
  status:     "PENDING" | "SENT" | "FAILED" | string
  createdAt:  string
}

interface PageInfo {
  size:          number
  number:        number
  totalElements: number
  totalPages:    number
}

const riskConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  HIGH:   { label: "Cao",        color: "text-red-700",    bg: "bg-red-50 border-red-200",    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  MEDIUM: { label: "Trung bình", color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  LOW:    { label: "Thấp",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  icon: <ShieldCheck className="w-3.5 h-3.5" /> },
}

const channelConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  EMAIL:    { label: "Email",       icon: <Mail className="w-3.5 h-3.5" />           },
  WEB_PUSH: { label: "Web Push",    icon: <Globe className="w-3.5 h-3.5" />          },
  SMS:      { label: "SMS",         icon: <MessageSquare className="w-3.5 h-3.5" />  },
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  SENT:    { label: "Đã gửi",    color: "text-green-600",  dot: "bg-green-500"  },
  PENDING: { label: "Đang gửi",  color: "text-amber-600",  dot: "bg-amber-400"  },
  FAILED:  { label: "Thất bại",  color: "text-red-600",    dot: "bg-red-500"    },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function AlertCard({ alert }: { alert: AlertItem }) {
  const risk    = riskConfig[alert.riskLevel]    ?? { label: alert.riskLevel,  color: "text-gray-600", bg: "bg-gray-50 border-gray-200", icon: <Info className="w-3.5 h-3.5" /> }
  const channel = channelConfig[alert.channel]   ?? { label: alert.channel,    icon: <Bell className="w-3.5 h-3.5" /> }
  const status  = statusConfig[alert.status]     ?? { label: alert.status,     color: "text-gray-500", dot: "bg-gray-400" }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden">
      {/* Risk stripe bên trái */}
      <div className="flex">
        <div className={`w-1 shrink-0 ${
          alert.riskLevel === "HIGH"   ? "bg-red-500"    :
          alert.riskLevel === "MEDIUM" ? "bg-orange-400" : "bg-green-400"
        }`} />

        <div className="flex-1 p-3 sm:p-4">
          {/* Row 1: khu vực + status */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-sm font-semibold text-gray-800 truncate">
                {alert.tenkhuvuc}
              </span>
            </div>

            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium shrink-0 ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${alert.status === "PENDING" ? "animate-pulse" : ""}`} />
              {status.label}
            </span>
          </div>

          {/* Row 2: risk level + channel */}
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            {/* Risk */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${risk.color} ${risk.bg}`}>
              {risk.icon}
              Rủi ro: {risk.label}
            </span>

            {/* Channel */}
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
              {channel.icon}
              {channel.label}
            </span>
          </div>

          {/* Row 3: thời gian */}
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock className="w-3 h-3" />
            {formatDateTime(alert.createdAt)}
          </div>
        </div>
      </div>
    </div>
  )
}

export const AlertHistoryPage = () => {
  const navigate  = useNavigate()
  const user      = useAppSelector(state => state.auth.user)
  const userId    = user?.id

  const [alerts,   setAlerts]   = useState<AlertItem[]>([])
  const [page,     setPage]     = useState<PageInfo | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const [filterChannel,  setFilterChannel]  = useState<string>("ALL")
  const [filterRisk,     setFilterRisk]     = useState<string>("ALL")

  const fetchAlerts = async (pageNum = 0) => {
    if (!userId) return
    try {
      setLoading(true)
      setError(null)
      const res = await axiosClient.get(
        `/alert/my-alerts/${userId}`,
        { params: { page: pageNum, size: 10 } }
      )
      const result = res.data?.result
      setAlerts(result?.content ?? [])
      setPage(result?.page ?? null)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải lịch sử cảnh báo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlerts(currentPage) }, [userId, currentPage])

  // Filter client-side
  const filtered = alerts.filter(a => {
    const matchChannel = filterChannel === "ALL" || a.channel   === filterChannel
    const matchRisk    = filterRisk    === "ALL" || a.riskLevel === filterRisk
    return matchChannel && matchRisk
  })

  const channelOptions = [
    { key: "ALL",      label: "Tất cả kênh" },
    { key: "EMAIL",    label: "Email"        },
    { key: "WEB_PUSH", label: "Web Push"     },
    { key: "SMS",      label: "SMS"          },
  ]

  const riskOptions = [
    { key: "ALL",    label: "Mọi mức" },
    { key: "HIGH",   label: "Cao"     },
    { key: "MEDIUM", label: "TB"      },
    { key: "LOW",    label: "Thấp"    },
  ]

  return (
    <div className="p-3 sm:p-5 flex-1 flex flex-col max-w-2xl mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-800">
            Lịch sử cảnh báo
          </h1>
          {page && (
            <p className="text-xs text-gray-400">
              {page.totalElements} thông báo
            </p>
          )}
        </div>

        <button
          onClick={() => fetchAlerts(currentPage)}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none">
        {/* Channel */}
        {channelOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilterChannel(opt.key)}
            className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap flex-shrink-0 transition-colors ${
              filterChannel === opt.key
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}

        <div className="w-px bg-gray-200 shrink-0 mx-1" />

        {/* Risk */}
        {riskOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilterRisk(opt.key)}
            className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap flex-shrink-0 transition-colors ${
              filterRisk === opt.key
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col gap-2.5">
        {loading && alerts.length === 0 && (
          <div className="space-y-2.5">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-14 ml-auto" />
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="h-5 bg-gray-100 rounded-full w-20" />
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-28" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              onClick={() => fetchAlerts(currentPage)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3 h-3" /> Thử lại
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">Không có cảnh báo nào</p>
            <p className="text-xs text-gray-300 mt-1">
              {filterChannel !== "ALL" || filterRisk !== "ALL"
                ? "Thử thay đổi bộ lọc"
                : "Bạn chưa nhận được cảnh báo nào"
              }
            </p>
          </div>
        )}

        {!error && filtered.map((alert, idx) => (
          <AlertCard key={idx} alert={alert} />
        ))}
      </div>

      {/* ── Pagination ── */}
      {page && page.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => { setCurrentPage(p => p - 1); fetchAlerts(currentPage - 1) }}
            disabled={currentPage === 0 || loading}
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>

          <div className="flex gap-1">
            {Array.from({ length: page.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i); fetchAlerts(i) }}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  i === currentPage
                    ? "bg-blue-500 text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setCurrentPage(p => p + 1); fetchAlerts(currentPage + 1) }}
            disabled={currentPage >= page.totalPages - 1 || loading}
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  )
}