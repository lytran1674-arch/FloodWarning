import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axiosClient";

interface Assignment {
  id: string;
  sosId: string;
  groupName: string;
  role: string;
  status: string;
}

export default function AssignmentStatusPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [availableStatuses, setAvailableStatuses] = useState<{ code: string; name: string }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
const user = JSON.parse(localStorage.getItem("user") || "{}");
const canUpdateStatus =  user?.isGroupLeader === true;
  // load danh sách nhiệm vụ
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await axiosClient.get("/sos-assignment/group");

      console.log("ASSIGNMENTS:", res.data);

      setAssignments(
        res.data.result?.content ||
        res.data.result ||
        []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // load trạng thái hợp lệ
const loadAvailableStatuses = async (assignmentId: string) => {
  try {
    const res = await axiosClient.get(
      `/sos-assignment/${assignmentId}/available-statuses`
    );
    setAvailableStatuses(res.data.result || []);
  } catch (err) {
    console.error(err);
  }
};

// Cập nhật status — dùng selectedStatus là code
const updateStatus = async () => {
  if (!selectedAssignment || !selectedStatus) return;
  try {
    await axiosClient.put(
      `/sos-assignment/${selectedAssignment.id}/status`,
      { status: selectedStatus }
    );
    alert("Cập nhật thành công");
    setSelectedAssignment(null);
    setSelectedStatus("");
    loadAssignments();
  } catch (err: any) {
    alert(err.response?.data?.message || "Cập nhật thất bại");
  }
};

  if (loading) {
    return (
      <div className="p-6">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Nhiệm vụ được giao
      </h1>

      <div className="space-y-4">

        {assignments.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Assignment ID:
                </p>
                <p className="text-sm text-gray-500">
                  {item.id}
                </p>

                <p className="mt-2">
                  Trạng thái:
                  <span className="font-bold ml-2">
                    {item.status}
                  </span>
                </p>
              </div>

           {canUpdateStatus && (
  <button
    onClick={() => {
      setSelectedAssignment(item);
      loadAvailableStatuses(item.id);
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Cập nhật
  </button>
)}
            </div>
          </div>
        ))}

      </div>

      {selectedAssignment && (
        <div className="mt-8 border rounded-xl p-4 bg-slate-50">

          <h2 className="font-bold mb-3">
            Cập nhật trạng thái
          </h2>

          <p className="mb-3">
            Trạng thái hiện tại:
            <b className="ml-2">
              {selectedAssignment.status}
            </b>
          </p>

          <select
  className="border rounded px-3 py-2 w-full"
  value={selectedStatus}
  onChange={(e) => setSelectedStatus(e.target.value)}
>
  <option value="">Chọn trạng thái</option>
  {availableStatuses.map((s) => (
    <option key={s.code} value={s.code}>
      {s.name}
    </option>
  ))}
</select>

          <button
            onClick={updateStatus}
            disabled={!selectedStatus}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Xác nhận cập nhật
          </button>
        </div>
      )}
    </div>
  );
}