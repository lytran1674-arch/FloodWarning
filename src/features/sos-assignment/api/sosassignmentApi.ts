import { axiosClient } from "@/api/axiosClient"

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
}