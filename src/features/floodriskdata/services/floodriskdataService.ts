import { FloodRiskDataApi } from "../api/floodriskdataApi";
import type { FloodRiskData } from "../types/floodriskdataType";


export const FloodriskdataService = {
 async getListFLoodRisk():Promise<FloodRiskData[]>{
    return await FloodRiskDataApi.getAll();
 },
 async getListPredictById(areaId:string):Promise<FloodRiskData[]>{
   return await FloodRiskDataApi.getPredictById(areaId);
 }
}
