import type { MucDo } from "@/features/floodriskdata/types/floodriskType"

export type TrangThai= "PENDING" | "DONE" | "PROCESSCING" | "CANCELLED"
export interface SoSRequest{
    id?: string
    alredyExits?:boolean
    priority:MucDo
    status?:TrangThai
    baseSeverityScore?:number
    evironmentRisk?:MucDo
    vitcimCount?:number
    priorityReason?:string
    mota?:string
    createdAt?: string

}

export interface updateSoSRequest{
     id?: string
    alredyExits?:boolean
    priority:MucDo
    status?:TrangThai
    baseSeverityScore?:number
    evironmentRisk?:MucDo
    vitcimCount?:number
    priorityReason?:string
    mota?:string
    createdAt?: string
}