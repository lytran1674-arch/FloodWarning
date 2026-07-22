import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Eye } from "lucide-react";

interface TeamSOS {
  id: string;
  alreadyExists: string;
  priority: string;
  status: string;
  environmentRisk: string;
  victimCount: number;
  priorityReason: string;
  mota: string;
  callEventId: string;
  trackingCode: string;
  dispatcherUserId: string;
  dispatcherName: string;
  dispatcherType: string;
  createdAt: string;
}

interface SoSCardProps {
  // sosId đang được chọn để xem chi tiết ở panel bên cạnh (nếu component cha có quản lý)
  selectedSosId?: string | null;
  // gọi khi người dùng bấm vào card hoặc nút "Xem chi tiết"
  onSelectSos?: (id: string) => void;
}

export default function SoSCard({ selectedSosId, onSelectSos }: SoSCardProps) {
  const [sosList, setSosList] = useState<TeamSOS[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const isLeaderTeam = user?.isTeamLeader === true;

  useEffect(() => {
    if (isLeaderTeam) {
      loadSOS();
    } else {
      setLoading(false);
    }
  }, [isLeaderTeam]);

  async function loadSOS() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/sos-request/team");
      const allSOS = res.data.result.content || [];
      setSosList(allSOS);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  // Màu nền + viền của cả card theo độ ưu tiên (tông nhạt hơn badge để dễ đọc chữ)
  const priorityCardStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-200 border-red-500";
      case "HIGH":
        return "bg-orange-50 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  // Không phải trưởng nhóm -> không hiển thị khu vực này.
  if (!isLeaderTeam) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 border border-[#E5E7EB] rounded-md">
      <h1 className="text-lg sm:text-xl font-bold mb-4">Danh sách yêu cầu SOS</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : sosList.length === 0 ? (
        <p>Không có yêu cầu SOS</p>
      ) : (
        <div
          className="
            grid grid-cols-1 
            max-h-[700px]
            overflow-y-auto
            pr-1 sm:pr-2
          "
        >
          {sosList.map((sos) => {
            // Ưu tiên xác định "đã phân công" dựa trên việc đã có dispatcher hay chưa,
            // vì đây là dữ liệu chắc chắn hơn so với chuỗi status (có thể không khớp PENDING).
           // const isAssigned = Boolean(sos.dispatcherUserId || sos.dispatcherName);
            const isSelected = sos.id === selectedSosId;

            return (
              <div
                key={sos.id}
                onClick={() => onSelectSos?.(sos.id)}
                className={`flex flex-col justify-between border rounded-xl p-3 shadow-sm transition-colors cursor-pointer hover:shadow-md ${priorityCardStyle(
                  sos.priority
                )} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm break-words">{sos.mota}</p>
                    <Eye className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    👥 {sos.victimCount} nạn nhân
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500">
                    📅 {new Date(sos.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${priorityColor(
                      sos.priority
                    )}`}
                  >
                    {sos.priority}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSos?.(sos.id);
                      }}
                      className="text-xs sm:text-sm px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 whitespace-nowrap"
                    >
                      Xem chi tiết
                    </button>

                    {/* {isAssigned ? (
                      <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                        👤 {sos.dispatcherName || "Đã phân công"}
                      </span>
                    ) : ( */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sos-assign/${sos.id}`);
                        }}
                        className="text-xs sm:text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                      >
                        Phân công
                      </button>
                    {/* )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}