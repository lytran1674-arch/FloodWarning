import type { CancelResponse } from "@/features/sosrequest-anonymous/types/sosanonymousType"
import type { AssignSos, DetailSos, DetailSoSCitizen, SentedSupportRequest, SoSRequest, SoSResponse } from "../types/sosType"
import { axiosClient, publicApi } from "@/api/axiosClient"

const API_URL = "/sos-request"

export const SoSAPI = {
  async createsos(data: SoSRequest): Promise<SoSResponse> {
    const response = await axiosClient.post(`${API_URL}`, data)
    return response.data.result
  },

  async getListSosRequest(): Promise<SoSResponse[]> {
    const response = await axiosClient.get(`${API_URL}/my-sos`)
    return response.data.result?.content ?? []
  },

  async getListAnonymousSosRequest(
    sodt: string,
    clientDeviceId: string
  ): Promise<SoSResponse[]> {
    const response = await publicApi.post(`${API_URL}/my-active-anonymous`, 
{sodt, clientDeviceId} )
    
    // Xử lý cả 2 trường hợp: có phân trang (.content) hoặc trả mảng thẳng
    return response.data.result?.content ?? response.data.result ?? []
  },

  async updateSos(id: string, data: SoSRequest): Promise<SoSResponse> {
    const response = await axiosClient.put(`${API_URL}/${id}`, data)
    return response.data.result
  },

  async postassigment(data: AssignSos): Promise<string> {
    const response = await axiosClient.post("/sos-assignment", data)
    return response.data.result
  },

  async getdetailsos(id: string): Promise<DetailSos> {
    const response = await axiosClient.get(`${API_URL}/${id}`)
    return response.data.result
  },

  // Hủy yêu cầu - người dùng ĐÃ có tài khoản (chỉ hủy khi PENDING)
  async cancelSosRequest(sosId: string): Promise<CancelResponse> {
    const response = await axiosClient.patch<CancelResponse>(
      `${API_URL}/${sosId}/cancel`
    )
    return response.data
  },

  //chi tiết sos của ng dân (đã có tài khoản)
  async getDetailSoS(sosId:string):Promise<DetailSoSCitizen>{
    const response=await axiosClient.get(`${API_URL}/my/${sosId}`)
    return response.data.result
  },

  // yêu cầu hỗ trợ đã gửi 
  async SentedSupportRequest():Promise<SentedSupportRequest[]>{
    const response=await axiosClient.get("/support-request/my-created")
    return response.data.result?.content??[]
  },
  ///tra cứu sos theo mã tracking cho người dân 
  async trackingCode(trackingCode:string):Promise<SoSResponse>{
    const response=await publicApi.get(`${API_URL}/tracking/${trackingCode}`)
    return response.data.result;
  },

}