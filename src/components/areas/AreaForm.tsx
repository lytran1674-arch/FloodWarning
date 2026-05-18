import { useState } from "react"
import { areaService } from "../../services/areaService"

const AreaForm = () => {
  const [form, setForm] = useState({
    tenkhuvuc: "",
    mota: "",
    parent_id: "",
    level: 1,
    lat: 0,
    lon: 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }



  return (
    <form

      className="space-y-4"
    >
      <input
        name="tenkhuvuc"
        placeholder="Tên khu vực"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="lat"
        placeholder="Vĩ độ"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="lon"
        placeholder="Kinh độ"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Lưu
      </button>
    </form>
  )
}

export default AreaForm