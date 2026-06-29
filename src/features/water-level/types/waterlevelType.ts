export interface IoTAggregate{
    area_id?:string
    tenkhuvuc?:string
    avgWater?:number
    maxWater?:number
    minWater?:number
    currentWater?:number
    totalDeviceCount?:number
    waterRiseRatePerMinute?:number
    dangerRatio?:number
    dangerDurationMinutes?:number
    recordedAt?:string
}

