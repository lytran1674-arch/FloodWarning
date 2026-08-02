  // features/sos/types/groupType.ts

import type { GROUPTYPE } from "./rescueType";

  export type GroupStatus = "AVAILABLE" | "BUSY" | "OFFLINE" | "DISBANDED" |string;


//OPERATIONAL: Nhóm thực thi nhiệm vụ
//HOTLINE:nhóm trực hotline
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
  
  export interface DetailResGroup{
    id:string
    name:string
    status:GroupStatus
    type:GROUPTYPE
    teamId:string
    teamName:string
    hasBoat:boolean
    hasMedical:boolean
    hasSearchRescue:boolean
    hasLogistics:boolean
    currentMember:number
    minMember:number
    maxMember:number
    enoughMember:number
    notes:string
    leader:GroupLeader
    members:MemberGroup[]
  }
  export interface MemberGroup{
    userId:string
    fullName:string
    phone:string
  }
  export interface GroupLeader{
    groupId:string
    groupName:string
    leaderId:string
    leaderName:string
    phone:string

  }

  export interface PayloadUpdateResGroup{
    name:string
    hasBoat:boolean
    hasMedical:boolean
    hasSearchRescue:boolean
    hasLogistics:boolean
    notes:string

  }