import { useEffect, useRef } from "react"
import { onMessage } from "firebase/messaging"
import { messaging } from "../firebase"
import { useAuth } from "../features/auth/hooks/useAuth"
import { requestNotificationPermission } from "../utils/firebaseNotification"

export const useFirebaseNotification = () => {
  const { isAuthenticated } = useAuth()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioUnlockedRef = useRef(false)

  // Unlock audio khi user click lần đầu vào trang
  useEffect(() => {
    const unlock = () => {
      if (audioUnlockedRef.current) return
      const silent = new Audio("/sounds/alert.mp3")
      silent.volume = 0
      silent.play().then(() => {
        silent.pause()
        audioUnlockedRef.current = true
        console.log("🔊 Audio unlocked")
      }).catch(() => {})
      window.removeEventListener("click", unlock)
    }
    window.addEventListener("click", unlock)
    return () => window.removeEventListener("click", unlock)
  }, [])

  // Xin quyền + đăng ký FCM token khi đã login
  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission()
    }
  }, [isAuthenticated])

  // Lắng nghe notification khi tab đang mở (foreground)
  useEffect(() => {
    if (!isAuthenticated) return

    const stopAlert = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const startAlert = () => {
      stopAlert()
      const playSound = () => {
        const audio = new Audio("/sounds/alert.mp3")
        audio.volume = 0.8
        console.log("🔊 Playing alert sound...")
        audio.play()
          .then(() => console.log("✅ Sound played!"))
          .catch(err => console.error("❌ Sound failed:", err))
      }
      playSound()
      intervalRef.current = setInterval(playSound, 5000)
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground message:", payload)
      startAlert()

      if (Notification.permission === "granted") {
        const notif = new Notification(
          payload.notification?.title ?? "⚠️ Cảnh báo lũ lụt",
          {
            body: payload.notification?.body,
            icon: "/logo.png",
            requireInteraction: true,
          }
        )
        // Dừng âm thanh khi user tương tác với notification
        notif.onclick = () => { stopAlert(); notif.close(); window.focus() }
        notif.onclose = () => { stopAlert() }
      }
    })

    return () => {
      unsubscribe()
      stopAlert()
    }
  }, [isAuthenticated])
}