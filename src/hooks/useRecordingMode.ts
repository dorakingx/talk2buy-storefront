"use client";

import { useEffect, useSyncExternalStore } from "react";

function getRecordingFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("recording") === "1";
}

function subscribeRecording(cb: () => void) {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
}

export function useRecordingMode(): boolean {
  const recording = useSyncExternalStore(
    subscribeRecording,
    getRecordingFromUrl,
    () => false
  );

  useEffect(() => {
    if (recording) {
      document.documentElement.classList.add("recording-mode");
    } else {
      document.documentElement.classList.remove("recording-mode");
    }
    return () => document.documentElement.classList.remove("recording-mode");
  }, [recording]);

  return recording;
}
