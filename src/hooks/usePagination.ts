import { useEffect, useMemo, useState } from "react";

export const usePagination = <T,>(data: T[] = [], pageSize = 5) => {
  const [page, setPage] = useState(1);

  const safeData = Array.isArray(data) ? data : [];

  const totalPages = Math.ceil(safeData.length / pageSize);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return safeData.slice(start, start + pageSize);
  }, [safeData, page, pageSize]);

  useEffect(() => {
    if (totalPages === 0) {
      setPage(1);
    } else if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

      useEffect(() => {
  setPage(1);
}, [safeData]);
  return {
    page,
    setPage,
    totalPages,
    paginated,
  };
};