import { axiosClient } from "@/api/axiosClient";
import type { AiFloodPredictions, AIIoT, Overview } from "../type/thongkeType";
import type { JobType } from "@/features/floodriskdata/types/floodriskType";

const API_URL="/statistics"
export const ThongKeApi={
    //Lấy các chỉ số tổng quan của toàn hệ thống (SOS, đội cứu hộ, IoT…)
    // // để hiển thị dạng card khi mở Dashboard.
    async getDashboardStats():Promise<Overview>{
        const response=await axiosClient.get(`${API_URL}/overview`);
        return response.data.result;
    },

    //Lấy kết quả dự báo lũ từ mô hình AI theo từng phiên chạy 
    // //(mới nhất hoặc theo ngày/phiên sáng-tối).
    //phiên mới nhất
    async getAiFloodPredictionsLatest():Promise<AiFloodPredictions>{
        const res=await axiosClient.get(`${API_URL}/ai-predictions/latest`);
        return res.data.result;
    }
    ,
    //chọn ngày và phiên chạy model
    async getAiFloodPredictions(date:string,jobType:JobType):Promise<AiFloodPredictions>{
        const res=await axiosClient.get(`${API_URL}/ai-predictions`,{
            params:{date,jobType}
        })
        return res.data.result;
    },

    //Lấy snapshot nguy cơ lũ hiện tại từ dữ liệu tổng hợp AI + IoT.
    async getAiIotFloodRisk():Promise<AIIoT>{
        const res=await axiosClient.get(`${API_URL}/ai-iot`);
        return res.data.result;
    }
}