"use client";

type Listener = (now: Date) => void;

let listeners = new Set<Listener>();
let rafId: number | null = null;
let lastTickSecond = -1;

function loop() {
  const now = new Date();
  const sec = Math.floor(now.getTime() / 1000);
  if (sec !== lastTickSecond) {
    lastTickSecond = sec;
    for (const fn of listeners) fn(now);
  }
  rafId = requestAnimationFrame(loop);
}

export function subscribeTick(fn: Listener): () => void {
  listeners.add(fn);
  if (rafId === null && typeof window !== "undefined") {
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
