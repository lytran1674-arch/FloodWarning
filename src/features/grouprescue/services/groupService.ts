
import type { AssignmentGroup, DetailSupportRequestGroupLeader, Group, GroupSupport, LeaderCreateSupport, SupportRequestGroupLeader } from '../types/groupType'
import { groupApi } from '../api/groupApi'

export const groupService =  {
 async getAssignmentgroup():Promise<AssignmentGroup[]>{
    return await groupApi.getAssignmentGroup()
 }
 ,
  async getGroupsByTeam(teamId: string): Promise<Group[]> {
   return await groupApi.getGroupsByTeam(teamId)
  },
  // group leader tạo yêu cầu hỗ trợ 
  async GroupLeaderCreatedSupport(assignmentId:string,payload:LeaderCreateSupport):Promise<string>{
      return await groupApi.GroupLeaderCreatedSupport(assignmentId,payload)
   
    },
  
    //team-leader xem danh sách yêu cầu hỗ trợ từ group leader
    async ListSupportGroupLeader():Promise<SupportRequestGroupLeader[]>{
     return await groupApi.ListSupportGroupLeader()
    },
  
    //xử lý yêu cầu hỗ trợ
    async DetailSupportRequest(supportRequestId:string):Promise<DetailSupportRequestGroupLeader>{
      return await groupApi.DetailSupportRequest(supportRequestId)
    },
  
    //Hiển thị danh sách các group phù hợp của team cho từng hạng mục 
    async CandidateGroupSupport(supportRequestItemId:string):Promise<GroupSupport[]>{
      return await groupApi.CandidateGroupSupport(supportRequestItemId);
    },
  
    // Teamleader phân công nhiệm vụ cho group ứng với từng items
    async AssignmentSupportGroup(supportRequestItemId:string,groupId:string,note:string):Promise<string>{
      return await groupApi.AssignmentSupportGroup(supportRequestItemId,groupId,note)
    }
}
