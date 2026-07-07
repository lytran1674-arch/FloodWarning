// src/features/province_operator/pages/ListMyRequestSupport.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestSupport } from "../hooks/useRequestSupport";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useGroup } from "@/features/rescue/hooks/useGroup";
import type { RequestSupportMyTeam } from "../types/provinceType";
import type { Group } from "@/features/grouprescue/types/groupType";



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
// Thay cho SUPPORT_TYPE_FLAG + g[flag as keyof Group]
const matchesSupportType = (g: Group, supportType: string): boolean => {
  switch (supportType) {
    case "BOAT":
      return g.hasBoat;
    case "MEDICAL":
      return g.hasMedical;
    case "SEARCH_RESCUE":
      return g.hasSearchRescue;
    case "LOGISTICS":
      return g.hasLogistics;
    default:
      return false;
  }
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
const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
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
  requestId: string;
  items: {
    itemId: string;
    supportType: string;
    remainingSlots: number;
  }[];
} | null>(null);

// Chọn nhóm theo từng itemId: { [itemId]: groupId[] }
const [selectedGroupsByItem, setSelectedGroupsByItem] = useState<Record<string, string[]>>({});


// STATE CHO MODAL TỪ CHỐI
const [reason,setReason]=useState("")
const {teamleaderReject}=useRequestSupport()
const [rejectTarget, setRejectTarget] = useState<string | null>(null); // request.id
const [rejecting, setRejecting] = useState(false);
const [rejectError, setRejectError] = useState<string | null>(null);
  
  // Đổi từ groupId (string) -> selectedGroupIds (string[])
  // vì cần chọn NHIỀU nhóm cùng lúc, đủ với số lượng còn thiếu
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

const openAssignModal = (request: RequestSupportMyTeam) => {
  const items = request.items
    .filter((item) => (item.assignedGroupCount ?? 0) < item.requiredGroupCount)
    .map((item) => ({
      itemId: item.id,
      supportType: item.supportType,
      remainingSlots:
        item.requiredGroupCount - (item.assignedGroupCount ?? 0),
    }));

  if (items.length === 0) return;

  setAssignTarget({ requestId: request.id, items });
  setSelectedGroupsByItem({});
  setNote("");
  setAssignError(null);
};

const closeAssignModal = () => {
  setAssignTarget(null);
  setSelectedGroupsByItem({});
  setAssignError(null);
};

  const openRejectModal=(requestId:string)=>{
    setRejectTarget(requestId);
    setReason("");
    setRejectError(null)
  }

  const closeRejectModal=()=>{
    setRejectTarget(null);
    setReason("");
    setRejectError(null);
    
  }

  const handleSubmitReject=async()=>{
    if(!rejectTarget) return;
    if(!reason.trim()){
      setRejectError("Vui lòng nhập lý do từ chối ")
      return;
    }
    try{
      setRejecting(true);
      setRejectError(null)
      const success=await teamleaderReject(rejectTarget,reason.trim());

      if(!success){
        setRejectError("Từ chối thất bại, vui lòng thử lại")
        return
      }
      await getListRequestSupportMyTeam();
      closeRejectModal();
    }finally{
      setRejecting(false)
    }
  }
  // Toggle chọn/bỏ chọn 1 nhóm, không cho vượt quá remainingSlots
 const toggleGroupSelect = (itemId: string, groupId: string) => {
  if (!assignTarget) return;

  const target = assignTarget.items.find((i) => i.itemId === itemId);
  if (!target) return;

  setAssignError(null);

  setSelectedGroupsByItem((prev) => {
    const current = prev[itemId] ?? [];
    const isSelected = current.includes(groupId);

    if (isSelected) {
      return { ...prev, [itemId]: current.filter((id) => id !== groupId) };
    }

    if (current.length >= target.remainingSlots) {
      setAssignError(
        `Chỉ được chọn tối đa ${target.remainingSlots} nhóm cho ${
          SUPPORT_TYPE_LABEL[target.supportType]
        }`
      );
      return prev;
    }

    return { ...prev, [itemId]: [...current, groupId] };
  });
};

 const handleSubmitAssign = async () => {
  if (!assignTarget) return;

  // Validate: mỗi item phải chọn đủ số nhóm còn thiếu
  const isIncomplete = assignTarget.items.some(
    (item) =>
      (selectedGroupsByItem[item.itemId]?.length ?? 0) !== item.remainingSlots
  );

  if (isIncomplete) {
    setAssignError("Vui lòng chọn đủ số nhóm cho tất cả loại hỗ trợ");
    return;
  }

  try {
    setAssigning(true);
    setAssignError(null);

    // Gộp tất cả cặp (itemId, groupId) thành 1 lần phân công duy nhất
    const pairs = assignTarget.items.flatMap((item) =>
      (selectedGroupsByItem[item.itemId] ?? []).map((groupId) => ({
        itemId: item.itemId,
        groupId,
      }))
    );

    const results = await Promise.all(
      pairs.map(({ itemId, groupId }) =>
        assignGroupToRequest(itemId, groupId, note.trim())
      )
    );

    if (results.some((success) => !success)) {
      setAssignError("Một số nhóm phân công thất bại, vui lòng kiểm tra lại");
      return;
    }

    await getListRequestSupportMyTeam();
    closeAssignModal();
    setAssignSuccess("Phân công hỗ trợ thành công")
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
    <div key={item.id} className="rounded-lg border bg-gray-50 p-3">
      <p className="font-semibold">{SUPPORT_TYPE_LABEL[item.supportType]}</p>
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
  ))}
