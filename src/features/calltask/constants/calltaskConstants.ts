// features/calltask/constants/calltaskConstants.ts

export type CallTaskStatus =
  | "CALLING_TEAM_LEADER"
  | "CALLING_DEPUTY_LEADER"
  | "CALLING_PROVINCE_OPERATOR"
  | "SUCCESS"
  | "FAILED"

export type TARGETTYPE =
  | "TEAM_LEADER"
  | "DEPUTY_LEADER"
  | "PROVINCE_OPERATOR"

export const CALL_TASK_SUCCESS_STATUS: CallTaskStatus = "SUCCESS"
export const CALL_TASK_FAILED_STATUS:  CallTaskStatus = "FAILED"

export const isCallTaskTerminal = (status: CallTaskStatus): boolean =>
  status === "SUCCESS" || status === "FAILED"

export const TARGET_TYPE_LABELS: Record<TARGETTYPE, string> = {
  TEAM_LEADER:       "Trưởng nhóm",
  DEPUTY_LEADER:     "Đội phó",
  PROVINCE_OPERATOR: "Điều phối viên tỉnh",
}