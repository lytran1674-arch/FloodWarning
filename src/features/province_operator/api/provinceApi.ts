import { axiosClient } from "@/api/axiosClient";
import type {
    ApprovePayload,
    AssignmentRequestSupport,
    CandidateTeam,
  // RejectPayload,
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
  teamId: string,
): Promise<CandidateTeam[]> {
  const res = await axiosClient.get(
    `${API_URL}/items/${teamId}/candidate-teams`,

  );    

  

  // Map lại field cho khớp với type CandidateTeam dùng trong UI:
  // - BE trả "name"        -> FE cần "teamName"
  // - BE trả "markerType"  -> FE cần "requesterTeam" (boolean)
   return (res.data.result ?? []).map((team: any) => ({
    id:                  team.teamId ?? team.id,        // thử cả 2
    teamName:            team.teamName ?? team.name,
    lat:                 team.lat ?? team.latitude,
    lon:                 team.lon ?? team.longitude,
    leaderName:          team.leaderName,
    leaderPhone:         team.leaderPhone,
    emergencyPhone:      team.emergencyPhone,
    availableGroupCount: team.availableGroupCount,
    distanceKm:          team.distanceKm,
    requesterTeam:       team.requesterTeam ?? false,
  }))
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
  async teamleaderrejectsupportrequets(supportRequestItemId:string,payload:{
   reason:string
  }){
   
    return axiosClient.post(`${API_URL}/items/${supportRequestItemId}/team_reject`,
      payload
    )
  }
};



