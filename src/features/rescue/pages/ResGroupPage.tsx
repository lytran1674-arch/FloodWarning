import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Ship,
  Cross,
  ArrowLeft,
  Plus,
  LifeBuoy,
  Package,
  Users,
} from "lucide-react";
import { rescueApi } from "../api/rescureApi";
import { Button } from "../../../components/ui/Button";
import { useAppSelector } from "@/hooks/redux.hooks";

export default function ResGroupPage() {
 
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state)=>state.auth.user)
  const canCreateGroup = user?.isTeamLeader === true;
  const teamId=user?.teamId
  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await rescueApi.getGroupByTeam(teamId);
        setGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId, location.key]);

  const handleOnClick=()=>{
    navigate(`/team/${teamId}/available-members`)
    console.log(teamId)
  }
  return (
    <div className="p-6">
      

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách Group</h1>
        <div className="flex justify-end lg:gap-2">
        <Button className="border border-blue-500 text-blue-600 rounded-md lg:p-2"
        onClick={handleOnClick}>
          <Users/>
          Thành viên chưa có Group
        </Button>
        {canCreateGroup && (
          <Button
            onClick={() => navigate("/res-group/create")}
            className="text-black bg-yellow-600 lg:text-xl sm:text-sm text-sm md:text-xl border border-yellow-400 h-10 p-4 rounded-md"
          >
            <Plus />
            Thêm nhóm cứu hộ
          </Button>
        )}
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center">Đang tải dữ liệu...</div>
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
            onClick={() => navigate(`/res-groups/${group.id}/members`)}
            className="cursor-pointer rounded-xl border p-4 transition hover:bg-slate-50 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {group.status}
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
        ))}
      </div>
    </div>
  );
}