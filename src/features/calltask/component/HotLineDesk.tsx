// // features/hotline/components/HotlineDesk.tsx
// import { CreateManualSosModal } from "@/features/emergency/components/test/CreateManualSosModal";
// import type { SosHotlineCreateResult } from "@/features/emergency/types/emergencyType";
// import { useState } from "react";


// /**
//  * Màn hình chính của Hotline operator:
//  * 1. Bấm "Tạo SOS thủ công" -> mở CreateManualSosModal
//  * 2. Tạo SOS thành công -> nhận { sos, initialCallTask } -> chuyển sang CallTaskDialer
//  * 3. CallTaskDialer tự lo vòng lặp gọi điện (Team Leader -> Deputy -> Province Operator)
//  * 4. Khi dialer kết thúc (SUCCESS hoặc FAILED) -> quay lại màn tạo SOS mới
//  */
// export function HotlineDesk() {
//   const [modalOpen, setModalOpen] = useState(false);


//   const handleCreated = (result: SosHotlineCreateResult) => {
//     setActiveResult(result);
//     setModalOpen(false);
//   };



//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       {!activeResult ? (
//         <>
//           <h1 className="text-xl font-bold mb-4">Trực tổng đài Hotline</h1>

//           <button
//             type="button"
//             onClick={() => setModalOpen(true)}
//             className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
//           >
//             + Tạo SOS thủ công
//           </button>

//           <CreateManualSosModal
//             open={modalOpen}
//             onClose={() => setModalOpen(false)}
//             onCreated={handleCreated}
//           />
//         </>
//       ) : (
//         <CallTaskDialer
//           initialCallTask={activeResult.initialCallTask}
//           trackingCode={activeResult.sos.trackingCode}
//           onDispatched={() => {
//             // TODO: cần xác nhận bước tiếp theo — điều hướng sang màn phân công
//             // group cho SOS này (activeResult.sos.id) hay chỉ cần quay lại màn tạo SOS mới?
//             handleFinish();
//           }}
//           onFailed={() => {
//             handleFinish();
//           }}
//         />
//       )}
//     </div>
//   );
// }