import { Calendar, Users, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupportRequestListGroup } from "../hooks/useSupportRequestListGroup";

export const ListSoSSupportCard = () => {
  const { sossupport } = useSupportRequestListGroup();
  const navigate = useNavigate();
  console.log(sossupport);

  const statusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-5">
      {sossupport.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {item.groupName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Mã yêu cầu: {item.id}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-5 px-6 py-5">

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Leader</p>
                  <p className="font-medium">{item.groupLeaderName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Lý do yêu cầu</p>
                  <p className="text-gray-700">
                    {item.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">
                    Thời gian tạo
                  </p>
                  <p>
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

            </div>

            {/* Right */}
            <div className="bg-gray-50 rounded-xl p-4 border flex flex-col justify-between">

              <div>
                <p className="text-sm font-semibold mb-3">
                  Thông tin xử lý
                </p>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Nhóm yêu cầu
                    </span>

                    <span className="font-medium">
                      {item.groupName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Leader
                    </span>

                    <span>{item.groupLeaderName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Trạng thái
                    </span>

                    <span className="font-medium">
                      {item.status}
                    </span>
                  </div>

                </div>
              </div>

              {(item.status === "PENDING" ||
                item.status === "PROCESSING") && (
                <button
                  onClick={() =>
                    navigate(`/support-group-assign/${item.id}`)
                  }
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
                >
                  Phân công nhóm
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};