// import {
//   AlertTriangle,
//   CheckCircle2,
//   Clock3,
//   DatabaseZap,
//   RefreshCcw,
//   TriangleAlert,
// } from "lucide-react";

// import type { PredictionJobs } from "../../types/floodriskType";

// interface Props {
//   data: PredictionJobs[];
// }

// export const PredictionCard = ({ data }: Props) => {
//   // =========================
//   // CALCULATE
//   // =========================

//   const totalJobs = data.length;

//   const successJobs = data.filter(
//     (item) => item.status === "SUCCESS"
//   ).length;

//   const partialJobs = data.filter(
//     (item) =>
//       item.status === "PARTIAL_SUCCESS"
//   ).length;

//   const failedJobs = data.filter(
//     (item) => item.status === "FAILED"
//   ).length;

// //   const totalRecovery = data.reduce(
// //     (sum, item) =>
// //       sum + (item. || 0),
// //     0
// //   );

//   // =========================
//   // UI
//   // =========================

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
//       {/* TOTAL */}
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">
//               Tổng lần chạy
//             </p>

//             <h2 className="mt-2 text-3xl font-bold text-black">
//               {totalJobs}
//             </h2>

//             <p className="mt-1 text-xs text-gray-400">
//               Trong lịch sử dự báo
//             </p>
//           </div>

//           <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
//             <DatabaseZap className="h-6 w-6" />
//           </div>
//         </div>
//       </div>

//       {/* SUCCESS */}
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">
//               Thành công
//             </p>

//             <h2 className="mt-2 text-3xl font-bold text-green-600">
//               {successJobs}
//             </h2>

//             <p className="mt-1 text-xs text-gray-400">
//               Dự báo hoàn tất
//             </p>
//           </div>

//           <div className="rounded-xl bg-green-100 p-3 text-green-600">
//             <CheckCircle2 className="h-6 w-6" />
//           </div>
//         </div>
//       </div>

//       {/* PARTIAL */}
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">
//               Một phần
//             </p>

//             <h2 className="mt-2 text-3xl font-bold text-orange-500">
//               {partialJobs}
//             </h2>

//             <p className="mt-1 text-xs text-gray-400">
//               Cần recovery dữ liệu
//             </p>
//           </div>

//           <div className="rounded-xl bg-orange-100 p-3 text-orange-500">
//             <Clock3 className="h-6 w-6" />
//           </div>
//         </div>
//       </div>

//       {/* FAILED */}
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">
//               Thất bại
//             </p>

//             <h2 className="mt-2 text-3xl font-bold text-red-500">
//               {failedJobs}
//             </h2>

//             <p className="mt-1 text-xs text-gray-400">
//               Không tạo được dự báo
//             </p>
//           </div>

//           <div className="rounded-xl bg-red-100 p-3 text-red-500">
//             <TriangleAlert className="h-6 w-6" />
//           </div>
//         </div>
//       </div>

//       {/* RECOVERY */}
//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">
//               Recovery
//             </p>

//             {/* <h2 className="mt-2 text-3xl font-bold text-purple-600">
//               {totalRecovery}
//             </h2> */}

//             <p className="mt-1 text-xs text-gray-400">
//               Tổng số lần phục hồi
//             </p>
//           </div>

//           <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
//             <RefreshCcw className="h-6 w-6" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };