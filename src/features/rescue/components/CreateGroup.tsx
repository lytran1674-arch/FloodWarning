import { useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";

export const CreateGroup = () => {
  // state
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  const [groupName, setGroupName] = useState("");

  const [hasBoat, setHasBoat] = useState(false);
  const [hasMedical, setHasMedical] = useState(false);
  const [hasSearchRescue, setHasSearchRescue] = useState(false);
  const [hasLogistics, setHasLogistics] = useState(false);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // lấy user localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("User Local:", user);

    // lấy teamId
    setTeamId(user.teamId || "");

    // nếu backend chưa trả teamName
    // có thể set mặc định
    setTeamName(user.teamName || "Chưa có tên đội");
  }, []);

  // 👇 tìm kiếm cứu nạn / hậu cần đều cần thuyền + y tế
  // → tự động tick khi bật 1 trong 2, và khoá không cho tự bỏ tick
  useEffect(() => {
    if (hasSearchRescue || hasLogistics) {
      setHasBoat(true);
      setHasMedical(true);
    }
  }, [hasSearchRescue, hasLogistics]);

  const isBoatMedicalLocked = hasSearchRescue || hasLogistics;

  // submit
  const handleCreateGroup = async () => {
    // validate
    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm");
      return;
    }

    if (!teamId) {
      alert("Không tìm thấy teamId");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: groupName,
        status: "AVAILABLE", // 👈 luôn cố định khi tạo nhóm mới
        hasBoat,
        hasMedical,
        hasSearchRescue,
        hasLogistics,
        notes,
      };

      console.log("Create Payload:", payload);
      console.log("Team ID:", teamId);

      const response = await rescueApi.CreateGroup(teamId, payload);

      console.log("Create Response:", response);

      alert("Tạo nhóm thành công");

      // reset
      setGroupName("");
      setHasBoat(false);
      setHasMedical(false);
      setHasSearchRescue(false);
      setHasLogistics(false);
      setNotes("");
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi tạo nhóm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        {/* title */}
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Tạo nhóm cứu hộ
        </h1>

        {/* team info */}
        <div className="mb-6 rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-gray-600">Team ID</p>

          <p className="font-semibold text-slate-800">
            {teamId || "Đang tải..."}
          </p>

          <p className="mt-3 text-sm text-gray-600">Tên đội</p>

          <p className="font-semibold text-slate-800">{teamName}</p>
        </div>

        {/* form */}
        <div className="space-y-5">
          {/* group name */}
          <div>
            <label className="mb-2 block font-medium">
              Tên nhóm <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ví dụ: Nhóm Alpha"
              className="
                w-full rounded-xl border
                border-slate-300 p-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* status - cố định, không cho chọn */}
          <div>
            <label className="mb-2 block font-medium">Trạng thái</label>

            <div
              className="
                w-full rounded-xl border
                border-slate-200 bg-slate-50 p-3
                text-slate-500
              "
            >
              AVAILABLE
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Nhóm mới tạo luôn ở trạng thái sẵn sàng.
            </p>
          </div>

          {/* năng lực chính: tìm kiếm cứu nạn / hậu cần */}
          <div>
            <label className="mb-2 block font-medium">Năng lực nhóm</label>

            <div className="flex gap-8">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasSearchRescue}
                  onChange={(e) => setHasSearchRescue(e.target.checked)}
                />
                Tìm kiếm cứu nạn
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasLogistics}
                  onChange={(e) => setHasLogistics(e.target.checked)}
                />
                Hậu cần
              </label>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Chọn 1 trong 2 (hoặc cả hai) sẽ tự động yêu cầu nhóm có thuyền và y tế.
            </p>
          </div>

          {/* checkbox thuyền / y tế */}
          <div className="flex gap-8">
            <label
              className={`flex items-center gap-2 ${
                isBoatMedicalLocked ? "text-gray-400" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={hasBoat}
                disabled={isBoatMedicalLocked}
                onChange={(e) => setHasBoat(e.target.checked)}
              />
              Có xuồng
            </label>

            <label
              className={`flex items-center gap-2 ${
                isBoatMedicalLocked ? "text-gray-400" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={hasMedical}
                disabled={isBoatMedicalLocked}
                onChange={(e) => setHasMedical(e.target.checked)}
              />
              Có y tế
            </label>
          </div>

          {isBoatMedicalLocked && (
            <p className="-mt-3 text-xs text-amber-600">
              Đã tự động bật "Có xuồng" và "Có y tế" vì nhóm có năng lực tìm kiếm cứu nạn / hậu cần.
            </p>
          )}

          {/* notes */}
          <div>
            <label className="mb-2 block font-medium">Ghi chú</label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Xuồng máy 10 chỗ"
              className="
                w-full rounded-xl border
                border-slate-300 p-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* button */}
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="
              w-full rounded-xl
              bg-blue-600 p-3
              font-semibold text-white
              transition hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Đang tạo..." : "Tạo nhóm cứu hộ"}
          </button>
        </div>
      </div>
    </div>
  );
};