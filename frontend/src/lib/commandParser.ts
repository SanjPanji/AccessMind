/**
 * Multilingual command parser for AccessMind voice navigation.
 * Supports English, Russian, and Kazakh.
 * Uses local keyword matching first, falls back to Cerebras AI.
 */

import { fetchCerebrasChat } from './cerebrasClient';

export type VoiceLang = 'en' | 'ru' | 'kk';

export interface CommandMatch {
  action: string;
  confidence: 'high' | 'low';
}

export interface LocalCommand {
  patterns: {
    en: RegExp[];
    ru: RegExp[];
    kk: RegExp[];
  };
  action: string;
}

/**
 * All supported voice commands with patterns in 3 languages.
 * Order matters — first match wins.
 */
export const MULTILINGUAL_COMMANDS: LocalCommand[] = [
  {
    patterns: {
      en: [/open (dashboard|home)/i, /go (to )?(dashboard|home|main)/i, /dashboard/i, /home/i],
      ru: [/(открой|перейди на|покажи) (главн|дашборд|домашн)/i, /главная/i, /дашборд/i],
      kk: [/(басты бет|негізгі бет)/i, /(аш|өт).*(басты|негізгі)/i],
    },
    action: '/dashboard',
  },
  {
    patterns: {
      en: [/open (assignments?|tasks?|homework)/i, /go (to )?(assignments?|tasks?)/i, /assignments?/i],
      ru: [/(открой|перейди|покажи).*(задани|задач)/i, /задания/i, /тапсырмалар/i],
      kk: [/(тапсырмалар|тапсырма)/i, /(аш|өт).*(тапсырма)/i],
    },
    action: '/assignments',
  },
  {
    patterns: {
      en: [/open (grades?|marks?|scores?)/i, /go (to )?(grades?|marks?)/i, /grades?/i],
      ru: [/(открой|перейди|покажи).*(оценк|балл)/i, /оценки/i],
      kk: [/(бағалар|баға)/i, /(аш|өт|көрсет).*(баға)/i],
    },
    action: '/grades',
  },
  {
    patterns: {
      en: [/open (attendance|schedule|journal)/i, /go (to )?(attendance|schedule)/i, /attendance/i],
      ru: [/(открой|перейди|покажи).*(посещаемость|расписани|журнал)/i, /посещаемость/i],
      kk: [/(сабаққа қатысу|қатысу|кесте)/i, /(аш|өт).*(қатысу|кесте)/i],
    },
    action: '/attendance',
  },
  {
    patterns: {
      en: [/open (profile|settings|account)/i, /go (to )?(profile|settings)/i, /profile/i],
      ru: [/(открой|перейди|покажи).*(профиль|настройк|аккаунт)/i, /профиль/i],
      kk: [/(профиль|параметрлер)/i, /(аш|өт).*(профиль)/i],
    },
    action: '/profile',
  },
  {
    patterns: {
      en: [/open (ai|assistant|helper)/i, /go (to )?(ai|assistant)/i, /assistant/i],
      ru: [/(открой|перейди|покажи).*(ассистент|помощник|ии)/i, /ассистент/i],
      kk: [/(жи көмекші|көмекші|ассистент)/i, /(аш|өт).*(көмекші)/i],
    },
    action: '/ai-assistant',
  },
  {
    patterns: {
      en: [/open (voice|navigation|voice navigation)/i, /go (to )?voice/i],
      ru: [/(открой|перейди).*(голосов|навигац)/i, /голосовая навигация/i],
      kk: [/(дауыстық навигация|дауыстық)/i, /(аш|өт).*(дауыстық)/i],
    },
    action: '/voice-navigation',
  },
  {
    patterns: {
      en: [/open (notifications?|alerts?)/i, /go (to )?notification/i, /notifications?/i],
      ru: [/(открой|перейди|покажи).*(уведомлени|оповещени)/i, /уведомления/i],
      kk: [/(хабарламалар|хабарлама)/i, /(аш|өт).*(хабарлама)/i],
    },
    action: '/notifications',
  },
  {
    patterns: {
      en: [/dark mode/i, /enable dark/i, /toggle dark/i, /night mode/i],
      ru: [/тёмн(ый|ая) (режим|тема)/i, /ночной режим/i, /включи(ть)? тёмн/i],
      kk: [/қараңғы (режим|тақырып)/i, /түнгі режим/i],
    },
    action: 'toggle-dark-mode',
  },
  {
    patterns: {
      en: [/read (text|page|this)/i, /read aloud/i, /start reading/i],
      ru: [/прочитай/i, /озвучь/i, /читай (текст|страниц)/i],
      kk: [/оқы/i, /дыбыстау/i, /мәтінді оқы/i],
    },
    action: 'read-page',
  },
  {
    patterns: {
      en: [/increase (font|text)/i, /bigger (font|text)/i, /larger text/i, /zoom in/i],
      ru: [/увеличь (шрифт|текст)/i, /крупн(ее|ый) (шрифт|текст)/i],
      kk: [/(үлкейт|арттыр).*(шрифт|мәтін)/i, /ірі (шрифт|мәтін)/i],
    },
    action: 'increase-font',
  },
  {
    patterns: {
      en: [/decrease (font|text)/i, /smaller (font|text)/i, /zoom out/i],
      ru: [/уменьш(и|ь) (шрифт|текст)/i, /мелк(ий|ее) (шрифт|текст)/i],
      kk: [/(кішірейт|азайт).*(шрифт|мәтін)/i],
    },
    action: 'decrease-font',
  },
];

