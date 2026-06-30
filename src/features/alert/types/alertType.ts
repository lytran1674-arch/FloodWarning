import type { MucDo } from "@/features/floodriskdata/types/floodriskType"


export type KenhCanhBao= "WEB_PUSH" | "EMAIL"
export type TinhTrang="PENDING" | "SENT"| "FAILED"


export interface Alert{
    tenkhuvuc:string
    riskLevel:MucDo
    channel:KenhCanhBao
    status:TinhTrang
    createdAt:string
}