import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { rescueApi } from "../api/rescureApi";
import type { ResCue, ResGroup } from "../types/rescueType";

type Step = "create" | "members" | "leader";

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("create");

  // team info
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  // step 1 - create group
  const [groupName, setGroupName] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [hasBoat, setHasBoat] = useState(false);
  const [hasMedical, setHasMedical] = useState(false);
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // result after create
  const [createdGroup, setCreatedGroup] = useState<ResGroup | null>(null);

  // step 2 - add members
  const [availableMembers, setAvailableMembers] = useState<ResCue[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false);

  // step 3 - pick leader
  const [leaderId, setLeaderId] = useState("");
  const [pickingLeader, setPickingLeader] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTeamId(user.teamId || "");
    setTeamName(user.teamName || "Chưa có tên đội");
  }, []);

  // ── Step 1: Tạo nhóm ──────────────────────────────────────────────
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Vui lòng nhập tên nhóm");
      return;
    }
    try {
      setCreating(true);
      const group = await rescueApi.CreateGroup(teamId, {
        name: groupName,
        status,
        hasBoat,
        hasMedical,
        notes,
      });
      setCreatedGroup(group);
      toast.success("Tạo nhóm thành công");

      // load available members right after group is created
      setLoadingMembers(true);
      const members = await rescueApi.getTeamMembersWithoutGroup(teamId);
      setAvailableMembers(members);
      setStep("members");
    } catch {
      toast.error("Có lỗi khi tạo nhóm");
    } finally {
      setCreating(false);
      setLoadingMembers(false);
    }
  };

  // ── Step 2: Thêm thành viên ───────────────────────────────────────
  const toggleMember = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (!createdGroup) return;
    if (selectedUserIds.length === 0) {
      toast.error("Chọn ít nhất 1 thành viên");
      return;
    }
    try {
      setAddingMembers(true);
      await rescueApi.addMemberToGroup(createdGroup.id, {
        userIds: selectedUserIds,
      });
      toast.success("Thêm thành viên thành công");
      setStep("leader");
    } catch {
      toast.error("Có lỗi khi thêm thành viên");
    } finally {
      setAddingMembers(false);
    }
  };

  // ── Step 3: Chọn leader ───────────────────────────────────────────
  const handlePickLeader = async () => {
    if (!createdGroup) return;
    if (!leaderId) {
      toast.error("Chọn leader cho nhóm");
      return;
    }
    try {
      setPickingLeader(true);
      await rescueApi.pickLeaderGroup(createdGroup.id, { userId: leaderId });
      toast.success("Chọn leader thành công");
      navigate(`/res-teams/${teamId}/groups`);
    } catch {
      toast.error("Có lỗi khi chọn leader");
    } finally {
      setPickingLeader(false);
    }
  };

  // ── Step indicator ────────────────────────────────────────────────
  const steps: { key: Step; label: string }[] = [
    { key: "create", label: "Tạo nhóm" },
    { key: "members", label: "Thêm thành viên" },
    { key: "leader", label: "Chọn leader" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            ← Quay lại
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Tạo nhóm cứu hộ
          </h1>
          <p className="text-sm text-slate-500">{teamName}</p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-0">
          {steps.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    className={`mt-1 whitespace-nowrap text-xs ${
                      active ? "font-semibold text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mb-4 h-0.5 flex-1 transition-colors ${
                      done ? "bg-green-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Tạo nhóm ── */}
        {step === "create" && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">
              Thông tin nhóm
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Tên nhóm <span className="text-red-500">*</span>
                </label>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ví dụ: Nhóm Alpha"
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BUSY">BUSY</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasBoat}
                    onChange={(e) => setHasBoat(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Có xuồng
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasMedical}
                    onChange={(e) => setHasMedical(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Có y tế
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Xuồng máy 10 chỗ"
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={creating}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Đang tạo..." : "Tạo nhóm & tiếp theo →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Thêm thành viên ── */}
        {step === "members" && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-1 text-lg font-semibold text-slate-700">
              Thêm thành viên
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Nhóm: <span className="font-medium text-slate-600">{createdGroup?.name}</span>
            </p>

            {loadingMembers ? (
              <p className="py-8 text-center text-slate-400">
                Đang tải danh sách...
              </p>
            ) : availableMembers.length === 0 ? (
              <p className="py-8 text-center text-slate-400">
                Không có thành viên nào chưa có nhóm
              </p>
            ) : (
              <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">
                {availableMembers.map((m) => {
                  const selected = selectedUserIds.includes(m.userId);
                  return (
                    <div
                      key={m.userId}
                      onClick={() => toggleMember(m.userId)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 text-xs font-bold transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && "✓"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          {m.fullName}
                        </p>
                        <p className="text-xs text-slate-400">{m.phone}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Đã chọn: <span className="font-semibold text-blue-600">{selectedUserIds.length}</span>
              </span>
              <button
                onClick={handleAddMembers}
                disabled={addingMembers || selectedUserIds.length === 0}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {addingMembers ? "Đang thêm..." : "Thêm & tiếp theo →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Chọn leader ── */}
        {step === "leader" && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-1 text-lg font-semibold text-slate-700">
              Chọn leader nhóm
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Nhóm: <span className="font-medium text-slate-600">{createdGroup?.name}</span>
            </p>

            <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">
              {availableMembers
                .filter((m) => selectedUserIds.includes(m.userId))
                .map((m) => (
                  <div
                    key={m.userId}
                    onClick={() => setLeaderId(m.userId)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      leaderId === m.userId
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                        leaderId === m.userId
                          ? "border-amber-500 bg-amber-500"
                          : "border-slate-300"
                      }`}
                    >
                      {leaderId === m.userId && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{m.fullName}</p>
                      <p className="text-xs text-slate-400">{m.phone}</p>
                    </div>
                    {leaderId === m.userId && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Leader
                      </span>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/res-team/${teamId}/groups`)}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Bỏ qua
              </button>
              <button
                onClick={handlePickLeader}
                disabled={pickingLeader || !leaderId}
                className="flex-1 rounded-lg bg-amber-500 py-2.5 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
              >
                {pickingLeader ? "Đang lưu..." : "Xác nhận leader ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};