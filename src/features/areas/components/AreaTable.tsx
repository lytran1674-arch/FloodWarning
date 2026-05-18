import type { Area } from "../types/areaType"

interface Props {
  data: Area[]
}

export const AreaTable = ({ data }: Props) => {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">
            Mã khu vực
          </th>

          <th className="border p-2">
            Tên
          </th>

          <th className="border p-2">
            Cấp độ
          </th>

          <th className="border p-2">
            Vĩ độ
          </th>

          <th className="border p-2">
            Kinh độ
          </th>
        </tr>
      </thead>

      <tbody>
        {data.map((area) => (
          <tr key={area.area_id}>
            <td className="border p-2">
              {area.area_id}
            </td>

            <td className="border p-2">
              {area.tenkhuvuc}
            </td>

            <td className="border p-2">
              {area.level}
            </td>

            <td className="border p-2">
              {area.lat}
            </td>

            <td className="border p-2">
              {area.lon}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}