import axios from "axios";
import type { ApiResPonse, CreateTeamRequest, ImportResult, ResCue, ResGroup, ResTeam } from "../types/rescueType";


const API_URL = "https://api-lulut.io.vn";

export const rescueApi = {
createTeam: async (data: CreateTeamRequest) => {
  try {
    const response = await axios.post(
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

    const response = await axios.post(
      `${API_URL}/res-team/${teamId}/import-rescuers`,
      formData
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
  userId: string
) {
  const response = await axios.put(
    `${API_URL}/res-team/${teamId}/leader`,
    {
      userId,
    }
  );

  return response.data;
}
,
async ListLeaderArea(areaId:string):Promise<ResTeam[]>{
  const response=await axios.get(`${API_URL}/res-team/leader/${areaId}`)
  return response.data.result
},

async CreateGroup(
  teamId: string,
  data: any
): Promise<ResGroup> {

  const response = await axios.post(
    `${API_URL}/res-groups/team/${teamId}`,
    data
  );

  return response.data.result;

}

,
async getTeamMembersWithoutGroup(id:string):Promise<ResCue[]>{
  const response=await axios.get(`${API_URL}/res-groups/team/${id}/available-members`)
  return  response.data.result;
},
async addMemberToGroup(userId:string):Promise<ResTeam>{
  const response=await axios.put(`${API_URL}/res-groups/${userId}/members`)
  return response.data.result
}
,
async setGroupLeader(userId:string):Promise<ResTeam>{
  const response=await axios.put(`${API_URL}/res-groups/${userId}/leader`)
  return response.data.result
}
,
async getTeamByArea(
  parent_id: string
): Promise<ResTeam[]> {

  const response = await axios.get(
    `${API_URL}/res-team/area/${parent_id}`
  );

  return response.data.result?.content ?? [];
}
,
async getGroupByTeam(teamId:string):Promise<ResGroup[]>{
  const response=await axios.get(`${API_URL}/res-team/${teamId}/group`)
   return response.data.result?.content ?? [];
},
async getMemberByGroup(groupId:string):Promise<ResCue[]>{
  const response=await axios.get(`${API_URL}/res-groups/${groupId}/members`)
   return response.data.result?.content ?? [];
}
};