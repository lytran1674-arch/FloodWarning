
import { sosassignmentApi } from '../api/sosassignmentApi'

export const sosassignmentService = {
 // group leader báo thất bại đến team leader
 async FailedAssignment(assignmentId:string,failedReason:string,failedNote:string):Promise<string>{
   return sosassignmentApi.Failed(assignmentId,failedReason,failedNote);
 }
}
