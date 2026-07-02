// src/features/province_operator/pages/SupportRequestReviewPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import SOSDetailCard from "@/features/sosrequest/components/ChiTietSOS";
import { useSoS } from "@/features/sosrequest/hooks/useSoS";
import type { SupportRequestDetail } from "../types/provinceType";
import { CandidateTeamsPanel } from "../components/CandidateTeamsPanel";
import { provinceApi } from "../api/provinceApi";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  TEAM_REJECTED: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
};

const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT: "Xuồng cứu hộ",
  MEDICAL: "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS: "Hậu cần",
};

interface ReviewLocationState {
  sosId?: string;
  supportRequestId?: string;
  items?: SupportRequestDetail[];
}

export function SupportRequestReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sosId, supportRequestId, items } =
    (location.state as ReviewLocationState | null) ?? {};

  const { detailSOS, loading: loadingSOS, getDetailSoS } = useSoS();

  // mỗi item có thể chọn NHIỀU đội, tuỳ theo requiredGroupCount
  const [selectedTeamsByItem, setSelectedTeamsByItem] = useState<
    Record<string, string[]>
  >({});
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);

  useEffect(() => {
    if (!sosId || !supportRequestId || !items || items.length === 0) {
      toast.error("Không có dữ liệu yêu cầu hỗ trợ, vui lòng quay lại danh sách");
      navigate("/request-support");
    }
  }, [sosId, supportRequestId, items, navigate]);

  useEffect(() => {
    if (sosId) getDetailSoS(sosId);
  }, [sosId]);

  if (!sosId || !supportRequestId || !items || items.length === 0) return null;

  // toggle chọn/bỏ chọn 1 đội cho 1 loại hỗ trợ, giới hạn theo maxCount
  const handleToggleTeam = (itemId: string, teamId: string, maxCount: number) => {
    setSelectedTeamsByItem((prev) => {
      const current = prev[itemId] || [];
      if (current.includes(teamId)) {
        return { ...prev, [itemId]: current.filter((id) => id !== teamId) };
      }
      if (current.length >= maxCount) {
        toast.warning(`Chỉ được chọn tối đa ${maxCount} đội cho loại này`);
        return prev;
      }
      return { ...prev, [itemId]: [...current, teamId] };
    });
  };

  // đã chọn ĐỦ số lượng đội yêu cầu cho tất cả các loại chưa
  const allSelected = items.every(
    (item) =>
      (selectedTeamsByItem[item.id]?.length || 0) === (item.requiredGroupCount || 1)
  );

  const handleApprove = async () => {
    if (!allSelected) {
      toast.warning("Vui lòng chọn đủ số đội yêu cầu cho tất cả các loại hỗ trợ");
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all(
        items.map((item) =>
          provinceApi.approveSupportRequest(item.id, {
           assignedTeamId: [selectedTeamId],,
            provinceResponse: note.trim() || "Đồng ý chi viện",
          })
        )
      );
      toast.success("Đã duyệt yêu cầu hỗ trợ");
      navigate("/support-request");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Duyệt đơn thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all(
        items.map((item) =>
          provinceApi.rejectSupportRequest(item.id, {
            provinceResponse: rejectReason,
          })
        )
      );
      toast.success("Đã từ chối yêu cầu hỗ trợ");
      navigate("/support-request");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Từ chối đơn thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Chi tiết SOS</h2>
          <SOSDetailCard data={detailSOS} loading={loadingSOS} />
        </div>

        <div className="space-y-6">
          {/* TÓM TẮT TẤT CẢ LOẠI HỖ TRỢ CẦN DUYỆT */}
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div>
                  <h2 className="text-sm font-semibold">
                    {SUPPORT_TYPE_LABEL[item.supportType] ?? item.supportType}
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Cần {item.requiredGroupCount} nhóm
                    {item.assignedGroupCount != null &&
                      ` — đã gán ${item.assignedGroupCount}`}
                  </p>
                  {item.status === "TEAM_REJECTED" && item.teamResponse && (
                    <p className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1 mt-1">
                      Team từ chối: {item.teamResponse}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-[11px] px-2 py-1 rounded-full font-medium ${STATUS_BADGE[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* 1 MAP + DANH SÁCH ĐỘI CHUNG CHO TẤT CẢ LOẠI */}
          <CandidateTeamsPanel
            requestId={supportRequestId}
            items={items}
            sosLat={detailSOS?.lat}
            sosLon={detailSOS?.lon}
            selectedTeamsByItem={selectedTeamsByItem}
            onToggleTeam={handleToggleTeam}
          />

          {/* 1 CẶP NÚT DUYỆT / TỪ CHỐI DUY NHẤT */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Chi viện nhân lực"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {!showRejectBox ? (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={submitting || !allSelected}
                  className="flex-1 bg-blue-600 text-white text-sm rounded-lg py-2 disabled:opacity-50"
                >
                  {submitting ? "Đang duyệt..." : "Xác nhận duyệt"}
                </button>
                <button
                  onClick={() => setShowRejectBox(true)}
                  disabled={submitting}
                  className="flex-1 border border-red-300 text-red-600 text-sm rounded-lg py-2"
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
                  rows={2}
                  placeholder="Ví dụ: Hiện chưa đủ phương tiện chi viện"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRejectBox(false)}
                    disabled={submitting}
                    className="flex-1 border text-sm rounded-lg py-2"
                  >
                    Huỷ
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={submitting}
                    className="flex-1 bg-red-600 text-white text-sm rounded-lg py-2 disabled:opacity-50"
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