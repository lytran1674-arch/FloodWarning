import { Input } from "@/components/ui/Input";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useState } from "react";
import type { ResTeam } from "../types/rescueType";

interface Props {
  data: ResTeam;
}

export const InfTeam = ({ data }: Props) => {
 

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ResTeam>(data);
 

  const handleChange = (field: keyof ResTeam, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    if (isEditing) {
      console.log("Dữ liệu gửi API:", formData);

      // gọi api update ở đây
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="account-form lg:m-12 border rounded-md lg:p-5">
      <h2 className="text-black font-semibold lg:text-3xl sm:text-sm text-xs">
        Thông tin đội cứu hộ
      </h2>

      <form className="space-y-3">
        
        <Input
          label="Tên đội"
          value={formData.name || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("name", value)}
        />

        <Input
          label="Mô tả"
          value={formData.description || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("description", value)}
        />

        <Input
          label="Khu vực"
          value={formData.areaName || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("areaName", value)}
        />

        <Input
          label="Đội trưởng"
          value={formData.leaderName || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("leaderName", value)}
        />

        
        <Input
          label="Số hotline"
          value={formData.emergencyPhone || ""}
          type="text"
          disabled={!isEditing}
          onChange={(value) => handleChange("emergencyPhone", value)}
        />
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