export interface NotificationPopup {
  id: string;
  title: string;
  message: string;
  // CALL_WORKFLOW_FAILED: gọi SOS thất bại -> claim qua /sos-request/{sosId}/claim-dispatcher
  // SUPPORT_REQUEST_CALL_FAILED: gọi Province Operator cho support request thất bại
  //   -> claim qua /support-request/{supportRequestId}/claim-dispatcher
  type: "CALL_WORKFLOW_FAILED" | "SUPPORT_REQUEST_CALL_FAILED" | string;
  sosId?: string;
  supportRequestId?: string;
  trackingCode: string;
  createdAt: string;
}

export interface Alarm{
    id:string
    title:string
    message:string
    sosRequestId:string
    trackingCode:string
    callTaskId:string
    createdAt:string
}