// features/sos/services/sosService.ts

import { SoSAPI } from "../api/sosApi"
import type {  AssignSos, DetailSos, ListSOS, SoSRequest, SoSResponse } from "../types/sosType"

export const sosService = {
  async createsos(data: SoSRequest): Promise<SoSResponse> {
    return await SoSAPI.createsos(data)
  },

  async getListSosRequest(): Promise<ListSOS[]> {
    return await SoSAPI.getListSosRequest()
  },

  async getListAnonymousSosRequest(): Promise<ListSOS[]> {
    return await SoSAPI.getListAnonymousSosRequest()
  },
  async updateSOS(id:string,data:SoSRequest):Promise<SoSResponse>{
   return await SoSAPI.updateSos(id,data);
  }
  ,async postassign(data:AssignSos):Promise<string>{
    return await SoSAPI.postassigment(data)
  }
  ,
  async getDetailSoS(id:string):Promise<DetailSos>{
    return await SoSAPI.getdetailsos(id)
  }

}