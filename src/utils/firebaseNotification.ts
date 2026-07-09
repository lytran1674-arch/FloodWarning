// services/fcmService.ts
import axios from "axios";
import { getToken, deleteToken } from "firebase/messaging";
import { messaging } from "../firebase";

const API_URL = "https://api-lulut.io.vn/notification/token";

const PENDING_TOKEN_KEY = "pending_fcm_token";
const SAVED_TOKEN_KEY = "fcm_token";
const SAVED_USER_KEY = "fcm_token_owner";

const SW_PATH = "/firebase-messaging-sw.js";

const VAPID_KEY =
  "BJpZLQUn5cvE-lotcGk9C-1eu8SOI7y_9vANyUtPJD9pIVUMkIsAjXfhUBjYhiUfcURJMK_JwBn2gwBw61Ogw0g";

// =========================
// GỬI TOKEN LÊN BACKEND
// =========================
const sendTokenToBackend = async (
  token: string,
  accessToken: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      API_URL,
      { token },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Đăng ký FCM thành công cho user:", userId, response.data);

    localStorage.setItem(SAVED_TOKEN_KEY, token);
    localStorage.setItem(SAVED_USER_KEY, userId);
    localStorage.removeItem(PENDING_TOKEN_KEY);

    return true;
  } catch (error: any) {
    console.error("FCM SEND ERROR:", error);
    console.error("SERVER RESPONSE:", error?.response?.data);
    return false;
  }
};

// Đăng ký / lấy Service Worker registration - dùng chung cho cả getToken và cleanup
const getSwRegistration = async (): Promise<ServiceWorkerRegistration> => {
  const existing = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (existing) return existing;

  const registration = await navigator.serviceWorker.register(SW_PATH);
  await navigator.serviceWorker.ready;
  return registration;
};

// Xóa toàn bộ IndexedDB database mà Firebase SDK dùng để cache token/installation ID.
// Đây là bước quyết định để ép SDK gọi lại Push Service thực sự ở lần getToken() tiếp theo,
// thay vì trả về giá trị đã cache nội bộ (nguyên nhân chính khiến token cũ bị tái sử dụng
// cho user khác trên cùng thiết bị).
const clearFirebaseIndexedDB = async (): Promise<void> => {
  const dbNames = [
    "firebase-messaging-database",
    "firebase-installations-database",
  ];

  for (const dbName of dbNames) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = () => {
          console.log(`Đã xóa IndexedDB: ${dbName}`);
          resolve();
        };
        req.onerror = () => reject(req.error);
        req.onblocked = () => {
          console.warn(`Xóa ${dbName} bị block (có tab khác đang mở), vẫn tiếp tục.`);
          resolve();
        };
      });
    } catch (err) {
      console.error(`Lỗi khi xóa IndexedDB ${dbName}:`, err);
    }
  }
};

// =========================
// XIN QUYỀN + LẤY TOKEN
// =========================
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    let registration: ServiceWorkerRegistration;
    try {
      registration = await getSwRegistration();
    } catch (swError) {
      console.error("Đăng ký Service Worker thất bại:", swError);
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("Không lấy được FCM Token");
      return null;
    }

    console.log("FCM TOKEN:", token);

    const accessToken = localStorage.getItem("accessToken");
    const currentUserId = localStorage.getItem("userId");

    if (!accessToken) {
      console.log("Chưa đăng nhập, lưu FCM token tạm.");
      localStorage.setItem(PENDING_TOKEN_KEY, token);
      return token;
    }

    const savedToken = localStorage.getItem(SAVED_TOKEN_KEY);
    const savedUserId = localStorage.getItem(SAVED_USER_KEY);

    if (savedToken === token && savedUserId === currentUserId) {
      console.log("Token này đã được đăng ký đúng cho user hiện tại, bỏ qua.");
      return token;
    }

    await sendTokenToBackend(token, accessToken, currentUserId ?? "");

    return token;
  } catch (error: any) {
    console.error("FCM ERROR:", error);
    console.error("SERVER:", error?.response?.data);
    return null;
  }
};

// =========================
// FLUSH PENDING TOKEN — gọi ngay sau khi đăng nhập thành công
// =========================
export const flushPendingFcmToken = async (
  accessToken: string,
  userId: string
): Promise<void> => {
  const pendingToken = localStorage.getItem(PENDING_TOKEN_KEY);
  const tokenToSend = pendingToken ?? localStorage.getItem(SAVED_TOKEN_KEY);

  if (!tokenToSend) {
    console.log("Không có FCM token nào để gửi.");
    return;
  }

  const savedToken = localStorage.getItem(SAVED_TOKEN_KEY);
  const savedUserId = localStorage.getItem(SAVED_USER_KEY);

  if (savedToken === tokenToSend && savedUserId === userId) {
    console.log("Token đã đăng ký đúng cho user này.");
    return;
  }

  const success = await sendTokenToBackend(tokenToSend, accessToken, userId);

  if (success) {
    console.log("Đã gửi/cập nhật FCM token cho user:", userId);
  }
};

// =========================
// XÓA TOKEN + UNREGISTER SW + XÓA CACHE KHI LOGOUT
// Thứ tự bắt buộc:
// 1. Unsubscribe Push Subscription tường minh (cấp trình duyệt)
// 2. deleteToken() để Firebase server hủy token
// 3. Unregister Service Worker
// 4. Xóa IndexedDB cache riêng của Firebase SDK (bước quyết định, xem giải thích ở trên)
// 5. Xóa localStorage
// Thiếu bước 4 là lý do phổ biến nhất khiến token cũ vẫn bị tái sử dụng cho user mới.
// =========================
export const clearFcmTokenOnLogout = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.getRegistration(SW_PATH);

    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const unsubscribed = await subscription.unsubscribe();
        console.log("Push subscription unsubscribed:", unsubscribed);
      }
    }

    await deleteToken(messaging);
  } catch (error) {
    console.error("Lỗi khi xóa FCM token khỏi Firebase:", error);
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
    if (registration) {
      await registration.unregister();
      console.log("Đã unregister Service Worker FCM.");
    }
  } catch (error) {
    console.error("Lỗi khi unregister Service Worker:", error);
  }

  await clearFirebaseIndexedDB();

  localStorage.removeItem(SAVED_TOKEN_KEY);
  localStorage.removeItem(SAVED_USER_KEY);
  localStorage.removeItem(PENDING_TOKEN_KEY);
};