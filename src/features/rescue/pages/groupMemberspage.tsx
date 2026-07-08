import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Crown, ArrowLeft } from "lucide-react";
import { Button } from "antd";
import { IoRemove } from "react-icons/io5";
import { toast } from "react-toastify";

import { rescueApi } from "../api/rescureApi";
import { rescueService } from "../services/rescueService";
import type { GroupMember, ResCue } from "../types/rescueType";

export default function GroupMembersPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const data: ResCue[] = await rescueApi.getMemberByGroup(groupId);

      const sorted = [...data].sort(
        (a, b) => Number(b.isLeader) - Number(a.isLeader)
      );

      setMembers(sorted);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Không thể tải danh sách thành viên."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  const handleRemove = async (member: GroupMember) => {
    if (!groupId) return;

    if (member.isLeader) {
      toast.error(
        "Không thể loại trưởng nhóm. Hãy chọn trưởng nhóm khác trước."
      );
      return;
    }

    try {
      await rescueService.RemoveMemberGroup(groupId, member.userId);

      toast.success("Đã loại thành viên khỏi nhóm.");

      await loadMembers();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Không thể loại thành viên."
      );
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Thành viên nhóm
      </h1>

      {loading && <p>Đang tải...</p>}

      {!loading && members.length === 0 && (
        <p>Nhóm chưa có thành viên.</p>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.userId}
            className="border rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{member.fullName}</h3>

                <p className="text-sm text-slate-500">
                  {member.phone}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {member.isLeader && (
                  <div className="flex items-center gap-1 text-yellow-600 font-medium">
                    <Crown size={18} />
                    Leader
                  </div>
                )}

                <Button
                  danger
                  disabled={member.isLeader}
                  onClick={() => handleRemove(member)}
                >
                  <IoRemove />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}