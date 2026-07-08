import { sosanonymousApi } from "../api/sosanonymousApi"
import type { CancelResponse } from "../types/sosanonymousType"
import type { SoSRequest, SoSResponse } from "@/features/sosrequest/types/sosType"

export const sosanonymousService = {
  async createSosAnonymous(data: SoSRequest): Promise<SoSResponse> {
    return await sosanonymousApi.createSosAnonymous(data)
  },

  async cancelSosRequestAnonymous(
    sosId: string,
    sodt: string,
    clientDeviceId: string
  ): Promise<CancelResponse> {
    return await sosanonymousApi.cancelSosRequestAnonymous(sosId, {
      sodt,
      clientDeviceId,
    })
  },

  async updateSosAnonymous(
    id: string,
    data: SoSRequest
  ): Promise<SoSResponse> {
    return await sosanonymousApi.updateSosAnonymous(id, data)
  },
}