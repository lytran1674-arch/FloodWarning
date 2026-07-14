import { rescueApi } from "../api/rescureApi";
import type { CreateTeamRequest, ResCue, ResTeam } from "../types/rescueType";


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

  // group leader cập nhật trạng thái của nhóm khi đã sửa chữa xong
  async UpdateStatusGroup(groupId:string,status:string):Promise<string>{
    return rescueApi.updateStatusGroup(groupId,status);
  }
};