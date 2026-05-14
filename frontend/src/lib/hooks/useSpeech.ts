/**
 * useSpeech.ts — Cross-browser Speech-to-Text + Text-to-Speech hook.
 *
 * Strategy:
 *   Primary   → Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 *               Works in: Chrome, Edge, Samsung Internet
 *   Fallback  → MediaRecorder + Groq Whisper API
 *               Works in: Firefox, Safari 14.1+, iOS Safari, any browser
 *               with mediaDevices support
 *
 * iOS Safari notes:
 *   - getUserMedia() MUST be called from within a direct user-gesture handler
 *     (click/tap). We keep a `streamRef` so we can reuse the granted stream
 *     without re-prompting on subsequent recordings.
 *   - AudioContext must also be resumed from a gesture on iOS.
 *
 * The external API is unchanged — consumers call startListening() and receive
 * the transcript in the onResult callback regardless of which path was used.
 */

import { useState, useRef, useCallback } from 'react';
import {
  type VoiceLang,
  type CommandMatch,
  LANG_TO_BCP47,
  processVoiceCommand,
} from '../commandParser';
import { transcribeAudio, getBestMimeType } from '../whisperClient';

// ── Types ──────────────────────────────────────────────────────────────────
export type SpeechState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
export type { VoiceLang, CommandMatch };

// Max recording duration for the MediaRecorder path (ms)
const MAX_RECORD_MS = 10_000;

// Detect SpeechRecognition support once at module load (avoids re-checking)
const SpeechRecognitionCtor: any =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null
    : null;

const HAS_NATIVE_STT = SpeechRecognitionCtor !== null;
const HAS_MEDIA_DEVICES =
  typeof window !== 'undefined' &&
  typeof navigator?.mediaDevices?.getUserMedia === 'function';

