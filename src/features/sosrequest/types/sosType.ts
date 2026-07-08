export type SosStatus =
  | "PENDING"
  | "DONE"
  | "PROCESSING"
  | "CANCELLED"

export type SosPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"

export type FilterStatus = 'ALL' | 'PENDING' | 'PROCESSING' | 'DONE' | 'CANCELLED'

export type RoleGroup = "PRIMARY" | "SUPPORT"

export interface SoSRequest {
  areaId?:string
  sodt?: string            // optional — chỉ gửi khi tạo SOS anonymous
  clientDeviceId?: string  // optional — chỉ gửi khi tạo SOS anonymous
  victimCount: number
  lat: number
  lon: number
  diachi: string           // bổ sung — luôn được gửi theo thực tế API
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

export interface AssignSos {
  sosId?: string
  groupId: string
  role: RoleGroup
  note?: string
}

export interface AssignRespone {
  code: number
  result: string
}

export interface DetailSos {
  id: string
  teamId: string
  teamName: string
  phoneNumber: string
  victimCount: number
  injured: boolean
  trapped: boolean
  vulnerable: boolean
  description: string
  priority: SosPriority
  baseSeverityScore: number
  priorityReason: string
  eviromentRisk: SosPriority
  lat: number
  lon: number
  address: string
  status: SosStatus
  createdAt: string
  assignments: Assignment[]
}

export interface Assignment {
  id: string
  groupId: string
  groupName: string
  teamId: string
}


export type LocationSource= "MANUAL_ADDRESS" | "GPS_FROM_CALL_EVENT"
export type SosSource="HOTLINE_OPERATOR" | "DIRECT"