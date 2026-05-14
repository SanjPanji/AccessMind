/// <reference types="vite/client" />

/**
 * whisperClient.ts
 *
 * Sends an audio Blob to the Groq Whisper API and returns the transcript.
 * Used as a fallback STT engine when the browser does not support
 * the Web Speech API (Firefox, Safari, iOS, etc.).
 *
 * API docs: https://console.groq.com/docs/speech-text
 */

import type { VoiceLang } from './commandParser';

// Map VoiceLang to Whisper language hints (ISO-639-1 codes)
const LANG_TO_WHISPER: Record<VoiceLang, string> = {
  en: 'en',
  ru: 'ru',
  kk: 'kk',
};

/**
 * Transcribe an audio Blob using Groq's Whisper endpoint.
 * Returns the recognised text, or throws on error.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  lang: VoiceLang,
  signal?: AbortSignal,
): Promise<string> {
  const rawKey = import.meta.env.VITE_GROQ_API_KEY;
  const apiKey = rawKey?.trim();
  console.log('[whisper-debug] typeof key:', typeof rawKey);
  console.log('[whisper-debug] key === undefined:', rawKey === undefined);
  console.log('[whisper-debug] key.length:', rawKey?.length ?? 0);
  console.log('[whisper-debug] key.slice(0, 8):', rawKey?.slice(0, 8) ?? '');

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error(
      'VITE_GROQ_API_KEY is not configured. ' +
      'Get a free key at https://console.groq.com and add it to frontend/.env',
    );
  }

  // Groq requires a named file — use .webm (most common MediaRecorder output)
  const ext = audioBlob.type.includes('ogg') ? 'ogg' : audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  const file = new File([audioBlob], `recording.${ext}`, { type: audioBlob.type });

  const form = new FormData();
  form.append('file', file);
  form.append('model', 'whisper-large-v3-turbo'); // fastest Whisper on Groq
  form.append('language', LANG_TO_WHISPER[lang]);
  form.append('response_format', 'json');
  console.log('[whisper-debug] auth prefix:', apiKey.slice(0, 8));

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq Whisper error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = (data.text as string | undefined)?.trim() ?? '';

  if (!text) throw new Error('Whisper returned an empty transcript.');

  return text;
}

/**
 * Determine the best MIME type for MediaRecorder in the current browser.
 * Returns the first supported type, or a safe default.
 */
export function getBestMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus', // Chrome, Edge, Firefox (latest)
    'audio/webm',             // Chrome, Edge
    'audio/ogg;codecs=opus',  // Firefox
    'audio/mp4',              // Safari 14.1+
    '',                       // browser default
  ];
  for (const type of candidates) {
    if (type === '' || MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}
