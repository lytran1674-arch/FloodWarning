
import { alertApi } from '../api/alertApi'
import type { Alert, PopupAlert } from '../types/alertType';

export const alertService =  {
 async getMyAlertById(userId:string):Promise<Alert[]>{
    return await alertApi.getMyAlertById(userId);
 },
 async getPopupAlert():Promise<PopupAlert[]>{
   return await alertApi.getPopupAlert();
 },
 async markAlertRead(alertId:string):Promise<PopupAlert>{
   return await alertApi.markAlertRead(alertId)
 }
}
