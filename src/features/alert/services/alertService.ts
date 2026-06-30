
import { alertApi } from '../api/alertApi'
import type { Alert } from '../types/alertType';

export const alertService =  {
 async getMyAlertById(userId:string):Promise<Alert[]>{
    return await alertApi.getMyAlertById(userId);
 }
}
