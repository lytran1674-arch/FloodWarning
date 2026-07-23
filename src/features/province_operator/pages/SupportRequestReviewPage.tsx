// src/features/province_operator/pages/SupportRequestReviewPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

import SOSDetailCard from "@/features/sosrequest/components/ChiTietSOS";

import type {
  ApprovedItem,
  ApprovePayload,
  SupportRequestDetail,
} from "../types/provinceType";
import { CandidateTeamsPanel } from "../components/CandidateTeamsPanel";

import { provinceApi } from "../api/provinceApi";
import { getAvailableGroups, SUPPORT_TYPE_LABEL } from "../utils/supportType";
import { useCandidateTeams } from "../hooks/usecandidateTeams";
import { useSoS } from "@/features/rescue/hooks/useSoS";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
  TEAM_REJECTED: "bg-orange-100 text-orange-700",
};

const statusBadgeClass = (status: string) =>
  STATUS_BADGE[status] ?? "bg-gray-100 text-gray-600";

interface ReviewLocationState {
  sosId?: string;
  supportRequestId?: string;
  items?: SupportRequestDetail[];
  dispatcherUserId?: string | null;
  dispatcherUserName?: string | null;
}

export function SupportRequestReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Nguồn dữ liệu DUY NHẤT là location.state, vì backend chưa có
  // endpoint GET /support-request/:id để fetch lại khi thiếu state
  const { sosId, supportRequestId, items, dispatcherUserId, dispatcherUserName } =
    (location.state as ReviewLocationState | null) ?? {};

  const currentUser = useAppSelector((state) => state.auth.user);
  const isDispatcher = !dispatcherUserId || currentUser?.id === dispatcherUserId;

  const { detail, loading: loadingSOS, getDetailSoS } = useSoS();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedTeamsByItem, setSelectedTeamsByItem] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [note, setNote] = useState("");

  const { teamsByItem, loadingItemId, fetchCandidateTeams } = useCandidateTeams();

  // ✅ Guard: nếu thiếu dữ liệu (mở link trực tiếp / reload / navigate thiếu state)
  // -> báo rõ nguyên nhân và đưa về danh sách, KHÔNG cố fetch API chưa tồn tại
  useEffect(() => {
    if (!sosId || !supportRequestId || !items || items.length === 0) {
      toast.error(
        "Không có dữ liệu yêu cầu hỗ trợ. Vui lòng mở trang này từ danh sách yêu cầu, không dùng link trực tiếp."
      );
      navigate("/support-request");
    }
  }, [sosId, supportRequestId, items, navigate]);

  // ✅ Sửa: bỏ getDetailSoS khỏi dependency vì hook chưa bọc useCallback
  // -> nếu giữ trong deps, function đổi reference mỗi render -> gọi API lặp vô hạn
  useEffect(() => {
    if (sosId) getDetailSoS(sosId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosId]);

  const handleItemClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(itemId);
    if (!teamsByItem[itemId]) {
      fetchCandidateTeams(itemId);
    }
  };

  const handleToggleTeam = (itemId: string, teamId: string) => {
    setSelectedTeamsByItem((prev) => {
      const current = prev[itemId] ?? [];
      const item = items?.find((i) => i.id === itemId);
      const required = item?.requiredGroupCount ?? 1;

      if (current.includes(teamId)) {
        return { ...prev, [itemId]: current.filter((id) => id !== teamId) };
      }
      if (required === 1) {
        return { ...prev, [itemId]: [teamId] };
      }
      if (current.length >= required) {
        toast.warning(`Chỉ cần ${required} nhóm cho loại hỗ trợ này`);
        return prev;
      }
      return { ...prev, [itemId]: [...current, teamId] };
    });
  };

  const allocationByItem = useMemo(() => {
    return (items ?? []).map((item) => {
      const required = item.requiredGroupCount || 0;
      const selectedTeamIds = selectedTeamsByItem[item.id] || [];
      const teams = teamsByItem[item.id] || [];
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
  }, [items, selectedTeamsByItem, teamsByItem]);

  const totalSelectedGroups = useMemo(
    () => allocationByItem.reduce((sum, a) => sum + a.allocated, 0),
    [allocationByItem]
  );

  const totalRequiredGroups = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item.requiredGroupCount || 0), 0),
    [items]
  );

  const allSelected =
    allocationByItem.length > 0 && allocationByItem.every((a) => a.fulfilled);

  if (!sosId || !supportRequestId || !items || items.length === 0) {
    return null;
  }

  const handleApprove = async () => {
    if (!isDispatcher) {
      toast.error(`Chỉ ${dispatcherUserName ?? "Dispatcher"} mới được duyệt yêu cầu này`);
      return;
    }
    if (!allSelected) {
      toast.warning("Vui lòng chọn đủ số nhóm hỗ trợ cho từng loại");
      return;
    }

    const approvedItems: ApprovedItem[] = [];

    items.forEach((item) => {
      const selectedTeamIds = selectedTeamsByItem[item.id] || [];
      const teams = teamsByItem[item.id] || [];
      const teamMap = new Map(teams.map((t) => [t.id, t]));
      let remaining = item.requiredGroupCount || 0;

      for (const teamId of selectedTeamIds) {
        if (remaining <= 0) break;
        const team = teamMap.get(teamId);
        if (!team) continue;
        const available = getAvailableGroups(team, item.supportType);
        if (available <= 0) continue;

        const existed = approvedItems.some(
          (x) => x.supportRequestItemId === item.id && x.assignedTeamId === teamId
        );
        if (!existed) {
          approvedItems.push({
            supportRequestItemId: item.id,
            assignedTeamId: teamId,
            status: "APPROVED",
            ...(note.trim() ? { provinceResponse: note.trim() } : {}),
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

  const handleReject = async () => {
    if (!isDispatcher) {
      toast.error(`Chỉ ${dispatcherUserName ?? "Dispatcher"} mới được từ chối yêu cầu này`);
      return;
    }
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
        <div>
          <h2 className="mb-3 text-lg font-semibold">Chi tiết SOS</h2>
          <SOSDetailCard data={detail} loading={loadingSOS} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Các hạng mục hỗ trợ</h3>
            <div className="space-y-3">
              {items.map((item) => {
                const allocation = allocationByItem.find((a) => a.itemId === item.id);
                const isOpen = selectedItemId === item.id;

                return (
                  <div key={item.id} className="rounded-lg border bg-gray-50 transition-all">
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
                            Thiếu {(allocation?.required ?? 0) - (allocation?.allocated ?? 0)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${statusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="border-t p-3">
                        <CandidateTeamsPanel
                          teams={teamsByItem[item.id] || []}
                          loading={loadingItemId === item.id}
                          items={[item]}
                          sosLat={detail?.lat}
                          sosLon={detail?.lon}
                          selectedTeamIds={selectedTeamsByItem[item.id] || []}
                          onToggleTeam={(teamId) => handleToggleTeam(item.id, teamId)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Đã chọn <span className="font-semibold">{totalSelectedGroups}</span>/
              <span className="font-semibold">{totalRequiredGroups}</span> nhóm
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Xác nhận điều phối</h3>

            {!isDispatcher && (
              <p className="mb-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                Yêu cầu này đang được xử lý bởi{" "}
                <span className="font-semibold">{dispatcherUserName ?? "một Dispatcher khác"}</span>.
                Bạn chỉ có thể xem, không thể duyệt/từ chối.
              </p>
            )}

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

            {!showRejectBox ? (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={submitting || !allSelected || !isDispatcher}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white disabled:opacity-50"
                >
                  {submitting ? "Đang duyệt..." : "Xác nhận duyệt"}
                </button>
                <button
                  onClick={() => setShowRejectBox(true)}
                  disabled={submitting || !isDispatcher}
                  className="flex-1 rounded-lg border border-red-300 py-2 text-sm text-red-600 disabled:opacity-50"
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