// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAVpeDnSbKLCcB97U-8iNxa7siDz8OCbts",
  authDomain: "lulut-notification.firebaseapp.com",
  projectId: "lulut-notification",
  storageBucket: "lulut-notification.firebasestorage.app",
  messagingSenderId: "759133098871",
  appId: "1:759133098871:web:9c6c661ab034c458094772",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 [SW] Full payload:", JSON.stringify(payload, null, 2));

  const title = payload.notification?.title ?? "⚠️ Cảnh báo lũ lụt";
  const body =
    payload.notification?.body ?? "Có cảnh báo mới trong khu vực của bạn";

  const level = payload.data?.level ?? ""; // "HIGH" | "MEDIUM" | "LOW"

  // Backend có thể trả area_id (snake_case) hoặc areaId (camelCase) -> đọc cả 2 cho chắc
  const areaId = payload.data?.areaId ?? payload.data?.area_id ?? "";

  const icon =
    level === "HIGH"
      ? "/icons/warning-high.png"
      : level === "MEDIUM"
      ? "/icons/warning-medium.png"
      : "/logo.png";

  // QUAN TRỌNG: tag phải UNIQUE cho từng message để đảm bảo
  // mỗi message đều hiện noti + phát âm riêng, không bị OS gộp/đè
  // (nếu 2 tag trùng nhau đến gần nhau, một số OS chỉ update noti cũ,
  // không đảm bảo phát âm lại)
  const tag = `flood-warning-${areaId || "unknown"}-${Date.now()}`;

  const requireInteraction = level === "HIGH";

  const notificationOptions = {
    body,
    icon,
    badge: "/icons/badge.png",
    tag,
    renotify: true, // vẫn giữ để mỗi noti mới đều rung/phát âm dù trùng tag trong trường hợp hiếm
    requireInteraction,
    silent: false, // bắt buộc để phát âm thanh mặc định của OS
    vibrate:
      level === "HIGH"
        ? [300, 100, 300, 100, 300] // rung mạnh/dài hơn cho mức cao
        : [200, 100, 200],
    actions: [
      { action: "view", title: "📍 Xem bản đồ" },
      { action: "dismiss", title: "Bỏ qua" },
    ],
    data: {
      url: "https://tranthitrucly.io.vn/dashboard",
      areaId,
      level,
      ...payload.data,
    },
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});