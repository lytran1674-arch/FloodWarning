import axios from "axios";
import type { ApiResPonse, CreateTeamRequest, ImportResult, ResTeam } from "../types/rescueType";


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
}
};