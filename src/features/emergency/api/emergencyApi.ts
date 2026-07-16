// features/hotline/api/emergencyApi.ts
import { axiosClient, publicApi } from "@/api/axiosClient";
import type {
  DetailHotlineCall,
  EmergencyContactRequest,
  EmergencyContactResult,
  HotlineCallStatus,
  SosHotlineCreateResult,
  SosHotlineRequestPayload,
  StatusHotLineSoS,
  UpdateSoSHotlinePayLoad,
} from "../types/emergencyType";
import type { SoSRequestHotLine, SoSResponse } from "@/features/sosrequest/types/sosType";

const API_URL = "/hotline";

export const emergencyApi = {
  // Bước 1 — Dân bấm "Gọi Hotline": lấy số hotline của đội phụ trách theo lat/lon,
  // trả về kèm callEventId để đối chiếu ở bước 3. Không cần đăng nhập -> publicApi.
  async getEmergencyContact(
    payload: EmergencyContactRequest
  ): Promise<EmergencyContactResult> {
    const response = await publicApi.post(
      `${API_URL}/emergency-contact`,
      payload
    );
    return response.data.result;
  },

  // Bước 3 — Người trực hotline xem danh sách cuộc gọi đang chờ tạo SOS
  // (status PENDING_MATCH). Cần đăng nhập -> axiosClient.
  async listPendingCallEvents(): Promise<DetailHotlineCall[]> {
    const response = await axiosClient.get(`${API_URL}/call-events`);
    return response.data.result?.content ?? [];
  },

  // Bước 4 — Xem chi tiết 1 cuộc gọi. Cần đăng nhập -> axiosClient.
  async getCallEventDetail(callEventId: string): Promise<DetailHotlineCall> {
    const response = await axiosClient.get(
      `${API_URL}/call-events/${callEventId}`
    );
    return response.data.result;
  },

  // Bước 5 — Tạo SOS. Nếu payload có callEventId (luồng dân gọi qua web) hay
  // sodt/lat/lon (luồng dân gọi điện thoại thường, operator nhập tay) đều gọi
  // chung endpoint này. Người trực hotline thực hiện, cần đăng nhập -> axiosClient.
  async createHotlineSos(
    payload: SosHotlineRequestPayload
  ): Promise<SosHotlineCreateResult> {
    const response = await axiosClient.post(`${API_URL}/sos`, payload);
    return response.data.result;
  },

  // Bước 6 — Danh sách cuộc gọi theo trạng thái (vd MATCHED sau khi đã tạo SOS).
  // Cần đăng nhập -> axiosClient.
  async listCallHistory(
    status: HotlineCallStatus
  ): Promise<DetailHotlineCall[]> {
    const response = await axiosClient.get(`${API_URL}/history`, {
      params: { status },
    });
    return response.data.result?.content ?? [];
  },

  // Bước 7 — Dân tra cứu lại SOS đang active (PENDING/PROCESSING) của mình
  // bằng số điện thoại. Không cần đăng nhập -> publicApi.
  async getMyActiveSosByPhone(sodt: string): Promise<SoSRequestHotLine[]> {
    const response = await publicApi.post("/sos-request/my-active-anonymous", {
      sodt,
    });
    return response.data.result?.content ?? [];
  },

  // tra trạng thái sos cho hotline
  //theo từ khóa

  async KeyWord(keyword:string):Promise<SoSResponse[]>{
    const response=await axiosClient.get(`${API_URL}/sos/search`,
      {params:{keyword}}
    )
    return response.data.result?.content??[]
  },

  //theo trạng thái
  async Status(status:string):Promise<SoSResponse[]>{
    const response=await axiosClient.get(`${API_URL}/sos/search`,
      {params:{status}}
    )
    return response.data.result?.content??[]
  },

  //theo số điện thoại và trạng thái
  async KeyWordAndStatus(keyword:string,status:string):Promise<SoSResponse[]>{
    const response=await axiosClient.get(`${API_URL}/sos/search`,{
      params:{keyword,status}
    })
    return response.data.result?.content??[]
  },

  // hiển thị trạng thái để hotine tra cứu
  async getStaus():Promise<StatusHotLineSoS[]>{
    const response=await axiosClient.get(`${API_URL}/status-options`);
    return response.data.result??[]
  },

  //danh sách sos do nhóm hotline tạo thủ công 
  async getListSoSHotlineCreate():Promise<SoSResponse[]>{
    const response=await axiosClient.get(`${API_URL}/manual-sos`)
    return response.data.result?.content??[];
  },

  // cập nhật sos do hotline cập nhật
  async soshotlineupdate(sosId:string,payload:UpdateSoSHotlinePayLoad):Promise<SoSResponse>{
    const response=await axiosClient.put(`${API_URL}/sos/${sosId}`,payload)
    return response.data.result;
  },

};