// ── Hook ──────────────────────────────────────────────────────────────────
export function useSpeech() {
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('en');

  // Refs — survive re-renders without causing them
  const recognitionRef = useRef<any>(null);      // Web Speech API instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);      // reuse granted stream
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const setError = useCallback((msg: string) => {
    setSpeechState('error');
    setErrorMessage(msg);
    console.error('[useSpeech]', msg);
  }, []);

  const clearRecordTimer = useCallback(() => {
    if (recordTimerRef.current !== null) {
      clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  }, []);

  // ── Cancel everything ────────────────────────────────────────────────────
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    clearRecordTimer();

    // Stop Web Speech API
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder (fires 'stop' event which handles cleanup)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    // Note: we intentionally keep `streamRef` alive to avoid re-prompting iOS

    // Cancel any in-flight AI/Whisper request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop TTS
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSpeechState('idle');
    setErrorMessage('');
  }, [clearRecordTimer]);

  // ── Text-to-Speech ────────────────────────────────────────────────────
  const speak = useCallback((text: string, lang?: VoiceLang) => {
    cancel();
    cancelledRef.current = false;

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('[useSpeech] speechSynthesis not supported — skipping TTS');
      return;
    }

    setSpeechState('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_TO_BCP47[lang ?? voiceLang];

    utterance.onend = () => { if (!cancelledRef.current) setSpeechState('idle'); };
    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && !cancelledRef.current) {
        console.warn('[useSpeech] TTS error:', e.error);
        setSpeechState('idle');
      }
    };

    // iOS workaround: speechSynthesis can silently fail if the queue is paused
    window.speechSynthesis.cancel(); // flush any stale utterances
    window.speechSynthesis.speak(utterance);
  }, [cancel, voiceLang]);

  // ── Process transcript (common to both STT paths) ─────────────────────
  const handleTranscript = useCallback(async (
    transcript: string,
    lang: VoiceLang,
    onResult?: (text: string, match: CommandMatch) => void,
  ) => {
    if (cancelledRef.current) return;
    console.log(`[useSpeech] Transcript: "${transcript}"`);
    setSpeechState('processing');

    if (onResult) {
      try {
        abortControllerRef.current = new AbortController();
        const match = await processVoiceCommand(
          transcript,
          lang,
          abortControllerRef.current.signal,
        );
        if (!cancelledRef.current) onResult(transcript, match);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('[useSpeech] Command processing error:', e);
        }
      }
    }

    if (!cancelledRef.current) setSpeechState('idle');
  }, []);

  // ── PATH A: Web Speech API ────────────────────────────────────────────
  const startWithNativeSTT = useCallback((
    lang: VoiceLang,
    onResult?: (text: string, match: CommandMatch) => void,
  ) => {
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = LANG_TO_BCP47[lang];
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('[useSpeech] Native STT started, lang=', recognition.lang);
      if (!cancelledRef.current) setSpeechState('listening');
    };

    recognition.onresult = (event: any) => {
      if (cancelledRef.current) return;
      const transcript = event.results[0][0].transcript as string;
      handleTranscript(transcript, lang, onResult);
    };

    recognition.onerror = (event: any) => {
      console.warn('[useSpeech] Native STT error:', event.error);
      if (cancelledRef.current) return;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (event.error === 'no-speech') {
        setSpeechState('idle');
        setErrorMessage('No speech detected. Please try again.');
      } else if (event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (!cancelledRef.current) {
        setSpeechState(prev => prev === 'listening' ? 'idle' : prev);
      }
    };

    try {
      recognition.start();
    } catch (e: any) {
      setError(`Could not start recognition: ${e.message}`);
    }
  }, [handleTranscript, setError]);

  // ── PATH B: MediaRecorder + Whisper (cross-browser fallback) ──────────
  const startWithMediaRecorder = useCallback(async (
    lang: VoiceLang,
    onResult?: (text: string, match: CommandMatch) => void,
  ) => {
    if (!HAS_MEDIA_DEVICES) {
      setError('Your browser does not support microphone access. Please use Chrome or Firefox.');
      return;
    }

    setSpeechState('listening');
    console.log('[useSpeech] MediaRecorder path, lang=', lang);

    try {
      // Reuse existing stream if already granted (critical for iOS)
      if (!streamRef.current || !streamRef.current.active) {
        // This call MUST happen during a user gesture on iOS Safari
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (e: any) {
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else {
        setError(`Could not access microphone: ${e.message}`);
      }
      return;
    }

    if (cancelledRef.current) return;

    const mimeType = getBestMimeType();
    const recorderOptions = mimeType ? { mimeType } : {};

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(streamRef.current, recorderOptions);
    } catch (e: any) {
      // If mimeType is rejected, try without it
      try {
        recorder = new MediaRecorder(streamRef.current);
      } catch (e2: any) {
        setError(`MediaRecorder not supported: ${e2.message}`);
        return;
      }
    }

    audioChunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      clearRecordTimer();
      if (cancelledRef.current || audioChunksRef.current.length === 0) return;

      const audioBlob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      });
      audioChunksRef.current = [];

      setSpeechState('processing');
      console.log(`[useSpeech] Sending audio to Whisper (${(audioBlob.size / 1024).toFixed(1)} KB)`);

      try {
        abortControllerRef.current = new AbortController();
        const transcript = await transcribeAudio(audioBlob, lang, abortControllerRef.current.signal);
        await handleTranscript(transcript, lang, onResult);
      } catch (e: any) {
        if (e.name !== 'AbortError' && !cancelledRef.current) {
          setError(`Whisper transcription failed: ${e.message}`);
        }
      }
    };

    recorder.onerror = (e: any) => {
      if (!cancelledRef.current) {
        setError(`Recording error: ${e.error?.message ?? 'unknown'}`);
      }
    };

    // Start recording — collect in one chunk on stop
    recorder.start();

    // Auto-stop after MAX_RECORD_MS
    recordTimerRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        console.log('[useSpeech] Max recording duration reached, stopping.');
        mediaRecorderRef.current.stop();
      }
    }, MAX_RECORD_MS);
  }, [handleTranscript, setError, clearRecordTimer]);

  // ── Public: Start Listening ────────────────────────────────────────────
  /**
   * Starts the STT engine. This MUST be called from a user-gesture handler
   * (click/tap) on iOS Safari.
   *
   * @param onResult  Called with (transcript, commandMatch) when recognition
   *                  is complete.
   * @param lang      Override the active language.
   */
  const startListening = useCallback((
    onResult?: (text: string, match: CommandMatch) => void,
    lang?: VoiceLang,
  ) => {
    cancel();
    cancelledRef.current = false;

    const activeLang = lang ?? voiceLang;

    if (HAS_NATIVE_STT) {
      console.log('[useSpeech] Using native SpeechRecognition');
      startWithNativeSTT(activeLang, onResult);
    } else {
      console.log('[useSpeech] SpeechRecognition unavailable — using MediaRecorder + Whisper');
      // async inside, but the getUserMedia call is still in the gesture stack
      startWithMediaRecorder(activeLang, onResult);
    }
  }, [cancel, voiceLang, startWithNativeSTT, startWithMediaRecorder]);

  /**
   * For the MediaRecorder path: stop recording and trigger transcription.
   * On the native STT path this is a no-op (recognition stops automatically).
   * Expose this so UI can have a "stop recording" button.
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Change language ────────────────────────────────────────────────────
  const changeLanguage = useCallback((lang: VoiceLang) => {
    cancel();
    setVoiceLang(lang);
  }, [cancel]);

  // ── Feature flags (for UI to adapt) ───────────────────────────────────
  const isNativeSTT = HAS_NATIVE_STT;
  const isWhisperFallback = !HAS_NATIVE_STT && HAS_MEDIA_DEVICES;
  const isUnsupported = !HAS_NATIVE_STT && !HAS_MEDIA_DEVICES;

  return {
    speechState,
    errorMessage,
    voiceLang,
    isNativeSTT,
    isWhisperFallback,
    isUnsupported,
    startListening,
    stopRecording,
    speak,
    cancel,
    changeLanguage,
  };
}
