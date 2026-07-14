import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";


interface TeamSOS {
  id: string;
  priority: string;
  status: string;
  victimCount: number;
  mota: string;
  createdAt: string;
}

export default function TeamSOSPage() {
  const [sosList, setSosList] = useState<TeamSOS[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSOS();
  }, []);

  async function loadSOS() {
    try {
      const res = await axiosClient.get("/sos-request/team");

      setSosList(res.data.result.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Danh sách yêu cầu SOS
      </h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : sosList.length === 0 ? (
        <p>Không có yêu cầu SOS</p>
      ) : (
        <div className="space-y-4">
          {sosList.map((sos) => (
            <div
              key={sos.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
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

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(
                    sos.priority
                  )}`}
                >
                  {sos.priority}
                </span>
              </div>

             {(sos.status === "PENDING" || sos.status==="PROCESSING") && (
  <div className="mt-4 flex justify-end">
    <button
      onClick={() => navigate(`/sos-assign/${sos.id}`)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Phân công
    </button>
  </div>
)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}