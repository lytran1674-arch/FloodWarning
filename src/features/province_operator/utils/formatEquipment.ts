// // src/features/province_operator/utils/formatEquipment.ts
// import type { CandidateTeam } from "../types/provinceType";
// import type { SupportType } from "../types/provinceType";

// export function getEquipmentLabel(
//   team: CandidateTeam,
//   supportType: SupportType
// ): string {
//   switch (supportType) {
//     case "BOAT":
//       return `${team.availableBoatGroups} xuồng`;
//     case "SEARCH_RESCUE":
//       return `${team.availableSearchRescueGroups} đội tìm kiếm`;
//     case "LOGISTICS":
//     case "LOGISTICS":
//       return `${team.availableLogisticsGroups} đội hậu cần`;
//     default:
//       return `${team.availableMedicalGroups} y tế`;
//   }
// }

// export function isTeamAvailable(
//   team: CandidateTeam,
//   supportType: SupportType
// ): boolean {
//   switch (supportType) {
//     case "BOAT":
//       return team.availableBoatGroups > 0;
//     case "SEARCH_RESCUE":
//       return team.availableSearchRescueGroups > 0;
//     case "LOGISTICS":
//     case "LOGISTICS":
//       return team.availableLogisticsGroups > 0;
//     default:
//       return team.availableMedicalGroups > 0;
//   }
// }