export type TrangThai= "Warning" | "Low" | "Normal"
export interface IotDevice{
    device_id: string 
    area_id: string 
    ten_thietbi:string
    lat: number
    lon:number
    nguong_canh_bao: number
    trang_thai: TrangThai
    last_seen_at: Date
    approved_by: string 
    approved_at:Date
}

export interface CreateIotDevicePayLoad{
    area_id: string 
    ten_thietbi:string
    lat: number
    lon:number
    nguong_canh_bao: number
    trang_thai: TrangThai
    last_seen_at: Date
    approved_by: string 
    approved_at:Date
}

