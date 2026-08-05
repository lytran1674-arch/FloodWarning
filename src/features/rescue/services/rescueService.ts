import { rescueApi } from "../api/rescureApi";
import type { AddMemberToGroup, DetailResGroup, DisbandedGroup, ListMembers } from "../types/grouptype";
import type { CreateTeamRequest, InfoMemberTeam, PayLoaAddMemberTeam, ResCue, ResTeam } from "../types/rescueType";


export const rescueService = {
  async createTeamAndImport(
    data: CreateTeamRequest,
    file?: File
  ) {
    const team = await rescueApi.createTeam(data);

    if (file) {
      await rescueApi.importRescuers(
        team.result.id,
        file
      );
    }

    return team;
  },
  //lấy danh sách thành viên chauw có group
  async getTeamMembersWithoutGroup(id:string):Promise<ResCue[]>{
    return await rescueApi.getTeamMembersWithoutGroup(id);
  },
  // chi tiết đội cứu hộ 
  async getDetailTeam(teamId:string):Promise<ResTeam>{
    return await rescueApi.getDetailTeamId(teamId)
  }
  ,
  // xóa member ra khỏi group
  async RemoveMemberGroup(groupId:string,userId:string):Promise<ResCue>{
    return await rescueApi.removeMemberGroup(groupId,userId);
  },
  // xóa member ra khỏi team 
  async RemoveMemberTeam(groupId:string,userId:string):Promise<ResCue>{
    return await rescueApi.removeMemberteam(groupId,userId)
  },

  // // group leader cập nhật trạng thái của nhóm khi đã sửa chữa xong
  // async UpdateStatusGroup(groupId:string,status:string):Promise<string>{
  //   return rescueApi.updateStatusGroup(groupId,status);
  // },


  //group leader cập nhật trạng thái từ OFFLINE->AVAILABLE
  async updateStatusgroup(groupId:string):Promise<string>{
   return await rescueApi.updateStatusgroup(groupId);
  },
  //chi tiết nhóm
  async DetailResGroup(groupId:string):Promise<DetailResGroup>{
    return await rescueApi.detailResGroup(groupId);
  },

  // Cập nhật thông tin nhóm 
  //xóa nhóm 
  async ResetStatusGroup(groupId:string,status:string):Promise<string>{
    return await rescueApi.ResetStatusGroup(groupId,status);
  },

  // danh sách nhóm disbanbed 
  async ListGroupDisbanded():Promise<DisbandedGroup[]>{
      return await rescueApi.ListGroupDisbanded();
  },
  // Thêm thành viên  
  async addMember(groupId:string,payload: { userIds: string[] }):Promise<ListMembers[]>{
    return await rescueApi.addMember(groupId,payload);
  }
  ,

  //thêm thành viên vào đội
  async AddMemberTeam(payload:PayLoaAddMemberTeam):Promise<InfoMemberTeam>{
    return await rescueApi.AddMemberTeam(payload);
    
  }
};