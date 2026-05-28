// src/hooks/usePagination.ts
import { useState, useMemo } from "react"

export function usePagination<T>(data: T[], pageSize = 5) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(data.length / pageSize)

  // Slice data theo trang hiện tại
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  // Reset về trang 1 khi data thay đổi
  const reset = () => setPage(1)

  return { page, setPage, totalPages, paginated, reset }
}