"use client";

/**
 * Thin client for the FFmpeg worker in /workers/ffmpeg-worker.js.
 * One worker is shared by all tools; jobs run one at a time.
 */

export interface FfmpegJob {
  /** Input files written to FFmpeg's in-memory file system. */
  inputs: { name: string; file: Blob }[];
  /** Command-line arguments, without the leading "ffmpeg". */
  args: string[];
  /** File names the command writes and that should be returned. */
  outputs: string[];
  /** 0-1 while encoding. */
  onProgress?: (fraction: number) => void;
  /** Called once the ~30 MB engine has loaded and work begins. */
  onReady?: () => void;
}

export interface FfmpegResult {
  files: Map<string, Uint8Array>;
  /** FFmpeg's exit code; 0 is success. */
  code: number;
  /** Last lines FFmpeg printed, for error messages. */
  log: string[];
}

/** Everything is held in memory inside a 32-bit WebAssembly heap, so very large inputs cannot work. */
export const FFMPEG_MAX_INPUT_BYTES = 700 * 1024 * 1024;

let worker: Worker | null = null;
let queue: Promise<unknown> = Promise.resolve();
let nextId = 1;

function getWorker(): Worker {
  if (!worker) worker = new Worker("/workers/ffmpeg-worker.js");
  return worker;
}

export function runFfmpeg(job: FfmpegJob): Promise<FfmpegResult> {
  const task = async (): Promise<FfmpegResult> => {
    const total = job.inputs.reduce((n, i) => n + i.file.size, 0);
    if (total > FFMPEG_MAX_INPUT_BYTES) {
      throw new Error(`This file is too large to process in the browser (limit about ${Math.round(FFMPEG_MAX_INPUT_BYTES / 1024 / 1024)} MB).`);
    }
    const inputs = await Promise.all(job.inputs.map(async (i) => ({ name: i.name, data: await i.file.arrayBuffer() })));
    const w = getWorker();
    const id = nextId++;
    const log: string[] = [];

    return new Promise<FfmpegResult>((resolve, reject) => {
      const cleanup = () => { w.removeEventListener("message", onMessage); w.removeEventListener("error", onError); };
      const onError = () => {
        cleanup();
        worker?.terminate();
        worker = null; // a crashed engine (usually out of memory) cannot be reused
        reject(new Error("The video engine stopped unexpectedly, usually because the file needs more memory than the browser allows."));
      };
      const onMessage = (event: MessageEvent) => {
        const msg = event.data as { type: string; id?: number; message?: string; progress?: number; code?: number; outputs?: { name: string; data: ArrayBuffer }[] };
        if (msg.type === "log" && msg.message) { log.push(msg.message); if (log.length > 40) log.shift(); return; }
        if (msg.type === "ready") { job.onReady?.(); return; }
        if (msg.type === "progress" && typeof msg.progress === "number") {
          if (Number.isFinite(msg.progress)) job.onProgress?.(Math.max(0, Math.min(1, msg.progress)));
          return;
        }
        if (msg.id !== id) return;
        cleanup();
        if (msg.type === "error") { reject(new Error(msg.message || "Video processing failed.")); return; }
        const files = new Map<string, Uint8Array>();
        for (const out of msg.outputs ?? []) files.set(out.name, new Uint8Array(out.data));
        resolve({ files, code: msg.code ?? 0, log });
      };
      w.addEventListener("message", onMessage);
      w.addEventListener("error", onError);
      w.postMessage({ id, type: "run", inputs, args: job.args, outputs: job.outputs }, inputs.map((i) => i.data));
    });
  };
  const result = queue.then(task, task);
  queue = result.catch(() => undefined);
  return result;
}

/** Safe in-memory name that keeps the extension FFmpeg uses to guess the format. */
export function ffmpegInputName(file: File): string {
  const ext = (file.name.match(/\.([a-z0-9]{1,5})$/i)?.[1] ?? "mp4").toLowerCase();
  return `input.${ext}`;
}

/** Seconds as the hh:mm:ss.mmm FFmpeg expects. */
export function ffmpegTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), rest = (s % 60).toFixed(3);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${rest.padStart(6, "0")}`;
}
