// features/calltask/type/CallTaskType.ts
// ============================================================
// Single source of truth cho tất cả type liên quan CallTask
// Các file khác import từ đây, không định nghĩa lại
// ============================================================
import type { CallTaskStatus, TARGETTYPE } from "../constants/calltaskConstants"

// ── CallTask data (dùng chung cho initialCallTask và state trong Dialer) ──
export interface CallTaskData {
  callTaskId:     string
  status:         CallTaskStatus  // ✅ luôn là CallTaskStatus, không bao giờ string
  targetUserId:   string
  targetUserName: string
  phoneNumber:    string
  targetType:     TARGETTYPE
  retryCount:     number
  timeoutSeconds: number
}

// Alias để không breaking change các chỗ đang dùng UpdateCallTaskResponse
export type UpdateCallTaskResponse = CallTaskData

// ── Kết quả cuộc gọi ──
export type CallResultValue = "ANSWERED" | "NO_ANSWER" | "FAILED"

export interface CallResultOption {
  value: CallResultValue
  label: string
}

// ── Payload cập nhật kết quả cuộc gọi ──
export interface UpdateCallTaskPayLoad {
  callResult: CallResultValue
  startedAt:  string
  endedAt:    string
}