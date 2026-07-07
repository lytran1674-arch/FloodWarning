import { emergencyApi } from "../api/emergencyApi";
import type { Emergency } from "../types/emergencyType";


export const emergencyService ={

  //lấy hotline đội theo lat lon của ng dân
  async getHotlineTeam(lat:number,lon:number):Promise<Emergency>{
    return await emergencyApi.getHotline(lat,lon)
  }

}
