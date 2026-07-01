import { axiosClient } from "@/api/axiosClient"
import type { AssignmentGroup, AvailableStatus, Group, GroupListResponse } from "../types/groupType"


const API_URL="/sos-assignment"
export const groupApi ={
  async getAssignmentGroup():Promise<AssignmentGroup[]>{
    const response=await axiosClient.get(`${API_URL}/my-group`)
    return response.data.result??[]
  },
 async getGroupsByTeam(teamId: string): Promise<Group[]> {
    const res = await axiosClient.get<GroupListResponse>(
      `/res-team/${teamId}/group`
    );
    return res.data?.result?.content ?? [];
  },
async getAvailableStatuses(
  assignmentId: string
): Promise<AvailableStatus[]> {

  const res = await axiosClient.get(
    `${API_URL}/${assignmentId}/available-statuses`
  );

  return res.data.result ?? [];
}
,
  async updateStatus(
    assignmentId: string,
    status: string
  ) {

    return axiosClient.patch(
      `${API_URL}/${assignmentId}/status`,
      { status }
    );
  },
}
