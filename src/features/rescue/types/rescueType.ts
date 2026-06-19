export interface CreateTeamRequest{
 name:string
    description:string 
    areaId:string
}
export interface ResCue{
  userId:string
  fullName:string 
  phone:string
  isLeader?:boolean
}

export interface ResTeam{
  id:string
  name:string
  description:string
  areaId:string
  leaderId:string | null
  leaderName:string |null

}

export interface ApiResPonse<T>{
    code:number
    result:T
}


export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

type STATUS= "AVAILABLE"
export interface ResGroup{
 id:string
 name:string
 teamId:string
 teamName:string
 status:STATUS
 hasBoat:boolean
 hasMedical:boolean
 notes:string
}