import { useCallback, useEffect, useState } from "react";

import type { SupportRequestItem, Status } from "../types/provinceType";
import { provinceApi } from "../api/provinceApi";

export function useSupportRequestList(status: Status) {
  const [items, setItems] = useState<SupportRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await provinceApi.getRequestSupport(status);
      setItems(res?.content ?? []);
      setTotalElements(res?.page?.totalElements ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, loading, error, totalElements, refetch: fetchList };
}