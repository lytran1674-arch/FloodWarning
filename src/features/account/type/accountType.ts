import type { Role } from "@/features/auth/types/authType"


export interface Account{
    id:string
    hoten:string
    gioitinh:boolean
    ngaysinh:string
    sodt:string
    diachi:string
    email:string
    ghichu:string
    area:string
    role:Role
    chucVu:string
    rescueTeam:string
    rescueGroup:string
    province:string

}