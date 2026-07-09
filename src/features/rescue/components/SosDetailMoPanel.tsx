import { useEffect, useState } from "react";
import {
  MapPin,
  MessageSquare,
  Clock,
  Users,

  Inbox,
  Gauge,

  Building2,
  Hash,

} from "lucide-react";

import { SoSAPI } from "@/features/sosrequest/api/sosApi";



// ------------------- ĐỊNH NGHĨA TYPE -------------------
export interface Assignment {
  id: string;
  groupId: string;
  groupName: string;
  groupLeaderPhone: string;
  teamId: string;
  teamName: string;
  role: string;
  status: string;
  note: string | null;
  assignedAt: string;
  acknowledgedAt: string | null;
  arrivedAt: string | null;
  completedAt: string | null;
}

export interface SupportItem {
  id: string;

  supportType: string;

  requiredGroupCount: number;
  assignedGroupCount: number;

  status: string;

  assignedTeamId: string | null;
  assignedTeamName: string | null;

  provinceNote: string | null;
  teamResponse: string | null;
}

export interface SupportRequest {
  id: string;
  sosId: string;

  status: string

  items: SupportItem[];

  reason: string;

  requestedById: string;
  requestedByName: string;
  requestedPhone: string | null;

  approvedById: string | null;
  approvedByName: string | null;

  createdAt: string;
  reviewedAt: string | null;
}
export interface DetailSos {
  id: string;
  teamId: string;
  teamName: string;

  phoneNumber: string;
  victimCount: number;

  injured: boolean;
  trapped: boolean;
  vulnerable: boolean;

  description: string;

  priority: string;
  priorityReason: string;
  environmentRisk: string;

  lat: number;
  lon: number;
  address: string | null;

  status: string;
  trackingCode: string;

  createdAt: string;

  assignments: Assignment[];
  supportRequests: SupportRequest[];
}
// ------------------- CONSTANTS -------------------
// const SOS_STATUS_LABELS: Record<string, string> = {
//   PENDING: "Chờ xử lý",
//   ASSIGNED: "Đã giao đội",
//   IN_PROGRESS: "Đang xử lý",
//   RESOLVED: "Đã giải quyết",
//   CANCELED: "Đã huỷ",
// };

// const SOS_STATUS_COLORS: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   ASSIGNED: "bg-blue-100 text-blue-700",
//   IN_PROGRESS: "bg-indigo-100 text-indigo-700",
//   RESOLVED: "bg-green-100 text-green-700",
//   CANCELED: "bg-gray-200 text-gray-700",
// };

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  CRITICAL: "Khẩn cấp",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

// const ASSIGNMENT_STATUS_LABELS: Record<string, string> = {
//   ASSIGNED: "Đã giao",
//   ACKNOWLEDGED: "Đã nhận",
//   MOVING: "Đang di chuyển",
//   ARRIVED: "Đã tới nơi",
//   COMPLETED: "Hoàn thành",
//   FAILED: "Thất bại",
// };

// const ASSIGNMENT_STATUS_COLORS: Record<string, string> = {
//   ASSIGNED: "bg-yellow-100 text-yellow-700",
//   ACKNOWLEDGED: "bg-blue-100 text-blue-700",
//   MOVING: "bg-indigo-100 text-indigo-700",
//   ARRIVED: "bg-orange-100 text-orange-700",
//   COMPLETED: "bg-green-100 text-green-700",
//   FAILED: "bg-gray-200 text-gray-700",
// };

// const SUPPORT_TYPE_LABELS: Record<string, string> = {
//   BOAT: "Xuồng cứu hộ",
//   SEARCH_RESCUE: "Tìm kiếm cứu nạn",
//   MEDICAL: "Y tế",
//   FOOD: "Lương thực",
//   SHELTER: "Nơi trú ẩn",
// };

// const SUPPORT_STATUS_LABELS: Record<string, string> = {
//   PENDING: "Chờ duyệt",
//   APPROVED: "Đã duyệt",
//   REJECTED: "Từ chối",
//   COMPLETED: "Hoàn thành",
// };

// const SUPPORT_STATUS_COLORS: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   APPROVED: "bg-green-100 text-green-700",
//   REJECTED: "bg-red-100 text-red-700",
//   COMPLETED: "bg-blue-100 text-blue-700",
// };

// ------------------- HOOK -------------------
function useSosDetail(sosId: string | null) {
  const [data, setData] = useState<DetailSos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sosId) {
      setData(null);
      setError(null);
      return;
    }

    let active = true;

  const fetchDetail = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await SoSAPI.getdetailsos(sosId);
    // Nếu response có trường result (do API trả về { code, result })
    const data = (response as any).result ? (response as any).result : response;
    if (active) {
      setData(data as DetailSos);
    }
  } catch (err) {
        console.error("FETCH SOS DETAIL ERROR:", err);
        if (active) {
          setError("Không thể tải chi tiết SOS. Vui lòng thử lại.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      active = false;
    };
  }, [sosId]);

  return { data, loading, error };
}

// ------------------- COMPONENT -------------------
interface SosDetailPanelProps {
  sosId: string | null;
}

