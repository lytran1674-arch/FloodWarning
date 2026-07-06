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
import { useCandidateTeams } from "../hooks/usecandidateTeams";
import { provinceApi } from "../api/provinceApi";
import { getAvailableGroups, SUPPORT_TYPE_LABEL } from "../utils/supportType";

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

  const { detailSOS, loading: loadingSOS, getDetailSoS } = useSoS();

  // ======================================================
  // CANDIDATE TEAMS
  // Fetch 1 LẦN DUY NHẤT ở đây (component cha) bằng hook dùng
  // chung, rồi truyền xuống CandidateTeamsPanel để hiển thị.
  // Nhờ vậy trang review và panel luôn dùng chung 1 nguồn dữ
  // liệu teams — tránh lệch số liệu khi tính toán duyệt/approve.
  // ======================================================

  const { teams, loading: loadingTeams } = useCandidateTeams(
    supportRequestId
  );

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
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);

  // ======================================================
  // VALIDATE
  // ======================================================

  useEffect(() => {
    if (!sosId || !supportRequestId || !items || items.length === 0) {
      toast.error("Không có dữ liệu yêu cầu hỗ trợ");
      navigate("/support-request");
    }
  }, [sosId, supportRequestId, items, navigate]);

  // ======================================================
  // LOAD SOS
  // ======================================================

  useEffect(() => {
    if (sosId) {
      getDetailSoS(sosId);
    }
  }, [sosId, getDetailSoS]);

  // ======================================================
  // TOTAL REQUIRED
  // (Hook luôn được gọi trước mọi return có điều kiện — tuân thủ Rules of Hooks)
  // ======================================================

  const totalRequiredGroups = useMemo(() => {
    return (items ?? []).reduce(
      (sum, item) => sum + (item.requiredGroupCount || 0),
      0
    );
  }, [items]);

  // ======================================================
  // ALLOCATION BY ITEM
  // Tính số nhóm ĐÃ ĐÁP ỨNG được cho từng support type, dựa
  // trên SỐ NHÓM THẬT (availableBoatGroups, v.v...) của các
  // đội đã chọn — KHÔNG phải đếm số đội trong selectedTeamIds.
  //
  // Ví dụ: cần 2 nhóm BOAT, chọn 1 đội có availableBoatGroups=2
  // => allocated = 2, fulfilled = true. Không cần chọn thêm đội
  // thứ 2.
  // ======================================================

  const allocationByItem = useMemo(() => {
    const selectedTeams = teams.filter((team) =>
      selectedTeamIds.includes(team.id)
    );

    return (items ?? []).map((item) => {
      const required = item.requiredGroupCount || 0;

      const totalAvailable = selectedTeams.reduce(
        (sum, team) => sum + getAvailableGroups(team, item.supportType),
        0
      );

      return {
        itemId: item.id,
        supportType: item.supportType,
        required,
        allocated: Math.min(totalAvailable, required),
        fulfilled: totalAvailable >= required,
      };
    });
  }, [teams, selectedTeamIds, items]);

  const totalSelectedGroups = useMemo(
    () => allocationByItem.reduce((sum, a) => sum + a.allocated, 0),
    [allocationByItem]
  );

  const allSelected =
    allocationByItem.length > 0 &&
    allocationByItem.every((a) => a.fulfilled);

  // ======================================================
  // NULL GUARD
  // ======================================================

  if (!sosId || !supportRequestId || !items || items.length === 0) {
    return null;
  }

  // ======================================================
  // TOGGLE TEAM
  // Không còn giới hạn cứng theo "số đội <= số nhóm cần" —
  // vì 1 đội có thể tự đáp ứng nhiều hơn 1 nhóm. Panel con
  // (CandidateTeamsPanel) đã tự disable checkbox của đội hết
  // nhóm khả dụng, nên ở đây chỉ cần toggle tự do.
  // ======================================================

  const handleToggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  // ======================================================
  // APPROVE
  // Build payload bằng cách duyệt qua từng đội đã chọn theo
  // TỪNG loại hỗ trợ, lấy min(số nhóm khả dụng của đội, số
  // nhóm còn thiếu) — thay vì cắt mảng selectedTeamIds theo
  // kiểu 1-đội-1-nhóm như trước.
  // ======================================================

  const handleApprove = async () => {
    if (!allSelected) {
      toast.warning("Vui lòng chọn đủ số nhóm hỗ trợ cho từng loại");
      return;
    }

    setSubmitting(true);

    try {
      /**
       * items:
       * - BOAT: cần 2
       * - MEDICAL: cần 1
       *
       * selectedTeamIds: [A, B]
       * A.availableBoatGroups = 2
       * B.availableMedicalGroups = 1
       *
       * =>
       * BOAT -> A (x2 dòng approvedItems, cùng assignedTeamId=A)
       * MEDICAL -> B (x1 dòng)
       */

const approvedItems: ApprovedItem[] = [];

items.forEach((item) => {
  let remaining = item.requiredGroupCount || 0;

  for (const teamId of selectedTeamIds) {
    if (remaining <= 0) break;

    const team = teams.find((t) => t.id === teamId);
    if (!team) continue;

    const available = getAvailableGroups(team, item.supportType);
    if (available <= 0) continue;

    // CHỈ 1 dòng cho mỗi cặp (item, team) — backend tự hiểu
    // đội này đảm nhận phần còn thiếu của item, KHÔNG lặp dòng
    // theo số nhóm mà đội đó cung cấp.
    approvedItems.push({
      supportRequestItemId: item.id,
      assignedTeamId: teamId,
      status: "APPROVED",
    });

    remaining -= Math.min(available, remaining);
  }
});

// ======================================================
// VALIDATE LẦN CUỐI
// So sánh số CẶP (item, team) hợp lệ, không còn so bằng
// tổng số NHÓM nữa (vì 1 dòng giờ có thể gánh nhiều nhóm)
// ======================================================

if (approvedItems.length === 0) {
  toast.error("Chưa phân bổ được đội nào");
  setSubmitting(false);
  return;
}

      const payload: ApprovePayload = {
        items: approvedItems,
      };

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

      await provinceApi.approveSupportRequest(supportRequestId, payload);
  

      toast.success("Đã duyệt yêu cầu hỗ trợ");
      navigate("/support-request");
    } catch (err: any) {
      console.error("APPROVE ERROR:", err);
      toast.error(err?.response?.data?.message || "Duyệt yêu cầu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // REJECT
  // Từ chối là hành động ở cấp PHIẾU CHA (supportRequestId),
  // KHÔNG gọi lặp theo từng item con.
  // Endpoint: PUT /support-request/{supportRequestId}/reject
  // ======================================================

  const handleReject = async () => {
  if (!rejectReason.trim()) {
    toast.warning("Vui lòng nhập lý do từ chối");
    return;
  }

  setSubmitting(true);

  try {
    // Dùng chung endpoint approve, nhưng mỗi item có status = REJECTED
    // và provinceResponse là lý do từ chối. Test qua Postman xác nhận
    // đúng cấu trúc: PUT /support-request/{id}/approve
    // { items: [{ supportRequestItemId, status: "REJECTED", provinceResponse }] }
    const rejectedItems = items.map((item) => ({
      supportRequestItemId: item.id,
      status: "REJECTED" as const,
      provinceResponse: rejectReason,
    }));

    await provinceApi.approveSupportRequest(supportRequestId, {
      items: rejectedItems,
    });

    toast.success("Đã từ chối yêu cầu hỗ trợ");
    navigate("/support-request");
  } catch (err: any) {
    console.error("REJECT ERROR:", err);
    toast.error(err?.response?.data?.message || "Từ chối thất bại");
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
          <h2 className="mb-3 text-lg font-semibold">Chi tiết SOS</h2>
          <SOSDetailCard data={detailSOS} loading={loadingSOS} />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* SUMMARY */}
          <div className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
            {items.map((item) => {
              const allocation = allocationByItem.find(
                (a) => a.itemId === item.id
              );

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <div>
                    <h3 className="text-sm font-semibold">
                      {SUPPORT_TYPE_LABEL[item.supportType]}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Đã chọn {allocation?.allocated ?? 0}/
                      {item.requiredGroupCount} nhóm
                    </p>

                    {item.teamResponse && (
                      <p className="mt-1 rounded bg-orange-50 px-2 py-1 text-xs text-orange-700">
                        {item.teamResponse}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                      STATUS_BADGE[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}

            {/* COUNTER */}
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Đã chọn{" "}
              <span className="font-semibold">{totalSelectedGroups}</span>/
              <span className="font-semibold">{totalRequiredGroups}</span>{" "}
              nhóm
            </div>
          </div>

          {/* TEAM PANEL */}
          {/*
            ⚠️ QUAN TRỌNG: requestId phải là supportRequestId (id phiếu cha),
            KHÔNG được dùng sosId — đây là bug đã fix. Trước đó truyền nhầm
            {sosId} khiến API /support-request/{id}/candidate-teams nhận
            sai id và trả về 400 Bad Request.

            teams/loadingTeams được fetch 1 lần ở đây (useCandidateTeams)
            và truyền xuống panel để cả trang review và panel dùng chung
            1 nguồn dữ liệu — tránh lệch số liệu khi tính approve.
          */}
          <CandidateTeamsPanel
            teams={teams}
            loading={loadingTeams}
            items={items}
            sosLat={detailSOS?.lat}
            sosLon={detailSOS?.lon}
            selectedTeamIds={selectedTeamIds}
            onToggleTeam={handleToggleTeam}
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
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Điều động đội gần khu vực nhất"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* BUTTONS */}
            {!showRejectBox ? (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={submitting || !allSelected}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white disabled:opacity-50"
                >
                  {submitting ? "Đang duyệt..." : "Xác nhận duyệt"}
                </button>

                <button
                  onClick={() => setShowRejectBox(true)}
                  disabled={submitting}
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
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Không đủ lực lượng hỗ trợ"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRejectBox(false)}
                    disabled={submitting}
                    className="flex-1 rounded-lg border py-2 text-sm"
                  >
                    Huỷ
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-red-600 py-2 text-sm text-white disabled:opacity-50"
                  >
                    {submitting ? "Đang gửi..." : "Xác nhận từ chối"}
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