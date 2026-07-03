// // src/features/province_operator/components/RejectSupportRequestModal.tsx
// import { useState } from "react";

// import { provinceApi } from "../../api/provinceApi";


// interface RejectSupportRequestModalProps {
//   requestId: string;
//   open: boolean;
//   onClose: () => void;
//   onRejected: () => void;
// }

// export function RejectSupportRequestModal({
//   requestId,
//   open,
//   onClose,
//   onRejected,
// }: RejectSupportRequestModalProps) {
//   const [reason, setReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   if (!open) return null;

//   const handleClose = () => {
//     setReason("");
//     setError(null);
//     onClose();
//   };

//   const handleSubmit = async () => {
//     if (!reason.trim()) {
//       setError("Vui lòng nhập lý do từ chối");
//       return;
//     }
//     setSubmitting(true);
//     setError(null);
//     try {
//       await provinceApi.rejectSupportRequest(requestId, {
//         provinceResponse: reason,
//       });
//       onRejected();
//       handleClose();
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Từ chối đơn thất bại");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//         <h2 className="mb-4 text-lg font-semibold text-gray-900">
//           Từ chối yêu cầu hỗ trợ
//         </h2>

//         <div className="mb-4">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Lý do từ chối
//           </label>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             rows={3}
//             placeholder="Ví dụ: Hiện chưa đủ phương tiện chi viện"
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
//             className="rounded bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60"
//           >
//             {submitting ? "Đang gửi..." : "Xác nhận từ chối"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }