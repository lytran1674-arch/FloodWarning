// features/hotline/components/CallHistoryList.tsx
import { History, PhoneOutgoing } from "lucide-react";
import { Empty, Spin } from "antd";
import { useCallHistory } from "../../hooks/test/useCallHistory";


export function CallHistoryList() {
  const { calls, isLoading, error } = useCallHistory("MATCHED");

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-700 flex items-center gap-2">
        <History size={16} />
        Cuộc gọi đã tạo SOS
      </h3>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoading && calls.length === 0 && (
        <Empty description="Chưa có cuộc gọi nào được xử lý" />
      )}

      <div className="space-y-2">
        {calls.map((call) => (
          <div key={call.id} className="border rounded-xl p-3">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <PhoneOutgoing size={16} className="text-green-600" />
              {call.callerPhoneNumber}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {call.teamName} · {new Date(call.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}