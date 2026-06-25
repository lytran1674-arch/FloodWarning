// features/sos/services/sosService.ts

import { SoSAPI } from "../api/sosApi"
import type { ListSOS, SoSRequest, SoSResponse } from "../types/sosType"

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
}