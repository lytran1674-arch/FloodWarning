
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
    area_id:string
    created_at: string
    updated_at: string
}

export interface LoginPayLoad{
    loginInfo: string 
    password: string
}

export interface RegisterPayLoad{
    hoten: string
    email: string 
    sodt: string
    ngaysinh: string 
    diachi: string
    gioitinh: boolean
    matkhau: string
}

export interface LoginResponse{
   code: number
  result: {
    token: string
    role: Role
    authenticated: boolean
    hoten:string 
    id: string 
  }
}

export interface RegisterResponse{
    message: string
}