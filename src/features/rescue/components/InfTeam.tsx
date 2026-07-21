import { Input } from "@/components/ui/Input";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import { MdSystemUpdateAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import type { ResCue, ResTeam } from "../types/rescueType";

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
  const [members, setMembers] = useState<ResCue[]>([]);
  const [leaderError, setLeaderError] = useState("");

  useEffect(() => {
    if (!teamId) return;
    rescueApi
      .getTeamMembersWithoutGroup(teamId)
      .then(setMembers)
      .catch((err) => console.error("Không tải được danh sách thành viên:", err));
  }, [teamId]);
  const isLeaderTeam=user?.isTeamLeader===true
  const admin=user?.role==="ADMIN"

  const canUpdate= isLeaderTeam ||admin

 const handleUpdate = async () => {
  if (isEditing) {
    if (!teamId) {
      console.error("Không tìm thấy teamId");
      return;
    }

    if (!formData.leaderId) {
      setLeaderError("Vui lòng chọn Đội trưởng");
      return;
    }

    if (formData.deputyLeaderId && formData.deputyLeaderId === formData.leaderId) {
      setLeaderError("Đội trưởng và Đội phó không được là cùng một người");
      return;
    }

    setLeaderError("");

    try {
      console.log("Dữ liệu gửi API:", formData);

      await rescueApi.updateResTeam(teamId, formData);
      await rescueApi.PickLeaderAndDeputy(
        teamId,
        formData.leaderId,
        formData.deputyLeaderId ?? ""
      );

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

       <div>
          <label className="text-sm font-medium text-gray-700">Đội trưởng</label>
          <select
            value={formData.leaderId || ""}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, leaderId: e.target.value }))
            }
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm disabled:bg-gray-100"
          >
            <option value="">-- Chọn đội trưởng --</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Đội phó</label>
          <select
            value={formData.deputyLeaderId || ""}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deputyLeaderId: e.target.value }))
            }
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm disabled:bg-gray-100"
          >
            <option value="">-- Không chọn --</option>
            {members
              .filter((m) => m.userId !== formData.leaderId)
              .map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.fullName}
                </option>
              ))}
          </select>
        </div>

        {leaderError && <p className="text-sm text-red-600">{leaderError}</p>}

        
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