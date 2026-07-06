// src/features/province_operator/pages/ListMyRequestSupport.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestSupport } from "../hooks/useRequestSupport";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useGroup } from "@/features/rescue/hooks/useGroup";
import type { RequestSupportMyTeamItems } from "../types/provinceType";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

const SUPPORT_TYPE_LABEL: Record<string, string> = {
  BOAT: "Xuồng cứu hộ",
  MEDICAL: "Y tế",
  SEARCH_RESCUE: "Tìm kiếm cứu nạn",
  LOGISTICS: "Hậu cần",
};

export default function ListMyRequestSupport() {
  const {
    requestsupport,
    loading,
    error,
    getListRequestSupportMyTeam,
    assignGroupToRequest,
  } = useRequestSupport();

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isLeaderTeam = user?.isTeamLeader === true;

  const {
    groups,
    loading: loadingGroups,
    error: groupError,
  } = useGroup(user?.teamId);

  // ======================================================
  // STATE CHO MODAL PHÂN CÔNG
  // assignTarget lưu itemId + số nhóm còn thiếu cần chọn đủ
  // ======================================================
  const [assignTarget, setAssignTarget] = useState<{
    itemId: string;
    supportType: string;
    remainingSlots: number;
  } | null>(null);


  //STATE CHO MODAL TỪ CHỐI 
  const [reason,setReason]=useState("");
  
  // Đổi từ groupId (string) -> selectedGroupIds (string[])
  // vì cần chọn NHIỀU nhóm cùng lúc, đủ với số lượng còn thiếu
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    getListRequestSupportMyTeam();
  }, []);

  // ======================================================
  // HANDLERS
  // ======================================================

  const openAssignModal = (item: RequestSupportMyTeamItems) => {
    const remainingSlots =
      item.requiredGroupCount - (item.assignedGroupCount ?? 0);

    setAssignTarget({
      itemId: item.id,
      supportType: item.supportType,
      remainingSlots,
    });
    setSelectedGroupIds([]);
    setNote("");
    setAssignError(null);
  };

  const closeAssignModal = () => {
    setAssignTarget(null);
    setSelectedGroupIds([]);
    setAssignError(null);
  };

  // Toggle chọn/bỏ chọn 1 nhóm, không cho vượt quá remainingSlots
  const toggleGroupSelect = (groupId: string) => {
    if (!assignTarget) return;

    setAssignError(null);

    setSelectedGroupIds((prev) => {
      const isSelected = prev.includes(groupId);

      if (isSelected) {
        // bỏ chọn -> luôn cho phép
        return prev.filter((id) => id !== groupId);
      }

      // đang chọn thêm -> kiểm tra giới hạn
      if (prev.length >= assignTarget.remainingSlots) {
        setAssignError(
          `Chỉ được chọn tối đa ${assignTarget.remainingSlots} nhóm`
        );
        return prev;
      }

      return [...prev, groupId];
    });
  };

  const handleSubmitAssign = async () => {
    if (!assignTarget) return;

    // Yêu cầu chọn ĐỦ số nhóm còn thiếu, không cho gán thiếu/thừa
    if (selectedGroupIds.length !== assignTarget.remainingSlots) {
      setAssignError(
        `Vui lòng chọn đủ ${assignTarget.remainingSlots} nhóm cứu hộ`
      );
      return;
    }

    try {
      setAssigning(true);
      setAssignError(null);

      // Gọi tuần tự cho từng nhóm đã chọn.
      // Nếu backend có endpoint nhận mảng groupIds trong 1 lần gọi,
      // nên đổi lại gọi 1 lần duy nhất thay vì loop để tránh
      // trường hợp gán được 1 phần rồi lỗi giữa chừng.
      for (const groupId of selectedGroupIds) {
        const success = await assignGroupToRequest(
          assignTarget.itemId,
          groupId,
          note.trim()
        );

        if (!success) {
          setAssignError("Phân công thất bại, vui lòng thử lại");
          setAssigning(false);
          return;
        }
      }

      await getListRequestSupportMyTeam();
      closeAssignModal();
    } finally {
      setAssigning(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================
  if (!isLeaderTeam) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Bạn không có quyền truy cập trang này.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Danh sách yêu cầu hỗ trợ</h1>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Đang tải...</p>}

      {/* ERROR */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && requestsupport.length === 0 && (
        <p className="text-sm text-gray-500">Không có yêu cầu hỗ trợ</p>
      )}

      {/* LIST */}
      {!loading && requestsupport.length > 0 && (
        <div className="space-y-4">
          {requestsupport.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {/* HEADER — thông tin cấp phiếu SOS cha */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mt-1 text-sm text-gray-500">
                    SOS ID: <span className="font-mono">{request.sosId}</span>
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Người yêu cầu: {request.requestByName}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    📅 {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* STATUS — status chỉ có ở cấp cha */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_COLOR[request.status]
                  }`}
                >
                  {request.status}
                </span>
              </div>

              {/* REASON */}
              {request.reason && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  <span className="font-medium">Lý do:</span> {request.reason}
                </div>
              )}

              {/* ITEMS — từng loại hỗ trợ (BOAT, MEDICAL,...) cần gán riêng */}
              <div className="mt-3 space-y-2">
                {request.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-gray-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {SUPPORT_TYPE_LABEL[item.supportType]}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Cần {item.requiredGroupCount} nhóm
                          {item.assignedGroupCount != null &&
                            ` • Đã gán ${item.assignedGroupCount} nhóm`}
                        </p>
                        {item.assignedTeamName && (
                          <p className="mt-1 text-xs text-gray-500">
                            Đội được gán: {item.assignedTeamName}
                          </p>
                        )}
                        {item.provinceNote && (
                          <p className="mt-1 text-xs text-blue-700">
                            Ghi chú tỉnh: {item.provinceNote}
                          </p>
                        )}
                      </div>

                      {/* Chỉ cho phân công khi phiếu đã APPROVED và
                          SỐ NHÓM ĐÃ GÁN (assignedGroupCount) còn nhỏ hơn
                          số nhóm cần (requiredGroupCount). */}
                     {request.status === "APPROVED" &&
  (item.assignedGroupCount ?? 0) < item.requiredGroupCount && (
    <button
      onClick={() => openAssignModal(item)}
      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700"
    >
      Phân công
    </button>
  )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/support-request/${request.id}`)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL PHÂN CÔNG ================= */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h2 className="mb-1 text-lg font-bold">Phân công nhóm hỗ trợ</h2>
            <p className="mb-4 text-sm text-gray-500">
              {SUPPORT_TYPE_LABEL[assignTarget.supportType]} — cần chọn đủ{" "}
              <span className="font-semibold text-emerald-700">
                {assignTarget.remainingSlots}
              </span>{" "}
              nhóm
            </p>

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Chọn nhóm cứu hộ ({selectedGroupIds.length}/
              {assignTarget.remainingSlots})
            </label>

            {loadingGroups && (
              <p className="mb-3 text-sm text-gray-500">Đang tải nhóm...</p>
            )}

            {!loadingGroups && groups.length === 0 && (
              <p className="mb-3 text-sm text-gray-500">
                Không có nhóm nào khả dụng
              </p>
            )}

            <div className="mb-3 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
              {groups.map((g) => {
                const isChecked = selectedGroupIds.includes(g.id);
                const isDisabled =
                  !isChecked &&
                  selectedGroupIds.length >= assignTarget.remainingSlots;

                return (
                  <label
                    key={g.id}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                      isDisabled
                        ? "cursor-not-allowed text-gray-400"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => toggleGroupSelect(g.id)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    {g.name}
                  </label>
                );
              })}
            </div>

            {groupError && (
              <p className="mb-3 text-sm text-red-600">{groupError}</p>
            )}

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Chi viện bằng xuồng cứu hộ"
              rows={3}
              className="mb-3 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {assignError && (
              <p className="mb-3 text-sm text-red-600">{assignError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={closeAssignModal}
                disabled={assigning}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitAssign}
                disabled={
                  assigning ||
                  selectedGroupIds.length !== assignTarget.remainingSlots
                }
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {assigning ? "Đang phân công..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}