import type { MucDo } from "@/features/floodriskdata/types/floodriskType"

export type TrangThai =
  | "PENDING"
  | "DONE"
  | "PROCESSCING"
  | "CANCELLED"

export interface SoSRequest {
  sodt?: string
  clientDeviceId?: string

  victimCount?: number

  lat?: number
  lon?: number
  diachi?: string
  accuracy?: number

  injured?: boolean
  trapped?: boolean
  vulnerable?: boolean

  alredyExits?: boolean
  mota?: string
}

export interface ListSOS {
  id?: string
  alredyExits?: boolean

  priority: MucDo
  status?: TrangThai

  baseSeverityScore?: number
  evironmentRisk?: MucDo

  victimCount?: number

  priorityReason?: string
  mota?: string
  createdAt?: string
}

export interface SoSRequestRespone {
  id?: string
  alredyExits?: boolean

  priority: MucDo
  status?: TrangThai

  baseSeverityScore?: number
  evironmentRisk?: MucDo

  victimCount?: number

  priorityReason?: string
  mota?: string
  createdAt?: string
}