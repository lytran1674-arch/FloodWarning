import type { SoSRequestHotLine, SoSResponse } from "@/features/sosrequest/types/sosType";
import { emergencyApi } from "../api/emergencyApi";
import type { DetailHotlineCall, EmergencyContactRequest, EmergencyContactResult, HotlineCallStatus, SosHotlineCreateResult, SosHotlineRequestPayload } from "../types/emergencyType";


export const emergencyService ={

  //B1:lấy hotline đội theo lat lon của ng dân
 async getEmergencyContact(payload:EmergencyContactRequest):Promise<EmergencyContactResult>{
  return await emergencyApi.getEmergencyContact(payload)
 },

 // Bước 3 — Người trực hotline xem danh sách cuộc gọi đang chờ tạo SOS
 async listPendingCallEvents():Promise<DetailHotlineCall[]>{
  return await emergencyApi.listPendingCallEvents();
 }
 ,
 // Bước 4 — Xem chi tiết 1 cuộc gọi.
 async getCallEventDetail(callEventId:string):Promise<DetailHotlineCall>{
  return await emergencyApi.getCallEventDetail(callEventId);
 },

 //Bước 5 — Tạo SOS từ 1 cuộc gọi hotline. Người trực hotline thực hiện,
 async createSosFromCall(payload:SosHotlineRequestPayload):Promise<SosHotlineCreateResult>{
  return await emergencyApi.createHotlineSos(payload)
 },
 // Bước 6 — Danh sách cuộc gọi theo trạng thái (vd MATCHED sau khi đã tạo SOS).
 async listCallHistory(status:HotlineCallStatus):Promise<DetailHotlineCall[]>{
  return await emergencyApi.listCallHistory(status);
 },

 // Bước 7 — Dân tra cứu lại SOS đang active (PENDING/PROCESSING) của mình
  // bằng số điện thoại.
  async getMyActiveSosByPhone(sodt:string):Promise<SoSRequestHotLine[]>{
    return await emergencyApi.getMyActiveSosByPhone(sodt);
  }
  ,

  // tra cứu sos theo từ khóa
  async trackingCode(keyword:string):Promise<SoSResponse>{
    return emergencyApi.KeyWord(keyword);
  }
  ,
  //theo trạng thái
  async Status(status:string):Promise<SoSResponse>{
    return emergencyApi.Status(status);
  },

  // theo số điện thoại và trạng thái
  async KeywordandStatus(keyword:string,status:string):Promise<SoSResponse>{
    return emergencyApi.KeyWordAndStatus(keyword,status);
  }
}
