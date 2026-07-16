// features/hotline/components/PendingCallsList.tsx
import { PhoneIncoming, Clock, RefreshCw } from "lucide-react";
import { Button, Empty, Spin } from "antd";
import { usePendingCallEvents } from "../../hooks/test/usePendingCallEvents";


interface PendingCallsListProps {
  onSelectCall: (callEventId: string) => void;
}

export function PendingCallsList({ onSelectCall }: PendingCallsListProps) {
  const { calls, isLoading, error, refetch } = usePendingCallEvents();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">
          Cuộc gọi đang chờ ({calls.length})
        </h3>
        <Button size="small" icon={<RefreshCw size={14} />} onClick={refetch}>
          Làm mới
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading && calls.length === 0 && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoading && calls.length === 0 && (
        <Empty description="Không có cuộc gọi nào đang chờ" />
      )}

      <div className="space-y-2">
        {calls.map((call) => (
          <button
            key={call.id}
            type="button"
            onClick={() => onSelectCall(call.id)}
            className="w-full text-left border rounded-xl p-3 hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <PhoneIncoming size={16} className="text-red-500" />
                {call.callerPhoneNumber}
              </div>

              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                Chờ tạo SOS
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              {new Date(call.createdAt).toLocaleString("vi-VN")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}