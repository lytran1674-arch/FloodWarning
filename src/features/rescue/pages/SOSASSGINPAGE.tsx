
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useGroup } from "../hooks/useGroup";
import { useSoS } from "../../sosrequest/hooks/useSoS";

import {
  Anchor,
  Stethoscope,
  Users,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { RequestSupportButton } from "@/features/province_operator/components/RequestSupportButton";

// TODO: đổi lại đúng enum RoleGroup thật trong sosType.ts của bạn
// Đây là 2 giá trị mình tạm giả định — "đội chính" / "đội hỗ trợ"
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

export const SOSASSGINPAGE=()=>  {
  const {sosId } = useParams<{ sosId: string }>();
  const navigate = useNavigate();

  // TODO: xác nhận field teamId thật trong redux auth state (giống areaId)
  const user = useAppSelector((state) => state.auth.user);
  const teamId = user?.teamId;

  const { groups, loading: loadingGroups } = useGroup(teamId);


  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [role, setRole] = useState<RoleGroup>("PRIMARY");
  const [note, setNote] = useState("");
const {
  assignment,
  submit,

  getDetailSoS,
} = useSoS()

useEffect(() => {
  if (sosId) {
    getDetailSoS(sosId)
  }
}, [sosId])
  // const selectedGroup: Group | undefined = groups.find(
  //   (g) => g.id === selectedGroupId
  // );
const handleSubmit = async () => {
  console.log("DEBUG sosId:", sosId, "| selectedGroupId:", selectedGroupId);

  if (!sosId) {
    console.log("DEBUG: bị chặn vì sosId undefined");
    return;
  }
  if (!selectedGroupId) {
    console.log("DEBUG: bị chặn vì chưa chọn group");
    return;
  }

  const success = await assignment({
    sosId,
    groupId: selectedGroupId,
    role,
    note: note.trim() || undefined,
  });

  console.log("DEBUG: kết quả assignment:", success);

  if (success) {
    navigate(-1);
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto">
     {/* <SOSDetailCard
  data={detailSOS}
  loading={loading}
/>     */}
  <div className="flex justify-between">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>
    {sosId && (
    <RequestSupportButton
      sosId={sosId}
      onCreated={(requestId) => {
        console.log("Đã tạo đơn hỗ trợ:", requestId);
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
        ) : groups.length === 0 ? (
          <p className="text-sm text-gray-400">
            Không có đội nào trong team của bạn
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
                    </div>

                    {group.notes && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {group.notes}
                      </p>
                    )}

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

      <button
        onClick={handleSubmit}
        disabled={!selectedGroupId || submit}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {submit ? "Đang phân công..." : "Xác nhận phân công"}
      </button>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSoS } from "../../sosrequest/hooks/useSoS";
// import { ArrowLeft } from "lucide-react";
// import SOSDetailCard from "@/features/sosrequest/components/ChiTietSOS";
// import { RescueGroupTable } from "./RescueGroupTable";

// // TODO: đổi lại đúng enum RoleGroup thật trong sosType.ts của bạn
// // Đây là 2 giá trị mình tạm giả định — "đội chính" / "đội hỗ trợ"
// type RoleGroup = "PRIMARY" | "SUPPORT";

// const roleOptions: { value: RoleGroup; label: string }[] = [
//   { value: "PRIMARY", label: "Đội chính" },
//   { value: "SUPPORT", label: "Đội hỗ trợ" },
// ];

// export const SOSASSGINPAGE = () => {
//   const { sosId } = useParams<{ sosId: string }>();
//   const navigate = useNavigate();

//   const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
//   const [role, setRole] = useState<RoleGroup>("PRIMARY");
//   const [note, setNote] = useState("");

//   const { assignment, submit, loading, detailSOS, getDetailSoS } = useSoS();

//   useEffect(() => {
//     if (sosId) {
//       getDetailSoS(sosId);
//     }
//   }, [sosId]);

//   const handleSubmit = async () => {
//     console.log("DEBUG sosId:", sosId, "| selectedGroupId:", selectedGroupId);

//     if (!sosId) {
//       console.log("DEBUG: bị chặn vì sosId undefined");
//       return;
//     }
//     if (!selectedGroupId) {
//       console.log("DEBUG: bị chặn vì chưa chọn group");
//       return;
//     }

//     const success = await assignment({
//       sosId,
//       groupId: selectedGroupId,
//       role,
//       note: note.trim() || undefined,
//     });

//     console.log("DEBUG: kết quả assignment:", success);

//     if (success) {
//       navigate(-1);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <SOSDetailCard data={detailSOS} loading={loading} />

//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         Quay lại
//       </button>

//       <h1 className="text-xl font-bold mb-4">Phân công đội cứu hộ</h1>

//       {/* Chọn group - RescueGroupTable tự fetch data qua useGroup */}
//       <div className="mb-6">
//         <RescueGroupTable
//           selectedGroup={selectedGroupId ?? undefined}
//           onSelect={setSelectedGroupId}
//         />
//       </div>

//       {/* Chọn role */}
//       <div className="mb-6">
//         <p className="text-sm font-semibold text-gray-700 mb-2">Vai trò</p>
//         <div className="flex gap-2">
//           {roleOptions.map((opt) => (
//             <button
//               key={opt.value}
//               type="button"
//               onClick={() => setRole(opt.value)}
//               className={`px-3 py-1.5 rounded-lg text-sm border transition-colors
//                 ${
//                   role === opt.value
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
//                 }`}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Ghi chú */}
//       <div className="mb-6">
//         <p className="text-sm font-semibold text-gray-700 mb-2">
//           Ghi chú (tuỳ chọn)
//         </p>
//         <textarea
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           rows={3}
//           placeholder="VD: Ưu tiên tiếp cận từ phía Nam, khu vực ngập sâu..."
//           className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={!selectedGroupId || submit}
//         className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//       >
//         {submit ? "Đang phân công..." : "Xác nhận phân công"}
//       </button>
//     </div>
//   );
// };