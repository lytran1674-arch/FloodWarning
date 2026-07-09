import type { CancelResponse } from "@/features/sosrequest-anonymous/types/sosanonymousType"
import { SoSAPI } from "../api/sosApi"
import type { AssignSos, DetailSos, SoSRequest, SoSResponse } from "../types/sosType"

export const sosService = {
  async createsos(data: SoSRequest): Promise<SoSResponse> {
    return await SoSAPI.createsos(data)
  },

  async getListSosRequest(): Promise<SoSResponse[]> {
    return await SoSAPI.getListSosRequest()
  },

  async getListAnonymousSosRequest(
    sodt: string,
    clientDeviceId: string
  ): Promise<SoSResponse[]> {
    return await SoSAPI.getListAnonymousSosRequest(sodt, clientDeviceId)
  },

  async updateSOS(id: string, data: SoSRequest): Promise<SoSResponse> {
    return await SoSAPI.updateSos(id, data)
  },

  async postassign(data: AssignSos): Promise<string> {
    return await SoSAPI.postassigment(data)
  },

  async getDetailSoS(id: string): Promise<DetailSos> {
    return await SoSAPI.getdetailsos(id)
  },

  // Hủy yêu cầu sos (đã có tài khoản)
  async cancelSosRequest(sosId: string): Promise<CancelResponse> {
    return await SoSAPI.cancelSosRequest(sosId)
  },

  
}