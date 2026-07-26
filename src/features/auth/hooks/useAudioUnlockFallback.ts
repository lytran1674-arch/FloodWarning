// src/features/auth/hooks/useAudioUnlockFallback.ts
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setAudioUnlocked } from "../store/authSlice";
import { unlockAudioContext } from "../utils/audioUnlock";
import type { RootState } from "@/app/store";

export function useAudioUnlockFallback() {
  const dispatch = useDispatch();
  const audioUnlocked = useSelector((s: RootState) => s.auth.audioUnlocked);

  useEffect(() => {
    if (audioUnlocked) return; // đã unlock (giả định) thì thôi

    const handler = () => {
      const ok = unlockAudioContext();
      dispatch(setAudioUnlocked(ok));
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };

    window.addEventListener("click", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true }); // phòng trường hợp user chỉ dùng bàn phím
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [audioUnlocked, dispatch]);
}