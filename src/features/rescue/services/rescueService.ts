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
};