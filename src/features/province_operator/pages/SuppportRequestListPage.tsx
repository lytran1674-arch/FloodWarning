// src/features/province_operator/pages/SupportRequestListPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CheckCircle2, Clock, Flag, XCircle, AlertTriangle } from "lucide-react";

import { useSupportRequestList } from "../hooks/useSupportRequestList";

import type {
  Status,
  SupportRequestDetail,
  SupportRequestItem,
} from "../types/provinceType";

// ======================================================
// STATUS TABS
// ⚠️ "TEAM_REJECTED" chỉ tồn tại ở cấp ITEM CON (SupportRequestDetail),
// KHÔNG tồn tại trong enum SupportRequestStatus ở backend cho cấp
// SOS CHA. Nếu gọi API bằng status="TEAM_REJECTED" sẽ bị lỗi 400:
// "Failed to convert value of type 'String' to required type
// 'SupportRequestStatus'... for value [TEAM_REJECTED]"
//
// => Tab này KHÔNG được gọi API trực tiếp bằng giá trị này.
// Xử lý: khi tab active là TEAM_REJECTED, ta gọi API bằng "APPROVED"
// (vì SOS cha vẫn ở trạng thái APPROVED khi có 1 item bị đội từ chối),
// sau đó lọc lại ở client theo item con có status TEAM_REJECTED.
// ======================================================

const STATUS_TABS: {
  value: Status;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    value: "PENDING",
    label: "Chờ duyệt",
    icon: Clock,
  },

  {
    value: "APPROVED",
    label: "Đã duyệt",
    icon: CheckCircle2,
  },

  {
    value: "TEAM_REJECTED",
    label: "Đội từ chối",
    icon: AlertTriangle,
  },

  {
    value: "REJECTED",
    label: "Đã từ chối",
    icon: XCircle,
  },

  {
    value: "COMPLETED",
    label: "Hoàn tất",
    icon: Flag,
  },
];

// ======================================================
// STATUS BADGE
// ======================================================

const STATUS_BADGE: Record<Status, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",

  APPROVED: "bg-blue-100 text-blue-700",

  REJECTED: "bg-red-100 text-red-700",

  TEAM_REJECTED: "bg-orange-100 text-orange-700",

  COMPLETED: "bg-green-100 text-green-700",
};

// ======================================================
// SUPPORT TYPE LABEL
// ======================================================

const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT: "Xuồng cứu hộ",
  MEDICAL: "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS: "Hậu cần",
};

