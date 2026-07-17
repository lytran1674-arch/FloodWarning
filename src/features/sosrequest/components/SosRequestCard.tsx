// features/sos/components/SosRequestCard.tsx

import { useNavigate } from "react-router-dom"
import { Pencil, Users, Clock, AlertTriangle, BarChart2 } from "lucide-react"
import type { SoSResponse, SosStatus, SosPriority } from "../types/sosType"

interface SosRequestCardProps {
  request:    SoSResponse
  highlight?: boolean
  sosData?:   any
  
}

const statusConfig: Record<SosStatus, {
  label: string
  dot: string
  badge: string
  bar: string
}> = {
  PENDING:    { label: "Chờ tiếp nhận", dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200",  bar: "bg-amber-400"  },
  PROCESSING: { label: "Đang xử lý",    dot: "bg-blue-500",   badge: "bg-blue-50 text-blue-700 border-blue-200",     bar: "bg-blue-500"   },
  DONE:       { label: "Hoàn thành",    dot: "bg-emerald-500",badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500"},
  CANCELLED:  { label: "Đã huỷ",        dot: "bg-gray-400",   badge: "bg-gray-50 text-gray-500 border-gray-200",     bar: "bg-gray-400"   },
  ASSIGNED: { label: "Đã điều phối",dot: "bg-indigo-500",badge: "bg-indigo-50 text-indigo-700 border-indigo-200",bar: "bg-indigo-500",
  },
}

const priorityConfig: Record<SosPriority, {
  label: string
  stripe: string
  text: string
}> = {
  CRITICAL: { label: "Khẩn cấp",  stripe: "bg-red-500",    text: "text-red-700"    },
  HIGH:     { label: "Cao",        stripe: "bg-orange-400", text: "text-orange-700" },
  MEDIUM:   { label: "Trung bình", stripe: "bg-amber-400",  text: "text-amber-700"  },
  LOW:      { label: "Thấp",       stripe: "bg-green-400",  text: "text-green-700"  },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// Score bar: 0–100 → width %
function ScoreBar({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score))
  const color =
    clamped >= 75 ? "bg-red-500" :
    clamped >= 50 ? "bg-orange-400" :
    clamped >= 25 ? "bg-amber-400" : "bg-green-400"

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 tabular-nums w-6 text-right">
        {score}
      </span>
    </div>
  )
}

const UPDATABLE_STATUSES: SosStatus[] = ["PENDING", "PROCESSING"]

export default function SosRequestCard({
  request,
  highlight = false,
  sosData,

}: SosRequestCardProps) {
  const navigate = useNavigate()

  const status   = statusConfig[request.status as SosStatus]   ?? { label: request.status,   dot: "bg-gray-400", badge: "bg-gray-50 text-gray-500 border-gray-200", bar: "bg-gray-400" }
  const priority = priorityConfig[request.priority as SosPriority] ?? { label: request.priority, stripe: "bg-gray-400", text: "text-gray-700" }

  const shortId   = request.id.substring(0, 8).toUpperCase()
  const canUpdate = UPDATABLE_STATUSES.includes(request.status as SosStatus)

const handleUpdate = (e: React.MouseEvent) => {
  e.stopPropagation();

  navigate(`/update-sos/${request.id}`, {
    state: { sosData: sosData ?? request },
  });
};

const handleOnClick = () => {
  navigate(`/detail-sos-request/${request.id}`, {
    state: { request },
  });
};
  return (
    <div
      className={`
        group relative bg-white rounded-2xl border overflow-hidden
        transition-all duration-200
        ${highlight
          ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.2)] shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      {/* Priority stripe — bên trái */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priority.stripe}`} />

      <div className="pl-4 pr-3 sm:pr-4 pt-3 pb-3">

        {/* ── Row 1: ID · badge highlight · status ── */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-gray-400 font-mono tracking-wide flex-shrink-0">
              #{shortId}
            </span>
            {highlight && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse flex-shrink-0">
                Yêu cầu hiện tại
              </span>
            )}
          </div>

          {/* Status badge với dot */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot} ${request.status !== "DONE" && request.status !== "CANCELLED" ? "animate-pulse" : ""}`} />
            {status.label}
          </span>
        </div>

        {/* ── Row 2: Mô tả ── */}
        <p className="text-sm font-semibold text-gray-800 mb-2.5 line-clamp-2 sm:truncate sm:line-clamp-none leading-snug">
          {request.mota || <span className="text-gray-400 italic">Không có mô tả</span>}
        </p>

        {/* ── Row 3: Meta chips ── */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${priority.text}`}>
            <AlertTriangle className="w-3 h-3" />
            Ưu tiên: {priority.label}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            {request.victimCount} người
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatDate(request.createdAt)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <AlertTriangle className="w-3 h-3 opacity-60" />
            {request.environmentRisk}
          </span>
        </div>

        {/* ── Row 4: Score bar ── */}
        <div className="mb-0.5">
          <div className="flex items-center justify-between mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
              <BarChart2 className="w-3 h-3" />
              Mức độ nghiêm trọng
            </span>
          </div>
          <ScoreBar score={request.baseSeverityScore??0} />
        </div>

        {/* ── Nút Cập nhật ── */}
        {canUpdate && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleUpdate}
              className="
                w-full flex items-center justify-center gap-2
                bg-red-600 hover:bg-red-700 active:bg-red-800
                text-white text-sm font-semibold
                py-2.5 rounded-xl transition-colors
                shadow-sm hover:shadow
              "
            >
              <Pencil className="w-3.5 h-3.5" />
              Cập nhật yêu cầu
            </button>
          </div>
        )}
      </div>
       <button
        onClick={handleOnClick}
        className="text-xs text-red-500 hover:underline mt-2"
      >
        Xem chi tiết
      </button>

    </div>
    
  )
}