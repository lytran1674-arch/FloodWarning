// constants/callTaskStatus.constants.ts
import type { TARGETTYPE } from "../type/CallTaskType"

export type CallTaskStatus =
  | "CALLING_TEAM_LEADER"
  | "CALLING_DEPUTY"
  | "CALLING_PROVINCE"
  | "SUCCESS"
  | "FAILED"

export type CallResultValue = "ANSWERED" | "NO_ANSWER" | "FAILED"

export const CALL_TASK_SUCCESS_STATUS: CallTaskStatus = "SUCCESS"
export const CALL_TASK_FAILED_STATUS:  CallTaskStatus = "FAILED"

export const isCallTaskTerminal = (status: CallTaskStatus): boolean =>
  status === "SUCCESS" || status === "FAILED"

export const TARGET_TYPE_LABELS: Record<TARGETTYPE, string> = {
  TEAM_LEADER:       "Trưởng nhóm",
  DEPUTY_LEADER:     "Đội phó",
  PROVINCE_OPERATOR: "Điều phối viên tỉnh",
}