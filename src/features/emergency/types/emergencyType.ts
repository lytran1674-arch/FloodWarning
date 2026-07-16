// features/hotline/types/emergencyType.ts

import type { CallTaskStatus } from "@/features/calltask/constants/calltaskConstants";
import type { SosSource } from "@/features/sosrequest/types/sosType";

export type HotlineCallStatus = "PENDING_MATCH" | "MATCHED";
export type TARGETTYPE="TEAM_LEADER" | "DEPUTY_LEADER" | "PROVINCE_OPERATOR"

// Payload gửi khi dân bấm "Gọi Hotline" — POST /hotline/emergency-contact
export interface EmergencyContactRequest {
  lat: number;
  lon: number;
  callerPhoneNumber: string;
}

// Response của /hotline/emergency-contact — 1 object đơn, KHÔNG phải mảng.
// callEventId dùng để đối chiếu khi hotline mở danh sách cuộc gọi chờ (bước 3).
export interface EmergencyContactResult {
  callEventId: string;
  teamId: string;
  teamName: string;
  emergencyPhone: string;
}

// Payload tạo SOS — POST /hotline/sos, dùng chung cho 2 luồng:
// - Luồng 1: dân gọi qua web (có EmergencyCallEvent) -> có callEventId
// - Luồng 2: dân gọi điện thoại thường, operator nghe và nhập tay -> có sodt/lat/lon,
//   không có callEventId (response trả callEventId: null cho trường hợp này)
interface SosHotlineBasePayload {
  victimCount: number;
  injured: boolean;
  trapped: boolean;
  vulnerable: boolean;
  diachi?:string
  mota: string;
}

export interface SosHotlineFromCallPayload extends SosHotlineBasePayload {
  callEventId: string;
}

export interface SosHotlineManualPayload extends SosHotlineBasePayload {
  sodt: string;
  lat: number;
  lon: number;
}

export type SosHotlineRequestPayload =
  | SosHotlineFromCallPayload
  | SosHotlineManualPayload;

// Response khi tạo SOS thành công từ cuộc gọi hotline.
// priority/status/environmentRisk chỉ mới thấy 1 giá trị thực tế mỗi loại trong test
// (CRITICAL/PENDING/HIGH) — cần xác nhận backend còn giá trị nào khác không.
export interface SosHotlineCreateResult {
    sos:SosItems;
  initialCallTask:CallTaskInitial;
 
}



export interface SosItems {
  id: string;
  alreadyExists: boolean | null;
  priority: string;
  status: string;
  environmentRisk: string;
  victimCount: number;
  priorityReason: string;
  mota: string;
  sosSource: SosSource;
  callEventId: string | null;
  trackingCode: string;
  dispatcherUserId: string | null;
  dispatcherName: string | null;
  dispatcherType: string | null;
  createdAt: string;
}
export interface CallTaskInitial{
  callTaskId:string
  targetUserId:string
  targetUserName:string
  phoneNumber:string
  targetType:TARGETTYPE
  timeoutSeconds:number
  retryCount:number
  status:CallTaskStatus
}
// Chi tiết 1 cuộc gọi hotline — dùng chung cho GET call-events/{id} và GET history
export interface DetailHotlineCall {
  id: string;
  teamId: string;
  teamName: string;
  callerLat: number;
  callerLon: number;
  callerPhoneNumber: string;
  status: HotlineCallStatus;
  createdAt: string;
}
export interface StatusHotLineSoS{
  label:string
  value:string
}

export interface UpdateSoSHotlinePayLoad{
sodt?:string
lat?:number
lon?:number
diachi?:string
victimCount?:number
injured?:boolean
trapped?:boolean
vulnerable?:boolean
mota?:string
}