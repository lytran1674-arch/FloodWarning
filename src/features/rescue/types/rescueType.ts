export interface CreateTeamRequest{
 name:string
    description:string 
    areaId:string
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