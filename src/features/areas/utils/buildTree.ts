import type { AreaTree } from "../types/areaType"  // ← đổi import đúng file

export const buildTree = (
  areas: AreaTree[],
  parentId: string | null = null
): AreaTree[] => {
  return areas
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(areas, item.id),  // ← đổi area_id → id
    }))
}