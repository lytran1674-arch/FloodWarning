// // src/features/province_operator/components/ApproveSupportRequestModal.tsx
// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/hooks/redux.hooks";
// import { provinceoperatorApi } from "../../api/provinceoperatorApi";
// import { provinceApi } from "../../api/provinceApi";


// interface ApproveSupportRequestModalProps {
//   requestId: string;
//   open: boolean;
//   onClose: () => void;
//   onApproved: () => void;
// }

// export function ApproveSupportRequestModal({
//   requestId,
//   open,
//   onClose,
//   onApproved,
// }: ApproveSupportRequestModalProps) {
//  const operatorId = useAppSelector((state) => state.auth.user?.id);

//   const [teams, setTeams] = useState<
//     { id: string; name: string; leaderName: string; groupCount: number }[]
//   >([]);
//   const [teamsLoading, setTeamsLoading] = useState(false);
//   const [selectedTeamId, setSelectedTeamId] = useState("");
//   const [note, setNote] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !operatorId) return;
//     setTeamsLoading(true);
//     provinceoperatorApi
//       .getMyTeams(operatorId)
//       .then(setTeams)
//       .catch(() => setError("Không tải được danh sách team"))
//       .finally(() => setTeamsLoading(false));
//   }, [open, operatorId]);

//   if (!open) return null;

//   const handleClose = () => {
//     setSelectedTeamId("");
//     setNote("");
//     setError(null);
//     onClose();
//   };
// const handleSubmit = async () => {
//   if (!selectedTeamId) {
//     setError("Vui lòng chọn team chi viện");
//     return;
//   }

//   setSubmitting(true);
//   setError(null);

//   try {
//     await provinceApi.approveSupportRequest(requestId, {
//       items: [
//         {
//           supportRequestItemId: requestId,
//           status: "APPROVED",
//           assignedTeamId: selectedTeamId,
//         },
//       ],
//     });

//     onApproved();
//     handleClose();
//   } catch (err: any) {
//     setError(
//       err?.response?.data?.message ||
//         "Duyệt yêu cầu thất bại"
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//         <h2 className="mb-4 text-lg font-semibold text-gray-900">
//           Duyệt yêu cầu hỗ trợ
//         </h2>

//         <div className="mb-4">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Chọn team chi viện
//           </label>
//           {teamsLoading ? (
//             <p className="text-sm text-gray-400">Đang tải danh sách team...</p>
//           ) : (
//             <select
//               value={selectedTeamId}
//               onChange={(e) => setSelectedTeamId(e.target.value)}
//               className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//             >
//               <option value="">-- Chọn team --</option>
//               {teams.map((t) => (
//                 <option key={t.id} value={t.id}>
//                   {t.name} (leader: {t.leaderName}, {t.groupCount} group)
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Ghi chú (tuỳ chọn)
//           </label>
//           <textarea
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             rows={3}
//             placeholder="Ví dụ: Chi viện nhân lực"
//             className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//           />
//         </div>

//         {error && (
//           <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
//             {error}
//           </p>
//         )}

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={handleClose}
//             disabled={submitting}
//             className="rounded border px-4 py-2 text-sm text-gray-700"
//           >
//             Hủy
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
//           >
//             {submitting ? "Đang duyệt..." : "Xác nhận duyệt"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
