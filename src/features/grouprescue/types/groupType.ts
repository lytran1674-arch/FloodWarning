// features/sos/types/groupType.ts

export type GroupStatus = "AVAILABLE" | "BUSY" | "UNAVAILABLE" | string;
export type Role ="PRIMARY" | "SUPPORT"
export type MucDo= "HIGH" | "CRITICAL" | "LOW" | "MEDIUM"
export type AssignmentStatus= "ASSIGNED" | "MOVING" | "ACKNOWLEDGED" | "FAILED" | "ARRIVED"
export interface Group {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  status: GroupStatus;
  hasBoat: boolean;
  hasMedical: boolean;
  notes: string;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface GroupListResult {
  content: Group[];
  page: PageInfo;
}

export interface GroupListResponse {
  code: number;
  result: GroupListResult;
}

export interface AssignmentGroup{
    assignmentId:string
    sosId:string
    role:Role
    status:AssignmentStatus
    priority:MucDo
    lat:number
    lon:number
    primaryGroupId:string
    primaryGroupName:string
    supportGroup:string
}

export interface AvailableStatus {
  code: string;
  name: string;
}