// features/map/types/map.types.ts
import type { Area } from "../../areas/types/areaType"


export interface AreaPolygon {
  id: string
  tenkhuvuc: string
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon
}

export interface AreaWithRisk extends Area {
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon
  riskLevel: RiskLevel
}

// features/map/types/mapType.ts
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN"

export const RISK_COLORS: Record<RiskLevel, { fill: string; stroke: string; label: string }> = {
  HIGH:    { fill: "#EF444466", stroke: "#EF4444", label: "Nguy hiểm cao" },
  MEDIUM:  { fill: "#F9731666", stroke: "#F97316", label: "Cảnh báo" },
  LOW:     { fill: "#22C55E55", stroke: "#22C55E", label: "An toàn" },
  UNKNOWN: { fill: "#94A3B855", stroke: "#94A3B8", label: "Chưa có dữ liệu" },
}