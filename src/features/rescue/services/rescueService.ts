import { rescueApi } from "../api/rescureApi";
import type { CreateTeamRequest, ResCue } from "../types/rescueType";


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
  }
};