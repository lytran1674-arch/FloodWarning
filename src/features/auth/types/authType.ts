
type TrangThai= ''
 export type Role= "admin" | " rescuer" | "citizen"

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
    email: string 
    matkhau: string
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
    user: User
    access_token: string
}

export interface RegisterResponse{
    message: string
}