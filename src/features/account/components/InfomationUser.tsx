import { Pen, Shield, UserCircle2, Lock, CheckCircle2 } from "lucide-react"
import type { Account } from "../type/accountType";
import { UseAccount } from "../hooks/useAccount";
import { AccountApi } from "../api/accountApi";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

interface Props {
  data: Account;
}

const LABEL_ROLE: Record<string, string> = {
  CITIZEN: "người dân",
  ADMIN: "quản trị viên",
  RESCUER: "lực lượng cứu hộ",
  PROVINCE_OPERATOR: "điều hành cấp tỉnh",
};

// Danh sách quyền hạn hiển thị trong ô "Quyền hạn hệ thống" theo từng vai trò
const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  ADMIN: ["Quản trị toàn bộ hệ thống", "Quản lý tài khoản người dùng"],
  RESCUER: ["Truy cập SOS Queue", "Điều phối đơn vị cứu hộ"],
  PROVINCE_OPERATOR: ["Giám sát khu vực tỉnh", "Điều phối lực lượng cứu hộ"],
  CITIZEN: ["Gửi yêu cầu cứu hộ", "Theo dõi trạng thái SOS"],
};

export const InfomationUser = ({ data }: Props) => {
  const { account } = UseAccount();
  const user = useAppSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Account>(data);
  const [isSaving, setIsSaving] = useState(false);

  const admin = user?.role === "ADMIN";
  const rescue = user?.role === "RESCUER";
  const province_operator = user?.role === "PROVINCE_OPERATOR";
  const citizen = user?.role === "CITIZEN";

  const roleLabel = account?.role ? LABEL_ROLE[account.role] ?? account.role : "";
  const permissions = account?.role ? PERMISSIONS_BY_ROLE[account.role] ?? [] : [];

  const handleChange = (field: keyof Account, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        console.log("Dữ liệu gửi API:", formData);
        const res = await AccountApi.updateAccount(formData);
        console.log("Phản hồi từ API:", res);
        toast.success("Cập nhật thành công");
        setIsEditing(false);
      } catch (error: any) {
        console.error("Cập nhật thất bại - chi tiết lỗi:", error);
        console.error("Response từ server (nếu có):", error?.response?.data);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Cập nhật thất bại, vui lòng thử lại"
        );
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
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

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
          className="flex shrink-0 justify-center gap-2 items-center
            bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
            px-3 py-2 lg:px-5 lg:py-2.5
            text-xs lg:text-sm shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Pen className="h-4 w-4" />
          <span className="hidden sm:inline">Chỉnh sửa thông tin</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cột trái - tóm tắt hồ sơ + quyền hạn hệ thống: ẩn trên mobile, chỉ hiện form */}
        <div className="hidden lg:flex lg:flex-col gap-5 lg:col-span-1">
          {/* Ô đầu tiên: tóm tắt hồ sơ */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <p className="text-blue-600 font-semibold text-lg">{account?.hoten}</p>
            <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-[11px] font-semibold tracking-wide uppercase rounded-full px-3 py-1">
              {account?.chucVu}
            </span>

            <hr className="my-4 border-gray-200" />

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mã định danh:</span>
                <span className="text-gray-900 font-semibold">
                  {account?.id.slice(0, 5)}
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

          {/* Ô thứ hai: quyền hạn hệ thống - nằm ngay dưới ô đầu tiên */}
          <div className="relative overflow-hidden bg-blue-700 rounded-2xl p-5 text-white">
            <p className="font-semibold mb-1">Quyền hạn hệ thống</p>
            <p className="text-sm text-blue-100 mb-3 max-w-[75%]">
              Bạn đang truy cập với quyền hạn {roleLabel}.
            </p>

            <ul className="flex flex-col gap-2">
              {permissions.map((perm) => (
                <li key={perm} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>

            <Shield className="pointer-events-none absolute -right-2 bottom-2 h-24 w-24 text-blue-500/40" />
          </div>
        </div>

        {/* Cột phải - form: luôn hiển thị, kể cả trên mobile */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 lg:p-6 lg:col-span-2">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-200">
            <UserCircle2 className="h-5 w-5 text-blue-600" />
            <p className="font-semibold text-gray-900">Thông tin chi tiết</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Họ và tên: luôn khoá, không cho tự chỉnh sửa qua trang cá nhân */}
              <div className="relative">
                <Input
                  label="Họ và tên"
                  value={formData.hoten || ""}
                  type="text"
                  disabled
                />
                <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 text-gray-400" />
              </div>

              <Input
                label="Ngày sinh"
                value={formData.ngaysinh || ""}
                type="date"
                disabled={!isEditing}
                onChange={(value) => handleChange("ngaysinh", value)}
              />

              <Input
                label="Số điện thoại"
                value={formData.sodt || ""}
                type="text"
                disabled={!isEditing}
                onChange={(value) => handleChange("sodt", value)}
              />

              <Input
                label="Email"
                value={formData.email || ""}
                type="text"
                disabled={!isEditing}
                onChange={(value) => handleChange("email", value)}
              />
            </div>

            <Input
              label="Địa chỉ"
              value={formData.diachi || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) => handleChange("diachi", value)}
            />

            <Input
              label="Ghi chú"
              value={formData.ghichu || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) => handleChange("ghichu", value)}
            />

            {citizen && (
              <Input
                label="Khu vực"
                value={formData.area || ""}
                type="text"
                disabled={!isEditing}
                onChange={(value) => handleChange("area", value)}
              />
            )}

            {rescue && (
              <Input label="Khu vực" value={formData.area || ""} type="text" disabled />
            )}

            {(rescue || admin || province_operator) && (
              <Input label="Vai trò" value={roleLabel} type="text" disabled />
            )}

            {rescue && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Đội cứu hộ"
                  value={formData.rescueTeam || ""}
                  type="text"
                  disabled={!isEditing}
                  onChange={(value) => handleChange("rescueTeam", value)}
                />

                <Input
                  label="Nhóm cứu hộ"
                  value={formData.rescueGroup || ""}
                  type="text"
                  disabled={!isEditing}
                  onChange={(value) => handleChange("rescueGroup", value)}
                />
              </div>
            )}

            {province_operator && (
              <Input
                label="Tỉnh"
                value={formData.province || ""}
                type="text"
                disabled={!isEditing}
                onChange={(value) => handleChange("province", value)}
              />
            )}

            {(admin || province_operator) && (
              <Input
                label="Chức vụ"
                value={formData.chucVu || ""}
                type="text"
                disabled={!isEditing}
                onChange={(value) => handleChange("chucVu", value)}
              />
            )}

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
                className="border bg-blue-700 rounded-md px-4 py-1 text-white font-medium text-[16px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang lưu..." : isEditing ? "Lưu thông tin" : "Cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};