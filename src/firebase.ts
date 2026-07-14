// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getMessaging, isSupported } from "firebase/messaging"

const firebaseConfig = {
  apiKey:            "AIzaSyAVpeDnSbKLCcB97U-8iNxa7siDz8OCbts",
  authDomain:        "lulut-notification.firebaseapp.com",
  projectId:         "lulut-notification",
  storageBucket:     "lulut-notification.firebasestorage.app",
  messagingSenderId: "759133098871",
  appId:             "1:759133098871:web:9c6c661ab034c458094772",
  measurementId:     "G-J771KEFP8D",
}

const app = initializeApp(firebaseConfig)

// ✅ Kiểm tra browser có hỗ trợ messaging không trước khi khởi tạo
// tránh crash trên Safari / trình duyệt cũ
let messaging: ReturnType<typeof getMessaging> | null = null

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app)
  } else {
    console.warn("[FCM] Trình duyệt không hỗ trợ Firebase Messaging")
  }
})

export { app, messaging }