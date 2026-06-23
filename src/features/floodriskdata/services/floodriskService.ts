import { FloodRiskDataApi } from "../api/floodriskApi";
import type { FloodRiskData } from "../types/floodriskType";


export const FloodriskdataService = {
 async getListFLoodRisk():Promise<FloodRiskData[]>{
    return await FloodRiskDataApi.getAll();
 },
 async getListPredictById(areaId:string):Promise<FloodRiskData[]>{
   return await FloodRiskDataApi.getPredictById(areaId);
 }
}