/**
 * Map from VoiceLang to BCP-47 locale for SpeechRecognition.
 */
export const LANG_TO_BCP47: Record<VoiceLang, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  kk: 'kk-KZ',
};

/**
 * Try to match user text against local command patterns.
 * Checks in the given language first, then all other languages as fallback.
 */
export function matchLocalCommand(text: string, lang: VoiceLang): CommandMatch | null {
  const normalised = text.trim().toLowerCase();

  // 1. Check patterns in the active language first
  for (const cmd of MULTILINGUAL_COMMANDS) {
    for (const pattern of cmd.patterns[lang]) {
      if (pattern.test(normalised)) {
        return { action: cmd.action, confidence: 'high' };
      }
    }
  }

  // 2. Fallback: check all other languages (user may code-switch)
  const otherLangs = (['en', 'ru', 'kk'] as VoiceLang[]).filter(l => l !== lang);
  for (const otherLang of otherLangs) {
    for (const cmd of MULTILINGUAL_COMMANDS) {
      for (const pattern of cmd.patterns[otherLang]) {
        if (pattern.test(normalised)) {
          return { action: cmd.action, confidence: 'high' };
        }
      }
    }
  }

  return null;
}

/**
 * Use Cerebras AI to extract an intent from unclear text.
 * Supports multilingual input.
 */
export async function matchAICommand(
  text: string,
  signal?: AbortSignal
): Promise<CommandMatch> {
  try {
    const responseText = await fetchCerebrasChat(
      [
        {
          role: 'system',
          content: `You are an intent extractor for a multilingual student dashboard application called AccessMind.
The user may speak in English, Russian, or Kazakh.
Possible actions: '/dashboard', '/assignments', '/grades', '/attendance', '/profile', '/ai-assistant', '/voice-navigation', '/notifications', 'toggle-dark-mode', 'read-page', 'increase-font', 'decrease-font'.
Analyse the user input carefully and output ONLY the action string if a match is found, or "UNKNOWN" if no reasonable match exists.
Do NOT output anything else — no explanations, no punctuation, no quotes.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      signal
    );

    const action = responseText.trim().replace(/['"]/g, '');
    if (action && action !== 'UNKNOWN') {
      return { action, confidence: 'low' };
    }
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      console.error('[CommandParser] AI fallback error:', e);
    }
  }

  return { action: 'UNKNOWN', confidence: 'low' };
}

/**
 * Full command processing pipeline:
 * 1. Local multilingual pattern matching (instant, no API call)
 * 2. Cerebras AI fallback (for fuzzy / unclear commands)
 */
export async function processVoiceCommand(
  text: string,
  lang: VoiceLang,
  signal?: AbortSignal
): Promise<CommandMatch> {
  // Fast local matching
  const localMatch = matchLocalCommand(text, lang);
  if (localMatch) {
    console.log('[CommandParser] Local match:', localMatch.action);
    return localMatch;
  }

  // AI fallback
  console.log('[CommandParser] No local match, falling back to AI for:', text);
  return matchAICommand(text, signal);
}
