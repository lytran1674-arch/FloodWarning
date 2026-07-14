// features/sos/types/groupType.ts

import type { SupportType } from "@/features/province_operator/types/provinceType";

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
  hasSearchRescue:boolean
   hasLogistics:boolean
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

export interface LeaderCreateSupport{
  reason:string
  items:LeaderCreateSupportItems[]
}

export interface LeaderCreateSupportItems{
  supportType:SupportType
  requiredGroupCount:number
}

export interface SupportRequestGroupLeader{
  id:string
  groupName:string
  groupLeaderName:string
  reason:string
  status:string
  createdAt:string
}

export interface DetailSupportRequestGroupLeader{
   id:string
  groupName:string
  groupLeaderName:string
  reason:string
  status:string
  createdAt:string
  items:DetailSupportRequestGroupLeaderItem[];
}

export interface DetailSupportRequestGroupLeaderItem{
  id:string
  supportType:SupportType
  requiredGroupCount:number
  assignedGroupCount:number
  completedGroupCount:number
  status:string
}

export interface GroupSupport{
  id:string
  groupName:string
  leaderName:string
  status:string
  hasBoat:boolean
  hasMedical:boolean
  hasSearchRescue:boolean
  hasLogistics:boolean

}