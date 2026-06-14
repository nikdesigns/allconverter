import type { ProcessingConfig, ToolCategory } from "./types";

const BASE_STEPS = (labels: [string, string, string, string, string]) => [
  { id: "upload",    label: labels[0], stage: "uploaded"   as const },
  { id: "analyze",   label: labels[1], stage: "analyzing"  as const },
  { id: "process",   label: labels[2], stage: "processing" as const },
  { id: "optimize",  label: labels[3], stage: "optimizing" as const },
  { id: "complete",  label: labels[4], stage: "complete"   as const },
];

export const PROCESSING_PRESETS: Record<ToolCategory, ProcessingConfig> = {
  image: {
    category: "image",
    method: "Browser-Based · Canvas API",
    badges: ["local", "fast", "privacy", "no-upload"],
    steps: BASE_STEPS([
      "File Selected",
      "Reading Image",
      "Processing Pixels",
      "Optimizing Output",
      "Ready to Download",
    ]),
    messages: {
      uploaded:   "Reading image metadata…",
      analyzing:  "Detecting format and dimensions…",
      processing: "Compressing image data…",
      optimizing: "Optimizing output quality…",
      generating: "Encoding final image…",
      complete:   "Image processed successfully",
    },
  },

  pdf: {
    category: "pdf",
    method: "Browser-Based · PDF.js",
    badges: ["local", "privacy", "no-upload"],
    steps: BASE_STEPS([
      "File Selected",
      "Reading Document",
      "Processing Pages",
      "Optimizing PDF",
      "Ready to Download",
    ]),
    messages: {
      uploaded:   "Loading PDF document…",
      analyzing:  "Extracting pages and structure…",
      processing: "Processing document content…",
      optimizing: "Optimizing file size…",
      generating: "Generating output PDF…",
      complete:   "Document processed successfully",
    },
  },

  audio: {
    category: "audio",
    method: "Browser-Based · Web Audio API",
    badges: ["local", "privacy", "no-upload"],
    steps: BASE_STEPS([
      "File Selected",
      "Reading Audio",
      "Analyzing Waveform",
      "Processing Audio",
      "Ready to Download",
    ]),
    messages: {
      uploaded:   "Loading audio file…",
      analyzing:  "Analyzing audio waveform…",
      processing: "Processing audio data…",
      optimizing: "Encoding output format…",
      generating: "Preparing audio file…",
      complete:   "Audio processed successfully",
    },
  },

  video: {
    category: "video",
    method: "Browser-Based · MediaRecorder API",
    badges: ["local", "privacy", "no-upload"],
    steps: BASE_STEPS([
      "File Selected",
      "Reading Video",
      "Processing Frames",
      "Encoding Output",
      "Ready to Download",
    ]),
    messages: {
      uploaded:   "Loading video file…",
      analyzing:  "Reading video metadata…",
      processing: "Processing video frames…",
      optimizing: "Encoding output stream…",
      generating: "Preparing video file…",
      complete:   "Video processed successfully",
    },
  },

  ai: {
    category: "ai",
    method: "AI-Powered · Server Processing",
    badges: ["encrypted", "privacy", "fast"],
    steps: BASE_STEPS([
      "Input Received",
      "Understanding Context",
      "Processing Request",
      "Refining Response",
      "Complete",
    ]),
    messages: {
      uploaded:   "Input received…",
      analyzing:  "Understanding your request…",
      processing: "Processing with AI…",
      optimizing: "Refining output quality…",
      generating: "Generating response…",
      complete:   "AI processing complete",
    },
  },

  developer: {
    category: "developer",
    method: "Client-Side · Zero Latency",
    badges: ["local", "fast", "no-upload"],
    steps: BASE_STEPS([
      "Input Received",
      "Validating Input",
      "Parsing Data",
      "Transforming Content",
      "Complete",
    ]),
    messages: {
      uploaded:   "Input received…",
      analyzing:  "Validating input format…",
      processing: "Parsing and transforming…",
      optimizing: "Applying formatting rules…",
      generating: "Preparing output…",
      complete:   "Transformation complete",
    },
  },

  business: {
    category: "business",
    method: "Browser-Based · Secure",
    badges: ["local", "privacy", "encrypted"],
    steps: BASE_STEPS([
      "Data Received",
      "Validating Fields",
      "Generating Document",
      "Applying Formatting",
      "Ready to Download",
    ]),
    messages: {
      uploaded:   "Data received…",
      analyzing:  "Validating form fields…",
      processing: "Generating document…",
      optimizing: "Applying professional formatting…",
      generating: "Preparing final document…",
      complete:   "Document generated successfully",
    },
  },

  generic: {
    category: "generic",
    method: "Browser-Based",
    badges: ["local", "privacy"],
    steps: BASE_STEPS([
      "File Selected",
      "Analyzing Input",
      "Processing Data",
      "Optimizing Output",
      "Complete",
    ]),
    messages: {
      uploaded:   "Loading input…",
      analyzing:  "Analyzing data…",
      processing: "Processing…",
      optimizing: "Optimizing output…",
      generating: "Preparing result…",
      complete:   "Processing complete",
    },
  },
};
