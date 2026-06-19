import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Ship,
  Cross,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { rescueApi } from "../api/rescureApi";
import { Button } from "../../../components/ui/Button";
import { CreateGroupModal } from "../components/CreateGroupModal";

export default function ResGroupPage() {
  const { teamId } = useParams();

  const navigate = useNavigate();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] =
  useState(false);

  // Lấy thông tin user đã login
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isLeader = user?.isLeader === true;

  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      try {
        setLoading(true);

        const data =
          await rescueApi.getGroupByTeam(teamId);

        setGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId]);

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Danh sách Group
        </h1>

       <Button
  onClick={() => setShowCreateModal(true)}
  className="text-black bg-yellow-600 lg:text-xl sm:text-sm text-sm md:text-xl border border-yellow-400 h-10 p-4 rounded-md"
>
  <Plus />
  Thêm nhóm cứu hộ
</Button>
      </div>

      {loading && (
        <div className="py-10 text-center">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-slate-500">
          Chưa có nhóm cứu hộ nào
        </div>
      )}

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() =>
              navigate(
                `/res-groups/${group.id}/members`
              )
            }
            className="
              cursor-pointer
              rounded-xl
              border
              p-4
              transition
              hover:bg-slate-50
              hover:shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {group.name}
              </h3>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {group.status}
              </span>
            </div>

            <div className="mt-3 flex gap-4">
              {group.hasBoat && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Ship size={16} />
                  <span>Có xuồng</span>
                </div>
              )}

              {group.hasMedical && (
                <div className="flex items-center gap-1 text-red-600">
                  <Cross size={16} />
                  <span>Y tế</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showCreateModal && (
  <CreateGroupModal
    onClose={() => setShowCreateModal(false)}
    onSuccess={async () => {
      const data =
        await rescueApi.getGroupByTeam(
          teamId!
        );

      setGroups(data);

      setShowCreateModal(false);
    }}
  />
)}
    </div>
    
  );
}