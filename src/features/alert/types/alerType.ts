import type { MucDo } from "@/features/floodriskdata/types/floodriskType"
import type { TrangThai } from "@/features/iotdevices/types/deviceType"

export type KenhCanhBao= "WEB_PUSH" | "EMAIL"
export type TinhTrang="PENDING" | "SENT"| "FAILED"
export interface Alert{
    tenkhuvuc?:string
    riskLevl:MucDo
    channel?:KenhCanhBao
    status:TrangThai
    createdAt:string
}