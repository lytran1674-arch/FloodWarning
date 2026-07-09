export type SupportType ="SEARCH_RESCUE" | "BOAT" | "MEDICAL" | "LOGISTICS"
export type Status="PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "TEAM_REJECTED"

export interface SupportRequestItem{
  id:string
  sosId: string;
  status: Status;
 items:SupportRequestDetail[]
}

export interface SupportRequestDetail{
  id: string;
  supportType: string;
  requiredGroupCount: number;
  status: Status;
  assignedTeamId: string | null;
  assignedTeamName: string | null;
  provinceNote: string | null;
  teamResponse: string | null;
  assignedGroupCount: number | null;
}
export interface SupportRequestItemPayload {
  supportType: SupportType;

  requiredGroupCount: number;
}

export interface CreateSupportRequestPayload {
  sosId: string;

  reason: string;

  items: SupportRequestItemPayload[];
}


export interface CreateSupportRequestResponse {
  code: number;
  result: string; // id đơn hỗ trợ vừa tạo
}

export interface SupportRequestListResponse {
  content: SupportRequestItem[];
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

// src/features/province_operator/types/provinceOperator.types.ts
export interface ProvinceOperatorItem {
  id: string;
  hoten: string;
  tenkhuvuc_phutrach: string;
}

export interface ProvinceOperatorListResponse {
  code: number;
  result: {
    content: ProvinceOperatorItem[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
}

export interface ImportProvinceOperatorResponse {
  code: number;
  message?: string;
  result?: {
    successCount?: number;
    failCount?: number;
    errors?: { row: number; message: string }[];
  };
}

export interface ApprovePayload {
  items:ApprovedItem[];
}
// provinceType.ts
export interface ApprovedItem {
  supportRequestItemId: string;
  assignedTeamId?: string | null;   // chỉ cần khi approve
  provinceResponse?: string;        // chỉ cần khi reject
  status: "APPROVED" | "REJECTED";
}

export interface RejectPayload {
  provinceResponse: string;
}


export interface ProvinceOperatorItem {
  id: string;
  hoten: string;
  tenkhuvuc_phutrach: string;
}

export interface ProvinceOperator {
  code: number;
  result: {
    content: ProvinceOperatorItem[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };

}

export interface ProvinceOperatorDetail {
  id: string;
 hoten: string;
  sodt: string;
  email: string;
  areaId: string;
  tenKhuVucPhuTrach: string;
  teamCount: number;
}

export interface RescueTeamItem {
  id: string;
  name: string;
  leaderName: string;
  groupCount: number;
}

export interface CandidateTeam {
  id: string;
  teamName: string;
  areaId: string;
  lat: number;
  lon: number;
  leaderName: string;
  leaderPhone: string;
  emergencyPhone: string;
  availableBoatGroups: number;
  availableMedicalGroups: number;
  availableSearchRescueGroups: number;
  availableLogisticsGroups: number;
  distanceKm:number
  requesterTeam:boolean
}

export interface RequestSupportMyTeam{
  id:string
  sosId:string
  status:Status
 items:RequestSupportMyTeamItems[];
 reason:string
  requestedById:string
  requestedByName:string
  approvedById:string
  approvedByName:string
  createdAt:string
  reviewAt:string
}

export interface RequestSupportMyTeamItems{
  id:string
   supportType:SupportType
   requiredGroupCount:number
   assignedTeamId:string
   assignedTeamName:string
   provinceNote:string
   teamResponse:string
   assignedGroupCount:number
  
}
export interface AssignmentRequestSupport{
  groupId:string
  note:string
}