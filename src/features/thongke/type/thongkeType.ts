import type { JobType } from "@/features/floodriskdata/types/floodriskType"

export interface Overview{
    totalSos:number
    todaySos:number
    pendingSos:number
    assignedSos:number
    processingSos:number
    completedSos:number
    cancelledSos:number
    totalTeams:number
    totalGroups:number
    totalMembers:number
    totalDevices:number
}

export interface AiFloodPredictions{
    totalAreas:number
    lowRiskAreas:number
    mediumRiskAreas:number
    highRiskAreas:number
    jobDate:string
    jobType:JobType
    topHighRiskAreas:TopHighRiskAreasItem[];
}

export interface TopHighRiskAreasItem{
    areaName:string
    probability:number
}

export interface AIIoT{
    totalAreas:number
    lowRiskAreas:number
    mediumRiskAreas:number
    highRiskAreas:number
    topHighAreas:TopHighRiskAreasItem[]
}

export interface SumRequestSoS{
    totalSos:number
    completedSos:number
    processingSos:number
    cancelledSos:number
    chart:ChartItem[];
}

export interface ChartItem{
    date:string 
    totalSos:number
}