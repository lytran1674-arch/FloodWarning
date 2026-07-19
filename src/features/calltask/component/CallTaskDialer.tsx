// // features/calltask/component/CallTaskDialer.tsx
// import { useEffect, useState } from "react";
// import { Phone, PhoneCall, CheckCircle2, AlertTriangle } from "lucide-react";

// import {
//   CALL_TASK_SUCCESS_STATUS,
//   CALL_TASK_FAILED_STATUS,
//   isCallTaskTerminal,
//   TARGET_TYPE_LABELS,
// } from "../constants/calltaskConstants";
// import type { CallResultValue, UpdateCallTaskResponse } from "../type/CallTaskType";
// import { useCallTask } from "../hook/useCallTask";

// interface CallTaskDialerProps {
//   // ✅ cho phép null/undefined để component tự chịu trách nhiệm bảo vệ,
//   // không phụ thuộc hoàn toàn vào nơi gọi phải check trước
//   initialCallTask: UpdateCallTaskResponse | null | undefined;
//   trackingCode?: string;
//   onDispatched?: (finalCallTask: UpdateCallTaskResponse) => void;
//   onFailed?: (finalCallTask: UpdateCallTaskResponse) => void;
// }

// export const CallTaskDialer = ({
//   initialCallTask,
//   trackingCode,
//   onDispatched,
//   onFailed,
// }: CallTaskDialerProps) => {
//   // useCallTask tự fetch danh sách kết quả cuộc gọi (result) khi mount,
//   // và UpdateCallTask trả trực tiếp CallTask mới nhất (không đọc qua state để tránh stale)
//   const { result: options, loading, error, UpdateCallTask } = useCallTask();

//   // ✅ Hook luôn phải gọi ở top-level, không đặt sau early-return.
//   // Dùng optional chaining + fallback để không crash khi initialCallTask null.
//   const [callTask, setCallTask] = useState<UpdateCallTaskResponse | null>(
//     initialCallTask ?? null
//   );
//   const [selectedResult, setSelectedResult] = useState<CallResultValue | "">("");
//   const [startedAt, setStartedAt] = useState<string | null>(null);
//   const [secondsLeft, setSecondsLeft] = useState(initialCallTask?.timeoutSeconds ?? 0);
//   const [formError, setFormError] = useState("");

//   // đếm ngược lại mỗi khi callTask đổi (sang người mới hoặc lần gọi mới)
//   useEffect(() => {
//     if (!callTask) return; // ✅ guard: không setup timer khi chưa có data
//     setSecondsLeft(callTask.timeoutSeconds);
//     const timer = setInterval(() => {
//       setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [callTask]);

//   // ----- Guard: không có dữ liệu CallTask -----
//   // Đặt SAU tất cả hook để tuân thủ Rules of Hooks, nhưng TRƯỚC khi
//   // truy cập callTask.xxx ở phần render bên dưới.

//   if (!callTask) {
//     return (
//       <div className="max-w-md mx-auto p-6 text-center">
//         <AlertTriangle className="mx-auto text-amber-500" size={40} />
//         <h2 className="text-base font-semibold mt-3">Không có dữ liệu cuộc gọi</h2>
//         <p className="text-sm text-slate-500 mt-1">
//           Không tìm thấy thông tin CallTask để hiển thị. Vui lòng quay lại và thử tạo SOS lại.
//         </p>
//       </div>
//     );
//   }

//   const isDone = isCallTaskTerminal(callTask.status);
//   const isSuccess = callTask.status === CALL_TASK_SUCCESS_STATUS;

//   const handleCall = () => {
//     setStartedAt(new Date().toISOString());
//     window.location.href = `tel:${callTask.phoneNumber}`;
//   };

//   const handleConfirm = async () => {
//     if (!selectedResult) {
//       setFormError("Vui lòng chọn kết quả cuộc gọi");
//       return;
//     }
//     setFormError("");

//     const endedAt = new Date().toISOString();
//     const res = await UpdateCallTask(callTask.callTaskId, {
//       callResult: selectedResult,
//       startedAt: startedAt ?? endedAt, // nếu Hotline chưa bấm "Gọi" thì lấy tạm thời điểm xác nhận
//       endedAt,
//     });

//     if (!res) return; // lỗi mạng — giữ nguyên form để thử lại

//     setCallTask(res);
//     setSelectedResult("");
//     setStartedAt(null);

