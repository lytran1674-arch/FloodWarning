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
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  return { alarms, loading, error, refetch: fetchAlarms };
}