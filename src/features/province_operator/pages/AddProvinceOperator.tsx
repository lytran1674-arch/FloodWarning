import { ArrowLeft, User, Shield,   } from "lucide-react"
import {  useState } from "react"
import TeamWork from "../../../../public/image/Team work-rafiki.png"
import { Input } from "@/components/ui/Input"
import { useNavigate } from "react-router-dom"

import { useAreaSelect } from "@/features/areas/hooks/useAreaSelect"
import { useProvince } from "../hooks/useProvince"
import { SelectField } from "@/components/ui/SelectField"


export const AddProvinceOperator = () => {
  const navigate = useNavigate()


  const [hoten, setHoten] = useState("")
  const [email, setEmail] = useState("")
  const [sodt, setSodt] = useState("")
  const [gioitinh, setGioitinh] = useState(false) // true = Nam, false = Nữ
  const [ngaysinh, setNgaysinh] = useState("")
  const [diachi, setDiachi] = useState("")
  const {add,addProvinceOperator}=useProvince();
  
  const [submitting, setSubmitting] = useState(false)
    const {
      tinhId,
      setTinhId,
       tinhOptions,
    } = useAreaSelect();

   const selectedProvince = tinhOptions.find(
  (item) => item.value === tinhId
);
  const handleSubmit = async () => {
    if (!hoten || !email || !sodt ) return
    try {
      setSubmitting(true)
      const payload = {
        hoten,
        email,
        sodt,
        gioitinh,
        ngaysinh,
        diachi: selectedProvince?.label ?? "",
        areaId:tinhId,
     
      }
      const newMember = await addProvinceOperator(payload)
      if (newMember) {
        navigate(-1)
      }
    } catch (error) {
      console.error("Thêm thành viên thất bại:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lg:m-5">
      {/* Header */}
      <div className="flex justify-between items-start ">
        <div className="flex-col space-y-1">
          <div
            className="flex justify-start items-center gap-1 cursor-pointer text-blue-600 text-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Quay lại
          </div>

          <div className="flex-col space-y-1 lg:mt-3">
            <p className="text-2xl font-bold">Thêm điều phối cấp tỉnh</p>
            <p className="text-gray-500 text-sm">
              Nhập thông tin để thêm thành viên mới.
            </p>
          </div>
        </div>
        <img src={TeamWork} className="lg:w-40 lg:h-28 object-contain hidden lg:block" />
      </div>

      {/* Form */}
      <div className="lg:gap-6 gap-4">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="bg-white rounded-xl border p-5 space-y-1">
          <p className="flex items-center gap-2 font-semibold text-gray-800">
            <User size={16} className="text-blue-600" />
            Thông tin cá nhân
          </p>

          <div>
            <label className="text-sm text-gray-600">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              id="hoten"
              type="text"
              placeholder="Nhập họ và tên"
              value={hoten}
              onChange={ setHoten}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                id="sodt"
                type="text"
                placeholder="Nhập số điện thoại"
                value={sodt}
                onChange={ setSodt}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Ngày sinh</label>
              <Input
                id="ngaysinh"
                type="date"
                value={ngaysinh}
                onChange={setNgaysinh}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Giới tính</label>
              <div className="flex items-center gap-4 h-9">
                <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    checked={gioitinh === true}
                    onChange={() => setGioitinh(true)}
                  />
                  Nam
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    checked={gioitinh === false}
                    onChange={() => setGioitinh(false)}
                  />
                  Nữ
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Địa chỉ</label>
           <SelectField
  id="tinh"

  value={tinhId}
  onChange={setTinhId}
  options={tinhOptions}
  placeholder="-- Chọn tỉnh/thành phố --"
  required
/>
          </div>
          <div className="flex justify-end gap-3  pt-4" >
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border text-sm text-gray-600 flex items-center gap-1.5"
        >
          ✕ Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-1.5 disabled:opacity-60"
        >
          + {submitting ? "Đang thêm..." : "Thêm thành viên"}
        </button>
      </div>
        </div>
  
       
        </div>
      </div>

     
     
  )
}