//     if (res.status === CALL_TASK_SUCCESS_STATUS) {
//       onDispatched?.(res);
//     } else if (res.status === CALL_TASK_FAILED_STATUS) {
//       onFailed?.(res);
//     }
//     // ngược lại: vẫn đang CALLING_* -> component tự re-render với callTask mới, tiếp tục vòng lặp
//   };

//   // ----- Màn hình kết thúc (thành công / thất bại) -----
//   if (isDone) {
//     return (
//       <div className="max-w-md mx-auto p-6 text-center">
//         {isSuccess ? (
//           <>
//             <CheckCircle2 className="mx-auto text-green-500" size={48} />
//             <h2 className="text-lg font-bold mt-3">Đã điều phối thành công</h2>
//             <p className="text-sm text-slate-500 mt-1">
//               {callTask.targetUserName} ({TARGET_TYPE_LABELS[callTask.targetType]}) đã xác nhận điều phối SOS.
//             </p>
//           </>
//         ) : (
//           <>
//             <AlertTriangle className="mx-auto text-red-500" size={48} />
//             <h2 className="text-lg font-bold mt-3">Không ai xác nhận điều phối</h2>
//             <p className="text-sm text-slate-500 mt-1">
//               Hệ thống đã gọi hết Team Leader, Đội phó và các Điều phối viên tỉnh nhưng không ai bắt máy.
//               Cảnh báo đã được tạo và gửi thông báo.
//             </p>
//           </>
//         )}
//       </div>
//     );
//   }

//   // ----- Màn hình dialer (đang trong vòng lặp gọi) -----
//   return (
//     <div className="max-w-md mx-auto p-6 space-y-5">
//       {trackingCode && (
//         <p className="text-xs text-slate-400">Mã theo dõi SOS: {trackingCode}</p>
//       )}

//       <div className="border rounded-2xl p-5 bg-slate-50">
//         <p className="text-xs font-medium text-blue-600 uppercase">
//           {TARGET_TYPE_LABELS[callTask.targetType]}
//         </p>
//         <h2 className="text-xl font-bold mt-1">{callTask.targetUserName}</h2>
//         <p className="text-slate-600 mt-0.5">{callTask.phoneNumber}</p>

//         <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
//           <span>Lần gọi thứ {callTask.retryCount + 1}/3</span>
//           <span>Còn {secondsLeft}s</span>
//         </div>

//         <button
//           type="button"
//           onClick={handleCall}
//           className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700"
//         >
//           <PhoneCall size={18} />
//           Gọi ngay
//         </button>
//       </div>

//       <div>
//         <label className="text-sm font-semibold text-gray-700">
//           Kết quả cuộc gọi
//         </label>
//         <select
//           value={selectedResult}
//           onChange={(e) => setSelectedResult(e.target.value as CallResultValue)}
//           className="w-full mt-2 rounded-xl border border-gray-200 p-3 text-sm"
//         >
//           <option value="">-- Chọn kết quả --</option>
//           {options.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {(formError || error) && (
//         <p className="text-sm text-red-600">{formError || error}</p>
//       )}

//       <button
//         type="button"
//         onClick={handleConfirm}
//         disabled={loading}
//         className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
//       >
//         <Phone size={18} />
//         {loading ? "Đang cập nhật..." : "Xác nhận kết quả"}
//       </button>
//     </div>
//   );
// };


// features/calltask/component/CallTaskDialer.tsx
import { useEffect, useState }  from "react"
import { Phone, PhoneCall, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  CALL_TASK_SUCCESS_STATUS,
  CALL_TASK_FAILED_STATUS,
  isCallTaskTerminal,
  TARGET_TYPE_LABELS,
}                               from "../constants/calltaskConstants"
import type {
  CallTaskData,
  CallResultValue,
}                               from "../type/CallTaskType"
import { useCallTask }          from "../hook/useCallTask"

interface CallTaskDialerProps {
  // ✅ nhận CallTaskData — type duy nhất, không còn conflict
  initialCallTask: CallTaskData | null | undefined
  trackingCode?:   string
  onDispatched?:   (final: CallTaskData) => void
  onFailed?:       (final: CallTaskData) => void
}

