
import type { ProvinceOperatorDetail, RequestSupportMyTeam, RescueTeamItem } from '../types/provinceType';
import { provinceoperatorApi } from '../api/provinceoperatorApi';
import { provinceApi } from '../api/provinceApi';

export const provinceService =  {
  async getProvinceOperatorDetail(
  id: string
): Promise<ProvinceOperatorDetail> {
  return provinceoperatorApi.getProvinceOperatorDetail(id);
}
,
async getTeamsByProvinceOperator(
  id: string
): Promise<RescueTeamItem[]> {
  return provinceoperatorApi.getTeamsByProvinceOperator(id);
},
async getListRequestSupportMyTeam():Promise<RequestSupportMyTeam[]>{
  return await provinceApi.getListRequestSupportMyTeam();
}
}
