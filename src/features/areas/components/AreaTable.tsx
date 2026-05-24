import type { AreaTree } from "../types/areaType"

interface Props {
  data: AreaTree[]  // ← đổi Area[] → AreaTree[]
}

const flattenAreas = (areas: AreaTree[]): AreaTree[] => {
  return areas.flatMap((area) => [area, ...flattenAreas(area.children ?? [])])
}

export const AreaTable = ({ data }: Props) => {
  const flatData = flattenAreas(data)

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">Mã khu vực</th>
          <th className="border p-2">Tên</th>
          <th className="border p-2">Cấp độ</th>
          <th className="border p-2">Vĩ độ</th>
          <th className="border p-2">Kinh độ</th>
        </tr>
      </thead>
      <tbody>
        {flatData.map((area) => (
          <tr key={area.id} className={area.level === 1 ? "bg-blue-50 font-semibold" : "bg-white"}>
            <td className="border p-2 text-xs">{area.id}</td>
            <td
              className="border p-2"
              style={{ paddingLeft: `${(area.level - 1) * 24 + 8}px` }}  // ← thụt lề theo cấp
            >
              {area.tenkhuvuc}
            </td>
            <td className="border p-2">{area.level}</td>
            <td className="border p-2">{area.lat ?? "—"}</td>
            <td className="border p-2">{area.lon ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}