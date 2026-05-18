import type { AreaTreeNode } from "../../utils/buildTree"

interface Props {
  data: AreaTreeNode[]
}

const AreaTree = ({ data }: Props) => {
  return (
    <div>
      {data.map((item) => (
        <div key={item.area_id} className="ml-4">
          <div className="py-1">
            {item.tenkhuvuc}
          </div>

          {item.children.length > 0 && (
            <AreaTree data={item.children} />
          )}
        </div>
      ))}
    </div>
  )
}

export default AreaTree