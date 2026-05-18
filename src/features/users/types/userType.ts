
type TrangThai= ''
type Role= "admin" | " rescuer" | "citizen"

export interface Users{
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

export interface CreateUser{
    hoten: string
    gioitinh: boolean
    ngaysinh: string
    sodt: string
    diachi: string
    email: string 
}

export interface UpdateUserPayLoad{
    hoten?: string
    gioitinh?: boolean
    ngaysinh?: string
    sodt?: string
    diachi?: string
    email?: string 
}

