import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Cross, LifeBuoy, Package, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { rescueService } from "../services/rescueService"; // chỉnh lại path đúng của bạn

const TRANG_THAI_NHOM: Record<string, { nhan: string; mau: string }> = {
  DISBANDED: {
    nhan: "Đã giải tán",
    mau: "bg-red-100 text-red-700",
  },
};

export default function GroupDisbanded() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const LeaderTeam = user?.isTeamLeader === true;

  useEffect(() => {
    if (!LeaderTeam) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await rescueService.ListGroupDisbanded();
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [LeaderTeam]);

  if (!LeaderTeam) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Bạn không có quyền truy cập trang này.
        </div>
      </div>
    );
  }
const handleQuaylai=()=>{
    navigate(-1);
}
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-start lg:gap-3 gap-1">
        <ArrowLeft onClick={handleQuaylai}/>
        <h1 className="text-2xl font-bold">Danh sách nhóm đã giải tán</h1>
      </div>

      {loading && (
        <div className="py-10 text-center">Đang tải dữ liệu...</div>
      )}

      {!loading && groups.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-slate-500">
          Chưa có nhóm nào đã giải tán.
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
                <div
                  className="flex-1 cursor-pointer"
                 
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

                  {group.notes && (
                    <p className="mt-3 text-sm text-slate-500">
                      Ghi chú: {group.notes}
                    </p>
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