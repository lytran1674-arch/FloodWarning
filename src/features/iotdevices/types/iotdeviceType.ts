export type TrangThai= "Warning" | "Low" | "Normal"
export interface IotDevice {
  id: string;
  device_code: string;
  area_id: string;
  tenkhuvuc: string;
  ten_thietbi: string;
  nguong_canh_bao: number | null;
  lat: number;
  lon: number;
  trang_thai: string;
  createdAt: string;
  updatedAt: string;
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

export type DeviceStatus='pending' | 'active' | 'rejected'
export type TabFilter= 'all' | DeviceStatus
export interface DeviceCounts{
    total:number
    active:number
    pending:number
    rejected:number
}
