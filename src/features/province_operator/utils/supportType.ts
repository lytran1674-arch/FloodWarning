import type { CandidateTeam } from "../types/provinceType"

// utils/supportType.ts
export const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT:          "Xuồng cứu hộ",
  MEDICAL:       "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS:     "Hậu cần",
}

// ✅ Đơn giản hóa — BE đã filter đúng type rồi, chỉ cần đọc availableGroupCount
export function getAvailableGroups(
  team: CandidateTeam,
  _supportType: string   // không cần dùng nữa vì BE filter sẵn
): number {
  return team.availableGroupCount ?? 0
}