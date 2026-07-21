export type CallTaskStatus =
  | "CALLING_TEAM_LEADER"
  | "CALLING_DEPUTY_LEADER"
  | "CALLING_PROVINCE_OPERATOR"
  // Thay đổi 4: gọi Trưởng nhóm cứu hộ sau khi Team Leader phân công — không có
  // escalation qua đội phó/province, chỉ 1 cấp gọi duy nhất tới Group Leader.
  | "CALLING_GROUP_LEADER"
  | "SUCCESS"
  | "FAILED"

export type TARGETTYPE =
  | "TEAM_LEADER"
  | "DEPUTY_LEADER"
  | "PROVINCE_OPERATOR"
  // Chỉ dùng cho luồng Assign Group (Thay đổi 4), KHÔNG dùng trong luồng Hotline SOS
  | "GROUP_LEADER"

export const CALL_TASK_SUCCESS_STATUS: CallTaskStatus = "SUCCESS"
export const CALL_TASK_FAILED_STATUS:  CallTaskStatus = "FAILED"

export const isCallTaskTerminal = (status: CallTaskStatus): boolean =>
  status === "SUCCESS" || status === "FAILED"

export const TARGET_TYPE_LABELS: Record<TARGETTYPE, string> = {
  TEAM_LEADER:       "Trưởng nhóm",
  DEPUTY_LEADER:     "Đội phó",
  PROVINCE_OPERATOR: "Điều phối viên tỉnh",
  GROUP_LEADER:      "Trưởng nhóm cứu hộ",
}