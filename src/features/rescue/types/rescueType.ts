import type { GroupStatus } from "@/features/grouprescue/types/groupType"

export interface CreateTeamRequest{
 name:string
    description:string 
    areaId:string
    lat:number
    lon:number 
    emergencyPhone:string
    diachi:string 

    

}
export interface ResCue{
  userId:string
  fullName:string 
  phone:string
  isLeader?:boolean
}

export interface ResTeam{
  id:string
  name:string
  description:string
  areaId:string
  areaName:string
  leaderId:string | null
  leaderName:string |null
  lat:number
  lon:number
  emergencyPhone:string
}


export interface ApiResPonse<T>{
    code:number
    result:T
}


export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}


export interface ResGroup{
  id: string;
     name: string;
     teamId: string;
     teamName: string;
     status: GroupStatus;
     hasBoat: boolean;
     hasMedical: boolean;
     hasSearchRescue:boolean
     hasLogistics:boolean
     notes: string;
}




// ── Team ──────────────────────────────────────────────────────────────────────
export interface Team {
  id: string
  name: string
  description: string
  areaId: string
  areaName: string
  leaderId: string | null
  leaderName: string | null
}

// ── Group ─────────────────────────────────────────────────────────────────────
export interface Group {
  id: string;
     name: string;
     teamId: string;
     teamName: string;
     status: GroupStatus;
     hasBoat: boolean;
     hasMedical: boolean;
   hasSearchRescue:boolean
    hasLogistics:boolean
     notes: string;
}

// ── Member ────────────────────────────────────────────────────────────────────
/** Trả về từ GET /res-groups/{groupId}/members */
export interface GroupMember {
  userId: string
  fullName: string
  phone: string
  isLeader: boolean
}

/** Trả về từ GET /res-groups/team/{teamId}/available-members */
export interface AvailableMember {
  userId: string
  fullName: string
  phone: string
}

/** Trả về từ GET /res-team/leader/{areaId} */
export interface TeamLeaderInfo {
  teamId: string
  teamName: string
  leaderId: string
  leaderName: string
  phone: string
}

// ── SOS ───────────────────────────────────────────────────────────────────────
export type SosStatus = "pending" | "assigned" | "in_progress" | "resolved" | "cancelled"

export interface SosRequest {
  id: number
  ho_ten: string
  so_dien_thoai: string
  mo_ta: string
  dia_chi: string
  latitude: number | null
  longitude: number | null
  status: SosStatus
  area_id: number
  area_name: string
  assigned_group_id: string | null
  assigned_group_name: string | null
  created_at: string
  updated_at: string
}



// ── SOS display helpers ───────────────────────────────────────────────────────
export const SOS_STATUS_LABEL: Record<SosStatus, string> = {
  pending:     "Chờ xử lý",
  assigned:    "Đã phân công",
  in_progress: "Đang xử lý",
  resolved:    "Đã giải quyết",
  cancelled:   "Đã huỷ",
}

export const SOS_STATUS_NEXT: Partial<Record<SosStatus, SosStatus[]>> = {
  pending:     ["assigned", "cancelled"],
  assigned:    ["in_progress", "cancelled"],
  in_progress: ["resolved", "cancelled"],
}

export const SOS_STATUS_COLOR: Record<SosStatus, { bg: string; text: string; border: string }> = {
  pending:     { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  assigned:    { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  in_progress: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
  resolved:    { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  cancelled:   { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
}

export const GROUP_STATUS_LABEL: Record<Group["status"], string> = {
  AVAILABLE: "Sẵn sàng",
  BUSY:      "Đang nhiệm vụ",
  INACTIVE:  "Không hoạt động",
}

export const GROUP_STATUS_COLOR: Record<Group["status"], { bg: string; text: string }> = {
  AVAILABLE: { bg: "#D1FAE5", text: "#065F46" },
  BUSY:      { bg: "#FEE2E2", text: "#991B1B" },
  INACTIVE:  { bg: "#F3F4F6", text: "#6B7280" },
}