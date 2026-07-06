import { FloodRiskDataApi } from "../api/floodriskApi";
import type { FloodRiskData, PredictionJobs, PredictionJobsDetail } from "../types/floodriskType";


export const FloodriskdataService = {
 async getListFLoodRisk():Promise<FloodRiskData[]>{
    return await FloodRiskDataApi.getAll();
 },
 async getListPredictById(areaId:string):Promise<FloodRiskData[]>{
   return await FloodRiskDataApi.getPredictById(areaId);
 },

 //lấy danh sách lịch sử chạy dự báo 
 async getPredictionJobs():Promise<PredictionJobs[]>{
  return await FloodRiskDataApi.getPredictJob();
 }
 ,
 //lấy chi tiết của 1 lịch sử chạy dự báo
 async getPredictionJobDetail(id:string):Promise<PredictionJobsDetail>{
  return await FloodRiskDataApi.getPredictionJobDetail(id);
 }
}
