// src/features/auth/utils/audioUnlock.ts
export function unlockAudioContext(): boolean {
  try {
    const audio = new Audio("/sounds/silence.mp3");
    audio.volume = 0;
    const p = audio.play();
    if (p) {
      p.then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    }

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      const ctx: AudioContext = new Ctx();
      if (ctx.state === "suspended") ctx.resume();
    }

    return true;
  } catch (e) {
    console.warn("Unlock audio failed:", e);
    return false;
  }
}