import { useCallback, useEffect, useRef, useState } from "react"
import { alertService } from "../services/alertService"
import type { PopupAlert } from "../types/alertType"

// Khoảng thời gian gọi lại API /alert/popup định kỳ để nhận cảnh báo mới
// trong lúc người dùng đang mở ứng dụng (ngoài lần gọi đầu khi mount).
const POLL_INTERVAL_MS = 60 * 1000 // 60 giây

export const useAlertPopup = (enabled: boolean) => {
  // Hàng đợi các popup PENDING chưa hiển thị/đóng
  const [queue, setQueue] = useState<PopupAlert[]>([])
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tránh việc polling ghi đè mất các alert đang chờ hiển thị nếu id đã có
  // sẵn trong queue hiện tại (không thêm trùng).
  const queueIdsRef = useRef<Set<string>>(new Set())

  const fetchPopupAlerts = useCallback(async () => {
    try {
      const result = await alertService.getPopupAlert()
      const newOnes = result.filter((a) => !queueIdsRef.current.has(a.id))
      if (newOnes.length === 0) return

      newOnes.forEach((a) => queueIdsRef.current.add(a.id))
      setQueue((prev) => [...prev, ...newOnes])
    } catch (err) {
      console.error("[Alert popup] Lỗi khi lấy cảnh báo:", err)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Gọi ngay khi mount / khi user vừa đăng nhập
    fetchPopupAlerts()

    // Gọi định kỳ để bắt cảnh báo mới trong lúc app vẫn đang mở
    const timer = setInterval(fetchPopupAlerts, POLL_INTERVAL_MS)

    // Gọi lại ngay khi tab được mở lại (quay lại từ tab khác/minimize),
    // vì trong lúc tab ẩn có thể đã có cảnh báo mới phát sinh.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchPopupAlerts()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [enabled, fetchPopupAlerts])

  // Popup đang hiển thị luôn là phần tử đầu tiên trong hàng đợi
  const current = queue[0] ?? null

  // Đóng popup hiện tại: gọi API đánh dấu đã đọc, rồi chuyển sang popup kế tiếp.
  const closeCurrent = useCallback(async () => {
    if (!current) return
    setClosing(true)
    setError(null)
    try {
      await alertService.markAlertRead(current.id)
      queueIdsRef.current.delete(current.id)
      setQueue((prev) => prev.slice(1))
    } catch (err) {
      console.error("[Alert popup] Lỗi khi đánh dấu đã đọc:", err)
      setError("Không thể đánh dấu đã đọc, vui lòng thử lại")
    } finally {
      setClosing(false)
    }
  }, [current])

  return {
    current,
    remainingCount: queue.length,
    closing,
    error,
    closeCurrent,
  }
}