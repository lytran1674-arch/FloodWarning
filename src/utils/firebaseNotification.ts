import axios from "axios";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const requestNotificationPermission = async () => {
  try {
    // Xin quyền notification
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification denied");
      return;
    }

    // Đăng ký service worker TRƯỚC khi lấy token
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    await navigator.serviceWorker.ready;

    // Lấy FCM token
    const token = await getToken(messaging, {
      vapidKey:
        "BJpZLQUn5cvE-lotcGk9C-1eu8SOI7y_9vANyUtPJD9pIVUMkIsAjXfhUBjYhiUfcURJMK_JwBn2gwBw61Ogw0g",
      serviceWorkerRegistration: registration, // <-- thêm dòng này
    });

    if (!token) {
      console.log("Không lấy được FCM token");
      return;
    }

    console.log("FCM TOKEN:", token);

    // Chống gửi nhiều lần
    const savedFcmToken = localStorage.getItem("fcm_token");

    if (savedFcmToken === token) {
      console.log("FCM token already sent");
      return;
    }

    // Lấy JWT access token
    const accessToken = localStorage.getItem("accessToken") || "";

    console.log("ACCESS TOKEN:", accessToken);

    // Nếu chưa login thì không gửi
    if (!accessToken) {
      console.log("Không tìm thấy accessToken");
      return;
    }

    // Gửi token lên backend
    const response = await axios.post(
      "https://api-lulut.io.vn/notification/token",
      { token },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SEND TOKEN SUCCESS:", response.data);

    // Lưu token tránh spam
    localStorage.setItem("fcm_token", token);
  } catch (error: any) {
    console.error("FCM ERROR CODE:", error?.code);
    console.error("FCM ERROR MESSAGE:", error?.message);
    console.error("FULL ERROR:", error);
    console.error("SERVER RESPONSE:", error?.response?.data);
  }
};