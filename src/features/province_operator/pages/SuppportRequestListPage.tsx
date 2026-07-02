// src/features/province_operator/components/SupportRequestListPage.tsx

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Clock,
  Flag,
  RotateCcw,
  XCircle,
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
    label: "Team từ chối",
    icon: RotateCcw,
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

const STATUS_BADGE: Record<
  Status,
  string
> = {
  PENDING:
    "bg-yellow-100 text-yellow-700",

  APPROVED:
    "bg-blue-100 text-blue-700",

  REJECTED:
    "bg-red-100 text-red-700",

  TEAM_REJECTED:
    "bg-orange-100 text-orange-700",

  COMPLETED:
    "bg-green-100 text-green-700",
};

// ======================================================
// SUPPORT TYPE LABEL
// ======================================================

const SUPPORT_TYPE_LABEL: Record<
  string,
  string
> = {
  BOAT: "Xuồng cứu hộ",

  MEDICAL: "Y tế",

  SEARCH_RESCUE:
    "Tìm kiếm cứu nạn",

  LOGISTICS:
    "Hậu cần",
};

export function SupportRequestListPage() {
  // ======================================================
  // NAVIGATE
  // ======================================================

  const navigate =
    useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [
    activeStatus,
    setActiveStatus,
  ] = useState<Status>(
    "PENDING"
  );

  // ======================================================
  // FETCH DATA
  // ======================================================

  const {
    items,
    loading,
    error,
    totalElements,
  } = useSupportRequestList(
    activeStatus
  );

  // ======================================================
  // REVIEWABLE
  // ======================================================

  const canReview = (
    status: Status
  ) =>
    status === "PENDING" ||
    status === "TEAM_REJECTED";

  // ======================================================
  // NAVIGATE REVIEW
  // ======================================================
const goToReview = (
  sosGroup: SupportRequestItem,
  subItems: SupportRequestDetail[]
) => {
  navigate(
    `/support-request/${sosGroup.sosId}/review`,
    {
      state: {
        sosId: sosGroup.sosId,
        supportRequestId: sosGroup.id,   // 👈 THÊM: id cha của SupportRequest
        items: subItems,
      },
    }
  );
};
  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mx-auto max-w-4xl p-6">

      {/* TITLE */}
      <h1 className="mb-4 text-xl font-bold">
        Danh sách yêu cầu hỗ trợ
      </h1>

      {/* TABS */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">

        {STATUS_TABS.map(
          (tab) => {
            const Icon =
              tab.icon;

            const isActive =
              tab.value ===
              activeStatus;

            return (
              <button
                key={
                  tab.value
                }
                onClick={() =>
                  setActiveStatus(
                    tab.value
                  )
                }
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
          }
        )}

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-400">
          Đang tải danh sách...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        items.length === 0 && (
          <p className="text-sm text-gray-400">
            Không có đơn nào ở
            trạng thái này
          </p>
        )}

      {/* LIST */}
      {!loading &&
        items.length > 0 && (
          <>
            <p className="mb-2 text-xs text-gray-400">
              Tổng số:{" "}
              {
                totalElements
              }{" "}
              SOS
            </p>

            <div className="space-y-4">

              {items.map(
                (
                  sosGroup
                ) => {

                  // chỉ cần 1 item pending là được review
                  const hasReviewable =
                    sosGroup.items.some(
                      (item) =>
                        canReview(
                          item.status
                        )
                    );

                  // tổng nhóm cần hỗ trợ
                  const totalRequiredGroups =
                    sosGroup.items.reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        (item.requiredGroupCount ||
                          0),
                      0
                    );

                  // tổng nhóm đã gán
                  const totalAssignedGroups =
                    sosGroup.items.reduce(
                      (
                        sum,
                        item
                      ) =>
                        sum +
                        (item.assignedGroupCount ||
                          0),
                      0
                    );

                  return (
                    <div
                      key={
                        sosGroup.id
                      }
                   onClick={() => {
  if (hasReviewable) {
    const reviewableItems = sosGroup.items.filter((item) =>
      canReview(item.status)
    );
    goToReview(sosGroup, reviewableItems);
  }
}}
                      className={`
                        rounded-xl border border-gray-200
                        bg-white p-4 transition-colors

                        ${
                          hasReviewable
                            ? "cursor-pointer hover:border-blue-400"
                            : ""
                        }
                      `}
                    >

                      {/* HEADER */}
                      <div className="mb-3 flex items-center justify-between">

                        <div>

                          <p className="text-xs text-gray-400">
                            SOS:{" "}

                            <span className="font-mono">
                              {
                                sosGroup.sosId
                              }
                            </span>

                          </p>

                          <p className="mt-1 text-xs text-gray-500">

                            Tổng cần{" "}

                            <span className="font-semibold">
                              {
                                totalRequiredGroups
                              }
                            </span>{" "}

                            nhóm

                            {totalAssignedGroups >
                              0 && (
                              <>
                                {" "}
                                — đã gán{" "}
                                {
                                  totalAssignedGroups
                                }
                              </>
                            )}

                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                            STATUS_BADGE[
                              sosGroup.status
                            ]
                          }`}
                        >
                          {
                            sosGroup.status
                          }
                        </span>

                      </div>

                      {/* SUPPORT TYPES */}
                      <div className="space-y-2">

                        {sosGroup.items.map(
                          (
                            subItem
                          ) => (
                            <div
                              key={
                                subItem.id
                              }
                              className="rounded-lg border p-3"
                            >

                              <div className="flex items-center justify-between gap-3">

                                <div>

                                  <p className="text-sm font-semibold">
                                    {
                                      SUPPORT_TYPE_LABEL[
                                        subItem
                                          .supportType
                                      ]
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">

                                    Cần{" "}

                                    {
                                      subItem.requiredGroupCount
                                    }{" "}

                                    nhóm

                                  </p>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                                    STATUS_BADGE[
                                      subItem
                                        .status
                                    ]
                                  }`}
                                >
                                  {
                                    subItem.status
                                  }
                                </span>

                              </div>

                              {/* TEAM REJECT */}
                              {subItem.status ===
                                "TEAM_REJECTED" &&
                                subItem.teamResponse && (
                                  <p className="mt-2 rounded bg-orange-50 px-2 py-1.5 text-xs text-orange-700">

                                    Team từ chối:{" "}
                                    {
                                      subItem.teamResponse
                                    }

                                  </p>
                                )}

                            </div>
                          )
                        )}

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
                }
              )}

            </div>
          </>
        )}

    </div>
  );
}