export default function SosDetailPanel({ sosId }: SosDetailPanelProps) {
  const { data: detail, loading, error } = useSosDetail(sosId);
const timeline = detail
  ? [
      {
        id: "created",
        title: "SOS được tạo",
        time: detail.createdAt,
        color: "bg-blue-500",
      },

      ...detail.assignments.flatMap((a) => [
        {
          id: `${a.id}-assigned`,
          title: `Phân công ${a.groupName}`,
          time: a.assignedAt,
          color: "bg-indigo-500",
        },
        ...(a.acknowledgedAt
          ? [{
              id: `${a.id}-ack`,
              title: `${a.groupName} đã xác nhận`,
              time: a.acknowledgedAt,
              color: "bg-cyan-500",
            }]
          : []),
        ...(a.arrivedAt
          ? [{
              id: `${a.id}-arrived`,
              title: `${a.groupName} đã đến hiện trường`,
              time: a.arrivedAt,
              color: "bg-orange-500",
            }]
          : []),
        ...(a.completedAt
          ? [{
              id: `${a.id}-completed`,
              title: `${a.groupName} hoàn thành`,
              time: a.completedAt,
              color: "bg-green-500",
            }]
          : []),
      ]),

      ...detail.supportRequests.flatMap((r) => [
        {
          id: `${r.id}-create`,
          title: "Gửi yêu cầu chi viện",
          time: r.createdAt,
          color: "bg-purple-500",
        },
        ...(r.reviewedAt
          ? [{
              id: `${r.id}-review`,
              title:
                r.status === "APPROVED"
                  ? "Yêu cầu được phê duyệt"
                  : "Yêu cầu bị từ chối",
              time: r.reviewedAt,
              color:
                r.status === "APPROVED"
                  ? "bg-emerald-500"
                  : "bg-red-500",
            }]
          : []),
      ]),
    ].sort(
      (a, b) =>
        new Date(a.time).getTime() -
        new Date(b.time).getTime()
    )
  : [];
  if (!sosId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center h-full flex flex-col items-center justify-center">
        <Inbox className="text-slate-300" size={48} />
        <p className="mt-4 text-slate-500 text-sm">
          Chọn một nhiệm vụ ở danh sách bên trái để xem chi tiết SOS
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">Chi tiết yêu cầu SOS</h2>
          {detail?.teamName && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Building2 size={12} />
              Đội phụ trách: {detail.teamName}
            </p>
          )}
          {detail?.trackingCode && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Hash size={12} />
              Mã tra cứu: {detail.trackingCode}
            </p>
          )}
        </div>

        {detail?.priority && (
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
              PRIORITY_COLORS[detail.priority] || "bg-slate-100 text-slate-700"
            }`}
          >
            {PRIORITY_LABELS[detail.priority] || detail.priority}
          </span>
        )}
      </div>

      {/* BODY */}
     <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
  {loading ? (
    <div className="text-center text-slate-500 py-8">
      Đang tải chi tiết...
    </div>
  ) : error ? (
    <div className="text-center text-red-500 py-8">
      {error}
    </div>
  ) : detail ? (
    <>
      {/* THÔNG TIN NẠN NHÂN */}
      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Users size={18} className="text-indigo-500" />
          Thông tin nạn nhân
        </div>

        <div className="text-sm text-slate-600">
          <p>Số điện thoại: {detail.phoneNumber || "Chưa cung cấp"}</p>
          <p>Số nạn nhân: {detail.victimCount} người</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {detail.injured && (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
              Bị thương
            </span>
          )}

          {detail.trapped && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
              Bị mắc kẹt
            </span>
          )}

          {detail.vulnerable && (
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
              Người già / Trẻ em
            </span>
          )}

          {!detail.injured &&
            !detail.trapped &&
            !detail.vulnerable && (
              <span className="text-xs text-slate-400">
                Không có thông tin đặc biệt
              </span>
            )}
        </div>
      </div>

      {/* VỊ TRÍ */}
      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <MapPin size={18} className="text-red-500" />
          Vị trí
        </div>

        <p className="text-sm text-slate-600">
          {detail.address || "Chưa có địa chỉ"}
        </p>

        <p className="text-xs text-slate-500">
          {detail.lat}, {detail.lon}
        </p>
      </div>

      {/* MÔ TẢ */}
      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <MessageSquare size={18} />
          Mô tả
        </div>

        <p className="text-sm text-slate-600 whitespace-pre-line">
          {detail.description || "Không có mô tả"}
        </p>
      </div>

      {/* ĐÁNH GIÁ MỨC ĐỘ */}
      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Gauge size={18} className="text-orange-500" />
          Đánh giá mức độ
        </div>

        <div className="flex gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              PRIORITY_COLORS[detail.priority]
            }`}
          >
            {PRIORITY_LABELS[detail.priority]}
          </span>

          <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
            {detail.environmentRisk}
          </span>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
          {detail.priorityReason}
        </div>
      </div>

      {/* TIMELINE */}
      <div className="border rounded-xl p-4">
        <div className="flex items-center gap-2 font-medium text-slate-700 mb-4">
          <Clock size={18} className="text-blue-500" />
          Timeline
        </div>

       

       <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-5">
  {timeline.map((item) => (
    <div key={item.id} className="relative">
      <span
        className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${item.color}`}
      />

      <p className="font-medium text-sm">
        {item.title}
      </p>

      <p className="text-xs text-slate-500">
        {new Date(item.time).toLocaleString("vi-VN")}
      </p>
    </div>
  ))}
</div>
        
  
      </div>
    </>
  ) : null}

      </div>
    </div>
  );
}

