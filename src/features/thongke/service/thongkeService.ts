
import type { AiFloodPredictions, AIIoT, Overview, SumRequestSoS } from "../type/thongkeType";
import type { JobType } from "@/features/floodriskdata/types/floodriskType";
import { ThongKeApi } from "../api/thongkeApi";

export const ThongKeService={
    //Lấy các chỉ số tổng quan của toàn hệ thống (SOS, đội cứu hộ, IoT…)
    // // để hiển thị dạng card khi mở Dashboard.
    async getDashboardStats():Promise<Overview>{
       return await ThongKeApi.getDashboardStats()
    },

    //Lấy kết quả dự báo lũ từ mô hình AI theo từng phiên chạy 
    // //(mới nhất hoặc theo ngày/phiên sáng-tối).
    //phiên mới nhất
    async getAiFloodPredictionsLatest():Promise<AiFloodPredictions>{
        return await ThongKeApi.getAiFloodPredictionsLatest();
    }
    ,
    //chọn ngày và phiên chạy model
    async getAiFloodPredictions(date:string,jobType:JobType):Promise<AiFloodPredictions>{
       return await ThongKeApi.getAiFloodPredictions(date,jobType);
    },

    //Lấy snapshot nguy cơ lũ hiện tại từ dữ liệu tổng hợp AI + IoT.
    async getAiIotFloodRisk():Promise<AIIoT>{
       return await ThongKeApi.getAiIotFloodRisk();
    },
      //  hiển thị gồm tổng số yêu cầu cứu hộ, số yêu cầu đã hoàn thành, số yêu cầu đang xử lý và số yêu cầu đã hủy.
    async getSumRequestSoS(from:string,to:string):Promise<SumRequestSoS>{
         return await ThongKeApi.getSumRequestSoS(from,to)
        }

}