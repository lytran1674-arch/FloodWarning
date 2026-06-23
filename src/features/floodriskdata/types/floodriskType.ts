import type { RiskLevel } from "@/features/map/types/mapType";


export type MucDo= "LOW" | "MEDIUM" | "HIGH" ;
export type TrangThai="PENDING" | "SENT"
export type ThongBao= "EMAIL" | "WEB_PUSH"
export interface FloodRiskData{
    area_id: string
    tenKhuVuc: string 
    lead1: MucDo
    lead1Probability: number
    lead2: MucDo
    lead2Probability:number
    lead3: MucDo
    lead3Probability:number
    predictedAt:string
    weatherFrom: string
    weatherTo: string 
}

export interface FloodRiskAlert{
    tenkhuvuc?:string
    riskLevel?: RiskLevel
    channel?:ThongBao
    status?: TrangThai
    createdAt?:string 

}

