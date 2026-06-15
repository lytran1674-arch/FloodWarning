// features/map/utils/riskColor.ts
export const RISK_COLORS: Record<string, string> = {
  LOW: "#22c55e",      // xanh lá
  MEDIUM: "#facc15",   // vàng
  HIGH: "#f97316",     // cam
  VERY_HIGH: "#ef4444" // đỏ
};

export function getRiskColor(level?: string) {
  return RISK_COLORS[level ?? "LOW"] ?? "#9ca3af"; // mặc định xám
}