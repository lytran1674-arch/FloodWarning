


import { useState }                        from "react"
import { Tabs, Button }                    from "antd"
import { PhoneCall }                       from "lucide-react"

import { CallTaskDialer }                  from "@/features/calltask/component/CallTaskDialer"
import { useAppSelector }                  from "@/hooks/redux.hooks"
import { useListSoSHotlineCreated } from "../../hooks/useListSoSHotlineCreated"
import type { SosHotlineCreateResult } from "../../types/emergencyType"
import { PendingCallsList } from "../../components/test/PendingCallsList"
import { CallHistoryList } from "../../components/test/CallHistoryList"
import { TraCuuSoS } from "../../components/TraCuuSoS"
import { ListSoSHotline } from "../../components/ListSoSHotline"
import { CreateSosFromCallDrawer } from "../../components/test/CreateSosFromCallDrawerProps "
import { CreateManualSosModal } from "../../components/test/CreateManualSosModal"



export default function HotlineOperatorDashboard() {
  const { soshotline } = useListSoSHotlineCreated()
  const user           = useAppSelector(s => s.auth.user)
  const isHotline      = user?.groupType === "HOTLINE"

  const [selectedCallEventId, setSelectedCallEventId] = useState<string | null>(null)
  const [manualModalOpen, setManualModalOpen]         = useState(false)
  const [refreshKey, setRefreshKey]                   = useState(0)

  // ✅ Dùng SosHotlineCreateResult — type duy nhất, không còn ActiveResult riêng
  const [activeResult, setActiveResult] = useState<SosHotlineCreateResult | null>(null);


// Luồng "tạo từ cuộc gọi" — vẫn chuyển sang màn gọi cứu hộ
const handleCreatedFromCall = (result: SosHotlineCreateResult) => {
  setSelectedCallEventId(null)
  setActiveResult(result)
}

// Luồng "tạo thủ công" — CHƯA có màn gọi cứu hộ, chỉ đóng modal + refresh danh sách
const handleCreatedManual = (result: SosHotlineCreateResult) => {
  setManualModalOpen(false)
  setRefreshKey(k => k + 1)
  // TODO: khi có luồng gọi cứu hộ cho SOS thủ công, đổi thành setActiveResult(result)
}

  const handleFinish = () => {
    setActiveResult(null)
    setRefreshKey(k => k + 1)
  }

  // ── Màn Call Workflow ──
  if (activeResult) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        {/* Back button */}
        <button
          onClick={handleFinish}
          className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
        >
          ← Quay lại
        </button>

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
        ]}
      />

     <CreateSosFromCallDrawer
  callEventId={selectedCallEventId}
  onClose={() => setSelectedCallEventId(null)}
  onCreated={handleCreatedFromCall}   // ← đổi từ handleCreated
/>
{isHotline && (
  <CreateManualSosModal
    open={manualModalOpen}
    onClose={() => setManualModalOpen(false)}
    onCreated={handleCreatedManual}   // ← đổi từ handleCreated
  />

      )}
    </div>
  )
}