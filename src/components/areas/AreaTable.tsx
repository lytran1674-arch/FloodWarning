import type { Area } from "../../types/areas"

interface Props {
  data: Area[]
}

const AreaTable = ({ data }: Props) => {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Mã</th>
          <th className="p-2 border">Tên</th>
          <th className="p-2 border">Vĩ độ</th>
          <th className="p-2 border">Kinh độ</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.area_id}>
            <td className="border p-2">
              {item.area_id}
            </td>

            <td className="border p-2">
              {item.tenkhuvuc}
            </td>

            <td className="border p-2">
              {item.lat}
            </td>

            <td className="border p-2">
              {item.lon}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AreaTable