import type { Area } from "../types/areas"

export interface AreaTreeNode extends Area {
  children: AreaTreeNode[]
}

export const buildTree = (
  areas: Area[],
  parentId: string | null = null
): AreaTreeNode[] => {
  return areas
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(areas, item.area_id),
    }))
}