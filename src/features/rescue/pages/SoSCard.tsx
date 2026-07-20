import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux.hooks";



interface TeamSOS {
  id: string;
  priority: string;
  status: string;
  victimCount: number;
  mota: string;
  createdAt: string;
}

export default function SoSCard() {
  const [sosList, setSosList] = useState<TeamSOS[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  const user = useAppSelector((state) => state.auth.user);
  const isLeaderTeam = user?.isTeamLeader===true

  

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

setSosList(allSOS
);
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

  // ── Chặn truy cập nếu không phải leaderTeam ──
  if (isLeaderTeam) {
  
  return (
    <div className="p-6 border border-[#E5E7EB] rounded-md ">
      <h1 className="text-xl font-bold mb-4">
        Danh sách yêu cầu SOS
      </h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : sosList.length === 0 ? (
        <p>Không có yêu cầu SOS</p>
      ) : (
        <div
          className="
          space-y-3
          max-h-[700px]
          overflow-y-auto
          pr-2
          "
        >
          {sosList.map((sos) => (
            
            <div
              key={sos.id}
              className={`border rounded-xl p-2 shadow-sm transition-colors ${priorityCardStyle(
                sos.priority
              )}`}
            >
              <div className="flex-wrap ">
                  <p className="font-semibold text-xs sm:text-sm lg:text-xs">
                    {sos.mota}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    👥 {sos.victimCount} nạn nhân
                  </p>

                  <p className="text-sm text-gray-500">
                    📅{" "}
                    {new Date(
                      sos.createdAt
                    ).toLocaleString()}
                  </p>
             
              </div>
                    
              <div className="lg:mt-1 sm:mt-1 flex justify-between">
                   <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(
                    sos.priority
                  )}`}
                >
                  {sos.priority}
                </span>
                
                <button
                  onClick={() =>
                    navigate(`/sos-assign/${sos.id}`)
                  }
                  className=" text-xs sm:text-sm lg:text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Phân công
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
}