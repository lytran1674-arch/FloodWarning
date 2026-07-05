// src/features/province_operator/utils/supportType.ts

import type { CandidateTeam } from "../types/provinceType";

// ======================================================
// FIELD MAP
// Map từ supportType -> field số nhóm khả dụng tương ứng
// trong CandidateTeam
// ======================================================

export const AVAILABLE_FIELD_BY_TYPE: Record<string, keyof CandidateTeam> = {
  BOAT: "availableBoatGroups",
  MEDICAL: "availableMedicalGroups",
  SEARCH_RESCUE: "availableSearchRescueGroups",
  LOGISTICS: "availableLogisticsGroups",
};

// ======================================================
// LABEL
// ======================================================

export const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT: "Xuồng cứu hộ",
  MEDICAL: "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS: "Hậu cần",
};

// ======================================================
// GET AVAILABLE GROUPS
// Trả về số nhóm khả dụng của 1 đội cho 1 loại hỗ trợ cụ thể.
// Đây là hàm dùng chung giữa CandidateTeamsPanel và
// SupportRequestReviewPage để đảm bảo tính nhất quán khi
// tính tổng số nhóm đã chọn / phân bổ đội.
// ======================================================

export function getAvailableGroups(
  team: CandidateTeam,
  supportType: string
): number {
  const field = AVAILABLE_FIELD_BY_TYPE[supportType];
  return field ? Number(team[field]) || 0 : 0;
}