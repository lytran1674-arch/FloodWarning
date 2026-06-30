
import { dataevaluationApi } from '../api/dataevaluationApi'
import type { SnapShot } from '../types/dataevaluationType'

export const dataevaluationService = {
   async buttonSnapShot():Promise<void>{
      return await dataevaluationApi.buttonSnapShot()
    }
    ,
    async getSnapShotSumById(areaId:string):Promise<SnapShot>{
     return await dataevaluationApi.getSnapShotSumById(areaId)
    }
    ,
    async getSnapShotSumOneDay(areaId:string):Promise<SnapShot[]>{
        return await dataevaluationApi.getSnapShotSumOneDay(areaId)
     
    }
}
