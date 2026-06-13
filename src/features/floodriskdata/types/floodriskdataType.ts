import type { TrangThai } from "../../iotdevices/types/iotdeviceType"

export interface FloodRiskData{
    area_id: string
    tenKhuVuc: string 
    lead1: TrangThai
    lead1Probability: number
    lead2: TrangThai
    lead2Probability:number
    lead3: TrangThai
    lead3Probability:number
    predictedAt:string
    weatherFrom: string
    weatherTo: string 
}

