import { Input } from "@/components/ui/Input";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import {  MdSave, MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import type { ResCue, ResTeam } from "../types/rescueType";
import { rescueApi } from "../api/rescureApi";

interface Props {
  data: ResTeam;
}

export const InfTeam = ({ data }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ResTeam>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [leaderError, setLeaderError] = useState("");

  const user = useAppSelector((state) => state.auth.user);
  const teamId = user?.teamId;
  const [members, setMembers] = useState<ResCue[]>([]);

  const isLeaderTeam = user?.isTeamLeader === true;
  const isAdmin = user?.role === "ADMIN";
  const canUpdate = isLeaderTeam || isAdmin;

  // Load team members
  useEffect(() => {
    if (!teamId) return;
    rescueApi
      .getTeamMembersWithoutGroup(teamId)
      .then(setMembers)
      .catch((err) => console.error("Không tải được danh sách thành viên:", err));
  }, [teamId]);

  // Sync data when prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof ResTeam, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "leaderId" || field === "deputyLeaderId") {
      setLeaderError("");
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Validation
    if (!formData.leaderId) {
      setLeaderError("Vui lòng chọn Đội trưởng");
      return;
    }
    if (formData.deputyLeaderId && formData.deputyLeaderId === formData.leaderId) {
      setLeaderError("Đội trưởng và Đội phó không được là cùng một người");
      return;
    }

    setLeaderError("");
    setIsLoading(true);

    try {
      await rescueApi.updateResTeam(teamId!, formData);
      await rescueApi.PickLeaderAndDeputy(
        teamId!,
        formData.leaderId,
        formData.deputyLeaderId ?? ""
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Thông tin đội cứu hộ
            </h2>
            <p className="text-gray-500 mt-1">Quản lý thông tin và thành viên đội</p>
          </div>
          
          {canUpdate && (
            <Button
              type="primary"
              onClick={handleUpdate}
              loading={isLoading}
              className="flex items-center gap-2 px-6 py-2 h-11 text-base font-medium"
              icon={isEditing ? <MdSave size={20} /> : <MdEdit size={20} />}
            >
              {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
            </Button>
          )}
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên đội */}
            <Input
              label="Tên đội"
              value={formData.name || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) => handleChange("name", value)}
              className="col-span-1"
            />

            {/* Khu vực */}
            <Input
              label="Khu vực hoạt động"
              value={formData.areaName || ""}
              type="text"
              disabled={!isEditing}
              onChange={(value) => handleChange("areaName", value)}
            />
          </div>

          
   

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Đội trưởng */}
              <div>
                 <Input
              label="Đội trưởng"
              value={formData.leaderName || ""}
              type="text"
              disabled
              onChange={(value) => handleChange("leaderName", value)}
            />
               
              </div>

              {/* Đội phó */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Đội phó
                </label>
                <select
                  value={formData.deputyLeaderId || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleChange("deputyLeaderId", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
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
            </div>

            {leaderError && (
              <p className="mt-3 text-sm text-red-600 font-medium flex items-center gap-1">
                ⚠️ {leaderError}
              </p>
            )}
     

          {/* Mô tả */}
          <Input
            label="Mô tả đội"
            value={formData.description || ""}
            type="text"
            disabled={!isEditing}
            onChange={(value) => handleChange("description", value)}
          />

          {/* Hotline */}
          <Input
            label="Số hotline khẩn cấp"
            value={formData.emergencyPhone || ""}
            type="text"
            disabled={!isEditing}
            onChange={(value) => handleChange("emergencyPhone", value)}
          />

        </div>

        {/* Footer */}
        {isEditing && (
          <div className="px-8 py-5 border-t bg-gray-50 flex justify-end">
            <Button
              onClick={() => {
                setIsEditing(false);
                setFormData(data);
                setLeaderError("");
              }}
              className="mr-3"
            >
              Hủy
            </Button>
            <Button type="primary" onClick={handleUpdate} loading={isLoading}>
              Lưu thông tin
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};