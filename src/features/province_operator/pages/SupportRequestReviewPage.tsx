// src/features/province_operator/pages/SupportRequestReviewPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import SOSDetailCard from "@/features/sosrequest/components/ChiTietSOS";
import { useSoS } from "@/features/sosrequest/hooks/useSoS";

import type {
  ApprovedItem,
  ApprovePayload,
  SupportRequestDetail,
} from "../types/provinceType";

import { CandidateTeamsPanel } from "../components/CandidateTeamsPanel";
import { provinceApi } from "../api/provinceApi";

// ======================================================
// STATUS BADGE
// ======================================================

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
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

// ======================================================
// LOCATION STATE
// ======================================================

interface ReviewLocationState {
  sosId?: string;
  supportRequestId?: string;
  items?: SupportRequestDetail[];
}

// ======================================================
// COMPONENT
// ======================================================

export function SupportRequestReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sosId, supportRequestId, items } =
    (location.state as ReviewLocationState | null) ?? {};

  const {
    detailSOS,
    loading: loadingSOS,
    getDetailSoS,
  } = useSoS();

  // ======================================================
  // STATE
  // ======================================================

  /**
   * selectedTeamIds:
   * [
   *   "team-1",
   *   "team-2",
   * ]
   */
  const [selectedTeamIds, setSelectedTeamIds] =
    useState<string[]>([]);

  const [note, setNote] =
    useState("");

  const [rejectReason, setRejectReason] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [showRejectBox, setShowRejectBox] =
    useState(false);

  // ======================================================
  // VALIDATE
  // ======================================================

  useEffect(() => {
    if (
      !sosId ||
      !supportRequestId ||
      !items ||
      items.length === 0
    ) {
      toast.error(
        "Không có dữ liệu yêu cầu hỗ trợ"
      );

      navigate("/support-request");
    }
  }, [
    sosId,
    supportRequestId,
    items,
    navigate,
  ]);

  // ======================================================
  // LOAD SOS
  // ======================================================

  useEffect(() => {
    if (sosId) {
      getDetailSoS(sosId);
    }
  }, [sosId, getDetailSoS]);

  // ======================================================
  // NULL
  // ======================================================

  if (
    !sosId ||
    !supportRequestId ||
    !items ||
    items.length === 0
  ) {
    return null;
  }

  // ======================================================
  // TOTAL REQUIRED
  // ======================================================

  const totalRequiredGroups =
    useMemo(() => {
      return items.reduce(
        (sum, item) =>
          sum +
          (item.requiredGroupCount || 0),
        0
      );
    }, [items]);

  // ======================================================
  // ALL SELECTED
  // ======================================================

  const allSelected =
    selectedTeamIds.length ===
    totalRequiredGroups;

  // ======================================================
  // TOGGLE TEAM
  // ======================================================

  const handleToggleTeam = (
    teamId: string
  ) => {
    setSelectedTeamIds((prev) => {
      // bỏ chọn
      if (prev.includes(teamId)) {
        return prev.filter(
          (id) => id !== teamId
        );
      }

      // vượt giới hạn
      if (
        prev.length >=
        totalRequiredGroups
      ) {
        toast.warning(
          `Chỉ được chọn tối đa ${totalRequiredGroups} đội`
        );

        return prev;
      }

      // chọn thêm
      return [...prev, teamId];
    });
  };

  // ======================================================
  // APPROVE
  // ======================================================

  const handleApprove =
    async () => {
      if (!allSelected) {
        toast.warning(
          `Vui lòng chọn đủ ${totalRequiredGroups} đội`
        );

        return;
      }

      setSubmitting(true);

      try {
        /**
         * items:
         * - BOAT: cần 1
         * - MEDICAL: cần 2
         *
         * selectedTeamIds:
         * [A, B, C]
         *
         * =>
         * BOAT -> A
         * MEDICAL -> B, C
         */

        let cursor = 0;

        const approvedItems: ApprovedItem[] =
          [];

        items.forEach((item) => {
          const requiredCount =
            item.requiredGroupCount || 1;

          const assignedTeams =
            selectedTeamIds.slice(
              cursor,
              cursor + requiredCount
            );

          cursor += requiredCount;

          assignedTeams.forEach(
            (teamId) => {
              approvedItems.push({
                supportRequestItemId:
                  item.id,

                assignedTeamId:
                  teamId,

                status:
                  "APPROVED",
              });
            }
          );
        });

        // ======================================================
        // VALIDATE LẦN CUỐI
        // ======================================================

        const processedCount =
          approvedItems.reduce(
            (sum, item) => {
              const found =
                items.find(
                  (x) =>
                    x.id ===
                    item.supportRequestItemId
                );

              return (
                sum +
                (found
                  ?.requiredGroupCount || 0)
              );
            },
            0
          );

        if (
          approvedItems.length !==
          totalRequiredGroups
        ) {
          toast.error(
            "Số đội phân bổ không hợp lệ"
          );

          setSubmitting(false);
          return;
        }

        const payload: ApprovePayload =
          {
            items: approvedItems,
          };

        console.log(
          "APPROVE PAYLOAD:",
          payload
        );

        /**
         * payload mẫu:
         *
         * {
         *   items: [
         *     {
         *       supportRequestItemId: "...",
         *       assignedTeamId: "...",
         *       status: "APPROVED"
         *     }
         *   ]
         * }
         */

        await provinceApi.approveSupportRequest(
          supportRequestId,
          payload
        );

        toast.success(
          "Đã duyệt yêu cầu hỗ trợ"
        );

        navigate("/support-request");
      } catch (err: any) {
        console.error(
          "APPROVE ERROR:",
          err
        );

        toast.error(
          err?.response?.data
            ?.message ||
            "Duyệt yêu cầu thất bại"
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ======================================================
  // REJECT
  // ======================================================

  const handleReject =
    async () => {
      if (!rejectReason.trim()) {
        toast.warning(
          "Vui lòng nhập lý do từ chối"
        );

        return;
      }

      setSubmitting(true);

      try {
        await Promise.all(
          items.map((item) =>
            provinceApi.rejectSupportRequest(
              item.id,
              {
                provinceResponse:
                  rejectReason,
              }
            )
          )
        );

        toast.success(
          "Đã từ chối yêu cầu hỗ trợ"
        );

        navigate("/support-request");
      } catch (err: any) {
        console.error(
          "REJECT ERROR:",
          err
        );

        toast.error(
          err?.response?.data
            ?.message ||
            "Từ chối thất bại"
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />

        Quay lại
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">
            Chi tiết SOS
          </h2>

          <SOSDetailCard
            data={detailSOS}
            loading={loadingSOS}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* SUMMARY */}
          <div className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div>
                  <h3 className="text-sm font-semibold">
                    {
                      SUPPORT_TYPE_LABEL[
                        item.supportType
                      ]
                    }
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Cần{" "}
                    {
                      item.requiredGroupCount
                    }{" "}
                    nhóm
                  </p>

                  {item.teamResponse && (
                    <p className="mt-1 rounded bg-orange-50 px-2 py-1 text-xs text-orange-700">
                      {
                        item.teamResponse
                      }
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_BADGE[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            ))}

            {/* COUNTER */}
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Đã chọn{" "}
              <span className="font-semibold">
                {
                  selectedTeamIds.length
                }
              </span>
              /
              <span className="font-semibold">
                {
                  totalRequiredGroups
                }
              </span>{" "}
              đội
            </div>
          </div>

          {/* TEAM PANEL */}
          <CandidateTeamsPanel
            requestId={
              supportRequestId
            }
            items={items}
            sosLat={detailSOS?.lat}
            sosLon={detailSOS?.lon}
            selectedTeamIds={
              selectedTeamIds
            }
            onToggleTeam={
              handleToggleTeam
            }
          />

          {/* ACTION */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            {/* NOTE */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ghi chú (tuỳ chọn)
              </label>

              <textarea
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Ví dụ: Điều động đội gần khu vực nhất"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* BUTTONS */}
            {!showRejectBox ? (
              <div className="flex gap-2">
                <button
                  onClick={
                    handleApprove
                  }
                  disabled={
                    submitting ||
                    !allSelected
                  }
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Đang duyệt..."
                    : "Xác nhận duyệt"}
                </button>

                <button
                  onClick={() =>
                    setShowRejectBox(
                      true
                    )
                  }
                  disabled={
                    submitting
                  }
                  className="flex-1 rounded-lg border border-red-300 py-2 text-sm text-red-600"
                >
                  Từ chối
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lý do từ chối
                </label>

                <textarea
                  value={
                    rejectReason
                  }
                  onChange={(e) =>
                    setRejectReason(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Ví dụ: Không đủ lực lượng hỗ trợ"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setShowRejectBox(
                        false
                      )
                    }
                    disabled={
                      submitting
                    }
                    className="flex-1 rounded-lg border py-2 text-sm"
                  >
                    Huỷ
                  </button>

                  <button
                    onClick={
                      handleReject
                    }
                    disabled={
                      submitting
                    }
                    className="flex-1 rounded-lg bg-red-600 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {submitting
                      ? "Đang gửi..."
                      : "Xác nhận từ chối"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}