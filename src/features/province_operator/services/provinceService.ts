
import type { ProvinceOperator, ProvinceOperatorDetail, ProvinceOperatorItem, RequestSupportMyTeam, RescueTeamItem } from '../types/provinceType';
import { provinceoperatorApi } from '../api/provinceoperatorApi';
import { provinceApi } from '../api/provinceApi';
import type { PayLoadAddProvinceOperator, UpdateResCue } from '@/features/rescue/types/rescueType';

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
},
// cập nhật thông tin điều phối cấp tỉnh
async updateProvinceOperator(data:UpdateResCue):Promise<ProvinceOperatorDetail>{
 return await provinceoperatorApi.updateProvinceOperator(data);

},

//tìm kiếm điều phối cấp tỉnh
async searchProvinceOperator(keyword:string):Promise<ProvinceOperator[]>{
 return await provinceoperatorApi.searchProvinceOperator(keyword)
}
}
