type RiskLevel= "an toàn" | "nguy cơ" | "nguy hiểm"
export interface Flood_Alert{
    macanhbao: string
    user_id: string
    area_id: string
    risk_level: RiskLevel
    message: string
    channel: string
    status: string
    sent_at: string
    created_at: string
}