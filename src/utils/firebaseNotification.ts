import axios from "axios";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

const API_URL = "https://api-lulut.io.vn/notification/token";

export const requestNotificationPermission = async () => {
  try {
    // Xin quyền thông báo
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Đăng ký Service Worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    await navigator.serviceWorker.ready;

    // Lấy FCM Token
    const token = await getToken(messaging, {
      vapidKey:
        "BJpZLQUn5cvE-lotcGk9C-1eu8SOI7y_9vANyUtPJD9pIVUMkIsAjXfhUBjYhiUfcURJMK_JwBn2gwBw61Ogw0g",
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("Không lấy được FCM Token");
      return null;
    }

    console.log("FCM TOKEN:", token);

    // Lưu token tạm để dùng sau khi đăng nhập
    localStorage.setItem("pending_fcm_token", token);

    const accessToken = localStorage.getItem("accessToken");

    // Chưa đăng nhập thì chỉ lưu token
    if (!accessToken) {
      console.log("Chưa đăng nhập, lưu FCM token tạm.");
      return token;
    }

    // Token đã gửi rồi thì bỏ qua
    const savedToken = localStorage.getItem("fcm_token");

    if (savedToken === token) {
      console.log("FCM token đã được đăng ký.");
      return token;
    }

    // Gửi lên backend
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

    console.log("Đăng ký FCM thành công:", response.data);

    // Chỉ lưu sau khi gửi thành công
    localStorage.setItem("fcm_token", token);
    localStorage.removeItem("pending_fcm_token");

    return token;
  } catch (error: any) {
    console.error("FCM ERROR:", error);
    console.error("SERVER:", error?.response?.data);
    return null;
  }
};