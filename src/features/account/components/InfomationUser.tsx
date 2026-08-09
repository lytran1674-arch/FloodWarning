// features/account/components/InfomationUser.tsx
import { Pen, Shield, UserCircle2, CheckCircle2 } from "lucide-react"
import type { UpdateAccount }  from "../type/accountType"
import { UseAccount }          from "../hooks/useAccount"
import { AccountApi }          from "../api/accountApi"
import { useAppSelector }      from "@/hooks/redux.hooks"
import { useEffect, useState } from "react"
import { Input }               from "@/components/ui/Input"
import { Button }              from "@/components/ui/Button"
import { toast }               from "react-toastify"
import { LockAccount }         from "@/features/auth/components/LockAccount"
import { MdPassword }          from "react-icons/md"
import { useNavigate }         from "react-router-dom"
import type { Area } from "@/features/areas/types/areaType"
import { areaApi } from "@/features/areas/api/areaApi"

interface Props {
  data: UpdateAccount
}

const LABEL_ROLE: Record<string, string> = {
  CITIZEN:           "người dân",
  ADMIN:             "quản trị viên",
  RESCUER:           "lực lượng cứu hộ",
  PROVINCE_OPERATOR: "điều hành cấp tỉnh",
}

const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  ADMIN:             ["Quản trị toàn bộ hệ thống", "Quản lý tài khoản người dùng"],
  RESCUER:           ["Truy cập SOS Queue", "Điều phối đơn vị cứu hộ"],
  PROVINCE_OPERATOR: ["Giám sát khu vực tỉnh", "Điều phối lực lượng cứu hộ"],
  CITIZEN:           ["Gửi yêu cầu cứu hộ", "Theo dõi trạng thái SOS"],
}

