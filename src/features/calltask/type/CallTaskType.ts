// type/CallTaskType.ts
import type { CallTaskStatus } from "../constants/calltaskConstants"

export type TARGETTYPE = "TEAM_LEADER" | "DEPUTY_LEADER" | "PROVINCE_OPERATOR"

export type CallResultValue = "ANSWERED" | "NO_ANSWER" | "FAILED"

export interface CallResultOption {
  value: CallResultValue
  label: string
}

export interface UpdateCallTaskPayLoad {
  callResult: CallResultValue
  startedAt:  string
  endedAt:    string
}

export interface UpdateCallTaskResponse {
  callTaskId:     string
  status:         CallTaskStatus  // ✅ đổi từ string → CallTaskStatus
  targetUserId:   string
  targetUserName: string
  phoneNumber:    string
  targetType:     TARGETTYPE
  retryCount:     number
  timeoutSeconds: number
}