import {
  Calendar,
  ChevronRight,
  Package,
  Truck,
  Users,
} from "lucide-react";
import { useSoS } from "../hooks/useSoS";


const statusColor = {
  APPROVED: "bg-green-100 text-green-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusText = {
  APPROVED: "Đã phê duyệt",
  PROCESSING: "Đang xử lý",
  PENDING: "Chờ xử lý",
  REJECTED: "Đã từ chối",
};

export const MySupportRequestCard=()=> {
      const { requests, loading } = useSoS();
if (loading) {
  return (
    <div className="flex justify-center py-10">
      Đang tải...
    </div>
  );
}

return (
  <div className="space-y-5 lg:m-10">
    <h2 className="text-sm text-black lg:text-2xl">Danh sách yêu cầu hỗ trợ cứu hộ đã gửi </h2>
    {requests.map((item) => (
      <div
        key={item.id}
        className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
      >
        <div className="grid grid-cols-12">

          {/* LEFT */}
          <div className="col-span-3 border-r p-5">
            <p className="text-xs text-gray-500">SOS ID</p>

            <p className="mt-1 break-all font-semibold">
              {item.sosId}
            </p>

            <div className="mt-4 flex items-center gap-2 text-gray-500">
              <Calendar size={16} />
              <span>{item.createdAt}</span>
            </div>

            <div
              className={`mt-4 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${
                statusColor[item.status as keyof typeof statusColor]
              }`}
            >
              {statusText[item.status as keyof typeof statusText]}
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold text-red-600 hover:bg-red-50">
              Xem chi tiết
              <ChevronRight size={18} />
            </button>
          </div>

          {/* RIGHT */}
          <div className="col-span-9 p-6">
            <p className="text-sm text-gray-400">
              Lý do yêu cầu
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {item.reason}
            </h2>

            <div className="mt-6 space-y-4">
              {item.items?.map((support) => (
                <div
                  key={support.id}
                  className="rounded-xl border border-green-100 bg-green-50 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                      <Package className="text-green-600" />
                    </div>

                    <div>
                      <p className="text-lg font-semibold">
                        {support.supportType}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          statusColor[
                            support.status as keyof typeof statusColor
                          ]
                        }`}
                      >
                        {
                          statusText[
                            support.status as keyof typeof statusText
                          ]
                        }
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Đội yêu cầu
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {support.requiredGroupCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Đã phân công
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-600">
                        {support.assignedGroupCount}
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Truck size={16} />
                        <span className="text-sm text-gray-500">
                          Đơn vị phụ trách
                        </span>
                      </div>

                      <p className="font-medium">
                        {support.assignedTeamName || "Chưa có"}
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Users size={16} />
                        <span className="text-sm text-gray-500">
                          Nhóm cứu hộ
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {support.assignedGroups?.length ? (
                          support.assignedGroups.map((group) => (
                            <span
                              key={group.groupId}
                              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                            >
                              {group.groupName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">
                            Chưa phân công
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    ))}
  </div>
)
}