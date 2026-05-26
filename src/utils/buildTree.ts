import type { AreaTree } from "../features/areas/components/AreaTree"  // ← đổi import đúng file
import type { AreaTree } from "../features/areas/types/areaType"

export const buildTree = (
  areas: AreaTree[],
  parentId: string | null = null
): AreaTree[] => {
  return areas
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(areas, item.id),  
    }))
}