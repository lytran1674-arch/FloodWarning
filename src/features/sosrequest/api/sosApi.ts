// features/sos/api/sosApi.ts

import { data } from "react-router-dom"
import type { AssignSos, DetailSos, ListSOS, SoSRequest, SoSResponse } from "../types/sosType"
import { axiosClient, publicApi } from "@/api/axiosClient"

const API_URL = "/sos-request"

export const SoSAPI = {
  async createsos(data: SoSRequest): Promise<SoSResponse> {
    const response = await axiosClient.post(`${API_URL}`, data)
    return response.data.result
  },

  async getListSosRequest(): Promise<ListSOS[]> {
    const response = await axiosClient.get(`${API_URL}/my-sos`)
    return response.data.result?.content ?? []
  },

  async getListAnonymousSosRequest(): Promise<ListSOS[]> {
    const response = await axiosClient.get(`${API_URL}/my-active-anonymous`)
    return response.data.result?.content ?? []
  },
  async updateSos(
  id: string,
  data: SoSRequest
): Promise<SoSResponse> {

  const response =
    await axiosClient.put(
      `${API_URL}/${id}`,
      data
    )

  return response.data.result
 
}
 ,
  async postassigment(data:AssignSos):Promise<string>{
    const response=await axiosClient.post("/sos-assignment",data);
    return response.data.result
  },
  async getdetailsos(id:string):Promise<DetailSos>{
    const response=await axiosClient.get(`${API_URL}/${id}`)
    return response.data.result
  },
  //hủy yêu cầu cứu hộ của người dân ,chỉ được hủy khi pending
  //chưa có tài khoản
  async cancelSosRequestAnonymous(sosId:string,data:string):Promise<string>{
    const response=await publicApi.patch(`${API_URL}/${sosId}/anonymous/cancel`,data)
      return response.data;
    
  }
,
  //đã có tài khoản
  async cancelSosRequest(sosId:string,sodt:string,clientDeviceId:string):Promise<string>{
    const response=await axiosClient.patch(`${API_URL}/${sosId}/cancel`,
      {clientDeviceId,sodt}
    )
    return response.data;
  }
}