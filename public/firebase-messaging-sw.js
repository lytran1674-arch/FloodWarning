importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  const title = payload.notification?.title ?? "⚠️ Cảnh báo lũ lụt";
  const body  = payload.notification?.body  ?? "Có cảnh báo mới trong khu vực của bạn";

  // Chọn icon theo mức độ cảnh báo (nếu backend gửi kèm data)
  const level = payload.data?.level ?? ""; // "HIGH" | "MEDIUM" | "LOW"
  const icon =
    level === "HIGH"   ? "/icons/warning-high.png"  :
    level === "MEDIUM" ? "/icons/warning-medium.png" :
    "/logo.png";

  self.registration.showNotification(title, {
    body,
    icon,
    badge:             "/icons/badge.png",   // 72x72px icon trắng trên thanh thông báo
    tag:               "flood-warning",      // gộp các noti cùng loại, không spam
    renotify:          true,                 // vẫn rung/kêu dù cùng tag
    requireInteraction: true,                // không tự tắt, user phải bấm
    vibrate:           [200, 100, 200],      // rung: 200ms - nghỉ 100ms - rung 200ms
    actions: [
      { action: "view",    title: "📍 Xem bản đồ" },
      { action: "dismiss", title: "Bỏ qua"         },
    ],
    data: {
      url: "/dashboard", // URL mở khi click notification
      ...payload.data,
    },
  });
});

// Xử lý khi user click vào notification hoặc action button
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  // Mở tab hoặc focus tab đã mở
  const targetUrl = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Nếu đã có tab mở thì focus vào
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      // Chưa có tab thì mở mới
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});