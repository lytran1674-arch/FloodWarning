import { SoSAPI } from "../api/sosApi";
import type { ListSOS, SoSRequest } from "../types/sosType";

export const sosService =  {
 async createsos(data:SoSRequest):Promise<SoSRequest>{
    return await SoSAPI.createsos(data);
 },
 async updateSoSRequest(id:string):Promise<SoSRequest>{
    return await SoSAPI.updateSoSRequest(id);
 },
 async updateAnonymousSosRequest(id:string):Promise<SoSRequest>{
    return await SoSAPI.updateAnonymousSosRequest(id)
 },
 async getListSosRequest():Promise<ListSOS[]>{
    return await SoSAPI.getListSosRequest();
 },
 async getListAnonymousSosRequest():Promise<ListSOS[]>{
    return await SoSAPI.getListAnonymousSosRequest()
 }
}
