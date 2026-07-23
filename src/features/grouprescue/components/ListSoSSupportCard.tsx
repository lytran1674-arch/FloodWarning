import { Calendar, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupportRequestListGroup } from "../hooks/useSupportRequestListGroup";

export const ListSoSSupportCard = () => {
  const { sossupport } = useSupportRequestListGroup();
  const navigate = useNavigate();

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: "Chờ xử lý",
      className: "bg-orange-100 text-orange-500",
    },
    PROCESSING: {
      label: "Đang xử lý",
      className: "bg-blue-100 text-blue-600",
    },
    APPROVED: {
      label: "Đã duyệt",
      className: "bg-green-100 text-green-600",
    },
    REJECTED: {
      label: "Từ chối",
      className: "bg-red-100 text-red-600",
    },
  };

  return (
    <div className="space-y-5">
      {sossupport.map((item) => {
        const status = statusConfig[item.status] ?? {
          label: item.status,
          className: "bg-gray-100 text-gray-600",
        };

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 lg:w-[600px] mt-2"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h2 className="font-semibold text-lg text-gray-800">
                Yêu cầu hỗ trợ: {item.groupName}
              </h2>

              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Trưởng nhóm</p>
                  <p className="font-semibold text-gray-900">
                    {item.groupLeaderName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Lý do</p>
                  <p className="font-semibold text-gray-900">{item.reason}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-700 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Thời gian tạo</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            {(item.status === "PENDING" || item.status === "PROCESSING") && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => navigate(`/support-group-assign/${item.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 py-2.5 transition"
                >
                  Phân công
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};