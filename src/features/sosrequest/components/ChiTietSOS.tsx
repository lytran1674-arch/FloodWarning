import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet"

import {
  Calendar,
  MapPin,
  Users,
  Phone,
  ShieldAlert,
} from "lucide-react"

import type { DetailSos } from "../types/sosType"

interface Props {
  data?: DetailSos | null
  loading?: boolean
}

const priorityColor = (
  priority: string
) => {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-500"

    case "HIGH":
      return "bg-orange-500"

    case "MEDIUM":
      return "bg-yellow-500 text-black"

    default:
      return "bg-green-500"
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-100 text-orange-600"

    case "ASSIGNED":
      return "bg-blue-100 text-blue-600"

    case "DONE":
      return "bg-green-100 text-green-600"

    case "CANCELLED":
      return "bg-red-100 text-red-600"

    default:
      return "bg-gray-100 text-gray-600"
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chưa phân công"

    case "ASSIGNED":
      return "Đã phân công"

    case "DONE":
      return "Hoàn thành"

    case "CANCELLED":
      return "Đã hủy"

    default:
      return status
  }
}

export default function SOSDetailCard({
  data,
  loading,
}: Props) {
  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-gray-200 rounded" />

          <div className="h-4 w-full bg-gray-100 rounded" />

          <div className="h-72 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  // =========================
  // EMPTY
  // =========================
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow border p-6 text-gray-500">
        Không có dữ liệu SOS
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ========================= */}
      {/* INFO CARD */}
      {/* ========================= */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {/* HEADER */}
        <div className="p-5 border-b flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert
                className="text-red-500"
                size={20}
              />

              <h2 className="font-semibold text-lg">
                Yêu cầu cứu hộ
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {data.description ||
                "Không có mô tả"}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap ${priorityColor(
              data.priority
            )}`}
          >
            {data.priority}
          </span>
        </div>

        {/* BODY */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3 items-start">
            <MapPin
              size={18}
              className="text-blue-500 mt-0.5"
            />

            <div>
              <p className="text-gray-500">
                Địa chỉ
              </p>

              <p className="font-medium">
                {data.address}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Users
              size={18}
              className="text-green-500 mt-0.5"
            />

            <div>
              <p className="text-gray-500">
                Số nạn nhân
              </p>

              <p className="font-medium">
                {data.victimCount} người
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Calendar
              size={18}
              className="text-orange-500 mt-0.5"
            />

            <div>
              <p className="text-gray-500">
                Thời gian tạo
              </p>

              <p className="font-medium">
                {new Date(
                  data.createdAt
                ).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Phone
              size={18}
              className="text-purple-500 mt-0.5"
            />

            <div>
              <p className="text-gray-500">
                Số điện thoại
              </p>

              <p className="font-medium">
                {data.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* TAGS */}
        <div className="px-5 pb-5 flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
              data.status
            )}`}
          >
            {statusLabel(data.status)}
          </span>

          {data.injured && (
            <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
              Có người bị thương
            </span>
          )}

          {data.trapped && (
            <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
              Có người mắc kẹt
            </span>
          )}

          {data.vulnerable && (
            <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600">
              Có người yếu thế
            </span>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* MAP */}
      {/* ========================= */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="border-b px-5 py-4 font-semibold">
          Vị trí trên bản đồ
        </div>

        <div className="h-[350px]">
          <MapContainer
            center={[data.lat, data.lon]}
            zoom={15}
            scrollWheelZoom={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                data.lat,
                data.lon,
              ]}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">
                    SOS khẩn cấp
                  </p>

                  <p className="text-sm">
                    {data.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* ========================= */}
      {/* ASSIGNMENTS */}
      {/* ========================= */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="border-b px-5 py-4 font-semibold">
          Đội cứu hộ đã phân công
        </div>

        <div className="p-5 space-y-3">
          {data.assignments &&
          data.assignments.length > 0 ? (
            data.assignments.map(
              (item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {item.groupName}
                    </p>

                    <p className="text-sm text-gray-500">
                      ID nhóm:{" "}
                      {item.groupId}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                    Đã phân công
                  </span>
                </div>
              )
            )
          ) : (
            <div className="text-sm text-gray-500">
              Chưa có đội cứu hộ nào
              được phân công
            </div>
          )}
        </div>
      </div>
    </div>
  )
}