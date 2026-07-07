import { Input } from "@/components/ui/Input";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useState } from "react";
import type { ResTeam } from "../types/rescueType";
import { rescueApi } from "../api/rescureApi";

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
  const user=useAppSelector((state)=>state.auth.user)
  const teamId=user?.teamId;
  const isLeaderTeam=user?.isTeamLeader===true
  const admin=user?.role==="ADMIN"

  const canUpdate= isLeaderTeam ||admin
 const handleUpdate = async () => {
  if (isEditing) {
    if (!teamId) {
      console.error("Không tìm thấy teamId");
      return;
    }

    try {
      console.log("Dữ liệu gửi API:", formData);

      await rescueApi.updateResTeam(teamId, formData);

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
        {canUpdate&&
          <Button
            type="primary"
            onClick={handleUpdate}
          >
            <MdSystemUpdateAlt />

            {isEditing ? "Lưu" : "Cập nhật"}
          </Button>
          }
        </div>
      </form>
    </div>
  );
};