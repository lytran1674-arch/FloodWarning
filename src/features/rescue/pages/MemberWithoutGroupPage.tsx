import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Select, Popconfirm } from "antd";
import { UserPlus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { rescueApi } from "../api/rescureApi";
import { useAvailableMembers } from "../hooks/useAvailableMembers";
import { useAppSelector } from "@/hooks/redux.hooks";

export default function MemberWithoutGroupPage() {
    const user=useAppSelector((state)=>state.auth.user)
    const leaderTeam=user?.isTeamLeader===true

  const { teamId } = useParams();

  const navigate = useNavigate();

  const { members, groups, loading, refresh } =
    useAvailableMembers(teamId);

  const [selectedGroup, setSelectedGroup] = useState<
    Record<string, string>
  >({});

  const handleAdd = async (userId: string) => {

    const groupId = selectedGroup[userId];

    if (!groupId) {
      toast.warning("Vui lòng chọn nhóm.");
      return;
    }

    try {

      await rescueApi.addMemberToGroup(groupId, {
        userIds: [userId],
      });

      toast.success("Đã thêm thành viên vào nhóm.");

      refresh();

    } catch (e: any) {

      toast.error(
        e.response?.data?.message ?? "Không thể thêm."
      );

    }
  };

  const handleDelete = async (userId: string) => {

    if (!teamId) return;

    try {

      await rescueApi.removeMemberteam(teamId, userId);

      toast.success("Đã xóa thành viên khỏi đội.");

      refresh();

    } catch (e: any) {

      toast.error(
        e.response?.data?.message ?? "Không thể xóa."
      );

    }
  };

  return (
    <div className="p-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-5"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Thành viên chưa có Group
          </h1>

          <p className="text-slate-500">
            Danh sách thành viên chưa được phân nhóm.
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {members.map((member) => (

          <div
            key={member.userId}
            className="border rounded-xl p-5 bg-white shadow-sm flex justify-between items-center"
          >

            <div>

              <h2 className="font-semibold text-lg">
                {member.fullName}
              </h2>

              <p className="text-slate-500">
                {member.phone}
              </p>

            </div>
               {leaderTeam&&(
            <div className="flex gap-3 items-center">

              <Select
                placeholder="Chọn nhóm"
                style={{ width: 220 }}
                value={selectedGroup[member.userId]}
                onChange={(value) =>
                  setSelectedGroup({
                    ...selectedGroup,
                    [member.userId]: value,
                  })
                }
              >
                {groups.map((g) => (
                  <Select.Option
                    key={g.id}
                    value={g.id}
                  >
                    {g.name}
                  </Select.Option>
                ))}
              </Select>

              <Button
                type="primary"
                icon={<UserPlus size={16} />}
                onClick={() =>
                  handleAdd(member.userId)
                }
              >
                Thêm vào nhóm
              </Button>

              <Popconfirm
                title="Xóa thành viên?"
                description="Sau khi xóa sẽ không thể đăng nhập."
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() =>
                  handleDelete(member.userId)
                }
              >
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                >
                  Xóa khỏi đội
                </Button>
              </Popconfirm>

            </div>
                    )}
          </div>

        ))}

      </div>

      {!loading && members.length === 0 && (

        <div className="text-center py-20 text-slate-500">

          Không còn thành viên nào chưa có group.

        </div>

      )}

    </div>
  );
}