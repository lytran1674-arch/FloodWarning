import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSoS } from "../../sosrequest/hooks/useSoS";
import { useAssignCandidates } from "../hooks/useAssignCandidates";
import { RequestSupportButton } from "@/features/province_operator/components/RequestSupportButton";

import {
  Users,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type RoleGroup = "PRIMARY" | "SUPPORT";

const roleOptions: { value: RoleGroup; label: string }[] = [
  { value: "PRIMARY", label: "Đội chính" },
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

export const SOSASSGINPAGE = () => {
  const { sosId } = useParams<{ sosId: string }>();
  const navigate = useNavigate();

  // Đã sửa: gọi đúng endpoint mới theo sosId, BE tự lọc team + AVAILABLE,
  // không tự fetch toàn bộ group của team rồi lọc client-side như trước.
  const { groups, loading: loadingGroups, error: candidatesError, getAssignCandidates } =
    useAssignCandidates();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [role, setRole] = useState<RoleGroup>("PRIMARY");
  const [note, setNote] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { assignment, submit, getDetailSoS } = useSoS();

  useEffect(() => {
    if (sosId) {
      getDetailSoS(sosId);
      getAssignCandidates(sosId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosId]);

const handleSubmit = async () => {
  if (!sosId || !selectedGroupId) return
  setSubmitError("")

  const res = await assignment({
    sosId,
    groupId: selectedGroupId,
    role,
    note: note.trim() || undefined,
  })

  if (res) {
    if (res.callTask) {
      // ✅ Mở màn gọi Group Leader
      navigate("/call-workflow", {
  state: {
    initialCallTask:  res.callTask,
    supportRequestId: res.assignmentId,
    flowType:         "ASSIGN_GROUP",  // ✅ thêm
    sosId:            sosId,           // ✅ thêm — để navigate về đúng SOS
  }
})
    } else {
      toast.success("Phân công thành công!")
      navigate("/team-sos")
    }
  } else {
    setSubmitError(
      "Không thể phân công. Có thể quyền điều phối SOS này đã thay đổi — vui lòng quay lại danh sách và thử lại."
    )
  }
}

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {sosId && (
          <RequestSupportButton
            sosId={sosId}
            onCreated={() => {
              // Sau khi xin hỗ trợ, quyền điều phối SOS này chuyển sang Province Operator.
              // Team Leader không còn quyền phân công SOS này nữa -> quay lại danh sách ngay,
              // không để họ đứng lại màn phân công (mọi thao tác assign tiếp theo sẽ bị BE
              // trả NO_PERMISSION).
              toast.success(
                "Đã gửi yêu cầu hỗ trợ. SOS này đã được chuyển cho Điều phối viên tỉnh xử lý."
              );
              navigate(-1);
            }}
          />
        )}
      </div>

      <h1 className="text-xl font-bold mb-4">Phân công đội cứu hộ</h1>

      {/* Chọn group */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Chọn đội (group)
        </p>

        {loadingGroups ? (
          <p className="text-sm text-gray-400">Đang tải danh sách đội...</p>
        ) : candidatesError ? (
          <p className="text-sm text-red-600">{candidatesError}</p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-gray-400">
            Không có đội nào phù hợp / sẵn sàng cho SOS này
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {groups.map((group) => {
              const isSelected = group.id === selectedGroupId;
              const isDisabled = group.status !== "AVAILABLE";

              return (
                <button
                  key={group.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full text-left border rounded-xl p-3 transition-colors flex items-center justify-between gap-3
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-semibold text-sm truncate">
                        {group.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${groupStatusStyle(
                          group.status
                        )}`}
                      >
                        {groupStatusLabel(group.status)}
                      </span>
  {/* ✅ Tag gọi thất bại */}
  {group.callFailed && (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600 shrink-0">
      Gọi thất bại
    </span>
  )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Trưởng nhóm: {group.leaderName} · {group.memberCount} thành viên
                    </p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

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
                ${
                  role === opt.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Ghi chú (tuỳ chọn)
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="VD: Ưu tiên tiếp cận từ phía Nam, khu vực ngập sâu..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {submitError && (
        <p className="text-sm text-red-600 mb-3">{submitError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedGroupId || submit}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {submit ? "Đang phân công..." : "Xác nhận phân công"}
      </button>
    </div>
  );
};