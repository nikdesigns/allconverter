export type ProcessingStage =
  | "idle"
  | "uploaded"
  | "analyzing"
  | "processing"
  | "optimizing"
  | "generating"
  | "complete"
  | "error";

export type ToolCategory =
  | "image"
  | "pdf"
  | "audio"
  | "ai"
  | "developer"
  | "business"
  | "video"
  | "generic";

export type TrustBadge =
  | "local"
  | "fast"
  | "privacy"
  | "no-upload"
  | "encrypted"
  | "open-source";

export interface ProcessingStep {
  id: string;
  label: string;
  stage: ProcessingStage;
}

export interface OutputStat {
  label: string;
  before?: string;
  after?: string;
  delta?: string;
  highlight?: boolean;
  warn?: boolean; // amber — output is worse than input (e.g. file got larger)
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  preview?: string; // data URL for images
}

export interface ProcessingConfig {
  category: ToolCategory;
  steps: ProcessingStep[];
  badges: TrustBadge[];
  messages: Partial<Record<ProcessingStage, string>>;
  method?: string; // e.g. "Browser-Based", "Client-Side WASM"
}

export interface ProcessingState {
  stage: ProcessingStage;
  progress: number; // 0–100
  currentMessage: string;
  file: FileInfo | null;
  stats: OutputStat[];
  error: string | null;
  elapsedMs: number;
}
