"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Web Speech API types (not in default TS dom lib for all browsers)
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function AudioToTextTool() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("en-US");
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) setSupported(false);
  }, []);

  function startListening() {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk + " ";
        else interimText += chunk;
      }
      if (finalText) setTranscript((prev) => prev + finalText);
      setInterim(interimText);
    };

    rec.onerror = () => {
      setListening(false);
      setInterim("");
    };

    rec.onend = () => {
      setListening(false);
      setInterim("");
    };

    recogRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stopListening() {
    recogRef.current?.stop();
    recogRef.current = null;
    setListening(false);
    setInterim("");
  }

  async function copy() {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const LANGUAGES = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "hi-IN", label: "Hindi" },
    { code: "es-ES", label: "Spanish (Spain)" },
    { code: "es-MX", label: "Spanish (Mexico)" },
    { code: "fr-FR", label: "French" },
    { code: "de-DE", label: "German" },
    { code: "it-IT", label: "Italian" },
    { code: "pt-BR", label: "Portuguese (Brazil)" },
    { code: "ja-JP", label: "Japanese" },
    { code: "ko-KR", label: "Korean" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
    { code: "ar-SA", label: "Arabic" },
  ];

  if (!supported) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center py-10">
        <MicOff className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="font-semibold mb-1">Not supported</p>
        <p className="text-sm text-muted-foreground">
          Your browser doesn&apos;t support the Web Speech API. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="space-y-1 flex-1 min-w-40">
          <Label className="text-xs">Language</Label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={listening}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-5">
          {!listening ? (
            <Button onClick={startListening} className="gap-2">
              <Mic className="w-4 h-4" />Start Recording
            </Button>
          ) : (
            <Button onClick={stopListening} variant="destructive" className="gap-2">
              <MicOff className="w-4 h-4" />Stop Recording
            </Button>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {listening && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          Listening — speak clearly into your microphone
        </div>
      )}

      {/* Transcript area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Transcript</Label>
          <span className="text-xs text-muted-foreground">{transcript.length} chars</span>
        </div>
        <div className="min-h-40 rounded-xl border border-border bg-muted/20 p-4 text-sm leading-relaxed font-sans">
          {transcript || (
            <span className="text-muted-foreground/50 italic">
              {listening ? "Waiting for speech…" : "Press Start Recording and speak into your microphone."}
            </span>
          )}
          {interim && (
            <span className="text-muted-foreground/70 italic"> {interim}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      {transcript && (
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={copy} className="gap-2">
            {copied ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Text</>}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTranscript("")} className="gap-2">
            <Trash2 className="w-3.5 h-3.5" />Clear
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        Uses your browser&apos;s built-in speech recognition. Requires microphone permission.
        Works best in Chrome and Edge. Transcript is not sent to any server.
      </div>
    </div>
  );
}
