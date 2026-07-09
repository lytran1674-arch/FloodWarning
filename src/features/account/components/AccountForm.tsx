import { Input } from "@/components/ui/Input";
import type { Account } from "../type/accountType";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useState } from "react";

import { AccountApi } from "../api/accountApi";

interface Props {
  data: Account;
}

export const AccountForm = ({ data }: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Account>(data);

  const admin = user?.role === "ADMIN";
  const rescue = user?.role ==="RESCUER"
  const province_operator = user?.role === "PROVINCE_OPERATOR";
  const citizen = user?.role === "CITIZEN";

  const handleChange = (field: keyof Account, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleUpdate = async () => {
  if (isEditing) {
    try {
      console.log("Dữ liệu gửi API:", formData);

      await AccountApi.updateAccount(formData);

      console.log("Cập nhật thành công");
      setIsEditing(false);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  } else {
    setIsEditing(true);
  }
};
  return (
    <div className="account-form lg:m-12 border rounded-md lg:p-5">
      <h2 className="text-black font-semibold lg:text-3xl sm:text-sm text-xs">
        Thông tin cá nhân
      </h2>

      <form className="space-y-3">
        <Input
          label="Họ tên"
          value={formData.hoten || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("hoten", value)}
        />

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
          label="Địa chỉ"
          value={formData.diachi || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("diachi", value)}
        />

        <Input
          label="Email"
          value={formData.email || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("email", value)}
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
        {rescue&&(
           <Input
            label="Khu vực"
            value={formData.area || ""}
            type="text"
            disabled
     
          />
        )}

        {(rescue || admin || province_operator) && (
          <Input
            label="Vai trò"
            value={formData.role || ""}
            type="text"
            disabled
          />
        )}

        {rescue && (
          <>
            <Input
              label="Đội cứu hộ"
              value={formData.rescueTeam || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) =>
                handleChange("rescueTeam", value)
              }
            />

            <Input
              label="Nhóm cứu hộ"
              value={formData.rescueGroup || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) =>
                handleChange("rescueGroup", value)
              }
            />
          </>
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

        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleUpdate}
          >
            <MdSystemUpdateAlt />

            {isEditing ? "Lưu" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </div>
  );
};