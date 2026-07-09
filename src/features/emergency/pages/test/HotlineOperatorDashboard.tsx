// features/hotline/pages/HotlineOperatorDashboard.tsx
import { useState } from "react";
import { Tabs, Button } from "antd";
import { PhoneCall } from "lucide-react";
import { PendingCallsList } from "../../components/test/PendingCallsList";
import { CallHistoryList } from "../../components/test/CallHistoryList";
import { CreateSosFromCallDrawer } from "../../components/test/CreateSosFromCallDrawerProps ";
import { CreateManualSosModal } from "../../components/test/CreateManualSosModal";


export default function HotlineOperatorDashboard() {
  const [selectedCallEventId, setSelectedCallEventId] = useState<string | null>(
    null
  );
  const [manualModalOpen, setManualModalOpen] = useState(false);
  // Đổi key để ép Tabs (và các list con) remount, load lại data ngay sau khi tạo SOS
  // thay vì đợi tới lượt polling tiếp theo (tối đa 6s).
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setSelectedCallEventId(null);
    setManualModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-600">
          Bảng điều khiển Hotline
        </h1>
        <Button
          icon={<PhoneCall size={16} />}
          onClick={() => setManualModalOpen(true)}
        >
          Tạo SOS thủ công
        </Button>
      </div>

      <Tabs
        key={refreshKey}
        items={[
          {
            key: "pending",
            label: "Đang chờ",
            children: <PendingCallsList onSelectCall={setSelectedCallEventId} />,
          },
          {
            key: "history",
            label: "Lịch sử",
            children: <CallHistoryList />,
          },
        ]}
      />

      <CreateSosFromCallDrawer
        callEventId={selectedCallEventId}
        onClose={() => setSelectedCallEventId(null)}
        onCreated={handleCreated}
      />

      <CreateManualSosModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}