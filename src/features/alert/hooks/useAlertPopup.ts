// import { useCallback, useEffect, useRef, useState } from "react"
// import { alertService } from "../services/alertService"
// import type { PopupAlert } from "../types/alertType"

// // Khoảng thời gian gọi lại API /alert/popup định kỳ để nhận cảnh báo mới
// // trong lúc người dùng đang mở ứng dụng (ngoài lần gọi đầu khi mount).
// const POLL_INTERVAL_MS = 60 * 1000 // 60 giây

// export const useAlertPopup = (enabled: boolean) => {
//   // Hàng đợi các popup PENDING chưa hiển thị/đóng
//   const [queue, setQueue] = useState<PopupAlert[]>([])
//   const [closing, setClosing] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Tránh việc polling ghi đè mất các alert đang chờ hiển thị nếu id đã có
//   // sẵn trong queue hiện tại (không thêm trùng).
//   const queueIdsRef = useRef<Set<string>>(new Set())

//   const fetchPopupAlerts = useCallback(async () => {
//     try {
//       const result = await alertService.getPopupAlert()
//       const newOnes = result.filter((a) => !queueIdsRef.current.has(a.id))
//       if (newOnes.length === 0) return

//       newOnes.forEach((a) => queueIdsRef.current.add(a.id))
//       setQueue((prev) => [...prev, ...newOnes])
//     } catch (err) {
//       console.error("[Alert popup] Lỗi khi lấy cảnh báo:", err)
//     }
//   }, [])

//   useEffect(() => {
//     if (!enabled) return

//     // Gọi ngay khi mount / khi user vừa đăng nhập
//     fetchPopupAlerts()

//     // Gọi định kỳ để bắt cảnh báo mới trong lúc app vẫn đang mở
//     const timer = setInterval(fetchPopupAlerts, POLL_INTERVAL_MS)

//     // Gọi lại ngay khi tab được mở lại (quay lại từ tab khác/minimize),
//     // vì trong lúc tab ẩn có thể đã có cảnh báo mới phát sinh.
//     const onVisibilityChange = () => {
//       if (document.visibilityState === "visible") fetchPopupAlerts()
//     }
//     document.addEventListener("visibilitychange", onVisibilityChange)

//     return () => {
//       clearInterval(timer)
//       document.removeEventListener("visibilitychange", onVisibilityChange)
//     }
//   }, [enabled, fetchPopupAlerts])

//   // Popup đang hiển thị luôn là phần tử đầu tiên trong hàng đợi
//   const current = queue[0] ?? null

//   // Đóng popup hiện tại: gọi API đánh dấu đã đọc, rồi chuyển sang popup kế tiếp.
//   const closeCurrent = useCallback(async () => {
//     if (!current) return
//     setClosing(true)
//     setError(null)
//     try {
//       await alertService.markAlertRead(current.id)
//       queueIdsRef.current.delete(current.id)
//       setQueue((prev) => prev.slice(1))
//     } catch (err) {
//       console.error("[Alert popup] Lỗi khi đánh dấu đã đọc:", err)
//       setError("Không thể đánh dấu đã đọc, vui lòng thử lại")
//     } finally {
//       setClosing(false)
//     }
//   }, [current])

//   return {
//     current,
//     remainingCount: queue.length,
//     closing,
//     error,
//     closeCurrent,
//   }
// }


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

  // ── Âm thanh cảnh báo ──
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const unlockedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio("/sounds/alert.mp3")
    audio.loop = true
    audioRef.current = audio

    // Trình duyệt chặn autoplay nếu chưa có tương tác của người dùng trong
    // tab này — "mở khoá" bằng cách play() rồi pause() ngay khi người dùng
    // click/gõ phím lần đầu, để những lần play() thật sau đó không bị chặn.
    const unlock = () => {
      if (unlockedRef.current) return
      audio
        .play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          unlockedRef.current = true
        })
        .catch(() => {})
    }
    document.addEventListener("click", unlock)
    document.addEventListener("keydown", unlock)

    return () => {
      document.removeEventListener("click", unlock)
      document.removeEventListener("keydown", unlock)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const playAlertSound = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch((err) => console.warn("[Alert popup] Không phát được âm thanh:", err))
  }, [])

  const stopAlertSound = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

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

  // Phát âm thanh mỗi khi có popup mới lên hàng đầu; dừng khi hết hàng đợi.
  useEffect(() => {
    if (!current) {
      stopAlertSound()
      return
    }

    playAlertSound()

    // Notification gốc của trình duyệt KHÔNG bị chặn bởi autoplay policy
    // như <audio>, nên dùng làm phương án dự phòng để đảm bảo có âm thanh
    // ngay cả khi <audio> chưa unlock được. Nếu <audio> đã unlock rồi thì
    // không cần bắn thêm Notification nữa, tránh 2 tiếng chồng lên nhau.
    if (!unlockedRef.current && Notification.permission === "granted") {
      try {
        const notif = new Notification(current.title, {
          body: current.message,
          icon: "/logo.png",
        })
        notif.onclick = () => window.focus()
      } catch (err) {
        console.warn("[Alert popup] Không tạo được Notification:", err)
      }
    }
  }, [current, playAlertSound, stopAlertSound])

  // Đóng popup hiện tại: gọi API đánh dấu đã đọc, rồi chuyển sang popup kế tiếp.
  const closeCurrent = useCallback(async () => {
    if (!current) return
    stopAlertSound()
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
  }, [current, stopAlertSound])

  return {
    current,
    remainingCount: queue.length,
    closing,
    error,
    closeCurrent,
  }
}