import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Ship,
  Cross,
  Plus,
  LifeBuoy,
  Package,
  Users,
  UserRoundX,
} from "lucide-react";
import { rescueApi } from "../api/rescureApi";
import { Button } from "../../../components/ui/Button";
import { useAppSelector } from "@/hooks/redux.hooks";
import { ActiveGroup } from "../components/ActiveGroup";
import { DeleteGroup } from "../components/DeleteGroup";



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


  const LeaderTeam = user?.isTeamLeader === true;

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
  
 const handleCreateMemberTeam=()=>{
  navigate(`/res-team/${teamId}/add-member`)
  

  }
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách nhóm cứu hộ</h1>

        <div className="flex gap-2">
            <Button
              onClick={handleCreateMemberTeam}
              className="text-black bg-yellow-600 lg:text-xl md:text-xl text-sm border border-yellow-400 h-10 p-4 rounded-md"
            >
              <Plus />
              Thành viên
            </Button>
             <Button
              onClick={handleCreateMemberTeam}
              className="text-black bg-pink-500 lg:text-xl md:text-xl text-sm border border-pink-500 h-10 p-4 rounded-md"
            >
             Danh sách thành viên
            </Button>
          <Button
            className="border border-blue-500 text-blue-600 rounded-md p-2"
            onClick={handleOnClick}
            disabled={!teamId}
          >
            <Users />
            Thành viên chưa có nhóm
          </Button>

 {LeaderTeam && (
           
            <Button
              onClick={() => navigate("/res-groups/disbanded")}
              className="bg-red-500 text-white border  rounded-md p-2"
            >
            <UserRoundX />
              Các nhóm đã giải tán 
            </Button>
          )}
          {LeaderTeam && (
           
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

      <div className="grid gap-5">
  {groups.map((group) => {
    const trangThai = TRANG_THAI_NHOM[group.status] ?? {
      nhan: group.status,
      mau: "bg-slate-100 text-slate-600",
    };

    return (
      <div
        key={group.id}
        className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* ================= LEFT ================= */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => navigate(`/detail-group/${group.id}`)}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-800">
                {group.name}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${trangThai.mau}`}
              >
                {trangThai.nhan}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {group.hasBoat && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Ship size={18} />
                  <span>Có xuồng</span>
                </div>
              )}

              {group.hasMedical && (
                <div className="flex items-center gap-2 text-red-600">
                  <Cross size={18} />
                  <span>Y tế</span>
                </div>
              )}

              {group.hasSearchRescue && (
                <div className="flex items-center gap-2 text-orange-600">
                  <LifeBuoy size={18} />
                  <span>Tìm kiếm cứu nạn</span>
                </div>
              )}

              {group.hasLogistics && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Package size={18} />
                  <span>Hậu cần</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
        
          <div
            className="w-full lg:w-[360px] flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <ActiveGroup
              group={group}
              onSuccess={async () => {
                const data = await rescueApi.getGroupByTeam(teamId!);
                setGroups(Array.isArray(data) ? data : []);
              }}
            />
            {LeaderTeam&&(
            <DeleteGroup
  group={group}
  onSuccess={async () => {
    const data = await rescueApi.getGroupByTeam(teamId!);
    setGroups(Array.isArray(data) ? data : []);
  }}
/>
)}
            </div>
          </div>
        </div>
 
    );
  })}
</div>
    </div>
  );
}