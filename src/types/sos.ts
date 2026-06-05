// features/sos/types/sos.types.ts

export type SOSCondition = "injured" | "trapped" | "vulnerable" | "normal"
export type SOSPriority  = "critical" | "high" | "medium" | "low"
export type SOSStatus    = "pending" | "processing" | "done" | "canceled"

// ── Gửi lên API ──
export interface SOSFormData {
  location: string
  lat: number | null
  lon: number | null
  people_count: number
  conditions: SOSCondition[]
  sodt: string
  mota: string
  area_id: string
}

// ── Nhận về từ API ──
export interface SOSRequest {
  masos: string
  user_id: string
  area_id: string
  sodt: string
  device_id?: string
  ip_device?: string
  location: string | null
  mota: string | null
  created_at: string
  status: SOSStatus
  priority: SOSPriority
  conditions: SOSCondition
  updated_at: string
}

// ── Dùng trong UI ──
export const CONDITION_OPTIONS: { value: SOSCondition; label: string }[] = [
  { value: "injured",    label: "Bị thương"                         },
  { value: "trapped",    label: "Mắc kẹt"                           },
  { value: "vulnerable", label: "Có người già / trẻ em / mang thai" },
  { value: "normal",     label: "Bình thường"                       },
]

export const STATUS_LABELS: Record<SOSStatus, string> = {
  pending:    "Chờ xử lý",
  processing: "Đang xử lý",
  done:       "Đã hoàn thành",
  canceled:   "Đã hủy",
}

export const PRIORITY_LABELS: Record<SOSPriority, string> = {
  critical: "Nguy hiểm tính mạng",
  high:     "Cần hỗ trợ gấp",
  medium:   "Không quá gấp",
  low:      "Ít nguy hiểm",
}

export const STATUS_COLORS: Record<SOSStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100   text-blue-700",
  done:       "bg-green-100  text-green-700",
  canceled:   "bg-gray-100   text-gray-500",
}

export const PRIORITY_COLORS: Record<SOSPriority, string> = {
  critical: "bg-red-100    text-red-700",
  high:     "bg-orange-100 text-orange-700",
  medium:   "bg-yellow-100 text-yellow-700",
  low:      "bg-green-100  text-green-700",
}