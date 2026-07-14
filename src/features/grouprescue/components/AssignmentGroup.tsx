import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Anchor, Stethoscope, Users, ArrowLeft, CheckCircle2 } from "lucide-react";

import { useCandidateGroups } from "../hooks/useCandidateGroups";
import { useSupportRequestDetailGroup } from "../hooks/useSupportRequestDetailGroup";

import type { Role } from "../types/groupType";
import { useAssignmentGroupSupport } from "../hooks/useAssignmentGroupSupport";
import { RequestSupportButton } from "@/features/province_operator/components/RequestSupportButton";

const roleOptions: { value: Role; label: string }[] = [
  { value: "SUPPORT", label: "Đội hỗ trợ" },
];

const groupStatusStyle = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";
    case "BUSY":
      return "bg-orange-100 text-orange-700";
    case "UNAVAILABLE":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const groupStatusLabel = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng";
    case "BUSY":
      return "Đang bận";
    case "UNAVAILABLE":
      return "Không sẵn sàng";
    default:
      return status;
  }
};

export const AssignmentGroup = () => {
  const navigate = useNavigate();
  const { supportRequestId } = useParams<{ supportRequestId: string }>();

  const { detail, loading: loadingDetail, DetailSupportRequestrGroup } = useSupportRequestDetailGroup();
  const { candidate, loading: loadingGroups, CandidateGroupSupport } = useCandidateGroups();
  const { loading: assign, AssignSupportGroup } = useAssignmentGroupSupport();

  // item (loại hỗ trợ) đang được chọn để phân công
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("SUPPORT");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (supportRequestId) {
      DetailSupportRequestrGroup(supportRequestId);
    }
  }, [supportRequestId]);

  // khi chọn item -> load danh sách nhóm ứng viên cho item đó
  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedGroupId(null); // reset group đã chọn khi đổi item
    CandidateGroupSupport(itemId);
  };

  const handleSubmit = async () => {
    if (!selectedItemId || !selectedGroupId) return;
    const item = detail?.items.find(
  i => i.id === selectedItemId
);

if (!item) return;

if (
  item.status !== "PENDING" ||
  item.assignedGroupCount >= item.requiredGroupCount
) {
  alert("Loại hỗ trợ này đã được phân công đủ.");
  return;
}

    const success = await AssignSupportGroup({
      supportRequestItemId: selectedItemId,
      groupId: selectedGroupId,
      note: note.trim() || undefined,
    });

    if (success) {
      navigate(-1);
    }
  };
  useEffect(() => {
  console.log(detail);
}, [detail]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {supportRequestId && (
          <RequestSupportButton
            sosId={supportRequestId}
            onCreated={(requestId) => {
              console.log("Đã tạo đơn hỗ trợ:", requestId);
            }}
          />
        )}
      </div>

      <h1 className="text-xl font-bold mb-4">Phân công đội cứu hộ</h1>

      {/* Bước 1: chọn loại hỗ trợ cần phân công */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Chọn loại hỗ trợ cần phân công
        </p>

        {loadingDetail ? (
          <p className="text-sm text-gray-400">Đang tải chi tiết yêu cầu...</p>
        ) : !detail || detail.items.length === 0 ? (
          <p className="text-sm text-gray-400">Không có mục hỗ trợ nào</p>
        ) : (
          <div className="space-y-2">
            {detail.items.map((item) => {
              const isSelected = item.id === selectedItemId;
              const remaining = item.requiredGroupCount - item.assignedGroupCount;
              const disabled =
            remaining <= 0 || item.status !== "PENDING";
              return (
              <button
  key={item.id}
  type="button"
  disabled={disabled}
  onClick={() => handleSelectItem(item.id)}
  className={`w-full text-left border rounded-xl p-3 transition
    ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 bg-white hover:border-gray-300"
    }
    ${
      disabled
        ? "opacity-60 cursor-not-allowed bg-gray-100"
        : ""
    }
  `}
><div className="flex items-center gap-2">

<span
  className={`px-2 py-1 rounded text-xs font-medium
  ${
    item.status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : item.status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {item.status}
</span>

<span className="text-xs text-gray-500">
  Đã gán {item.assignedGroupCount}/{item.requiredGroupCount}
</span>

</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bước 2: chọn nhóm ứng viên (chỉ hiện khi đã chọn item) */}
      {selectedItemId && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Chọn đội (group)</p>

          {loadingGroups ? (
            <p className="text-sm text-gray-400">Đang tải danh sách đội...</p>
          ) : candidate.length === 0 ? (
            <p className="text-sm text-gray-400">Không có đội nào phù hợp</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {candidate.map((group) => {
                const isSelected = group.id === selectedGroupId;
                const isDisabled = group.status !== "AVAILABLE";

                return (
                  <button
                    key={group.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full text-left border rounded-xl p-3 transition-colors flex items-center justify-between gap-3
                      ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-semibold text-sm truncate">{group.groupName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${groupStatusStyle(
                            group.status
                          )}`}
                        >
                          {groupStatusLabel(group.status)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1 truncate">
                        Trưởng nhóm: {group.leaderName}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        {group.hasBoat && (
                          <span className="flex items-center gap-1 text-[11px] text-blue-600">
                            <Anchor className="w-3.5 h-3.5" />
                            Có xuồng
                          </span>
                        )}
                        {group.hasMedical && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                            <Stethoscope className="w-3.5 h-3.5" />
                            Có thuốc y tế
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Chọn role */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Vai trò</p>
        <div className="flex gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors
                ${role === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú (tuỳ chọn)</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="VD: Ưu tiên tiếp cận từ phía Nam, khu vực ngập sâu..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedGroupId || assign}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {assign ? "Đang phân công..." : "Xác nhận phân công"}
      </button>
    </div>
  );
};