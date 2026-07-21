// pages/CallWorkflowPage.tsx
import type { CallTaskData } from "../type/CallTaskType"
import { useLocation, useNavigate } from "react-router-dom"
import { CallTaskDialer } from "../component/CallTaskDialer"
import { toast } from "react-toastify"

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

 // Gọi thành công (ANSWERED) -> phân công/điều phối đã HOÀN TẤT thật sự
  const handleDispatched = () => {
    if (flowType === "ASSIGN_GROUP") {
      toast.success("Đã liên hệ được Trưởng nhóm — phân công thành công!")
      navigate("/team-sos", { replace: true })
    } else {
      toast.success("Đã liên hệ được Điều phối viên tỉnh — gửi yêu cầu hỗ trợ thành công!")
      navigate("/support-request", { replace: true })
    }
  }

  // Gọi thất bại hẳn (đủ retry ở mọi cấp, không ai bắt máy)
  // -> KHÔNG coi là xong, phải quay lại chọn nhóm/đối tượng khác
  const handleFailed = () => {
    if (flowType === "ASSIGN_GROUP" && sosId) {
      toast.error("Trưởng nhóm không phản hồi. Vui lòng chọn nhóm khác để phân công.")
      // quay lại đúng SOS này -> getAssignCandidates sẽ fetch lại,
      // nhóm vừa gọi thất bại sẽ hiện tag "Gọi thất bại", các nhóm khác vẫn chọn được
      navigate(`/sos-assign/${sosId}`, { replace: true })
    } else {
      toast.error("Điều phối viên không phản hồi. Yêu cầu hỗ trợ sẽ chờ người khác nhận điều phối.")
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
        onDispatched={handleDispatched}
        onFailed={handleFailed}
      />
    </div>
  )
}