import { useEffect, useRef } from "react"
import { onMessage } from "firebase/messaging"
import { messaging } from "../firebase"
import { useAuth } from "../features/auth/hooks/useAuth"
import { requestNotificationPermission } from "../utils/firebaseNotification"

export const useFirebaseNotification = () => {
  const { isAuthenticated } = useAuth()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const unlockedRef = useRef(false)

  // Khởi tạo audio object 1 lần duy nhất
  useEffect(() => {
    const audio = new Audio("/sounds/alert.mp3")
    audio.preload = "auto"
    audio.volume = 0.8
    audioRef.current = audio

    // Unlock khi user click bất kỳ đâu
    const unlock = () => {
      if (unlockedRef.current) return
      audio.play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          unlockedRef.current = true
          console.log("🔊 Audio unlocked!")
          document.removeEventListener("click", unlock)
          document.removeEventListener("keydown", unlock)
        })
        .catch(() => {})
    }

    document.addEventListener("click", unlock)
    document.addEventListener("keydown", unlock)

    return () => {
      document.removeEventListener("click", unlock)
      document.removeEventListener("keydown", unlock)
      audio.pause()
    }
  }, [])

  // Xin quyền + đăng ký FCM token
  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission()
    }
  }, [isAuthenticated])

  // Lắng nghe notification foreground
  useEffect(() => {
    if (!isAuthenticated) return

    const stopAlert = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }

    const playSound = () => {
      const audio = audioRef.current
      if (!audio) return
      if (!unlockedRef.current) {
        console.warn("⚠️ Audio chưa unlock — user chưa click vào trang")
        return
      }
      audio.currentTime = 0
      audio.play()
        .then(() => console.log("✅ Sound played!"))
        .catch(err => console.error("❌ Sound failed:", err.name))
    }

    const startAlert = () => {
      stopAlert()
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
            body: payload.notification?.body ?? "Có cảnh báo mới trong khu vực của bạn",
            icon: "/logo.png",
            requireInteraction: true,
          }
        )
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