export const CallTaskDialer = ({
  initialCallTask,
  trackingCode,
  onDispatched,
  onFailed,
}: CallTaskDialerProps) => {
  const { result: options, loading, error, UpdateCallTask } = useCallTask()

  // ✅ Tất cả hooks ở top-level — không đặt sau early return
  const [callTask, setCallTask]           = useState<CallTaskData | null>(initialCallTask ?? null)
  const [selectedResult, setSelectedResult] = useState<CallResultValue | "">("")
  const [startedAt, setStartedAt]         = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft]     = useState(initialCallTask?.timeoutSeconds ?? 0)
  const [formError, setFormError]         = useState("")

  // Đếm ngược mỗi khi callTask thay đổi
  useEffect(() => {
    if (!callTask) return
    setSecondsLeft(callTask.timeoutSeconds)
    const timer = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [callTask])

  // ── Guard: không có CallTask ──
  if (!callTask) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <AlertTriangle className="mx-auto text-amber-500" size={40} />
        <h2 className="text-base font-semibold mt-3">Không có dữ liệu cuộc gọi</h2>
        <p className="text-sm text-slate-500 mt-1">
          Không tìm thấy thông tin CallTask để hiển thị.
          Vui lòng quay lại và thử tạo SOS lại.
        </p>
      </div>
    )
  }

  const isDone    = isCallTaskTerminal(callTask.status)
  const isSuccess = callTask.status === CALL_TASK_SUCCESS_STATUS

  const handleCall = () => {
    setStartedAt(new Date().toISOString())
    window.location.href = `tel:${callTask.phoneNumber}`
  }

  const handleConfirm = async () => {
    if (!selectedResult) {
      setFormError("Vui lòng chọn kết quả cuộc gọi")
      return
    }
    setFormError("")

    const endedAt = new Date().toISOString()
    const res = await UpdateCallTask(callTask.callTaskId, {
      callResult: selectedResult,
      startedAt:  startedAt ?? endedAt,
      endedAt,
    })

    if (!res) return // lỗi mạng — giữ nguyên form

    setCallTask(res)
    setSelectedResult("")
    setStartedAt(null)

    if (res.status === CALL_TASK_SUCCESS_STATUS) {
      onDispatched?.(res)
    } else if (res.status === CALL_TASK_FAILED_STATUS) {
      onFailed?.(res)
    }
  }

  // ── Màn hình kết thúc ──
  if (isDone) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        {isSuccess ? (
          <>
            <CheckCircle2 className="mx-auto text-green-500" size={48} />
            <h2 className="text-lg font-bold mt-3">Đã điều phối thành công</h2>
            <p className="text-sm text-slate-500 mt-1">
              {callTask.targetUserName} ({TARGET_TYPE_LABELS[callTask.targetType]}) đã xác nhận điều phối SOS.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto text-red-500" size={48} />
            <h2 className="text-lg font-bold mt-3">Không ai xác nhận điều phối</h2>
            <p className="text-sm text-slate-500 mt-1">
              Hệ thống đã gọi hết Team Leader, Đội phó và các Điều phối viên tỉnh nhưng không ai bắt máy.
              Cảnh báo đã được tạo và gửi thông báo.
            </p>
          </>
        )}
      </div>
    )
  }

  // ── Màn hình dialer ──
  return (
    <div className="max-w-md mx-auto p-6 space-y-5">
      {trackingCode && (
        <p className="text-xs text-slate-400">Mã theo dõi SOS: {trackingCode}</p>
      )}

      <div className="border rounded-2xl p-5 bg-slate-50">
        <p className="text-xs font-medium text-blue-600 uppercase">
          {TARGET_TYPE_LABELS[callTask.targetType]}
        </p>
        <h2 className="text-xl font-bold mt-1">{callTask.targetUserName}</h2>
        <p className="text-slate-600 mt-0.5">{callTask.phoneNumber}</p>

        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>Lần gọi thứ {callTask.retryCount + 1}/3</span>
          <span>Còn {secondsLeft}s</span>
        </div>

        <button
          type="button"
          onClick={handleCall}
          className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <PhoneCall size={18} />
          Gọi ngay
        </button>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Kết quả cuộc gọi
        </label>
        <select
          value={selectedResult}
          onChange={e => setSelectedResult(e.target.value as CallResultValue)}
          className="w-full mt-2 rounded-xl border border-gray-200 p-3 text-sm"
        >
          <option value="">-- Chọn kết quả --</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {(formError || error) && (
        <p className="text-sm text-red-600">{formError || error}</p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Phone size={18} />
        {loading ? "Đang cập nhật..." : "Xác nhận kết quả"}
      </button>
    </div>
  )
}