// features/hotline/hooks/usePendingCallEvents.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { DetailHotlineCall } from "../../types/emergencyType";
import { emergencyApi } from "../../api/emergencyApi";


// Đây là hàng đợi real-time nên cần polling định kỳ để người trực hotline
// thấy cuộc gọi mới mà không phải tự bấm làm mới liên tục.
const POLL_INTERVAL_MS = 6000;

interface UsePendingCallEventsResult {
  calls: DetailHotlineCall[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePendingCallEvents(): UsePendingCallEventsResult {
  const [calls, setCalls] = useState<DetailHotlineCall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCalls = useCallback(async (showLoading: boolean) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await emergencyApi.listPendingCallEvents();
      setCalls(data);
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Không thể tải danh sách cuộc gọi."
      );
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls(true);
    intervalRef.current = setInterval(() => fetchCalls(false), POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchCalls]);

  return { calls, isLoading, error, refetch: () => fetchCalls(true) };
}