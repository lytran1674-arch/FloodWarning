import { ArrowLeft, User,  Shield } from "lucide-react"
import { useEffect, useState } from "react"
import TeamWork from "../../../../public/image/Group-amico.png"
import { Input } from "@/components/ui/Input"
import { useNavigate, useParams } from "react-router-dom"
import { useResCue } from "../hooks/useResCue"

export const AddMemberTeam = () => {
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { addMemberTeam ,detailTeam,detail} = useResCue(teamId ?? "")

  const [hoten, setHoten] = useState("")
  const [email, setEmail] = useState("")
  const [sodt, setSodt] = useState("")
  const [gioitinh, setGioitinh] = useState(false) // true = Nam, false = Nữ
  const [ngaysinh, setNgaysinh] = useState("")
  const [diachi, setDiachi] = useState("")

  const [submitting, setSubmitting] = useState(false)
   useEffect(() => {
  if (teamId) {
    detailTeam(teamId);
     console.log("teamId:", teamId);
  }
}, [teamId, detailTeam]);

  const handleSubmit = async () => {
    if (!hoten || !email || !sodt || !teamId) return
    try {
      setSubmitting(true)
      const payload = {
        hoten,
        email,
        sodt,
        gioitinh,
        ngaysinh,
        diachi,
        teamId,
     
      }
      const newMember = await addMemberTeam(payload)
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
            <p className="text-2xl font-bold">Thêm thành viên vào đội</p>
            <p className="text-gray-500 text-sm">
              Nhập thông tin để thêm thành viên mới vào đội cứu hộ.
            </p>
          </div>
        </div>
        <img src={TeamWork} className="lg:w-40 lg:h-28 object-contain hidden lg:block" />
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-2 lg:gap-6 gap-4">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="bg-white rounded-xl border p-5 space-y-2">
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
            <Input
              id="diachi"
              type="text"
              placeholder="Nhập địa chỉ hiện tại"
              value={diachi}
              onChange={ setDiachi}
            />
          </div>
        </div>

        {/* Cột phải: Thông tin đội */}
           <div className="flex-col lg:space-y-9 space-y-3">
        <div className="bg-white rounded-xl border p-5 space-y-6 lg:h-72">
          <p className="flex items-center gap-2 font-semibold text-gray-800">
            <Shield size={16} className="text-blue-600" />
            Thông tin đội
          </p>

           <div>
            <label className="text-sm text-gray-600">Đội</label>
           <Input
  id="teamid"
  type="text"
  value={detail?.name}
  disabled
/>
          </div>

          {/* <div>
            <label className="text-sm text-gray-600 block mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTrangthai("ACTIVE")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm ${
                  trangthai === "ACTIVE"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <Check size={14} />
                Hoạt động
              </button>
              <button
                type="button"
                onClick={() => setTrangthai("LOCKED")}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm ${
                  trangthai === "LOCKED"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <Lock size={14} />
                Tạm khóa
              </button>
            </div>
          </div> */}

          <div className="bg-blue-50 rounded-lg p-3 flex gap-2 text-sm ">
            <span className="text-blue-600">ⓘ</span>
            <div>
              <p className="text-blue-700 font-medium">Thông tin vai trò</p>
              <p className="text-blue-600 text-xs mt-0.5">
                Thành viên cứu hộ có thể tham gia các nhiệm vụ, nhận thông báo
                và cập nhật thông tin trong đội.
              </p>
            </div>
          </div>
        </div>
         <div className="flex justify-end gap-3 mt-6 pt-4" >
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