"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  loadDemoContext,
  type DemoStep,
  getCompletedSteps,
  DEMO_STEP_ORDER,
} from "@/lib/demo-storage";

function subscribe(callback: () => void) {
  window.addEventListener("talk2buy-demo-update", callback);
  return () => window.removeEventListener("talk2buy-demo-update", callback);
}

function getSnapshot(): DemoStep | null {
  return loadDemoContext()?.demoStep ?? null;
}

export function useDemoFlow() {
  const activeStep = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const completedSteps = activeStep ? getCompletedSteps(activeStep) : [];

  const stepIndex = activeStep
    ? DEMO_STEP_ORDER.indexOf(activeStep)
    : -1;

  return {
    activeStep,
    completedSteps,
    stepIndex,
  };
}

export function useDemoContext() {
  const getCtx = useCallback(() => loadDemoContext(), []);

  const ctx = useSyncExternalStore(
    subscribe,
    getCtx,
    () => null
  );

  return ctx;
}
