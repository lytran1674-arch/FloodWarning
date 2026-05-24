import type { Area } from "../types/areaType"
import { TreeNode } from "./TreeNode"

interface Props {
  areas: Area[]
}


export const AreaTree = ({ areas }: Props) => {
  return (
    <div>
      {areas.map((area) => (
        <TreeNode key={area.id} area={area} />
      ))}
    </div>
  )
}