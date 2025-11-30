// src/hooks/useCrossfade.js
import { useEffect, useRef } from "react";

export default function useCrossfade(audioRef, fadeDuration = 6) {
  const audioCtxRef = useRef(null);
  const currentSourceRef = useRef(null);
  const nextSourceRef = useRef(null);
  const gainCurrentRef = useRef(null);
  const gainNextRef = useRef(null);
  const playingRef = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current =
      new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      stopAll();
      audioCtxRef.current?.close();
    };
  }, []);

  const stopAll = () => {
    try {
      currentSourceRef.current?.stop();
      nextSourceRef.current?.stop();
    } catch (_) {}
    playingRef.current = false;
    abortControllerRef.current?.abort();
  };

  const playWithCrossfade = async (newUrl) => {
    if (!newUrl) return;

    // Cancel any previous in-progress fetch
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();

    // Fetch and decode audio safely
    const response = await fetch(newUrl, { signal: controller.signal });
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    // Prepare new gain + source
    const nextGain = ctx.createGain();
    nextGain.gain.value = 0;
    const nextSource = ctx.createBufferSource();
    nextSource.buffer = audioBuffer;
    nextSource.connect(nextGain).connect(ctx.destination);

    // Fade-out current if exists
    const now = ctx.currentTime;
    if (gainCurrentRef.current) {
      gainCurrentRef.current.gain.cancelScheduledValues(now);
      gainCurrentRef.current.gain.setValueAtTime(
        gainCurrentRef.current.gain.value,
        now
      );
      gainCurrentRef.current.gain.linearRampToValueAtTime(0, now + fadeDuration);
    }

    // Start new audio + fade-in
    nextSource.start(0);
    nextGain.gain.linearRampToValueAtTime(1, now + fadeDuration);

    // Clean up old one after fade ends
    if (currentSourceRef.current) {
      setTimeout(() => {
        try {
          currentSourceRef.current.stop();
        } catch (_) {}
      }, fadeDuration * 1000);
    }

    // Store references
    currentSourceRef.current = nextSource;
    gainCurrentRef.current = nextGain;
    playingRef.current = true;
  };

  return { playWithCrossfade, stopAll };
}
