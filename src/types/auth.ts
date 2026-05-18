export interface LoginPayLoad{
    email: string
    password: string
}
export interface RegisterPayLoad{
    hoten: string
    email: string
    sodt: string
    diachi: string
    ngaysinh: string
    gioitinh: string 
}

export interface User{
    hoten: string
    email: string
    sodt: string
    diachi: string
    role: string
    access_token:string

}