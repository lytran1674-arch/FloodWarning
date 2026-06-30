import type { MucDo } from "@/features/floodriskdata/types/floodriskType"

export interface SnapShot{
    areaId?:string
    tenkhuvuc?:string
    riskLevel?:MucDo
    iotRiskScore?:string
    predictionProbaility?:number
    dangerRatio?:number
    dangerDuraionMinutes?:number
    waterRiseRatePerMinute?:number
    dangerAggregateCount?:number
    dangerPercent?:number
    predictionRiskLevel?:MucDo
    snapshotAt:string
    createdAt:string
}