import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging"; // <-- thêm dòng này

const firebaseConfig = {
  apiKey: "AIzaSyAVpeDnSbKLCcB97U-8iNxa7siDz8OCbts",
  authDomain: "lulut-notification.firebaseapp.com",
  projectId: "lulut-notification",
  storageBucket: "lulut-notification.firebasestorage.app",
  messagingSenderId: "759133098871",
  appId: "1:759133098871:web:9c6c661ab034c458094772",
  measurementId: "G-J771KEFP8D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app); // <-- thêm dòng này

// Export messaging để dùng ở nơi khác
export { analytics, messaging }; // <-- sửa export
// hoặc export riêng: export const messaging = getMessaging(app);