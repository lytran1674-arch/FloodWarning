

import type { DetailResGroup, DisbandedGroup, ListMembers, PayloadUpdateResGroup } from "../types/grouptype";
import type { AvailableMember, CreateTeamRequest,    DetailMember,    InfoMemberTeam,    PayLoaAddMemberTeam,    PayLoadAddProvinceOperator,    ResCue, ResGroup, ResTeam, UpdateResCue } from "../types/rescueType";
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
async PickLeaderAndDeputy(
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

// // group leader cập nhật trạng thái lại của đội khi đã sửa chữa xong
// // (với tình trạng OFFLINE->AVAILABLE)
// async updateStatusGroup(groupId:string,status:string):Promise<string>{
// const response=await axiosClient.patch(`/res-groups/${groupId}/status`,status)
// return response.data;
// },

//teamleader xoa nhom cuu ho
async deleteGroup(groupId:string):Promise<string>{
  const response=await axiosClient.patch(`/res-groups/${groupId}/status`)
  return response.data;
},
//group leader cập nhật trạng thái từ OFFLINE->AVAILABLE
async updateStatusgroup(groupId:string):Promise<string>{
  const response=await axiosClient.patch(`/res-groups/${groupId}/status`);
  return response.data;
},
// chi tiết nhóm 
async detailResGroup(groupId:string):Promise<DetailResGroup>{
  const res=await axiosClient.get(`/res-groups/${groupId}`)
  return res.data.result;
}
,
// cập nhật thông tin nhóm 
async updateResGroup(groupId:string,payload:PayloadUpdateResGroup):Promise<string>{
  const res=await axiosClient.put(`res-groups/${groupId}`,payload)
  return res.data;
}

,
// xóa group
async ResetStatusGroup(groupId:string,status:string):Promise<string>{
  const res=await axiosClient.patch(`/res-groups/${groupId}/status`,
    {status:status}
    );
  return res.data;
}
,// danh sách nhóm disbanbed 
async ListGroupDisbanded():Promise<DisbandedGroup[]>{
  const res=await axiosClient.get('/res-groups/disbanded');
  return res.data.result?.content??[] 
},

// Thêm thành viên  
async addMember(groupId:string,payload: { userIds: string[] }):Promise<ListMembers[]>{
  console.log("Payload gửi lên:", payload); // 👈 thêm dòng này
  const res=await axiosClient.put(`/res-groups/${groupId}/members`,
    payload
  )
  return res.data.result??[];
}
,

//thêm thành viên vào đội
async AddMemberTeam(payload:PayLoaAddMemberTeam):Promise<InfoMemberTeam>{
  const res=await axiosClient.post("/res-team/rescuer",payload);
  return res.data.result;
}
,
//cập nhật thông tin thành viên cứu hộ trong đội
async updateResCue(userId:string,data:UpdateResCue):Promise<InfoMemberTeam>{
  const res=await axiosClient.put(`/res-team/rescuers/${userId}`,data);
  return res.data.result;
}

,
// tìm kiếm thành viên lực lượng cứu hộ theo keyword,số điện thoại , họ tên ,email
async SearchRescue(keyword:string):Promise<AvailableMember[]>{
  const res=await axiosClient.get("/res-team/rescuers/search",
    {params:{keyword}}
  );
  return res.data.result??[];
},

// chi tiết thành viên 
async detailMember(id:string):Promise<DetailMember>{
  const res=await axiosClient.get(`/res-team/detail-member/${id}`)
  return res.data.result
}
};