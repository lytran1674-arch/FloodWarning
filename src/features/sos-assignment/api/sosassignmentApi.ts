import { axiosClient } from "@/api/axiosClient"
import type { AssignSos, } from "@/features/sosrequest/types/sosType";

const API_URL="/sos-assignment"

export const sosassignmentApi =  {
    //group leader báo thất bại đến TeamLeader
    async Failed(assignmentId:string,failedReason:string,failedNote:string):Promise<string>{
        const response=await axiosClient.patch(`${API_URL}/${assignmentId}/failed`,
            {
                failedReason,failedNote
            }
        )
        return response.data;
    },
    
    //Phân công giao nhiệm vụ khi số lượng thành viên trong nhóm ko đạt số lượng tối thiếu   
    async assignWithMinimum(payload:AssignSos):Promise<string>{
        const res=await axiosClient.post("API_URL",
            payload
        );
        return res.data;
    }
    
    
}