export function SupportRequestListPage() {
  // ======================================================
  // NAVIGATE
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [activeStatus, setActiveStatus] = useState<Status>("PENDING");

  // Cờ đánh dấu đang ở tab "Đội từ chối" — tab đặc biệt, không
  // gọi API trực tiếp bằng giá trị này.
  const isTeamRejectedTab = activeStatus === "TEAM_REJECTED";

  // Status THẬT SỰ gửi lên API. Nếu đang ở tab TEAM_REJECTED,
  // ta gọi bằng "APPROVED" rồi lọc lại ở client bên dưới.
  const queryStatus: Status = isTeamRejectedTab ? "APPROVED" : activeStatus;

  // ======================================================
  // FETCH DATA
  // ======================================================

  const { items, loading, error, totalElements } =
    useSupportRequestList(queryStatus);

  // Lọc lại ở client: chỉ giữ những SOS có ít nhất 1 item con
  // đang ở trạng thái TEAM_REJECTED
  const displayedItems = isTeamRejectedTab
    ? items.filter((sosGroup) =>
        sosGroup.items.some((item) => item.status === "TEAM_REJECTED")
      )
    : items;

  // ======================================================
  // REVIEWABLE
  // Đơn ở trạng thái PENDING, REJECTED, hoặc TEAM_REJECTED
  // (đội đã từ chối, đơn quay lại cho tỉnh xử lý) đều cần
  // PROVINCE_OPERATOR xem lại và điều phối.
  // ======================================================

  const canReview = (status: Status) =>
    status === "PENDING" || status === "TEAM_REJECTED" 
    

  // ======================================================
  // NAVIGATE REVIEW
  // ⚠️ FIX BUG: supportRequestId PHẢI là sosGroup.id (id phiếu cha),
  // KHÔNG được dùng sosGroup.sosId. Trước đây gán nhầm sosId khiến
  // API /support-request/{id}/candidate-teams ở trang review nhận
  // sai id và trả về 400 Bad Request.
  // ======================================================

  const goToReview = (
    sosGroup: SupportRequestItem,
    subItems: SupportRequestDetail[]
  ) => {
    navigate(`/support-request/${sosGroup.sosId}/review`, {
      state: {
        sosId: sosGroup.sosId,

        // id cha của support request — KHÔNG phải sosId
        supportRequestId: sosGroup.id,

        // QUAN TRỌNG:
        // truyền TOÀN BỘ items, backend cần đủ danh sách
        // để xử lý duyệt/từ chối theo từng item
        items: subItems,
      },
    });
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* TITLE */}
      <h1 className="mb-4 text-xl font-bold">Danh sách yêu cầu hỗ trợ</h1>

      {/* TABS */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === activeStatus;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`
                flex items-center gap-1.5
                whitespace-nowrap rounded-lg border
                px-3 py-1.5 text-sm transition-colors

                ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }
              `}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-400">Đang tải danh sách...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading && !error && displayedItems.length === 0 && (
        <p className="text-sm text-gray-400">
          Không có đơn nào ở trạng thái này
        </p>
      )}

      {/* LIST */}
      {!loading && displayedItems.length > 0 && (
        <>
          <p className="mb-2 text-xs text-gray-400">
            Tổng số:{" "}
            {isTeamRejectedTab ? displayedItems.length : totalElements} SOS
          </p>

          <div className="space-y-4">
            {displayedItems.map((sosGroup) => {
              // có item review được không
              const hasReviewable = sosGroup.items.some((item) =>
                canReview(item.status)
              );

              // tổng số nhóm cần
              const totalRequiredGroups = sosGroup.items.reduce(
                (sum, item) => sum + (item.requiredGroupCount ?? 0),
                0
              );

              // tổng số nhóm đã gán
              const totalAssignedGroups = sosGroup.items.reduce(
                (sum, item) => sum + (item.assignedGroupCount ?? 0),
                0
              );

              return (
                <div
                  key={sosGroup.id}
                  onClick={() => {
                    if (hasReviewable) {
                      // KHÔNG filter item — backend cần toàn bộ items
                      goToReview(sosGroup, sosGroup.items);
                    }
                  }}
                  className={`
                    rounded-xl border border-gray-200
                    bg-white p-4 transition-colors

                    ${hasReviewable ? "cursor-pointer hover:border-blue-400" : ""}
                  `}
                >
                  {/* HEADER */}
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        SOS: <span className="font-mono">{sosGroup.sosId}</span>
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Tổng cần{" "}
                        <span className="font-semibold">
                          {totalRequiredGroups}
                        </span>{" "}
                        nhóm
                        {totalAssignedGroups > 0 && (
                          <> — đã gán {totalAssignedGroups}</>
                        )}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                        STATUS_BADGE[sosGroup.status]
                      }`}
                    >
                      {sosGroup.status}
                    </span>
                  </div>

                  {/* SUPPORT TYPES */}
                  <div className="space-y-2">
                    {sosGroup.items.map((subItem) => (
                      <div key={subItem.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {SUPPORT_TYPE_LABEL[subItem.supportType]}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Cần {subItem.requiredGroupCount} nhóm
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                              STATUS_BADGE[subItem.status]
                            }`}
                          >
                            {subItem.status}
                          </span>
                        </div>

                        {/* TEAM REJECT — hiển thị lý do đội từ chối */}
                        {subItem.status === "TEAM_REJECTED" &&
                          subItem.teamResponse && (
                            <p className="mt-2 rounded bg-orange-50 px-2 py-1.5 text-xs text-orange-700">
                              Team từ chối: {subItem.teamResponse}
                            </p>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* ACTION */}
                  {hasReviewable && (
                    <div className="mt-3 text-right">
                      <span className="text-xs font-medium text-blue-600">
                        Bấm để xem chi tiết & điều phối →
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}