export interface NotificationPopup{
    id:string
    title:string
    message:string
    type:string
    sosId:string
    trackingCode:string
    createdAt:string
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