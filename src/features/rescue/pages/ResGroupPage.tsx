import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Ship,
  Cross,
  Plus,
  LifeBuoy,
  Package,
  Users,
} from "lucide-react";
import { rescueApi } from "../api/rescureApi";
import { Button } from "../../../components/ui/Button";
import { useAppSelector } from "@/hooks/redux.hooks";

// Cấu hình trạng thái nhóm
const TRANG_THAI_NHOM: Record<string, { nhan: string; mau: string }> = {
  AVAILABLE: {
    nhan: "Sẵn sàng",
    mau: "bg-green-100 text-green-700",
  },
  BUSY: {
    nhan: "Bận",
    mau: "bg-yellow-100 text-yellow-700",
  },
  OFFLINE: {
    nhan: "Hỏng",
    mau: "bg-red-100 text-red-700",
  },
};

export default function ResGroupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const canCreateGroup = user?.isTeamLeader === true;

  // teamId từ URL (Admin)
  const { teamId: paramTeamId } = useParams<{ teamId: string }>();

  // Nếu không có trên URL thì lấy của Team Leader
  const teamId = paramTeamId ?? user?.teamId ?? null;

  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await rescueApi.getGroupByTeam(teamId);

        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId, location.key]);

  const handleOnClick = () => {
    if (!teamId) return;

    navigate(`/team/${teamId}/available-members`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách nhóm cứu hộ</h1>

        <div className="flex gap-2">
          <Button
            className="border border-blue-500 text-blue-600 rounded-md p-2"
            onClick={handleOnClick}
            disabled={!teamId}
          >
            <Users />
            Thành viên chưa có nhóm
          </Button>

          {canCreateGroup && (
            <Button
              onClick={() => navigate("/res-group/create")}
              className="bg-yellow-500 text-black border border-yellow-400 rounded-md p-2"
            >
              <Plus />
              Thêm nhóm cứu hộ
            </Button>
          )}
        </div>
      </div>

      {!teamId && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Không xác định được đội cứu hộ.
        </div>
      )}

      {loading && (
        <div className="py-10 text-center">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && teamId && groups.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-slate-500">
          Chưa có nhóm cứu hộ nào.
        </div>
      )}

      <div className="grid gap-4">
        {groups.map((group) => {
          const trangThai = TRANG_THAI_NHOM[group.status] ?? {
            nhan: group.status,
            mau: "bg-slate-100 text-slate-600",
          };

          return (
            <div
              key={group.id}
              onClick={() =>
                navigate(`/res-groups/${group.id}/members`)
              }
              className="cursor-pointer rounded-xl border p-4 hover:bg-slate-50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {group.name}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${trangThai.mau}`}
                >
                  {trangThai.nhan}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-4">
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

                {group.hasSearchRescue && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <LifeBuoy size={16} />
                    <span>Tìm kiếm cứu nạn</span>
                  </div>
                )}

                {group.hasLogistics && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Package size={16} />
                    <span>Hậu cần</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}