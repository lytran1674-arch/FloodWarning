  import { useCallback, useEffect, useState } from "react";
  import { ShieldAlert, Users, Navigation, Clock3 } from "lucide-react";

  import type { AssignmentGroup } from "@/features/grouprescue/types/groupType";
  import { useAppSelector } from "@/hooks/redux.hooks";
  import { groupService } from "@/features/grouprescue/services/groupService";
  import AssignmentStatusSelect from "@/features/grouprescue/components/AssigmentStatusSelect";
import { ModalFailedAssigment } from "@/features/sos-assignment/component/ModalFailedAssigment";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

  const STATUS_LABELS: Record<string, string> = {
    ASSIGNED: "Đã giao",
    ACKNOWLEDGED: "Đã nhận",
    MOVING: "Đang di chuyển",
    ARRIVED: "Đã tới nơi",
    COMPLETED: "Hoàn thành",
    FAILED: "Thất bại",
  };

  const STATUS_COLORS: Record<string, string> = {
    ASSIGNED: "bg-yellow-100 text-yellow-700",
    ACKNOWLEDGED: "bg-blue-100 text-blue-700",
    MOVING: "bg-indigo-100 text-indigo-700",
    ARRIVED: "bg-orange-100 text-orange-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-gray-200 text-gray-700",
  };

  const PRIORITY_COLORS: Record<string, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  interface AssigmentCardProps {
    selectedSosId: string | null;
    onSelectSos: (sosId: string) => void;
  }


  export default function AssigmentCard({ selectedSosId, onSelectSos }: AssigmentCardProps) {
    const user = useAppSelector((state) => state.auth.user);
    const isLeaderGroup = user?.isGroupLeader === true;

    const [assigmentList, setassigmentList] = useState<AssignmentGroup[]>([]);
    const [loading, setLoading] = useState(true);
     const [failingAssignmentId, setFailingAssignmentId] = useState<string | null>(null);

    const navigate=useNavigate();

   const handleOnClick = (assignmentId: string) => {
  navigate(`/support-request-group/${assignmentId}`);
};
    const fetchAssignments = useCallback(async () => {
      try {
        setLoading(true);
        const data = await groupService.getAssignmentgroup();
        console.log("ASSIGNMENTS:", data);
        setassigmentList(data ?? []);
      } catch (error) {
        console.error("FETCH ASSIGNMENTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (isLeaderGroup) {
        fetchAssignments();
      } else {
        setLoading(false);
      }
    }, [isLeaderGroup, fetchAssignments]);

    if (!isLeaderGroup) {
      return null;
    }

    return (
      <div className="space-y-4 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Danh sách nhiệm vụ</h1>
            <p className="text-sm text-slate-500 mt-1">
              Danh sách nhiệm vụ được giao cho nhóm cứu hộ
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
            {assigmentList.length} nhiệm vụ
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
            Đang tải nhiệm vụ...
          </div>
        ) : assigmentList.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <ShieldAlert className="mx-auto text-slate-300" size={48} />
            <p className="mt-4 text-slate-500">Hiện chưa có nhiệm vụ nào</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {assigmentList.map((assigment) => {
              const isActive = selectedSosId === assigment.sosId;

              return (
                <div
                  key={assigment.assignmentId}
                  className={`
                  bg-white rounded-2xl border shadow-sm hover:shadow-md
                  transition-all duration-300 overflow-hidden
                  ${isActive ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}
                  `}
                >
                  {/* TOP */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <ShieldAlert className="text-blue-700" size={22} />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800">
                          SOS #{assigment.sosId?.slice(0, 8)}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Assignment: {assigment.assignmentId?.slice(0, 12)}
                        </p>
                      </div>
                    </div>
                       {["ASSIGNED","ACKNOWLEDGED","MOVING","ARRIVED","RESCUING"].includes(assigment.status)&&(
                      <div className="lg:bg-red-600 lg:p-2 rounded-lg">                      
                        <Button className="text-white font-medium lg:text-sm text-xs"
                         onClick={() => handleOnClick(assigment.assignmentId)}
                        >Tạo yêu cầu hỗ trợ</Button>
                      </div>
                       )}
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        PRIORITY_COLORS[assigment.priority] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {assigment.priority}
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5 space-y-4">
                    {/* STATUS */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Clock3 size={18} className="text-slate-500" />
                        <span className="text-sm text-slate-600">Trạng thái nhiệm vụ</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[assigment.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {STATUS_LABELS[assigment.status] || assigment.status}
                      </span>
                    </div>

                    {/* STATUS UPDATE */}
                    {["ASSIGNED","ACKNOWLEDGED","MOVING","ARRIVED","RESCUING"].includes(assigment.status) && (
                      <div>
                        <AssignmentStatusSelect
                          assignmentId={assigment.assignmentId}
                          currentStatus={assigment.status}
                          onUpdated={fetchAssignments}
                        />
                      </div>
                    )}

                    {/* INFO */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Navigation size={16} className="text-red-500" />
                          <span className="text-sm font-medium">Vị trí cứu hộ</span>
                        </div>
                        <p className="text-sm text-slate-600">Latitude: {assigment.lat}</p>
                        <p className="text-sm text-slate-600 mt-1">Longitude: {assigment.lon}</p>
                      </div>

                      <div className="border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Users size={16} className="text-indigo-500" />
                          <span className="text-sm font-medium">Thông tin nhóm</span>
                        </div>
                        <p className="text-sm text-slate-600">Vai trò: {assigment.role}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Nhóm chính: {assigment.primaryGroupName || "Không có"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-between">
                      {["ASSIGNED","ACKNOWLEDGED","MOVING","ARRIVED","RESCUING"].includes(assigment.status)&&(
                      <button className="border border-red bg-red-500 text-white font-medium lg:px-4 lg:py-2 rounded-xl 
                      hover:bg-red-400"
                        type="button"
                        onClick={() => setFailingAssignmentId(assigment.assignmentId)}
                      >
                        Thất bại
                      </button>
                      )}
                    <button
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectSos(assigment.sosId);
    }}
                        className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition
                        ${
                          isActive
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }
                        `}
                      >
                        {isActive ? "Đang xem chi tiết" : "Xem chi tiết"}
                      </button>
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

          <ModalFailedAssigment
        isOpen={failingAssignmentId !== null}
        assignmentId={failingAssignmentId ?? ""}
        onClose={() => setFailingAssignmentId(null)}
        onSuccess={() => {
          setFailingAssignmentId(null);
          fetchAssignments();
        }}
      />
      </div>
    );
  }