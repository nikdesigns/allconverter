"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextToSpeechTool() {
  const [text, setText] = useState("Hello! This is a sample text that will be converted to speech. You can type any text here and listen to it.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) { setSupported(false); return; }
    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        const english = v.find((x) => x.lang.startsWith("en"));
        if (english) setSelectedVoice(english.name);
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  function speak() {
    if (!text.trim() || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utt.voice = voice;
    utt.rate = rate;
    utt.pitch = pitch;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center py-10">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="font-semibold mb-1">Not supported</p>
        <p className="text-sm text-muted-foreground">Your browser doesn&apos;t support the Web Speech API. Try Chrome or Edge.</p>
      </div>
    );
  }

  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
  const otherVoices = voices.filter((v) => !v.lang.startsWith("en"));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">Text to speak</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here…"
          rows={5}
          className="resize-none text-sm"
        />
        <p className="text-xs text-muted-foreground text-right">{text.length} characters</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Voice */}
        <div className="space-y-2">
          <Label className="text-xs">Voice</Label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            {englishVoices.length > 0 && (
              <optgroup label="English">
                {englishVoices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </optgroup>
            )}
            {otherVoices.length > 0 && (
              <optgroup label="Other languages">
                {otherVoices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Rate */}
        <div className="space-y-2">
          <Label className="text-xs flex justify-between">
            <span>Speed</span>
            <span className="font-mono text-primary">{rate.toFixed(1)}×</span>
          </Label>
          <input
            type="range" min={0.5} max={2} step={0.1} value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-primary mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span><span>Normal</span><span>Fast</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <Label className="text-xs flex justify-between">
            <span>Pitch</span>
            <span className="font-mono text-primary">{pitch.toFixed(1)}</span>
          </Label>
          <input
            type="range" min={0} max={2} step={0.1} value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-primary mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span><span>Normal</span><span>High</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {!speaking ? (
          <Button onClick={speak} disabled={!text.trim()} className="gap-2">
            <Play className="w-4 h-4" />Speak
          </Button>
        ) : (
          <Button onClick={stop} variant="destructive" className="gap-2">
            <Square className="w-4 h-4" />Stop
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => { stop(); setText(""); }} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />Clear
        </Button>
      </div>

      {speaking && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          Speaking…
        </div>
      )}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        Uses your browser&apos;s built-in Web Speech API. Available voices depend on your OS and browser.
        No internet connection needed after page load.
      </div>
    </div>
  );
}
