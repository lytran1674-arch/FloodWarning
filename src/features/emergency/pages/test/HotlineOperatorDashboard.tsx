// features/hotline/pages/HotlineOperatorDashboard.tsx
import { useState }                     from "react"
import { Tabs, Button }                 from "antd"
import { PhoneCall }                    from "lucide-react"
import { PendingCallsList }             from "../../components/test/PendingCallsList"
import { CallHistoryList }              from "../../components/test/CallHistoryList"

import { CreateManualSosModal }         from "../../components/test/CreateManualSosModal"
import { TraCuuSoS }                    from "../../components/TraCuuSoS"
import { ListSoSHotline }               from "../../components/ListSoSHotline"

import { useAppSelector }               from "@/hooks/redux.hooks"
import { useListSoSHotlineCreated }     from "../../hooks/useListSoSHotlineCreated"
import type { UpdateCallTaskResponse }  from "@/features/calltask/type/CallTaskType"
import { CallTaskDialer }               from "@/features/calltask/component/CallTaskDialer"
import { CreateSosFromCallDrawer }      from "../../components/test/CreateSosFromCallDrawerProps "
import { AlarmHistoryList }             from "@/features/notification/component/AlarmHistoryList"


// ── Type cho active call workflow ──
// initialCallTask có thể null nếu SOS tạo thành công nhưng backend
// không sinh được CallTask đầu tiên (vd không có Team Leader nào để gọi)
interface ActiveResult {
  initialCallTask: UpdateCallTaskResponse | null
  sos: { id: string; trackingCode: string }
}

export default function HotlineOperatorDashboard() {
  const { soshotline }  = useListSoSHotlineCreated()
  const user            = useAppSelector(s => s.auth.user)
  const isHotline       = user?.groupType === "HOTLINE"

  const [selectedCallEventId, setSelectedCallEventId] = useState<string | null>(null)
  const [manualModalOpen, setManualModalOpen]         = useState(false)
  const [refreshKey, setRefreshKey]                   = useState(0)

  // ✅ null = đang ở màn dashboard, có giá trị = đang trong call workflow
  const [activeResult, setActiveResult]               = useState<ActiveResult | null>(null)

  const handleCreated = (result?: ActiveResult) => {
    setSelectedCallEventId(null)
    setManualModalOpen(false)

    // ✅ Check chặt: phải có result VÀ có initialCallTask hợp lệ
    // mới chuyển sang màn dialer, tránh crash khi initialCallTask = null
    if (result?.initialCallTask) {
      setActiveResult(result)
    } else {
      // Không có CallTask (SOS tạo thành công nhưng chưa sinh được người gọi đầu tiên,
      // hoặc không tạo CallTask nào) → chỉ refresh danh sách
      setRefreshKey(k => k + 1)
    }
  }

  const handleFinish = () => {
    setActiveResult(null)
    setRefreshKey(k => k + 1)
  }

  // ── Màn Call Workflow ──
  // activeResult.initialCallTask đã được đảm bảo not-null nhờ check ở handleCreated
  if (activeResult?.initialCallTask) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <CallTaskDialer
          initialCallTask={activeResult.initialCallTask}
          trackingCode={activeResult.sos.trackingCode}
          onDispatched={handleFinish}
          onFailed={handleFinish}
        />
      </div>
    )
  }

  // ── Màn Dashboard chính ──
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-600">
          Bảng điều khiển Hotline
        </h1>
        {isHotline && (
          <Button
            icon={<PhoneCall size={16} />}
            onClick={() => setManualModalOpen(true)}
          >
            Tạo SOS thủ công
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        key={refreshKey}
        items={[
          {
            key:      "pending",
            label:    "Đang chờ",
            children: <PendingCallsList onSelectCall={setSelectedCallEventId} />,
          },
          {
            key:      "history",
            label:    "Lịch sử",
            children: <CallHistoryList />,
          },
          {
            key:      "search",
            label:    "Tra cứu SOS",
            children: <TraCuuSoS />,
          },
          {
            key:      "list",
            label:    "Danh sách SOS",
            children: <ListSoSHotline data={soshotline} />,
          },
          {
            key:      "alarms",
            label:    "Lịch sử cảnh báo",
            children: <AlarmHistoryList />,
          },
        ]}
      />

      {/* Drawer tạo SOS từ cuộc gọi */}
      <CreateSosFromCallDrawer
        callEventId={selectedCallEventId}
        onClose={() => setSelectedCallEventId(null)}
        onCreated={handleCreated}
      />

      {/* Modal tạo SOS thủ công */}
      <CreateManualSosModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}