// src/features/province_operator/pages/SupportRequestReviewPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

import SOSDetailCard from "@/features/sosrequest/components/ChiTietSOS";
import { useSoS } from "@/features/sosrequest/hooks/useSoS";

import type {
  ApprovedItem,
  ApprovePayload,
  SupportRequestDetail,
  CandidateTeam,
} from "../types/provinceType";
import { CandidateTeamsPanel } from "../components/CandidateTeamsPanel";

import { provinceApi } from "../api/provinceApi";
import { getAvailableGroups, SUPPORT_TYPE_LABEL } from "../utils/supportType";
import { useCandidateTeams } from "../hooks/usecandidateTeams";

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
  // STATE
  // ======================================================

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [candidateTeamsByItem, setCandidateTeamsByItem] = useState<
    Record<string, CandidateTeam[]>
  >({});
  const [selectedTeamsByItem, setSelectedTeamsByItem] = useState<
    Record<string, string[]>
  >({});

  // ======================================================
  // FETCH TEAMS FOR SELECTED ITEM
  // ======================================================

  const { teams: currentItemTeams, loading: loadingTeams } = useCandidateTeams(
    selectedItemId || undefined
  );

  // Lưu teams khi có dữ liệu
  useEffect(() => {
    if (selectedItemId && currentItemTeams.length > 0) {
      setCandidateTeamsByItem((prev) => ({
        ...prev,
        [selectedItemId]: currentItemTeams,
      }));
    }
    // Log để debug
    console.log("📌 selectedItemId:", selectedItemId);
    console.log("📦 currentItemTeams:", currentItemTeams);
  }, [selectedItemId, currentItemTeams]);

  // ======================================================
  // VALIDATE & LOAD SOS
  // ======================================================

  useEffect(() => {
    if (!sosId || !supportRequestId || !items || items.length === 0) {
      toast.error("Không có dữ liệu yêu cầu hỗ trợ");
      navigate("/support-request");
    }
  }, [sosId, supportRequestId, items, navigate]);

  useEffect(() => {
    if (sosId) getDetailSoS(sosId);
  }, [sosId, getDetailSoS]);

  // ======================================================
  // HANDLERS
  // ======================================================

  const handleItemClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(itemId);
  };

  const handleToggleTeam = (itemId: string, teamId: string) => {
    setSelectedTeamsByItem((prev) => {
      const current = prev[itemId] || [];
      const updated = current.includes(teamId)
        ? current.filter((id) => id !== teamId)
        : [...current, teamId];
      return { ...prev, [itemId]: updated };
    });
  };

  // ======================================================
  // CALCULATIONS
  // ======================================================

  const allocationByItem = useMemo(() => {
    return (items ?? []).map((item) => {
      const required = item.requiredGroupCount || 0;
      const selectedTeamIds = selectedTeamsByItem[item.id] || [];
      const teams = candidateTeamsByItem[item.id] || [];
      const selectedTeams = teams.filter((t) => selectedTeamIds.includes(t.id));

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
  }, [items, selectedTeamsByItem, candidateTeamsByItem]);

  const totalSelectedGroups = useMemo(
    () => allocationByItem.reduce((sum, a) => sum + a.allocated, 0),
    [allocationByItem]
  );

  const totalRequiredGroups = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item.requiredGroupCount || 0), 0),
    [items]
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
  // APPROVE & REJECT
  // ======================================================

  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!allSelected) {
      toast.warning("Vui lòng chọn đủ số nhóm hỗ trợ cho từng loại");
      return;
    }

    const approvedItems: ApprovedItem[] = [];

    items.forEach((item) => {
      const selectedTeamIds = selectedTeamsByItem[item.id] || [];
      const teams = candidateTeamsByItem[item.id] || [];
      const teamMap = new Map(teams.map((t) => [t.id, t]));

      let remaining = item.requiredGroupCount || 0;

      for (const teamId of selectedTeamIds) {
        if (remaining <= 0) break;

        const team = teamMap.get(teamId);
        if (!team) continue;

        const available = getAvailableGroups(team, item.supportType);
        if (available <= 0) continue;

        const existed = approvedItems.some(
          (x) =>
            x.supportRequestItemId === item.id &&
            x.assignedTeamId === teamId
        );
        if (!existed) {
          approvedItems.push({
            supportRequestItemId: item.id,
            assignedTeamId: teamId,
            status: "APPROVED",
          });
        }

        remaining -= Math.min(available, remaining);
      }
    });

    if (approvedItems.length === 0) {
      toast.error("Chưa phân bổ được đội nào");
      return;
    }

    const payload: ApprovePayload = { items: approvedItems };

    setSubmitting(true);
    try {
      await provinceApi.approveSupportRequest(supportRequestId, payload);
      toast.success("Đã duyệt yêu cầu hỗ trợ");
      navigate("/support-request");
    } catch (err: any) {
      console.error("APPROVE ERROR:", err);
      toast.error(err?.response?.data?.message || "Duyệt thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }

    setSubmitting(true);
    try {
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
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: SOS Detail */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Chi tiết SOS</h2>
          <SOSDetailCard data={detailSOS} loading={loadingSOS} />
        </div>

        {/* RIGHT: Items + Action */}
        <div className="space-y-6">
          {/* Các hạng mục hỗ trợ */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Các hạng mục hỗ trợ</h3>
            <div className="space-y-3">
              {items.map((item) => {
                const allocation = allocationByItem.find(
                  (a) => a.itemId === item.id
                );
                const isOpen = selectedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-gray-50 transition-all"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between p-3"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="font-medium text-sm">
                          {SUPPORT_TYPE_LABEL[item.supportType]}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({allocation?.allocated ?? 0}/{item.requiredGroupCount} nhóm)
                        </span>
                        {allocation?.fulfilled ? (
                          <span className="ml-2 text-xs text-green-600">✓ Đã đủ</span>
                        ) : (
                          <span className="ml-2 text-xs text-orange-600">
                            Thiếu { (allocation?.required ?? 0) - (allocation?.allocated ?? 0) }
                          </span>
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

                    {isOpen && (
                      <div className="border-t p-3">
                        <CandidateTeamsPanel
                          teams={candidateTeamsByItem[item.id] || []}
                          loading={loadingTeams && selectedItemId === item.id}
                          items={[item]}
                          sosLat={detailSOS?.lat}
                          sosLon={detailSOS?.lon}
                          selectedTeamIds={selectedTeamsByItem[item.id] || []}
                          onToggleTeam={(teamId) =>
                            handleToggleTeam(item.id, teamId)
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Đã chọn{" "}
              <span className="font-semibold">{totalSelectedGroups}</span>/
              <span className="font-semibold">{totalRequiredGroups}</span> nhóm
            </div>
          </div>

          {/* Action */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Xác nhận điều phối</h3>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Điều động đội gần khu vực nhất"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

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