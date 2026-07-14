// src/hooks/useFirebaseNotification.ts
import { useEffect, useRef }      from "react"
import { getMessaging, onMessage } from "firebase/messaging"
import { isSupported }            from "firebase/messaging"
import { app }                    from "../firebase"
import { useAuth }                from "../features/auth/hooks/useAuth"
import { useAppSelector }         from "./redux.hooks"
import {
  requestNotificationPermission,
} from "../utils/firebaseNotification"

export const useFirebaseNotification = () => {
  const { isAuthenticated }  = useAuth()

  // ✅ Lấy token + userId từ Redux — không dùng localStorage
  const accessToken = useAppSelector(s => s.auth.accessToken)
  const user        = useAppSelector(s => s.auth.user)

  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef      = useRef<HTMLAudioElement | null>(null)
  const unlockedRef   = useRef(false)
  const unsubRef      = useRef<(() => void) | null>(null)

  // ── Khởi tạo audio 1 lần ──
  useEffect(() => {
    const audio = new Audio("/sounds/alert.mp3")
    audio.preload = "auto"
    audio.volume  = 0.8
    audioRef.current = audio

    const unlock = () => {
      if (unlockedRef.current) return
      audio.play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          unlockedRef.current = true
          console.log("[FCM] Audio unlocked")
          document.removeEventListener("click",   unlock)
          document.removeEventListener("keydown", unlock)
        })
        .catch(() => {})
    }

    document.addEventListener("click",   unlock)
    document.addEventListener("keydown", unlock)

    return () => {
      document.removeEventListener("click",   unlock)
      document.removeEventListener("keydown", unlock)
      audio.pause()
    }
  }, [])

  // ── Xin quyền + đăng ký token khi đăng nhập ──
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    // ✅ Truyền accessToken và userId vào trực tiếp
    requestNotificationPermission(
      accessToken,
      (user as any)?.id ?? (user as any)?.userId ?? ""
    )
  }, [isAuthenticated, accessToken])

  // ── Lắng nghe foreground message ──
  useEffect(() => {
    if (!isAuthenticated) return

    const setupListener = async () => {
      const supported = await isSupported()
      if (!supported) return

      const messaging = getMessaging(app)

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
          console.warn("[FCM] Audio not unlocked yet")
          return
        }
        audio.currentTime = 0
        audio.play()
          .then(() => console.log("[FCM] Sound played"))
          .catch(err => console.error("[FCM] Sound error:", err.name))
      }

      const startAlert = () => {
        stopAlert()
        playSound()
        intervalRef.current = setInterval(playSound, 5000)
      }

      // ✅ Lưu unsubscribe để cleanup đúng cách
      unsubRef.current = onMessage(messaging, (payload) => {
        console.log("[FCM] Foreground message:", payload)
        startAlert()

        if (Notification.permission === "granted") {
          const notif = new Notification(
            payload.notification?.title ?? "Canh bao lu lut",
            {
              body:                payload.notification?.body ?? "Co canh bao moi trong khu vuc cua ban",
              icon:                "/logo.png",
              requireInteraction:  true,
            }
          )
          notif.onclick = () => { stopAlert(); notif.close(); window.focus() }
          notif.onclose = () => { stopAlert() }
        }
      })
    }

    setupListener()

    return () => {
      unsubRef.current?.()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAuthenticated])
}