import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Crown, ArrowLeft } from "lucide-react";
import { Button, Popconfirm } from "antd";
import { IoRemove } from "react-icons/io5";
import { toast } from "react-toastify";

import { rescueApi } from "../api/rescureApi";
import type { GroupMember } from "../types/rescueType";

export default function GroupMembersPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);

  // userId của thành viên đang có action chạy (remove hoặc set-leader),
  // dùng để disable/hiện loading đúng dòng đó thôi, không khóa cả danh sách.
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const loadMembers = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const data = await rescueApi.getMemberByGroup(groupId);

      // Chuẩn hóa isLeader: ResCue.isLeader có thể là undefined,
      // ép về false để khớp type GroupMember (bắt buộc boolean)
      // và tránh Number(undefined) = NaN làm sai kết quả sort.
      const sorted: GroupMember[] = [...data]
        .map((m) => ({ ...m, isLeader: m.isLeader ?? false }))
        .sort((a, b) => Number(b.isLeader) - Number(a.isLeader));

      setMembers(sorted);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Không thể tải danh sách thành viên."
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
      setProcessingUserId(member.userId);
      await rescueApi.removeMemberGroup(groupId, member.userId);

      toast.success("Đã loại thành viên khỏi nhóm.");
      await loadMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Không thể loại thành viên.");
    } finally {
      setProcessingUserId(null);
    }
  };

  // Đổi trưởng nhóm mới. Sau khi đổi thành công, trưởng nhóm cũ trở thành
  // thành viên thường và có thể bị loại như bình thường.
  const handleSetLeader = async (member: GroupMember) => {
    if (!groupId) return;

    try {
      setProcessingUserId(member.userId);
      await rescueApi.pickLeaderGroup(groupId, { userId: member.userId });

      toast.success(`Đã đặt ${member.fullName} làm trưởng nhóm.`);
      await loadMembers();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Không thể đặt làm trưởng nhóm."
      );
    } finally {
      setProcessingUserId(null);
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

      <h1 className="text-2xl font-bold mb-6">Thành viên nhóm</h1>

      {loading && <p>Đang tải...</p>}

      {!loading && members.length === 0 && <p>Nhóm chưa có thành viên.</p>}

      <div className="space-y-3">
        {members.map((member) => {
          const isRowProcessing = processingUserId === member.userId;

          return (
            <div
              key={member.userId}
              className="border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{member.fullName}</h3>
                  <p className="text-sm text-slate-500">{member.phone}</p>
                </div>

                <div className="flex items-center gap-4">
                  {member.isLeader && (
                    <div className="flex items-center gap-1 text-yellow-600 font-medium">
                      <Crown size={18} />
                      Leader
                    </div>
                  )}

                  {!member.isLeader && (
                    <Popconfirm
                      title="Đặt làm trưởng nhóm?"
                      description={`${member.fullName} sẽ trở thành trưởng nhóm mới.`}
                      okText="Xác nhận"
                      cancelText="Hủy"
                      onConfirm={() => handleSetLeader(member)}
                    >
                      <Button
                        disabled={processingUserId !== null && !isRowProcessing}
                        loading={isRowProcessing}
                      >
                        Đặt làm trưởng nhóm
                      </Button>
                    </Popconfirm>
                  )}

                  <Popconfirm
                    title="Loại thành viên khỏi nhóm?"
                    description={`${member.fullName} sẽ mất quyền truy cập nhóm ngay lập tức.`}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    disabled={member.isLeader}
                    onConfirm={() => handleRemove(member)}
                  >
                    <Button
                      danger
                      disabled={
                        member.isLeader ||
                        (processingUserId !== null && !isRowProcessing)
                      }
                      loading={isRowProcessing}
                    >
                      <IoRemove />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}