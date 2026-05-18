type TrangThaiXuLy= "pending" | "processing" | "done" | "cancel"
type TinhTrangNguoiDan= "injured" | "trapped" | "vulnerable"
type MucDoKhanCap= "critical" | "high" | "medium" | "low"

export interface SOS_Request{
    masos: string
    user_id?: string | null
    area_id: string
    sodt: string
    device_id: string
    ip_device: string
    location: string
    mota?: string
    created_at: string
    status: TrangThaiXuLy
    priority: MucDoKhanCap
    conditions: TinhTrangNguoiDan
    updated_at: string
}