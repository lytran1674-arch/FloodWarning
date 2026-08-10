// src/features/province_operator/pages/SupportRequestListPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  Flag,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Inbox,
  Loader2,
} from "lucide-react";
import { useSupportRequestList } from "../hooks/useSupportRequestList";
import type {
  Status,
  SupportRequestDetail,
  SupportRequestItem,
} from "../types/provinceType";

// ======================================================
// STATUS TABS
// ======================================================

const STATUS_TABS: {
  value: Status;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "PENDING", label: "Chờ duyệt", icon: Clock },
  { value: "APPROVED", label: "Đã duyệt", icon: CheckCircle2 },
  { value: "TEAM_REJECTED", label: "Đội từ chối", icon: AlertTriangle },
  { value: "REJECTED", label: "Đã từ chối", icon: XCircle },
  { value: "COMPLETED", label: "Hoàn tất", icon: Flag },
];

// ======================================================
// STATUS BADGE
// ======================================================

const STATUS_BADGE: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  TEAM_REJECTED: {
    label: "Đội từ chối",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  COMPLETED: {
    label: "Hoàn tất",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
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
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState<Status>("PENDING");

  const isTeamRejectedTab = activeStatus === "TEAM_REJECTED";
  const queryStatus: Status = isTeamRejectedTab ? "APPROVED" : activeStatus;

  const { items, loading, error, totalElements } =
    useSupportRequestList(queryStatus);

  const displayedItems = isTeamRejectedTab
    ? items.filter((sosGroup) =>
        sosGroup.items.some((item) => item.status === "TEAM_REJECTED")
      )
    : items;

  const canReview = (status: Status) =>
    status === "PENDING" || status === "TEAM_REJECTED";

  const goToReview = (
    sosGroup: SupportRequestItem,
    subItems: SupportRequestDetail[]
  ) => {
    navigate(`/support-request/${sosGroup.sosId}/review`, {
      state: {
        sosId: sosGroup.sosId,
        supportRequestId: sosGroup.id,
        items: subItems,
        dispatcherUserId: sosGroup.dispatcherUserId,
        dispatcherUserName: sosGroup.dispatcherUserName,
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Danh sách yêu cầu hỗ trợ
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý và điều phối yêu cầu cứu hộ theo trạng thái
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === activeStatus;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`
                relative flex items-center gap-1.5 whitespace-nowrap
                px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải danh sách...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && displayedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-600">
            Không có đơn nào
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Không có yêu cầu hỗ trợ ở trạng thái này
          </p>
        </div>
      )}

      {/* List */}
      {!loading && displayedItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            {isTeamRejectedTab ? displayedItems.length : totalElements} SOS
          </p>

          {displayedItems.map((sosGroup) => {
            const hasReviewable = sosGroup.items.some((item) =>
              canReview(item.status)
            );

            const totalRequiredGroups = sosGroup.items.reduce(
              (sum, item) => sum + (item.requiredGroupCount ?? 0),
              0
            );

            const totalAssignedGroups = sosGroup.items.reduce(
              (sum, item) => sum + (item.assignedGroupCount ?? 0),
              0
            );

            const parentBadge = STATUS_BADGE[sosGroup.status];

            return (
              <div
                key={sosGroup.id}
                onClick={() => {
                  if (hasReviewable) {
                    goToReview(sosGroup, sosGroup.items);
                  }
                }}
                className={`
                  rounded-xl border border-gray-200 bg-white p-4
                  transition-colors
                  ${
                    hasReviewable
                      ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/30"
                      : ""
                  }
                `}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900">
                      {sosGroup.id}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Cần {totalRequiredGroups} nhóm
                      {totalAssignedGroups > 0 && (
                        <span className="text-emerald-600">
                          {" "}
                          · đã gán {totalAssignedGroups}
                        </span>
                      )}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${parentBadge.className}`}
                  >
                    {parentBadge.label}
                  </span>
                </div>

                {/* Sub items */}
                <div className="space-y-2">
                  {sosGroup.items.map((subItem) => {
                    const badge = STATUS_BADGE[subItem.status];

                    return (
                      <div
                        key={subItem.id}
                        className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {SUPPORT_TYPE_LABEL[subItem.supportType] ??
                                subItem.supportType}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              Cần {subItem.requiredGroupCount} nhóm
                              {subItem.assignedGroupCount != null &&
                                subItem.assignedGroupCount > 0 && (
                                  <span className="text-emerald-600">
                                    {" "}
                                    · đã gán {subItem.assignedGroupCount}
                                  </span>
                                )}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Lý do đội từ chối */}
                        {subItem.status === "TEAM_REJECTED" &&
                          subItem.teamResponse && (
                            <p className="mt-2 rounded-md bg-orange-50 px-2.5 py-1.5 text-xs text-orange-700">
                              <span className="font-medium">Lý do:</span>{" "}
                              {subItem.teamResponse}
                            </p>
                          )}
                      </div>
                    );
                  })}
                </div>

                {/* Action */}
                {hasReviewable && (
                  <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      Xem chi tiết & điều phối
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}