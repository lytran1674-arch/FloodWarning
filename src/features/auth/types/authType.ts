
type TrangThai= ''
 export type Role= "ADMIN" | " RESCUER" | "CITIZEN"

export interface User{
    id:string
    hoten: string
    gioitinh: boolean
    ngaysinh: string
    sodt:string
    diachi: string
    email: string
    role: Role
    trangthai: TrangThai
    ghichu: string
    areaId:string
    created_at: string
    updated_at: string
    teamId?:string
    teamName?:string
    isLeader?:boolean
    isTeamLeader?:boolean
    isGroupLeader?:boolean
}

export interface LoginPayLoad{
    loginInfo: string 
    password: string
}

export interface LoginResponse{
   code: number
  result: {
    accessToken: string
    role: Role
    authenticated: boolean
    hoten:string 
    id: string 
    areaId:string
    teamId?:string
    teamName?:string
    sodt?:string
    isTeamLeader?:boolean
    isGroupLeader?:boolean
  }
}

export interface RegisterResponse{
    message: string
}

export interface RegisterPayload {
  hoten: string;
  sodt: string;
  email: string;
  matkhau: string;
  tinh_id: string;
  tinh_ten: string;
  phuong_xa_id: string;
  phuong_xa_ten: string;
  so_nha: string;
}
export interface Option {
  value: string;
  label: string;
}