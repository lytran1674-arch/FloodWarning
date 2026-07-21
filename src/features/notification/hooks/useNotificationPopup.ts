// hooks/useNotificationPopup.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { app } from "@/firebase";

import type { NotificationPopup } from "../type/notificationType";
import { useAppSelector } from "@/hooks/redux.hooks";
import { notificationApi } from "../api/notificationApi";
import { SoSAPI } from "@/features/sosrequest/api/sosApi";
import { useNavigate } from "react-router-dom";

// fallback, phòng trường hợp FCM rớt / không hỗ trợ trên trình duyệt
const FALLBACK_POLL_INTERVAL = 60000;

export function useNotificationPopup() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  const [queue, setQueue] = useState<NotificationPopup[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const unsubRef = useRef<(() => void) | null>(null);
  const navigate=useNavigate()

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

  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState("");

  // reset lỗi mỗi khi chuyển sang popup khác
  useEffect(() => {
    setClaimError("");
  }, [current?.id]);

  // const claimCurrent = useCallback(async () => {
  //   if (!current) return;
  //   setClaiming(true);
  //   setClaimError("");
  //   try {
  //     if (current.type === "SUPPORT_REQUEST_CALL_FAILED" && current.supportRequestId) {
  //       await SoSAPI.claimSupportRequestDispatcher(current.supportRequestId);
  //     } else if (current.sosId) {
  //       await SoSAPI.claimSosDispatcher(current.sosId);
  //     }
  //     await closeCurrent();
  //   } catch (err: any) {
  //     // Người khác đã nhận điều phối trước -> hiển thị lỗi cho người dùng,
  //     // để họ tự bấm nút Đóng (theo đúng spec bước 8)
  //     setClaimError(
  //       err?.response?.data?.message || "Đã có người khác nhận điều phối trước bạn."
  //     );
  //   } finally {
  //     setClaiming(false);
  //   }
  // }, [current, closeCurrent]);

  const claimCurrent = useCallback(async () => {
    if (!current) return;
    setClaiming(true);
    setClaimError("");

    const target = current;
    let claimFailed = false;
    let blockingError = "";

    try {
      if (target.type === "SUPPORT_REQUEST_CALL_FAILED" && target.supportRequestId) {
        await SoSAPI.claimSupportRequestDispatcher(target.supportRequestId);
      } else if (target.sosId) {
        await SoSAPI.claimSosDispatcher(target.sosId);
      }
    } catch (err: any) {
      claimFailed = true;
      // Chỉ chặn hẳn khi lỗi ghi rõ đã có người khác nhận trước.
      // Các lỗi khác (VD: bạn đã là dispatcher rồi) không chặn —
      // để màn phân công tự kiểm tra quyền khi thao tác thật sự.
      const message: string = err?.response?.data?.message || "";
      if (message.toLowerCase().includes("người khác") || message.toLowerCase().includes("đã nhận")) {
        blockingError = message;
      }
    }

    if (blockingError) {
      setClaimError(blockingError);
      setClaiming(false);
      return;
    }

    await closeCurrent();
    setClaiming(false);

    if (target.type === "SUPPORT_REQUEST_CALL_FAILED" && target.supportRequestId) {
      navigate(`/support-request/${target.sosId}/review`);
    } else if (target.sosId) {
      navigate(`/sos-assign/${target.sosId}`);
    }

    if (claimFailed) {
      // đã claim lỗi nhưng không phải do người khác giữ -> vẫn cho đi tiếp,
      // màn phân công sẽ tự báo lại nếu thực sự không có quyền
    }
  }, [current, closeCurrent, navigate]);
return {
    current,
    remainingCount: queue.length,
    closeCurrent,
    claimCurrent,
    claiming,
    claimError,
    audioRef,
  };
}