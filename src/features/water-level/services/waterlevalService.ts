
import type { IoTAggregate } from '../types/waterlevelType'
import { waterlevelApi } from '../api/waterlevelApi'

export const waterlevalService ={
 async getIoTWaterSummary():Promise<IoTAggregate[]>{
    return await waterlevelApi.getIoTWaterSummary();
 }
 ,
 async getWaterLevelsByArea(area_id:string):Promise<IoTAggregate>{
    return await waterlevalService.getWaterLevelsByArea(area_id)
 },

}
