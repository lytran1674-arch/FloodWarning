import type {
  SoSResponse,
  SosStatus,
  SosPriority,
} from "../types/sosType"

interface SosRequestCardProps {
  request: SoSResponse
}

const statusConfig: Record<
  SosStatus,
  { label: string; className: string }
> = {

  PENDING: {
    label: "Pending",
    className: "bg-green-100 text-green-700",
  },

  PROCESSING: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700",
  },

  DONE: {
    label: "Done",
    className: "bg-gray-100 text-gray-600",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
}


const priorityConfig: Record<
  SosPriority,
  { label: string; className: string }
> = {

  CRITICAL: {
    label: "Khẩn cấp",
    className: "bg-red-100 text-red-800",
  },

  HIGH: {
    label: "Cao",
    className: "bg-orange-100 text-orange-800",
  },

  MEDIUM: {
    label: "Trung bình",
    className: "bg-amber-100 text-amber-800",
  },

  LOW: {
    label: "Thấp",
    className: "bg-green-100 text-green-800",
  },
}


function formatDate(iso: string): string {

  const dt = new Date(iso)

  return dt.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}


export default function SosRequestCard({
  request,
}: SosRequestCardProps) {

  // fallback tránh backend trả giá trị lạ
  const status =
    statusConfig[
      request.status as SosStatus
    ] ?? {
      label: request.status,
      className:
        "bg-gray-100 text-gray-700",
    }

  const priority =
    priorityConfig[
      request.priority as SosPriority
    ] ?? {
      label: request.priority,
      className:
        "bg-gray-100 text-gray-700",
    }

  const shortId = request.id
    .substring(0, 8)
    .toUpperCase()

  return (

    <div
      className="
        bg-white rounded-xl
        border border-gray-200
        hover:border-gray-300
        transition-colors
        p-3.5 cursor-pointer
      "
    >

      {/* Header */}
      <div
        className="
          flex items-center
          justify-between
          mb-2.5
        "
      >

        <span
          className="
            text-xs text-gray-400
            font-mono
          "
        >
          #{shortId}
        </span>

        <span
          className={`
            text-xs font-medium
            px-2.5 py-0.5
            rounded-full
            ${status.className}
          `}
        >
          {status.label}
        </span>

      </div>


      {/* Body */}
      <div
        className="
          flex items-center
          gap-2.5
        "
      >

        {/* Priority */}
        <span
          className={`
            text-xs font-medium
            px-2 py-0.5
            rounded
            flex-shrink-0
            ${priority.className}
          `}
        >
          Ưu tiên: {priority.label}
        </span>


        {/* Info */}
        <div className="flex-1 min-w-0">

          <p
            className="
              text-sm font-medium
              text-gray-800
              truncate mb-1
            "
          >
            {request.mota}
          </p>

          <div
            className="
              flex gap-3
              text-xs text-gray-500
              flex-wrap
            "
          >

            <span>
              👥 {request.victimCount} người
            </span>

            <span>
              🕐 {formatDate(request.createdAt)}
            </span>

            <span>
              ⚠️ {request.environmentRisk}
            </span>

          </div>
        </div>


        {/* Score */}
        <div
          className="
            text-right
            flex-shrink-0
          "
        >

          <span
            className="
              block text-lg
              font-medium
              text-gray-800
              leading-none
            "
          >
            {request.baseSeverityScore}
          </span>

          <span
            className="
              text-xs text-gray-400
            "
          >
            Điểm nghiêm trọng
          </span>

        </div>

      </div>
    </div>
  )
}