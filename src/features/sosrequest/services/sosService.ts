// import type { CancelResponse } from "@/features/sosrequest-anonymous/types/sosanonymousType"
// import { SoSAPI } from "../api/sosApi"
// import type { AssignSos, DetailSos, SoSRequest, SoSResponse } from "../types/sosType"

// export const sosService = {
//   async createsos(data: SoSRequest): Promise<SoSResponse> {
//     return await SoSAPI.createsos(data)
//   },

//   async getListSosRequest(): Promise<SoSResponse[]> {
//     return await SoSAPI.getListSosRequest()
//   },

//   async getListAnonymousSosRequest(
//     sodt: string,
//     clientDeviceId: string
//   ): Promise<SoSResponse[]> {
//     return await SoSAPI.getListAnonymousSosRequest(sodt, clientDeviceId)
//   },

//   async updateSOS(id: string, data: SoSRequest): Promise<SoSResponse> {
//     return await SoSAPI.updateSos(id, data)
//   },

//   async postassign(data: AssignSos): Promise<string> {
//     return await SoSAPI.postassigment(data)
//   },

//   async getDetailSoS(id: string): Promise<DetailSos> {
//     return await SoSAPI.getdetailsos(id)
//   },

//   // Hủy yêu cầu sos (đã có tài khoản)
//   async cancelSosRequest(sosId: string): Promise<CancelResponse> {
//     return await SoSAPI.cancelSosRequest(sosId)
//   },
//   //tra cứu trackingCode
//   async trackingCode(trackingCode:string):Promise<SoSResponse>{
//     return SoSAPI.trackingCode(trackingCode);
//   }

  
// }


import type { CancelResponse } from "@/features/sosrequest-anonymous/types/sosanonymousType"
import { SoSAPI } from "../api/sosApi"
import type { AssignSos, AssignSosResult, DetailSos, SoSRequest, SoSResponse } from "../types/sosType"

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

  // ĐÃ SỬA: trước đây khai báo Promise<string> (chỉ trả assignmentId cũ).
  // BE giờ trả thêm callTask nên đổi type cho khớp response thật,
  // tránh lỗi "Property 'result' does not exist on type 'string'" ở useSoS.ts.
  async postassign(data: AssignSos): Promise<AssignSosResult> {
    return await SoSAPI.postassigment(data)
  },

  async getDetailSoS(id: string): Promise<DetailSos> {
    return await SoSAPI.getdetailsos(id)
  },

  // Hủy yêu cầu sos (đã có tài khoản)
  async cancelSosRequest(sosId: string): Promise<CancelResponse> {
    return await SoSAPI.cancelSosRequest(sosId)
  },
  //tra cứu trackingCode
  async trackingCode(trackingCode:string):Promise<SoSResponse>{
    return SoSAPI.trackingCode(trackingCode);
  }

}