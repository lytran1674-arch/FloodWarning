// features/map/types/map.types.ts
import type { Area } from "../../areas/types/areaType"

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" 

export interface AreaPolygon {
  id: string
  tenkhuvuc: string
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon
}

export interface AreaWithRisk extends Area {
  geometry: GeoJSON.MultiPolygon | GeoJSON.Polygon
  riskLevel: RiskLevel
}

// Màu tô theo risk level
export const RISK_COLORS: Record<RiskLevel, { fill: string; stroke: string; label: string }> = {
  HIGH: { fill: "#EF444466", stroke: "#EF4444", label: "Nguy hiểm cao"  },
  MEDIUM: { fill: "#F9731666", stroke: "#F97316", label: "Cảnh báo"        },
  LOW:  { fill: "#22C55E55", stroke: "#22C55E", label: "An toàn"         },
}