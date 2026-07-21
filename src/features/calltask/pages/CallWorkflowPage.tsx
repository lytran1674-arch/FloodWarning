// pages/CallWorkflowPage.tsx
import type { CallTaskData } from "../type/CallTaskType"
import { useLocation, useNavigate } from "react-router-dom"
import { CallTaskDialer } from "../component/CallTaskDialer"

interface State {
  initialCallTask:  CallTaskData
  supportRequestId?: string
  // phân biệt flow để navigate đúng sau khi xong
  flowType?: "SUPPORT_REQUEST" | "ASSIGN_GROUP"
  sosId?:    string  // dùng cho flow assign group — quay lại trang SOS
}

export function CallWorkflowPage() {
  const navigate  = useNavigate()
  const { state } = useLocation()
  const {
    initialCallTask,
    flowType = "SUPPORT_REQUEST",
    sosId,
  } = (state as State) ?? {}

  if (!initialCallTask) {
    navigate(-1)
    return null
  }

  // Sau khi dispatch thành công (ANSWERED) hoặc thất bại hẳn (đủ retry ở mọi cấp)
  const handleFinish = () => {
    if (flowType === "ASSIGN_GROUP" && sosId) {
      // Quay về màn phân công của đúng SOS này để Dispatcher thấy popup/chọn lại group
      navigate(`/sos-assign/${sosId}`, { replace: true })
    } else {
      // Support Request flow → về danh sách support request
      navigate("/support-request", { replace: true })
    }
  }

  const title =
    flowType === "ASSIGN_GROUP"
      ? "Xác nhận phân công đội cứu hộ"
      : "Điều phối yêu cầu hỗ trợ"

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-lg font-semibold text-center mb-4 text-red-600">
        {title}
      </h2>
      <CallTaskDialer
        initialCallTask={initialCallTask}
        trackingCode={sosId}
        onDispatched={handleFinish}
        onFailed={handleFinish}
      />
    </div>
  )
}