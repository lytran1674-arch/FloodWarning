import { publicApi } from "@/api/axiosClient"
import type { CancelResponse } from "../types/sosanonymousType"
import type { SoSRequest, SoSResponse } from "@/features/sosrequest/types/sosType"

const API_URL = "/sos-request"

export const sosanonymousApi = {
  // Tạo SOS - người chưa có tài khoản
  async createSosAnonymous(data: SoSRequest): Promise<SoSResponse> {
    const response = await publicApi.post(`${API_URL}`, data)
    return response.data.result
  },

  // Hủy yêu cầu - người chưa có tài khoản (chỉ hủy khi PENDING)
  async cancelSosRequestAnonymous(
    sosId: string,
    data: { sodt: string; clientDeviceId: string }
  ): Promise<CancelResponse> {
    const response = await publicApi.patch<CancelResponse>(
      `${API_URL}/${sosId}/anonymous/cancel`,
      data
    )
    return response.data
  },

  // Cập nhật SOS - người chưa có tài khoản
  async updateSosAnonymous(
    id: string,
    data: SoSRequest
  ): Promise<SoSResponse> {
    const response = await publicApi.put(`${API_URL}/${id}/anonymous`, data)
    return response.data.result
  },
}