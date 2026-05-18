type RiskLevel= "an toàn" | "nguy cơ" | "nguy hiểm"
export interface Flood_predictions{
    madubao: string
    madulieu: string
    risk_level : RiskLevel
    predicted_at: string
    area_id: string
}