export const InfomationUser = ({ data }: Props) => {
  const { account }  = UseAccount()
  const user         = useAppSelector(s => s.auth.user)
  const navigate     = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving,  setIsSaving]  = useState(false)
  const [provinces, setProvinces] = useState<Area[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [areaLabel, setAreaLabel] = useState("");

  // ✅ formData chỉ chứa đúng các field của UpdateAccount
  const [formData, setFormData] = useState<UpdateAccount>(data)
   useEffect(() => {
      const loadProvinces = async () => {
        try {
          setLoadingProvinces(true);
          const all = await areaApi.getAll();
          // Chỉ lấy khu vực cấp tỉnh/thành (level 1) — điều phối viên phụ trách theo tỉnh
          setProvinces(all.filter((a) => a.level === 1));
        } catch (err) {
          console.error(err);
          toast.error("Không thể tải danh sách tỉnh/thành.");
        } finally {
          setLoadingProvinces(false);
        }
      };
  
      loadProvinces();
    }, []);

  // ✅ Sync khi data prop thay đổi
  useEffect(() => { setFormData(data) }, [data])

  const admin             = user?.role === "ADMIN"
  const rescue            = user?.role === "RESCUER"
  const province_operator = user?.role === "PROVINCE_OPERATOR"
  const citizen           = user?.role === "CITIZEN"

  const roleLabel   = account?.role ? LABEL_ROLE[account.role]            ?? account.role : ""
  const permissions = account?.role ? PERMISSIONS_BY_ROLE[account.role]   ?? []           : []

  // ✅ handleChange chỉ nhận keyof UpdateAccount
  const handleChange = (field: keyof UpdateAccount, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setFormData(data)
    setIsEditing(false)
  }

const handleUpdate = async () => {
  if (!isEditing) {
    setIsEditing(true);
    return;
  }

  try {
    setIsSaving(true);

    const updatedAccount = await AccountApi.updateAccount(formData);

    console.log("UPDATE RESPONSE:", updatedAccount);

    setFormData(updatedAccount);

    toast.success("Cập nhật thành công");
    setIsEditing(false);
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);

    toast.error(
      error?.response?.data?.message ??
      error?.message ??
      "Cập nhật thất bại"
    );
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="p-3 lg:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-5 lg:mb-6">
        <div>
          <p className="text-xl lg:text-3xl text-gray-900 font-semibold">
            Thông tin cá nhân
          </p>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            Quản lý và cập nhật thông tin nhận dạng người dùng hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
              font-medium rounded-lg px-3 py-2 lg:px-5 lg:py-2.5 text-xs lg:text-sm
              shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Pen className="h-4 w-4" />
            <span className="hidden sm:inline">Chỉnh sửa thông tin</span>
          </button>

          {/* ✅ Ẩn LockAccount với ADMIN */}
          {!admin && <LockAccount />}

          <button
            type="button"
            onClick={() => navigate("/change-password")}
            className="flex items-center gap-2 bg-red-700 text-white font-medium
              rounded-lg px-3 py-2 lg:px-5 lg:py-2.5 text-xs lg:text-sm shadow-sm
              transition-colors"
          >
            <MdPassword className="h-4 w-4" />
            <span className="hidden sm:inline">Đổi mật khẩu</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* CỘT TRÁI */}
        <div className="hidden lg:flex lg:flex-col gap-5 lg:col-span-1">

          {/* Tóm tắt hồ sơ */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <p className="text-blue-600 font-semibold text-lg">{account?.hoten}</p>
            <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-[11px]
              font-semibold tracking-wide uppercase rounded-full px-3 py-1">
              {account?.chucVu ?? roleLabel}
            </span>
            <hr className="my-4 border-gray-200" />
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mã định danh:</span>
                <span className="text-gray-900 font-semibold font-mono">
                  {account?.id?.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Hoạt động
                </span>
              </div>
            </div>
          </div>

          {/* Quyền hạn */}
          <div className="relative overflow-hidden bg-blue-700 rounded-2xl p-5 text-white">
            <p className="font-semibold mb-1">Quyền hạn hệ thống</p>
            <p className="text-sm text-blue-100 mb-3 max-w-[75%]">
              Bạn đang truy cập với quyền hạn {roleLabel}.
            </p>
            <ul className="flex flex-col gap-2">
              {permissions.map(perm => (
                <li key={perm} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
            <Shield className="pointer-events-none absolute -right-2 bottom-2 h-24 w-24 text-blue-500/40" />
          </div>
        </div>

        {/* CỘT PHẢI — Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 lg:p-6 lg:col-span-2">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-200">
            <UserCircle2 className="h-5 w-5 text-blue-600" />
            <p className="font-semibold text-gray-900">Thông tin chi tiết</p>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/*  Được sửa */}
              <Input
                label="Họ và tên"
                value={formData.hoten || ""}
                type="text"
                disabled={!isEditing}
                onChange={value => handleChange("hoten", value)}
              />

              {/*  Được sửa */}
              <Input
                label="Ngày sinh"
                value={formData.ngaysinh || ""}
                type="date"
                disabled={!isEditing}
                onChange={value => handleChange("ngaysinh", value)}
              />

              {/*  Không được sửa — lấy từ account */}
              <Input
                label="Số điện thoại"
                value={account?.sodt || ""}
                type="text"
                disabled
              />

              {/*  Không được sửa — lấy từ account */}
              <Input
                label="Email"
                value={account?.email || ""}
                type="text"
                disabled
              />
            </div>

            {/*  Được sửa */}
            <Input
              label="Địa chỉ"
              value={formData.diachi || ""}
              type="text"
              disabled={!isEditing}
              onChange={value => handleChange("diachi", value)}
            />

            {/*  Được sửa */}
            <Input
              label="Ghi chú"
              value={formData.ghichu || ""}
              type="text"
              disabled={!isEditing}
              onChange={value => handleChange("ghichu", value)}
            />

            {/*  Khu vực — không được sửa */}
            {(citizen) && (
              <div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700">
    Địa chỉ
  </label>

  {isEditing ? (
    // ── Đang chỉnh sửa → dropdown chọn tỉnh ──
     <select
                          value={formData.areaId || ""}
                          disabled={loadingProvinces}
                          onChange={(e) => {
                            const areaId = e.target.value;
                            const picked = provinces.find((p) => p.id === areaId);
                            setFormData({ ...formData, areaId });
                            setAreaLabel(picked?.tenkhuvuc ?? "");
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">
                            {loadingProvinces ? "Đang tải..." : "-- Chọn tỉnh/thành --"}
                          </option>
                          {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.tenkhuvuc}
                            </option>
                          ))}
                        </select>
  ) : (
    // ── Không chỉnh sửa → hiển thị text ──
    <Input
      value={areaLabel}
      type="text"
      disabled
    />
  )}
</div>
            )}

            {/* Vai trò — không được sửa */}
            {(rescue || province_operator) && (
              <Input
                label="Vai trò"
                value={roleLabel}
                type="text"
                disabled
              />
            )}

            {/*  Đội/Nhóm cứu hộ — không được sửa */}
            {rescue && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Đội cứu hộ"
                  value={account?.rescueTeam || ""}
                  type="text"
                  disabled
                />
                <Input
                  label="Nhóm cứu hộ"
                  value={account?.rescueGroup || ""}
                  type="text"
                  disabled
                />
              </div>
            )}

            {/*  Tỉnh — không được sửa */}
            {province_operator && (
              <Input
                label="Tỉnh phụ trách"
                value={account?.province || ""}
                type="text"
                disabled
              />
            )}

            {/*  Chức vụ — không được sửa */}
            {(admin || province_operator) && (
              <Input
                label="Chức vụ"
                value={account?.chucVu || ""}
                type="text"
                disabled
              />
            )}

            {/* Actions */}
            <div className="flex justify-end items-center gap-5 pt-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
                >
                  Hủy thay đổi
                </button>
              )}
              <Button
                onClick={handleUpdate}
                disabled={isSaving}
                className="border bg-blue-700 rounded-md px-4 py-2 text-white font-medium
                  text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang lưu..." : isEditing ? "Lưu thông tin" : "Cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}