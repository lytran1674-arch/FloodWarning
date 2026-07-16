// hooks/useAlarmHistory.ts
import { useState, useCallback, useEffect } from "react";
import type { Alarm } from "../type/notificationType";
import { notificationApi } from "../api/notificationApi";

export function useAlarmHistory() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getAlarms();
      setAlarms(data);
    } catch (err) {
      console.error("Lỗi lấy lịch sử alarm:", err);
      setError("Không thể tải lịch sử cảnh báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  return { alarms, loading, error, refetch: fetchAlarms };
}