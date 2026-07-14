
import type { CreateTeamRequest,    ResCue, ResGroup, ResTeam } from "../types/rescueType";
import { axiosClient } from "@/api/axiosClient";


const API_URL = "https://api-lulut.io.vn";

export const rescueApi = {
createTeam: async (data: CreateTeamRequest) => {
  try {
    const response = await axiosClient.post(
      `${API_URL}/res-team`,
      data
    );

    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);
    throw error;
  }
},
async importRescuers(teamId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(
      `${API_URL}/res-team/${teamId}/import-rescuers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ override header cho request này
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    throw error;
  }
},
async PickLeader(
  teamId: string,
  leaderId: string,
  deputyLeaderId:string
) {
  const response = await axiosClient.put(
    `${API_URL}/res-team/${teamId}/leader`,
    {
      leaderId,
      deputyLeaderId
    }
  );

  return response.data;
}
,
async ListLeaderArea(areaId:string):Promise<ResTeam[]>{
  const response=await axiosClient.get(`${API_URL}/res-team/leader/${areaId}`)
  return response.data.result
},

async CreateGroup(teamId: string, data: any): Promise<ResGroup> {
  try {
    const response = await axiosClient.post(
      `${API_URL}/res-groups/team/${teamId}`,
      data
    );
    return response.data.result;
  } catch (error: any) {
    console.log("Error response:", error.response?.data); // ← thêm dòng này
    throw error;
  }
}

,
async getTeamMembersWithoutGroup(id:string):Promise<ResCue[]>{
  const response=await axiosClient.get(`${API_URL}/res-groups/team/${id}/available-members`)
  return  response.data.result;
},

async getTeamByArea(
  parent_id: string
): Promise<ResTeam[]> {

  const response = await axiosClient.get(
    `${API_URL}/res-team/area/${parent_id}`
  );

  return response.data.result?.content ?? [];
}
,
async getGroupByTeam(teamId:string):Promise<ResGroup[]>{
  const response=await axiosClient.get(`${API_URL}/res-team/${teamId}/group`)
   return response.data.result?.content ?? [];
},
async getMemberByGroup(groupId:string):Promise<ResCue[]>{
  const response=await axiosClient.get(`${API_URL}/res-groups/${groupId}/members`)
   return response.data.result?.content ?? [];
},
async addMemberToGroup(
  groupId: string,
  payload: {
    userIds: string[];
  }
) {
  const response = await axiosClient.put(
    `${API_URL}/res-groups/${groupId}/members`,
    payload
  );

  return response.data.result;
},

async pickLeaderGroup(
  groupId: string,
  payload: {
    userId: string;
  }
) {
  const response = await axiosClient.put(
    `${API_URL}/res-groups/${groupId}/leader`,
    payload
  );

  return response.data.result;
},

// chi tiết 1 đội
async getDetailTeamId(teamId:string):Promise<ResTeam>{
  const response=await axiosClient.get(`/res-team/detail/${teamId}`)
  return response.data.result;
}
,
// cập nhật đội cứu hộ 
async updateResTeam(teamId: string, data: ResTeam): Promise<ResTeam> {
  const response = await axiosClient.put(`/res-team/${teamId}`, data);
  return response.data.result;
},

// xóa member ra khỏi group
async removeMemberGroup(groupId:string,userId:string):Promise<ResCue>{
  const response=await axiosClient.delete(`/res-groups/${groupId}/members/${userId}`)
  return response.data
}
,
// xóa member ra khỏi team
async removeMemberteam(teamId:string,userId:string):Promise<ResCue>{
  const response=await axiosClient.delete(`/res-team/${teamId}/members/${userId}`)
  return response.data
},

// group leader cập nhật trạng thái lại của đội khi đã sửa chữa xong
// (với tình trạng OFFLINE->AVAILABLE)
async updateStatusGroup(groupId:string,status:string):Promise<string>{
const response=await axiosClient.patch(`/res-groups/{groupId}/status`,status)
return response.data;
}
};