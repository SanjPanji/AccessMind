/**
 * AccessibilityContext
 *
 * Central store for all accessibility preferences in AccessMind.
 * Modes are persisted to localStorage so they survive page reloads and login/logout.
 *
 * How it works:
 *   - The active mode is stored as a CSS class on <html> (e.g. "mode-adhd").
 *   - All mode styles are scoped to those classes in accessibility-modes.css.
 *   - Any component can read or change the mode via the useAccessibility() hook.
 *   - Individual settings (dark mode, large text, etc.) are stored separately
 *     so they can be combined with a mode or used standalone.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccessibilityMode = 'adhd' | 'dyslexia' | 'low-vision' | 'simplified' | 'voice' | null;

export interface IndividualSettings {
  /** Whether dark-mode class is active on <html> */
  darkMode: boolean;
  /** Whether text-to-speech is enabled (logic handled by VoiceNavigation) */
  textToSpeech: boolean;
  /** Whether high-contrast class is applied */
  highContrast: boolean;
  /** Whether large-text class is applied */
  largeText: boolean;
  /** Base font size in px (14-24) */
  fontSize: number;
  /** Color contrast level: 0=low, 1=normal, 2=high */
  colorContrast: number;
  /** TTS Volume (0-100) */
  ttsVolume: number;
  /** TTS Rate (0.5-2) */
  ttsRate: number;
  /** TTS Voice URI (null for default) */
  ttsVoiceURI: string | null;
  /** Whether to auto-read content when TTS is enabled */
  autoRead: boolean;
}

export interface AccessibilityContextValue {
  /** Currently active accessibility mode (null = default) */
  activeMode: AccessibilityMode;
  /** Set or toggle a mode. Passing the same mode again deactivates it. */
  setActiveMode: (mode: AccessibilityMode) => void;
  /** Individual granular settings */
  settings: IndividualSettings;
  /** Update one or more individual settings */
  updateSettings: (patch: Partial<IndividualSettings>) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_MODE = 'accessmind_a11y_mode';
const STORAGE_KEY_SETTINGS = 'accessmind_a11y_settings';

/** CSS class names applied to <html> for each mode */
const MODE_CLASSES: Record<NonNullable<AccessibilityMode>, string> = {
  adhd: 'mode-adhd',
  dyslexia: 'mode-dyslexia',
  'low-vision': 'mode-low-vision',
  simplified: 'mode-simplified',
  voice: 'mode-voice',
};

const DEFAULT_SETTINGS: IndividualSettings = {
  darkMode: false,
  textToSpeech: false,
  highContrast: false,
  largeText: false,
  fontSize: 16,
  colorContrast: 1,
  ttsVolume: 80,
  ttsRate: 1.0,
  ttsVoiceURI: null,
  autoRead: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

// ─── OpenDyslexic font loader ──────────────────────────────────────────────────

/**
 * Lazily injects the OpenDyslexic font stylesheet from CDN the first time
 * dyslexia mode is activated. Removed when mode is turned off.
 */
function loadOpenDyslexicFont(load: boolean) {
  const id = 'opendyslexic-font-link';
  const existing = document.getElementById(id);

  if (load && !existing) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    // OpenDyslexic hosted via open-dyslexic.org CDN
    link.href =
      'https://fonts.cdnfonts.com/css/opendyslexic';
    document.head.appendChild(link);
  } else if (!load && existing) {
    existing.remove();
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // ── Read persisted values from localStorage ──
  const [activeMode, setActiveModeState] = useState<AccessibilityMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE);
      return (saved as AccessibilityMode) ?? null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState<IndividualSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // ── Apply mode CSS classes to <html> whenever activeMode changes ──
  useEffect(() => {
    const html = document.documentElement;

    // Remove all mode classes first
    Object.values(MODE_CLASSES).forEach((cls) => html.classList.remove(cls));

    // Apply the new mode class
    if (activeMode) {
      html.classList.add(MODE_CLASSES[activeMode]);
    }

    // Load / unload OpenDyslexic font
    loadOpenDyslexicFont(activeMode === 'dyslexia');

    // Persist to localStorage
    try {
      if (activeMode) {
        localStorage.setItem(STORAGE_KEY_MODE, activeMode);
      } else {
        localStorage.removeItem(STORAGE_KEY_MODE);
      }
    } catch {
      // localStorage unavailable (private browsing etc.) — fail silently
    }
  }, [activeMode]);

  // ── Apply individual settings CSS classes to <html> ──
  useEffect(() => {
    const html = document.documentElement;

    // Dark mode
    if (settings.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // High contrast
    if (settings.highContrast) {
      html.classList.add('setting-high-contrast');
    } else {
      html.classList.remove('setting-high-contrast');
    }

    // Large text
    if (settings.largeText) {
      html.classList.add('setting-large-text');
    } else {
      html.classList.remove('setting-large-text');
    }

    // Color contrast level
    html.classList.remove('contrast-low', 'contrast-normal', 'contrast-high');
    const contrastMap = ['contrast-low', 'contrast-normal', 'contrast-high'];
    html.classList.add(contrastMap[settings.colorContrast] ?? 'contrast-normal');

    // Font size via CSS variable
    html.style.setProperty('--font-size', `${settings.fontSize}px`);

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // fail silently
    }
  }, [settings]);

  // ── Public API ──

  const setActiveMode = useCallback((mode: AccessibilityMode) => {
    // Clicking the currently-active mode deactivates it
    setActiveModeState((prev) => (prev === mode ? null : mode));
  }, []);

  const updateSettings = useCallback((patch: Partial<IndividualSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <AccessibilityContext.Provider value={{ activeMode, setActiveMode, settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the global accessibility state and update functions.
 * Must be used inside <AccessibilityProvider>.
 */
export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used inside <AccessibilityProvider>');
  }
  return ctx;
}
