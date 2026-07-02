
import type { ProvinceOperatorDetail, RescueTeamItem } from '../types/provinceType';
import { provinceoperatorApi } from '../api/provinceoperatorApi';

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
}
}
