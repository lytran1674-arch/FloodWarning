// src/features/province_operator/api/provinceApi.ts
import { axiosClient } from "@/api/axiosClient";
import type {
  //ApprovePayload,
  ImportProvinceOperatorResponse,
  ProvinceOperator,
  ProvinceOperatorDetail,
  ProvinceOperatorListResponse,
  //RejectPayload,
  RescueTeamItem,
} from "../types/provinceType";

const API_URL = "/province-operator";

export const provinceoperatorApi = {
  async importProvinceOperators(
    file: File
  ): Promise<ImportProvinceOperatorResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosClient.post<ImportProvinceOperatorResponse>(
      `${API_URL}/import`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  async getProvinceOperatorList(
    page = 0,
    size = 20
  ): Promise<ProvinceOperatorListResponse> {
    const { data } = await axiosClient.get<ProvinceOperatorListResponse>(
      API_URL,
      { params: { page, size } }
    );
    return data;
  },



  async getMyTeams(operatorId: string) {
    const { data } = await axiosClient.get(
      `/province-operator/${operatorId}/teams`
    );
    return data.result.content as {
      id: string;
      name: string;
      leaderName: string;
      groupCount: number;
    }[];
  },

  async getListProvinceOperator(): Promise<ProvinceOperator> {
    const response = await axiosClient.get<ProvinceOperator>(API_URL);
    return response.data;
  },

   async getProvinceOperatorDetail(
    id: string
  ): Promise<ProvinceOperatorDetail> {
    const response = await axiosClient.get(`${API_URL}/${id}`);
    return response.data.result;
  },

  async getTeamsByProvinceOperator(
  id: string
): Promise<RescueTeamItem[]> {
  const response = await axiosClient.get(
    `${API_URL}/${id}/teams`
  );

  return response.data.result?.content ?? [];
}
};