import { axiosClient } from "@/api/axiosClient"
import type { AssignCandidateGroup } from "../types/sosassignmentType";


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

    //hiển thị danh sách đội phù hợp để phân công cho group cứu hộ
    async getCandidateAssign(sosId:string):Promise<AssignCandidateGroup[]>{
        const response=await axiosClient.get(`${API_URL}/assign-candidate/${sosId}`);
        return response.data.result??[];
    }
  
}
