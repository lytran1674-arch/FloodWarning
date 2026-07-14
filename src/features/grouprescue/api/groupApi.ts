import { axiosClient } from "@/api/axiosClient"
import type { AssignmentGroup, AvailableStatus, DetailSupportRequestGroupLeader, Group, GroupListResponse, GroupSupport, LeaderCreateSupport, SupportRequestGroupLeader } from "../types/groupType"



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

  // group leader tạo yêu cầu hỗ trợ 
  async GroupLeaderCreatedSupport(assignmentId:string,payload:LeaderCreateSupport):Promise<string>{
    const response=await axiosClient.post(`/support-request/group/${assignmentId}`,payload)
    return response.data
  },

  //team-leader xem danh sách yêu cầu hỗ trợ từ group leader
  async ListSupportGroupLeader():Promise<SupportRequestGroupLeader[]>{
    const response=await axiosClient.get("/support-request/group")
    return response.data.result?.content??[]
  },

  //xử lý yêu cầu hỗ trợ
  async DetailSupportRequest(supportRequestId:string):Promise<DetailSupportRequestGroupLeader>{
    const response=await axiosClient.get(`/support-request/group/${supportRequestId}`)
    return response.data.result
  },

  //Hiển thị danh sách các group phù hợp của team cho từng hạng mục 
  async CandidateGroupSupport(supportRequestItemId:string):Promise<GroupSupport[]>{
    const response=await axiosClient.get(`/res-groups/support-candidates/${supportRequestItemId}`);
    return response.data.result??[]
  },

  // Teamleader phân công nhiệm vụ cho group ứng với từng items
  async AssignmentSupportGroup(supportRequestItemId:string,groupId:string,note:string):Promise<string>{
    const response=await axiosClient.post(`/support-request/support-request-items/${supportRequestItemId}/assign-group`,
      {
        groupId,note
      }
    )
    return response.data
  }
}
