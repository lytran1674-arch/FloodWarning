import { useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGroupModal = ({
  onClose,
  onSuccess,
}: Props) => {
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] =
    useState("");

  const [groupName, setGroupName] =
    useState("");

  const [status, setStatus] =
    useState("AVAILABLE");

  const [hasBoat, setHasBoat] =
    useState(false);

  const [hasMedical, setHasMedical] =
    useState(false);

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);
    const navigate=useNavigate()

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setTeamId(user.teamId || "");

    setTeamName(
      user.teamName || "Chưa có tên đội"
    );
  }, []);

  const handleCreateGroup =
    async () => {
      if (!groupName.trim()) {
        alert("Vui lòng nhập tên nhóm");
        return;
      }

      try {
        setLoading(true);

        const payload = {
          teamId:teamId,
          name: groupName,
          status,
          hasBoat,
          hasMedical,
          notes,
        };

        // rescueApi.ts hoặc handleCreateGroup
console.log("Payload gửi lên:", JSON.stringify(payload, null, 2));
        await rescueApi.CreateGroup(
          teamId,
          payload
        );

        toast.success("Tạo nhóm thành công");
        navigate(`/res-team/${teamId}/groups`);

        onSuccess();
      } catch (error) {
        console.error(error);

        alert("Có lỗi khi tạo nhóm");
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Tạo nhóm cứu hộ
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>

        </div>

        <div className="mb-6 rounded-lg bg-slate-100 p-4">

          <p className="text-sm text-gray-600">
            Team ID
          </p>

          <p className="font-semibold">
            {teamId}
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Tên đội
          </p>

          <p className="font-semibold">
            {teamName}
          </p>

        </div>

        <div className="space-y-4">

          <input
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
            placeholder="Tên nhóm"
            className="w-full rounded-lg border p-3"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-lg border p-3"
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

          <div className="flex gap-6">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasBoat}
                onChange={(e) =>
                  setHasBoat(
                    e.target.checked
                  )
                }
              />
              Có xuồng
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasMedical}
                onChange={(e) =>
                  setHasMedical(
                    e.target.checked
                  )
                }
              />
              Có y tế
            </label>

          </div>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Ghi chú"
            className="w-full rounded-lg border p-3"
          />

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Hủy
            </button>

            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {loading
                ? "Đang tạo..."
                : "Tạo nhóm"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};