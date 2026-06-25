import type { MucDo } from "@/features/floodriskdata/types/floodriskType"

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