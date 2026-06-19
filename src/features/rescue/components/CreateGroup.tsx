
import { useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";

export const CreateGroup = () => {

  // state
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  const [groupName, setGroupName] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  const [hasBoat, setHasBoat] = useState(false);
  const [hasMedical, setHasMedical] = useState(false);

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // lấy user localStorage
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log(
      "User Local:",
      user
    );

    // lấy teamId
    setTeamId(user.teamId || "");

    // nếu backend chưa trả teamName
    // có thể set mặc định
    setTeamName(
      user.teamName || "Chưa có tên đội"
    );

  }, []);

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

        status,

        hasBoat,

        hasMedical,

        notes

      };

      console.log(
        "Create Payload:",
        payload
      );

      console.log(
        "Team ID:",
        teamId
      );

      const response =
        await rescueApi.CreateGroup(
          teamId,
          payload
        );

      console.log(
        "Create Response:",
        response
      );

      alert("Tạo nhóm thành công");

      // reset
      setGroupName("");
      setStatus("AVAILABLE");
      setHasBoat(false);
      setHasMedical(false);
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

          <p className="text-sm text-gray-600">
            Team ID
          </p>

          <p className="font-semibold text-slate-800">
            {teamId || "Đang tải..."}
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Tên đội
          </p>

          <p className="font-semibold text-slate-800">
            {teamName}
          </p>

        </div>

        {/* form */}
        <div className="space-y-5">

          {/* group name */}
          <div>

            <label className="mb-2 block font-medium">

              Tên nhóm

            </label>

            <input
              type="text"
              value={groupName}
              onChange={(e) =>
                setGroupName(e.target.value)
              }
              placeholder="Ví dụ: Nhóm Alpha"
              className="
                w-full rounded-xl border
                border-slate-300 p-3
                outline-none
                focus:border-blue-500
              "
            />

          </div>

          {/* status */}
          <div>

            <label className="mb-2 block font-medium">

              Trạng thái

            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="
                w-full rounded-xl border
                border-slate-300 p-3
                outline-none
                focus:border-blue-500
              "
            >

              <option value="AVAILABLE">
                AVAILABLE
              </option>

              <option value="BUSY">
                BUSY
              </option>

              <option value="MAINTENANCE">
                MAINTENANCE
              </option>

            </select>

          </div>

          {/* checkbox */}
          <div className="flex gap-8">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={hasBoat}
                onChange={(e) =>
                  setHasBoat(e.target.checked)
                }
              />

              Có xuồng

            </label>

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={hasMedical}
                onChange={(e) =>
                  setHasMedical(e.target.checked)
                }
              />

              Có y tế

            </label>

          </div>

          {/* notes */}
          <div>

            <label className="mb-2 block font-medium">

              Ghi chú

            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
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

            {
              loading
                ? "Đang tạo..."
                : "Tạo nhóm cứu hộ"
            }

          </button>

        </div>

      </div>

    </div>

  );

};

