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
  const body = payload.notification?.body ?? "Có cảnh báo mới trong khu vực của bạn";

  const level = payload.data?.level ?? ""; // "HIGH" | "MEDIUM" | "LOW"
  const areaId = payload.data?.areaId ?? "";

  const icon =
    level === "HIGH" ? "/icons/warning-high.png" :
    level === "MEDIUM" ? "/icons/warning-medium.png" :
    "/logo.png";

  // Tag động theo khu vực -> cảnh báo khác khu vực không đè lên nhau
  const tag = areaId ? `flood-warning-${areaId}` : `flood-warning-${Date.now()}`;

  // Chỉ bắt buộc user phải tương tác (không tự tắt) với mức cảnh báo cao
  const requireInteraction = level === "HIGH";

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/icons/badge.png",
    tag,
    renotify: true,
    requireInteraction,
    silent: false, // QUAN TRỌNG: đảm bảo phát âm thanh mặc định của hệ điều hành, không cần chạm vào web
    vibrate: [200, 100, 200],
    actions: [
      { action: "view", title: "📍 Xem bản đồ" },
      { action: "dismiss", title: "Bỏ qua" },
    ],
    data: {
      url: "/dashboard",
      ...payload.data,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
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