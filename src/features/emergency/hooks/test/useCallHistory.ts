// features/hotline/hooks/useCallHistory.ts
import { useCallback, useEffect, useState } from "react";
import type { DetailHotlineCall, HotlineCallStatus } from "../../types/emergencyType";
import { emergencyApi } from "../../api/emergencyApi";


interface UseCallHistoryResult {
  calls: DetailHotlineCall[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCallHistory(status: HotlineCallStatus): UseCallHistoryResult {
  const [calls, setCalls] = useState<DetailHotlineCall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await emergencyApi.listCallHistory(status);
      setCalls(data);
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Không thể tải lịch sử cuộc gọi."
      );
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { calls, isLoading, error, refetch: fetchHistory };
}