</div>

              {/* ACTION */}
             {/* ACTION */}
<div className="mt-4 flex justify-end gap-2">
  {request.status === "APPROVED" && (
    <button
      onClick={() => openRejectModal(request.id)}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      Từ chối
    </button>
  )}

  {request.status === "APPROVED" &&
    request.items.some(
      (item) => (item.assignedGroupCount ?? 0) < item.requiredGroupCount
    ) && (
      <button
        onClick={() => openAssignModal(request)}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
      >
        Phân công
      </button>
    )}

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
     {/* ================= MODAL PHÂN CÔNG ================= */}
{assignTarget &&  (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="mb-1 text-lg font-bold">Phân công nhóm hỗ trợ</h2>
      <p className="mb-4 text-sm text-gray-500">
        Chọn đủ nhóm cho từng loại hỗ trợ đang yêu cầu
      </p>

      {(() => {
        // Danh sách groupId đã được chọn ở BẤT KỲ loại nào khác,
        // để không cho 1 nhóm bị gán trùng cho 2 loại hỗ trợ khác nhau
        const allSelectedGroupIds = new Set(
          Object.values(selectedGroupsByItem).flat()
        );

        return assignTarget.items.map((target) => {
         const matchingGroups = groups.filter((g) =>
  matchesSupportType(g, target.supportType)
);
          const selected = selectedGroupsByItem[target.itemId] ?? [];

          return (
            <div key={target.itemId} className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {SUPPORT_TYPE_LABEL[target.supportType]} — chọn{" "}
                {selected.length}/{target.remainingSlots} nhóm
              </label>

              {loadingGroups && (
                <p className="mb-2 text-sm text-gray-500">Đang tải nhóm...</p>
              )}

              {!loadingGroups && matchingGroups.length === 0 && (
                <p className="mb-2 text-sm text-gray-500">
                  Không có nhóm phù hợp cho loại này
                </p>
              )}

              <div className="mb-1 max-h-40 space-y-1 overflow-y-auto rounded-lg border p-2">
                {matchingGroups.map((g) => {
                  const isChecked = selected.includes(g.id);
                  const usedElsewhere =
                    allSelectedGroupIds.has(g.id) && !isChecked;
                  const isFull =
                    !isChecked && selected.length >= target.remainingSlots;
                  const isDisabled = usedElsewhere || isFull;

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
                        onChange={() =>
                          toggleGroupSelect(target.itemId, g.id)
                        }
                        className="h-4 w-4 accent-emerald-600"
                      />
                      {g.name}
                      {usedElsewhere && (
                        <span className="ml-1 text-xs text-orange-500">
                          (đã dùng cho loại khác)
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        });
      })()}

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
          disabled={assigning}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {assigning ? "Đang phân công..." : "Xác nhận"}
        </button>
      </div>
    </div>
  </div>
)}
{/* ================= MODAL TỪ CHỐI ================= */}
{rejectTarget && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
      <h2 className="mb-1 text-lg font-bold">Từ chối yêu cầu hỗ trợ</h2>
      <p className="mb-4 text-sm text-gray-500">
        Vui lòng nhập lý do từ chối yêu cầu chi viện này.
      </p>

      <label className="mb-1 block text-sm font-medium text-gray-700">
        Lý do từ chối
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ví dụ: Đội đã hết nhân lực, không đủ nhóm chi viện"
        rows={3}
        className="mb-3 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {rejectError && (
        <p className="mb-3 text-sm text-red-600">{rejectError}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={closeRejectModal}
          disabled={rejecting}
          className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmitReject}
          disabled={rejecting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
        >
          {rejecting ? "Đang từ chối..." : "Xác nhận từ chối"}
        </button>
      </div>
    </div>
  </div>
)}
    
    </div>
  );
}