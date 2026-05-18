import { AreaTable } from "../components/AreaTable"
import { AreaTree } from "../components/AreaTree"

import { useArea } from "../hooks/useArea"

import { buildTree } from "../utils/buildTree"

export const AreaPage = () => {
  const { areas, loading } = useArea()

  const treeData = buildTree(areas)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <AreaTree areas={treeData} />
      </div>

      <div className="col-span-9">
        Nội dung bên phải

        <AreaTable data={areas} />
      </div>
    </div>
  )
}