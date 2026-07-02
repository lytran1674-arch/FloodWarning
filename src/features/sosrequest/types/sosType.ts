

export type SosStatus =
  | "PENDING"
  | "DONE"
  | "PROCESSING"
  | "CANCELLED"

export type SosPriority =
  "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"

export type FilterStatus = 'ALL' | 'PENDING' | 'PROCESSING' | 'DONE' | 'CANCELLED'
// features/sos/types/sosType.ts

export type RoleGroup="PRIMARY" | "SUPPORT"
export interface SoSRequest {
  sodt: string
  clientDeviceId: string
  victimCount: number
  lat: number
  lon: number
  accuracy: number
  injured: boolean
  trapped: boolean
  vulnerable: boolean
  mota: string
}

export interface SoSResponse {
  id: string
  alreadyExists: boolean
  priority: SosPriority
  status: SosStatus
  baseSeverityScore: number
  environmentRisk: string
  victimCount: number
  priorityReason: string
  mota: string
  createdAt: string
  sodt?: string
  lat?: number
  lon?: number
  injured?: boolean
  trapped?: boolean
  vulnerable?: boolean
}

export interface ListSOS {
  id: string
  sodt: string
  victimCount: number
  lat: number
  lon: number
  status: string
  priority: string
  mota: string
  createdAt: string
}

export interface AssignSos{
  sosId?:string
  groupId:string
  role:RoleGroup
  note?:string
}

export interface AssignRespone{
  code:number
  result:string
}

export interface DetailSos{
  id:string
  teamId:string
  teamName:string
  phoneNumber:string
  victimCount:number
  injured:boolean
  trapped:boolean
  vulnerable:boolean
  description:string
  priority:SosPriority
  baseSeverityScore:number
  priorityReason:string
  eviromentRisk:SosPriority
  lat:number
  lon:number
  address:string
  status:SosStatus
  createdAt:string
  assignments:Assignment[]

}

export interface Assignment {
  id: string;
  groupId: string;
  groupName:string
  teamId:string
}
