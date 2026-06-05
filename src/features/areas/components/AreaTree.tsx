import type { Area } from "../types/areaType"
import { TreeNode } from "./TreeNode"

interface Props {
  areas: Area[]
  onSelect?:(area:Area)=>void

}


export const AreaTree = ({ areas,onSelect }: Props) => {
  return (
    <div >
      {areas.map((area) => (
        <TreeNode key={area.id} area={area} onSelect={onSelect}/>
      ))}
    </div>
  )
}