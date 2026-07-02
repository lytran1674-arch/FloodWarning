import { axiosClient } from "@/api/axiosClient";
import type {
    ApprovePayload,
    CandidateTeam,
  RejectPayload,
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
  const body: ApprovePayload = {
    assignedTeamId: payload.assignedTeamId,
  };

  if (payload.provinceResponse?.trim()) {
    body.provinceResponse =
      payload.provinceResponse.trim();
  }

  console.log("APPROVE BODY:", body);

  const response = await axiosClient.put(
    `${API_URL}/${id}/approve`,
    body
  );

  return response.data;
},
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
};

