// src/services/fcmService.ts
import axios                          from "axios"
import { getMessaging, getToken, deleteToken, isSupported } from "firebase/messaging"
import { app }                        from "../firebase"

// ── Constants ──
const API_URL          = "https://api-lulut.io.vn/notification/token"
const VAPID_KEY        = "BJpZLQUn5cvE-lotcGk9C-1eu8SOI7y_9vANyUtPJD9pIVUMkIsAjXfhUBjYhiUfcURJMK_JwBn2gwBw61Ogw0g"
const SW_PATH          = "/firebase-messaging-sw.js"
const KEY_TOKEN        = "fcm_token"
const KEY_OWNER        = "fcm_token_owner"
const KEY_PENDING      = "pending_fcm_token"

// ── Lấy messaging instance an toàn ──
const getMessagingInstance = async () => {
  const supported = await isSupported()
  if (!supported) return null
  return getMessaging(app)
}

// ── Lấy / đăng ký Service Worker ──
const getSwRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  try {
    const existing = await navigator.serviceWorker.getRegistration(SW_PATH)
    if (existing) return existing

    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" })
    await navigator.serviceWorker.ready
    console.log("[FCM] SW registered:", reg.scope)
    return reg
  } catch (err) {
    console.error("[FCM] SW registration failed:", err)
    return null
  }
}

// ── Xóa IndexedDB cache của Firebase (bắt buộc khi logout) ──
const clearFirebaseIndexedDB = async (): Promise<void> => {
  const dbNames = [
    "firebase-messaging-database",
    "firebase-installations-database",
  ]
  for (const dbName of dbNames) {
    try {
      await new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase(dbName)
        req.onsuccess  = () => { console.log(`[FCM] Cleared IndexedDB: ${dbName}`); resolve() }
        req.onerror    = () => { console.error(`[FCM] Failed to clear: ${dbName}`); resolve() }
        req.onblocked  = () => { console.warn(`[FCM] Blocked clearing: ${dbName}`); resolve() }
      })
    } catch (err) {
      console.error("[FCM] IndexedDB error:", err)
    }
  }
}

// ── Gửi token lên backend ──
const sendTokenToBackend = async (
  token:       string,
  accessToken: string,
  userId:      string,
): Promise<boolean> => {
  try {
    const res = await axios.post(
      API_URL,
      { token },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    )
    console.log("[FCM] Token registered for user:", userId, res.data)
    localStorage.setItem(KEY_TOKEN,  token)
    localStorage.setItem(KEY_OWNER,  userId)
    localStorage.removeItem(KEY_PENDING)
    return true
  } catch (err: any) {
    console.error("[FCM] Send token error:", err?.response?.data ?? err)
    return false
  }
}

// ════════════════════════════════════════════
// XIN QUYỀN + LẤY TOKEN
// accessToken và userId truyền từ ngoài vào
// (không tự lấy từ localStorage để tránh race condition)
// ════════════════════════════════════════════
export const requestNotificationPermission = async (
  accessToken?: string,
  userId?:      string,
): Promise<string | null> => {
  // Kiểm tra browser support
  const messaging = await getMessagingInstance()
  if (!messaging) {
    console.warn("[FCM] Browser not supported")
    return null
  }

  // Xin quyền
  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    console.log("[FCM] Permission denied")
    return null
  }

  // Lấy SW registration
  const registration = await getSwRegistration()
  if (!registration) return null

  // Lấy token
  let token: string
  try {
    token = await getToken(messaging, {
      vapidKey:                    VAPID_KEY,
      serviceWorkerRegistration:   registration,
    })
  } catch (err) {
    console.error("[FCM] getToken error:", err)
    return null
  }

  if (!token) {
    console.warn("[FCM] Empty token received")
    return null
  }

  console.log("[FCM] Token:", token)

  // Chưa đăng nhập → lưu pending
  if (!accessToken || !userId) {
    console.log("[FCM] Not logged in — saving pending token")
    localStorage.setItem(KEY_PENDING, token)
    return token
  }

  // Đã có token đúng user → bỏ qua
  const savedToken  = localStorage.getItem(KEY_TOKEN)
  const savedOwner  = localStorage.getItem(KEY_OWNER)
  if (savedToken === token && savedOwner === userId) {
    console.log("[FCM] Token already registered for this user")
    return token
  }

  // Gửi lên backend
  await sendTokenToBackend(token, accessToken, userId)
  return token
}

// ════════════════════════════════════════════
// FLUSH PENDING TOKEN — gọi ngay sau login
// ════════════════════════════════════════════
export const flushPendingFcmToken = async (
  accessToken: string,
  userId:      string,
): Promise<void> => {
  const pending = localStorage.getItem(KEY_PENDING)
  const saved   = localStorage.getItem(KEY_TOKEN)
  const token   = pending ?? saved

  if (!token) {
    // Chưa có token nào → xin lấy mới
    await requestNotificationPermission(accessToken, userId)
    return
  }

  // Đã đúng user → bỏ qua
  if (saved === token && localStorage.getItem(KEY_OWNER) === userId) {
    console.log("[FCM] Token already correct for this user")
    return
  }

  await sendTokenToBackend(token, accessToken, userId)
}

// ════════════════════════════════════════════
// XÓA TOKEN KHI LOGOUT
// ════════════════════════════════════════════
export const clearFcmTokenOnLogout = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.getRegistration(SW_PATH)
    if (registration) {
      const sub = await registration.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
    }

    const messaging = await getMessagingInstance()
    if (messaging) await deleteToken(messaging)
  } catch (err) {
    console.error("[FCM] Delete token error:", err)
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_PATH)
    if (reg) {
      await reg.unregister()
      console.log("[FCM] SW unregistered")
    }
  } catch (err) {
    console.error("[FCM] SW unregister error:", err)
  }

  await clearFirebaseIndexedDB()

  localStorage.removeItem(KEY_TOKEN)
  localStorage.removeItem(KEY_OWNER)
  localStorage.removeItem(KEY_PENDING)

  console.log("[FCM] Cleanup complete")
}