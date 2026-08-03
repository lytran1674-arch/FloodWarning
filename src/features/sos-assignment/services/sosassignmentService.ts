

import type { AssignSos } from '@/features/sosrequest/types/sosType';
import { sosassignmentApi } from '../api/sosassignmentApi'

export const sosassignmentService = {
 // group leader báo thất bại đến team leader
 async FailedAssignment(assignmentId:string,failedReason:string,failedNote:string):Promise<string>{
   return sosassignmentApi.Failed(assignmentId,failedReason,failedNote);
 },
    //Phân công giao nhiệm vụ khi số lượng thành viên trong nhóm ko đạt số lượng tối thiếu   
     async assignWithMinimum(payload:AssignSos):Promise<string>{
        return await sosassignmentApi.assignWithMinimum(payload);
     }
}
