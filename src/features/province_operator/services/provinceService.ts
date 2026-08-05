
import type { ProvinceOperatorDetail, ProvinceOperatorItem, RequestSupportMyTeam, RescueTeamItem } from '../types/provinceType';
import { provinceoperatorApi } from '../api/provinceoperatorApi';
import { provinceApi } from '../api/provinceApi';
import type { PayLoadAddProvinceOperator } from '@/features/rescue/types/rescueType';

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
},
// thêm điều phối cấp tỉnh
async addProvinceOperator(payload:PayLoadAddProvinceOperator):Promise<ProvinceOperatorItem>{
 return await provinceoperatorApi.addProvinceOperator(payload)
}
,

// xóa điều phối cấp tỉnh 
async deleteProvinceOperator(payload: { ids: string[] }): Promise<string> {
  return await provinceoperatorApi.deleteProvinceOperator(payload);
}
}
