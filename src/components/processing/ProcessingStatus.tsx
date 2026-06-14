"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Shield, Zap, Lock, FolderX,
  FileText, Image, Music, Code, Briefcase, Video, Cpu,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingState, ProcessingConfig, TrustBadge, ProcessingStage } from "./types";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGE_ORDER: ProcessingStage[] = [
  "uploaded", "analyzing", "processing", "optimizing", "generating", "complete",
];

const BADGE_META: Record<TrustBadge, { icon: React.ReactNode; label: string; color: string }> = {
  local:        { icon: <Lock    className="w-3 h-3" />, label: "Processed Locally",  color: "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  fast:         { icon: <Zap    className="w-3 h-3" />, label: "Lightning Fast",      color: "text-amber-700  dark:text-amber-400  border-amber-500/30  bg-amber-500/10"  },
  privacy:      { icon: <Shield className="w-3 h-3" />, label: "Privacy First",       color: "text-sky-700    dark:text-sky-400    border-sky-500/30    bg-sky-500/10"    },
  "no-upload":  { icon: <FolderX className="w-3 h-3"/>, label: "No File Upload",      color: "text-violet-700 dark:text-violet-400 border-violet-500/30 bg-violet-500/10" },
  encrypted:    { icon: <Lock   className="w-3 h-3" />, label: "Encrypted Transfer", color: "text-rose-700   dark:text-rose-400   border-rose-500/30   bg-rose-500/10"   },
  "open-source":{ icon: <Code   className="w-3 h-3" />, label: "Open Source",        color: "text-teal-700   dark:text-teal-400   border-teal-500/30   bg-teal-500/10"   },
};

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  image:     <Image     className="w-4 h-4" />,
  pdf:       <FileText  className="w-4 h-4" />,
  audio:     <Music     className="w-4 h-4" />,
  video:     <Video     className="w-4 h-4" />,
  ai:        <Cpu       className="w-4 h-4" />,
  developer: <Code      className="w-4 h-4" />,
  business:  <Briefcase className="w-4 h-4" />,
  generic:   <FileText  className="w-4 h-4" />,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FileCard({ file, category }: { file: ProcessingState["file"]; category: string }) {
  if (!file) return null;
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 backdrop-blur-sm"
    >
      <div className="relative shrink-0">
        {file.preview ? (
          <img
            src={file.preview} alt={file.name}
            className="w-10 h-10 rounded-lg object-cover ring-1 ring-border/40"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
            <span className="text-[9px] font-bold text-primary tracking-wider">{ext}</span>
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-border/60 flex items-center justify-center text-primary">
          {CATEGORY_ICON[category]}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(file.size)} · {file.type || ext}</p>
      </div>
    </motion.div>
  );
}

function ProgressBar({ progress, stage }: { progress: number; stage: ProcessingStage }) {
  const isError    = stage === "error";
  const isComplete = stage === "complete";

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full relative overflow-hidden",
            isError    ? "bg-rose-500" :
            isComplete ? "bg-emerald-500" :
            "bg-primary"
          )}
          initial={{ width: "0%" }}
          animate={{ width: `${isError ? 100 : progress}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {!isComplete && !isError && (
            <motion.div
              className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
            />
          )}
        </motion.div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-muted-foreground tabular-nums">{Math.round(progress)}%</span>
        {isError && (
          <span className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        )}
        {isComplete && (
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Complete
          </span>
        )}
      </div>
    </div>
  );
}

function StepList({
  config,
  stage,
}: {
  config: ProcessingConfig;
  stage: ProcessingStage;
}) {
  const currentIdx  = STAGE_ORDER.indexOf(stage);
  const isError     = stage === "error";

  return (
    <div className="space-y-0.5">
      {config.steps.map((step, i) => {
        const stepIdx   = STAGE_ORDER.indexOf(step.stage);
        const isDone    = currentIdx > stepIdx && !isError;
        const isCurrent = currentIdx === stepIdx && !isError;
        const isFuture  = currentIdx < stepIdx || isError;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-300",
              isDone    && "bg-emerald-500/5",
              isCurrent && "bg-primary/8",
              isFuture  && "opacity-40",
            )}
          >
            <div className="shrink-0 w-5 h-5 flex items-center justify-center">
              {isDone ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                </motion.div>
              ) : isCurrent ? (
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full border border-border/60" />
              )}
            </div>

            <span className={cn(
              "text-xs font-medium flex-1",
              isDone    ? "text-emerald-700 dark:text-emerald-400" :
              isCurrent ? "text-foreground" :
              "text-muted-foreground"
            )}>
              {step.label}
            </span>

            <AnimatePresence>
              {isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-semibold tracking-widest text-emerald-700/60 dark:text-emerald-400/70 uppercase"
                >
                  done
                </motion.span>
              )}
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-primary/70" />
                  <span className="text-[9px] font-semibold tracking-widest text-primary/70 uppercase">active</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function TrustBadges({ badges }: { badges: TrustBadge[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, i) => {
        const meta = BADGE_META[badge];
        return (
          <motion.div
            key={badge}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.1 }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wide uppercase",
              meta.color
            )}
          >
            {meta.icon}
            {meta.label}
          </motion.div>
        );
      })}
    </div>
  );
}

function MessageTicker({ message }: { message: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.25 }}
        className="text-sm text-muted-foreground font-mono"
      >
        {message}
      </motion.p>
    </AnimatePresence>
  );
}

function StatsGrid({ stats }: { stats: ProcessingState["stats"] }) {
  if (!stats.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07 + 0.2 }}
          className={cn(
            "rounded-xl border px-3 py-2.5 space-y-1",
            s.highlight ? "border-emerald-500/30 bg-emerald-500/8"
            : s.warn    ? "border-amber-500/30  bg-amber-500/8"
            :              "border-border/50     bg-muted/20"
          )}
        >
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
          {s.before && s.after ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground line-through">{s.before}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <span className={cn(
                "text-sm font-bold",
                s.highlight ? "text-emerald-700 dark:text-emerald-400"
                : s.warn    ? "text-amber-700 dark:text-amber-400"
                :              "text-foreground"
              )}>{s.after}</span>
            </div>
          ) : (
            <p className={cn(
              "text-sm font-bold",
              s.highlight ? "text-emerald-700 dark:text-emerald-400"
              : s.warn    ? "text-amber-700 dark:text-amber-400"
              :              "text-foreground"
            )}>
              {s.after ?? s.delta ?? "—"}
            </p>
          )}
          {s.delta && (
            <p className={cn(
              "text-[10px] font-semibold",
              s.highlight ? "text-emerald-700 dark:text-emerald-400"
              : s.warn    ? "text-amber-700 dark:text-amber-400"
              :              "text-muted-foreground"
            )}>{s.delta}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function SuccessBanner({ message, elapsed }: { message: string; elapsed: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/8 px-4 py-3"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.05 }}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{message}</p>
        {elapsed > 0 && (
          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60 mt-0.5">
            Completed in {elapsed < 1000 ? `${elapsed}ms` : `${(elapsed / 1000).toFixed(1)}s`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-50 dark:bg-rose-500/8 px-4 py-3"
    >
      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Processing Failed</p>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5 wrap-break-word">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 text-xs text-rose-700 dark:text-rose-400 border border-rose-500/40 rounded-lg px-3 py-1.5 hover:bg-rose-500/10 transition-colors"
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export interface ProcessingStatusProps {
  state: ProcessingState;
  config: ProcessingConfig;
  onRetry?: () => void;
  /** Show the step list. Default true. */
  showSteps?: boolean;
  /** Show trust badges. Default true. */
  showBadges?: boolean;
  /** Show the file card. Default true. */
  showFileCard?: boolean;
  className?: string;
}

export function ProcessingStatus({
  state,
  config,
  onRetry,
  showSteps   = true,
  showBadges  = true,
  showFileCard = true,
  className,
}: ProcessingStatusProps) {
  const { stage, progress, currentMessage, file, stats, error, elapsedMs } = state;
  const isIdle     = stage === "idle";
  const isComplete = stage === "complete";
  const isError    = stage === "error";
  const isActive   = !isIdle && !isComplete && !isError;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "analyzing" && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [stage]);

  if (isIdle) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl overflow-hidden",
        className
      )}
    >
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="p-4 space-y-4">

        {/* Header row: method pill + elapsed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
            <span className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase">
              {config.method ?? "Processing"}
            </span>
          </div>
          {elapsedMs > 0 && !isComplete && !isError && (
            <span className="text-[11px] text-muted-foreground/60 tabular-nums font-mono">
              {elapsedMs < 1000 ? `${elapsedMs}ms` : `${(elapsedMs / 1000).toFixed(1)}s`}
            </span>
          )}
        </div>

        {/* File card */}
        {showFileCard && file && (
          <FileCard file={file} category={config.category} />
        )}

        {/* Progress bar — while active */}
        {isActive && (
          <div className="space-y-1.5">
            <ProgressBar progress={progress} stage={stage} />
            <MessageTicker message={currentMessage} />
          </div>
        )}

        {/* Complete banner */}
        {isComplete && (
          <SuccessBanner message={config.messages.complete ?? "Complete"} elapsed={elapsedMs} />
        )}

        {/* Error banner */}
        {isError && (
          <ErrorBanner message={error ?? "An unexpected error occurred."} onRetry={onRetry} />
        )}

        {/* Output stats */}
        {isComplete && stats.length > 0 && <StatsGrid stats={stats} />}

        {/* Step list */}
        {showSteps && !isIdle && (
          <div className="rounded-xl border border-border/40 bg-muted/10 p-2">
            <StepList config={config} stage={stage} />
          </div>
        )}

        {/* Trust badges */}
        {showBadges && <TrustBadges badges={config.badges} />}

      </div>
    </motion.div>
  );
}
