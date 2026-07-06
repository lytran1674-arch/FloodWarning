import { axiosClient } from "@/api/axiosClient";
import type {
    ApprovePayload,
    AssignmentRequestSupport,
    CandidateTeam,
  RejectPayload,
  RequestSupportMyTeam,
  Status,
  SupportRequestListResponse,
} from "../types/provinceType";

const API_URL = "/support-request";

//lấy danh sách yêu cầu hỗ trợ theo trạng thái
export const provinceApi = {
  async getRequestSupport(
    status: Status  
  ): Promise<SupportRequestListResponse> {
    const response = await axiosClient.get(API_URL, {
      params: { status },
    });
    return response.data?.result;
  },

  //lấy danh sách đội của 1 tỉnh
async getCandidateTeams(
  requestId: string,
  params?: { supportType?: string }
): Promise<CandidateTeam[]> {
  const { data } = await axiosClient.get(
    `${API_URL}/${requestId}/candidate-teams`,
    { params }
  );

  // Cấu trúc thật: { code, result: { sos: {...}, teams: [...] } }
  // result.teams mới là mảng teams thật, KHÔNG phải result trực tiếp
  const rawTeams = data?.result?.teams;

  if (!Array.isArray(rawTeams)) {
    return [];
  }

  // Map lại field cho khớp với type CandidateTeam dùng trong UI:
  // - BE trả "name"        -> FE cần "teamName"
  // - BE trả "markerType"  -> FE cần "requesterTeam" (boolean)
  return rawTeams.map((t: any) => ({
    id: t.id,
    teamName: t.name,
    areaId: t.areaId,
    lat: t.lat,
    lon: t.lon,
    leaderName: t.leaderName,
    leaderPhone: t.leaderPhone,
    emergencyPhone: t.emergencyPhone,
    availableBoatGroups: t.availableBoatGroups,
    availableMedicalGroups: t.availableMedicalGroups,
    availableSearchRescueGroups: t.availableSearchRescueGroups,
    availableLogisticsGroups: t.availableLogisticsGroups,
    distanceKm: t.distanceKm,
    requesterTeam: t.markerType === "REQUESTER_TEAM",
  }));
},
// phê duyệt yêu cầu hỗ trợ
async approveSupportRequest(
  id: string,
  payload: ApprovePayload
) {
  console.log("APPROVE BODY:", payload);

  const response = await axiosClient.put(
    `${API_URL}/${id}/approve`,
    payload
  );

  return response.data;
}

,

//Từ chối yêu cầu hỗ trợ
  async rejectSupportRequest(
    id: string,
    payload: {
      provinceResponse: string;
    }
  ) {
    return axiosClient.put(
      `/support-request/${id}/approve`,
      payload
    );
  },

  async getListRequestSupportMyTeam():Promise<RequestSupportMyTeam[]>{
    const response=await axiosClient.get(`${API_URL}/my-team`)
    return response.data.result?.content??[]
  },
  async assignmentRequestSupport(supportRequestItemId:string,payload:AssignmentRequestSupport):Promise<void>{
   await axiosClient.post(`${API_URL}/items/${supportRequestItemId}/assign-group`,
      payload
    )
  },

  //team_leader từ chối yêu cầu hỗ trợ 
  async rejectsupportrequest(supportRequestItemId:string,payload:{
   reason:string
  }){
    return axiosClient.post(`${API_URL}/items/${supportRequestItemId}/team_reject`,
      payload
    )
  }
};



