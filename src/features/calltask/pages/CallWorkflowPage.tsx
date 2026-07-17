// pages/CallWorkflowPage.tsx
import type { CallTaskInitial } from "@/features/emergency/types/emergencyType"
import { useLocation, useNavigate } from "react-router-dom"
import { CallTaskDialer } from "../component/CallTaskDialer"

interface State {
  initialCallTask:  CallTaskInitial
  supportRequestId: string
  // ✅ Thêm — phân biệt flow để navigate đúng sau khi xong
  flowType?: "SUPPORT_REQUEST" | "ASSIGN_GROUP"
  sosId?:    string  // dùng cho flow assign group — quay lại trang SOS
}

export function CallWorkflowPage() {
  const navigate  = useNavigate()
  const { state } = useLocation()
  const {
    initialCallTask,
    supportRequestId,
    flowType = "SUPPORT_REQUEST",
    sosId,
  } = (state as State) ?? {}

  if (!initialCallTask) {
    navigate(-1)
    return null
  }

  // Navigate đúng theo flow
  const handleFinish = () => {
    if (flowType === "ASSIGN_GROUP" && sosId) {
      // Quay về màn SOS detail để dispatcher thấy kết quả
      navigate(`/sos/${sosId}`, { replace: true })
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
        onDispatched={handleFinish}
        onFailed={handleFinish}
      />
    </div>
  )
}