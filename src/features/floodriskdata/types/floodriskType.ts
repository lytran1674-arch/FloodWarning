import type { RiskLevel } from "@/features/map/types/mapType";


export type MucDo= "LOW" | "MEDIUM" | "HIGH" ;
export type TrangThai="PENDING" | "SENT"
export type ThongBao= "EMAIL" | "WEB_PUSH"
export type JobType="MORNING" |"EVENING"
export type StatusPredict= "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED"
export interface FloodRiskData{
    area_id: string
    tenKhuVuc: string 
    lead1: MucDo
    lead1Probability: number
    lead2: MucDo
    lead2Probability:number
    lead3: MucDo
    lead3Probability:number
    predictedAt:string
    weatherFrom: string
    weatherTo: string 
}

export interface FloodRiskAlert{
    tenkhuvuc?:string
    riskLevel?: RiskLevel
    channel?:ThongBao
    status?: TrangThai
    createdAt?:string 

}

//lấy danh sách lịch sử chạy dự báo
export interface PredictionJobs{
    id:string
    startedAt:string // thời gian bắt đầu chạy dự báo
    finishedAt:string // thời gian kết thúc chạy dự báo
    jobType:JobType   // ca dự báo ( có 2 ca là sáng và chiều)
    status:StatusPredict //trạng thái chạy dự báo ( success:thành công,
    //  partial_success:hoàn thành nhưng vẫn còn thiếu dữ liệu htong sẽ chạy recovery để bổ sung,
    // falied: thất bại )
    totalAreas:number // tổng số khu vực cần dự báo
    processedAreas:number // số khu vực dự báo thành công
    highRiskAreas:number   //số khu vực dự báo ở mức high
    errors:number  //số khu vực dự báo lỗi
    recoveryAttempts:number //số lần chạy recovery sau khi dự báo (tối đa 3 lần)
    recoveredAreass:number // số khu vực được recovery thành công
    remainingMissing:number//số khu vực vẫn chưa có dữ liệu dự báo sau khi recovery
    message:string // thông tin kết quả hoặc mô tả trạng thái của lần chạy dự báo
}

//lấy chi tiết của 1 lịch sử chạy dự báo 
export interface PredictionJobsDetail{
    id:string
    startedAt:string
    finishedAt:string
    jobtype:JobType
    status:StatusPredict
    totalAreas:number
    processedAreas:number
    highRiskAreas:number
    errors:number
    recoveryAttempts:number
    recoveredAreass:number
    remainingMissing:number
    message:string


}
