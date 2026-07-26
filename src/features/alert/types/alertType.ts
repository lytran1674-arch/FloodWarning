import type { MucDo } from "@/features/floodriskdata/types/floodriskType"


export type KenhCanhBao= "WEB_PUSH" | "EMAIL" | "POPUP"
export type TinhTrang="PENDING" | "SENT"| "FAILED"


export interface Alert{
    id:string
    tenkhuvuc:string
    riskLevel:MucDo
    channel:KenhCanhBao
    status:TinhTrang
    createdAt:string
}

export interface PopupAlert{
    id:string
    title:string
    message:string
    tenkhuvuc:string
    riskLevel:string
    createdAt:string
}