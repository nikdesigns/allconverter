"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  ProcessingStage,
  ProcessingState,
  ProcessingConfig,
  FileInfo,
  OutputStat,
} from "./types";
import { PROCESSING_PRESETS } from "./presets";

const STAGE_PROGRESS: Record<ProcessingStage, number> = {
  idle:       0,
  uploaded:   10,
  analyzing:  28,
  processing: 52,
  optimizing: 74,
  generating: 90,
  complete:   100,
  error:      0,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function buildFileInfo(file: File): Promise<FileInfo> {
  return new Promise((resolve) => {
    const info: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ ...info, preview: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      resolve(info);
    }
  });
}

export interface UseProcessingOptions {
  config?: ProcessingConfig;
  category?: ProcessingConfig["category"];
}

export interface UseProcessingReturn {
  state: ProcessingState;
  setFile: (file: File) => Promise<void>;
  advance: (toStage: ProcessingStage, messageOverride?: string) => void;
  setProgress: (pct: number) => void;
  complete: (stats?: OutputStat[]) => void;
  error: (message: string) => void;
  reset: () => void;
  config: ProcessingConfig;
  formatBytes: typeof formatBytes;
}

const INITIAL_STATE: ProcessingState = {
  stage: "idle",
  progress: 0,
  currentMessage: "",
  file: null,
  stats: [],
  error: null,
  elapsedMs: 0,
};

export function useProcessing({
  config: configProp,
  category = "generic",
}: UseProcessingOptions = {}): UseProcessingReturn {
  const config = configProp ?? PROCESSING_PRESETS[category];
  const [state, setState] = useState<ProcessingState>(INITIAL_STATE);
  const startTimeRef = useRef<number | null>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick elapsed time while processing
  useEffect(() => {
    if (state.stage !== "idle" && state.stage !== "complete" && state.stage !== "error") {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setState(s => ({ ...s, elapsedMs: Date.now() - (startTimeRef.current ?? Date.now()) }));
        }, 100);
      }
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [state.stage]);

  const setFile = useCallback(async (file: File) => {
    startTimeRef.current = Date.now();
    const info = await buildFileInfo(file);
    setState({
      ...INITIAL_STATE,
      stage: "uploaded",
      progress: STAGE_PROGRESS.uploaded,
      currentMessage: config.messages.uploaded ?? "File loaded…",
      file: info,
      elapsedMs: 0,
    });
  }, [config]);

  const advance = useCallback((toStage: ProcessingStage, messageOverride?: string) => {
    setState(s => ({
      ...s,
      stage: toStage,
      progress: STAGE_PROGRESS[toStage],
      currentMessage: messageOverride ?? config.messages[toStage] ?? "",
    }));
  }, [config]);

  const setProgress = useCallback((pct: number) => {
    setState(s => ({ ...s, progress: Math.min(100, Math.max(0, pct)) }));
  }, []);

  const complete = useCallback((stats: OutputStat[] = []) => {
    setState(s => ({
      ...s,
      stage: "complete",
      progress: 100,
      currentMessage: config.messages.complete ?? "Complete",
      stats,
      elapsedMs: Date.now() - (startTimeRef.current ?? Date.now()),
    }));
  }, [config]);

  const error = useCallback((message: string) => {
    setState(s => ({
      ...s,
      stage: "error",
      progress: 0,
      error: message,
      currentMessage: "An error occurred",
    }));
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  return { state, setFile, advance, setProgress, complete, error, reset, config, formatBytes };
}

export { formatBytes };
