// hooks/useNotificationPopup.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { app } from "@/firebase";

import type { NotificationPopup } from "../type/notificationType";
import { useAppSelector } from "@/hooks/redux.hooks";
import { notificationApi } from "../api/notificationApi";

// fallback, phòng trường hợp FCM rớt / không hỗ trợ trên trình duyệt
const FALLBACK_POLL_INTERVAL = 60000;

export function useNotificationPopup() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  const [queue, setQueue] = useState<NotificationPopup[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const unsubRef = useRef<(() => void) | null>(null);

  const current = queue[0] ?? null;

  const fetchPopups = useCallback(async () => {
    try {
      const data = await notificationApi.getPopupNotifications();
      const newOnes = data.filter((n) => !seenIds.current.has(n.id));
      if (newOnes.length > 0) {
        newOnes.forEach((n) => seenIds.current.add(n.id));
        setQueue((prev) => [...prev, ...newOnes]);
      }
    } catch (err) {
      console.error("Lỗi lấy notification popup:", err);
    }
  }, []);

  // reset khi logout
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setQueue([]);
      seenIds.current.clear();
    }
  }, [isAuthenticated, user]);

  // fetch lần đầu khi login + fallback polling định kỳ dài
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    fetchPopups();
    const interval = setInterval(fetchPopups, FALLBACK_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, fetchPopups]);

  // lắng nghe FCM để fetch lại ngay khi có alarm mới (real-time)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let cancelled = false;

    const setup = async () => {
      const supported = await isSupported();
      if (!supported || cancelled) return;

      const messaging = getMessaging(app);
      unsubRef.current = onMessage(messaging, () => {
        // FCM chỉ báo "có cảnh báo mới", lấy chi tiết đầy đủ qua API
        fetchPopups();
      });
    };

    setup();

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [isAuthenticated, user, fetchPopups]);

  // phát âm thanh khi có popup mới hiện lên
  useEffect(() => {
    if (current) {
      audioRef.current?.play().catch(() => {});
    }
  }, [current]);

  const closeCurrent = useCallback(async () => {
    if (!current) return;
    try {
      await notificationApi.closePopup(current.id);
    } catch (err) {
      console.error("Lỗi đóng popup:", err);
    } finally {
      setQueue((prev) => prev.slice(1));
    }
  }, [current]);

  return { current, remainingCount: queue.length, closeCurrent, audioRef };
}