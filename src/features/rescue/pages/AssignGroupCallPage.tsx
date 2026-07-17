// // features/sos/pages/AssignGroupCallPage.tsx
// //
// // MỚI: màn hình gọi Group Leader sau khi Dispatcher assign group cho SOS
// // (Bước 1 + 2 + 3 trong spec "Cập nhật luồng Assign Rescue Group").
// // Tái dùng CallTaskDialer (đúng như luồng call workflow của hotline: gọi, chọn kết quả,
// // retry tối đa 3 lần) nhưng đổi nội dung màn kết thúc + xử lý khi thất bại.
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { AlertTriangle } from "lucide-react";
// import { toast } from "react-toastify";

// import { CallTaskDialer } from "@/features/calltask/component/CallTaskDialer";
// import type { UpdateCallTaskResponse } from "@/features/calltask/type/CallTaskType";

// interface LocationState {
//   callTask?: UpdateCallTaskResponse;
// }

// export const AssignGroupCallPage = () => {
//   const { sosId } = useParams<{ sosId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { callTask } = (location.state as LocationState) ?? {};

//   // Trường hợp reload trang mất state (không có callTask trong location.state):
//   // không có API "lấy lại callTask hiện tại của SOS" trong spec, nên hướng dẫn
//   // dispatcher quay lại danh sách để assign lại thay vì hiển thị màn trắng.
//   if (!sosId || !callTask) {
//     return (
//       <div className="max-w-md mx-auto p-6 text-center">
//         <AlertTriangle className="mx-auto text-amber-500" size={40} />
//         <h2 className="text-base font-semibold mt-3">Không có dữ liệu cuộc gọi</h2>
//         <p className="text-sm text-slate-500 mt-1">
//           Có thể trang đã bị tải lại. Vui lòng quay lại màn phân công và thử lại.
//         </p>
//         <button
//           type="button"
//           onClick={() => navigate(`/sos-assignment/${sosId ?? ""}`)}
//           className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
//         >
//           Quay lại màn phân công
//         </button>
//       </div>
//     );
//   }

//   const handleFailed = () => {
//     // ĐÚNG THEO SPEC BƯỚC 3: SosAssignment vẫn ASSIGNED, group đã tự AVAILABLE lại ở BE.
//     // FE không tự động điều phối lại — Dispatcher sẽ nhận Popup (Bước 4) rồi bấm OK để
//     // mở lại danh sách group (Bước 6). Ở đây vẫn cho thao tác nhanh ngay tại chỗ,
//     // phòng khi Dispatcher đang đứng sẵn màn này chứ chưa rời đi.
//     toast.error("Group Leader không phản hồi sau 3 lần gọi. Vui lòng chọn lại đội cứu hộ.");
//   };

//   return (
//     <CallTaskDialer
//       initialCallTask={callTask}
//       trackingCode={sosId}
//       successTitle="Group Leader đã xác nhận"
//       successDescription={(task) =>
//         `${task.targetUserName} đã xác nhận tiếp nhận nhiệm vụ cứu hộ.`
//       }
//       failureTitle="Group Leader không phản hồi"
//       failureDescription="Đã gọi 3 lần nhưng Group Leader không bắt máy. Đội này đã được chuyển lại trạng thái Sẵn sàng. Vui lòng quay lại và chọn đội khác."
//       onDispatched={() => {
//         toast.success("Group Leader đã xác nhận nhiệm vụ");
//         navigate(-2); // thoát khỏi cả màn gọi + màn phân công, về danh sách SOS
//       }}
//       onFailed={handleFailed}
//     />
//   );
// };