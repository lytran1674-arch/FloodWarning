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

export const provinceApi = {
  async getRequestSupport(
    status: Status
  ): Promise<SupportRequestListResponse> {
    const response = await axiosClient.get(API_URL, {
      params: { status },
    });
    return response.data?.result;
  },
async getCandidateTeams(
  requestId: string,
  params?: { supportType?: string; lat?: number; lon?: number }
): Promise<CandidateTeam[]> {
  const { data } = await axiosClient.get(
    `${API_URL}/${requestId}/candidate-teams`,
    { params }
  );
  return data.result as CandidateTeam[];
},
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
  async rejectSupportRequest(
    id: string,
    payload: {
      provinceResponse: string;
    }
  ) {
    return axiosClient.put(
      `/support-request/${id}/reject`,
      payload
    );
  },

  async getListRequestSupportMyTeam():Promise<RequestSupportMyTeam[]>{
    const response=await axiosClient.get(`${API_URL}/my-team`)
    return response.data.result?.content??[]
  },
  async assignmentRequestSupport(id:string,payload:AssignmentRequestSupport):Promise<void>{
   await axiosClient.post(`${API_URL}/${id}/assign-group`,
      payload
    )
  }
};



