
import type { AssignmentGroup, Group } from '../types/groupType'
import { groupApi } from '../api/groupApi'

export const groupService =  {
 async getAssignmentgroup():Promise<AssignmentGroup[]>{
    return await groupApi.getAssignmentGroup()
 }
 ,
  async getGroupsByTeam(teamId: string): Promise<Group[]> {
   return await groupApi.getGroupsByTeam(teamId)
  },

}
