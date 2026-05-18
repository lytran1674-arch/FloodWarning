import type { AreaTree } from "../types/areaType"

interface Props {
  area: AreaTree
}

export const TreeNode = ({ area }: Props) => {
  return (
    <div className="ml-4">
      <p>{area.tenkhuvuc}</p>

      {area.children &&
        area.children.length > 0 && (
          <div className="ml-4 border-l pl-4">
            {area.children.map((child) => (
              <TreeNode
                key={child.area_id}
                area={child}
              />
            ))}
          </div>
        )}
    </div>
  )
}