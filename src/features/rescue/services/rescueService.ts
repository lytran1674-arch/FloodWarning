import { rescueApi } from "../api/rescureApi";
import type { CreateTeamRequest } from "../types/rescueType";


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
};