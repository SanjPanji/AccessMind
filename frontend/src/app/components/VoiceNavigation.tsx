import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Command,
  Radio,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Loader2,
  AlertTriangle,
  Globe,
  CheckCircle2,
  AlertTriangle as AlertIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeech } from '../../lib/hooks/useSpeech';
import { processVoiceCommand, type CommandMatch, type VoiceLang } from '../../lib/commandParser';
import { useAccessibility } from '../context/AccessibilityContext';

const I18N_TO_VOICE_LANG: Record<string, VoiceLang> = {
  en: 'en',
  ru: 'ru',
  kk: 'kk',
};

const VOICE_LANG_LABELS: Record<VoiceLang, string> = {
  en: 'English',
  ru: 'Русский',
  kk: 'Қазақша',
};

/**
 * Command Dispatcher — выполняет распознанные команды.
 * ПРИОРИТЕТ: выполнить действие → затем UI
 */
interface CommandDispatcher {
  execute: (action: string) => { success: boolean; message: string };
}

const createCommandDispatcher = (navigate: any): CommandDispatcher => {
  return {
    execute: (action: string) => {
      try {
        // Навигация
        if (action.startsWith('/')) {
          navigate(action);
          console.log('[VoiceCommand] EXECUTED:', action);
          return { success: true, message: `Navigating to ${action}` };
        }

        // Специальные действия
        if (action === 'toggle-dark-mode') {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            document.documentElement.classList.remove('dark');
          } else {
            document.documentElement.classList.add('dark');
          }
          console.log('[VoiceCommand] EXECUTED: toggle-dark-mode');
          return { success: true, message: 'Dark mode toggled' };
        }

        if (action === 'increase-font') {
          const current = parseFloat(document.documentElement.style.fontSize || '100');
          document.documentElement.style.fontSize = `${Math.min(current + 20, 200)}%`;
          console.log('[VoiceCommand] EXECUTED: increase-font');
          return { success: true, message: 'Font size increased' };
        }

        if (action === 'decrease-font') {
          const current = parseFloat(document.documentElement.style.fontSize || '100');
          document.documentElement.style.fontSize = `${Math.max(current - 20, 80)}%`;
          console.log('[VoiceCommand] EXECUTED: decrease-font');
          return { success: true, message: 'Font size decreased' };
        }

        if (action === 'read-page') {
          console.log('[VoiceCommand] EXECUTED: read-page (TTS handled by component)');
          return { success: true, message: 'Reading page' };
        }

        // Неизвестное действие
        console.warn('[VoiceCommand] UNKNOWN ACTION:', action);
        return { success: false, message: 'Unknown command' };
      } catch (error) {
        console.error('[VoiceCommand] EXECUTION FAILED:', action, error);
        return { success: false, message: 'Command execution failed' };
      }
    }
  };
};

export default function VoiceNavigation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useAccessibility();
  const {
    speechState,
    errorMessage,
    voiceLang,
    isNativeSTT,
    isWhisperFallback,
    isUnsupported,
    startListening,
    stopRecording,
    speak,
    pause,
    resume,
    cancel,
    changeLanguage: changeVoiceLang,
  } = useSpeech();

  // Инициализируем диспетчер команд один раз
  const dispatcher = createCommandDispatcher(navigate);

  const [recognizedText, setRecognizedText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [lastCommandStatus, setLastCommandStatus] = useState<'success' | 'error' | null>(null);

  // TTS State
  const [ttsProgress, setTtsProgress] = useState(0);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        setAvailableVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Sync i18n language → voice language on mount and change
  useEffect(() => {
    const lang = I18N_TO_VOICE_LANG[i18n.language] || 'en';
    changeVoiceLang(lang);
  }, [i18n.language, changeVoiceLang]);

  // ── Language switching ──────────────────────────────────────────────
  const handleLanguageChange = (lang: VoiceLang) => {
    i18n.changeLanguage(lang);
    changeVoiceLang(lang);
  };

  // ── Command list (translated) ──────────────────────────────────────
  const commands = [
    { command: t('voice.commands.openMaterials'), action: t('voice.commands.openMaterialsDesc'), icon: '📚' },
    { command: t('voice.commands.readText'), action: t('voice.commands.readTextDesc'), icon: '🔊' },
    { command: t('voice.commands.goToAssignments'), action: t('voice.commands.goToAssignmentsDesc'), icon: '📝' },
    { command: t('voice.commands.increaseFont'), action: t('voice.commands.increaseFontDesc'), icon: '🔍' },
    { command: t('voice.commands.enableDarkMode'), action: t('voice.commands.enableDarkModeDesc'), icon: '🌙' },
    { command: t('voice.commands.helpNavigate'), action: t('voice.commands.helpNavigateDesc'), icon: '🧭' },
    { command: t('voice.commands.openAI'), action: t('voice.commands.openAIDesc'), icon: '🤖' },
    { command: t('voice.commands.whatsNext'), action: t('voice.commands.whatsNextDesc'), icon: '⏰' },
  ];

  const quickPhrases: string[] = t('voice.quickPhrases', { returnObjects: true }) as string[];

  /**
   * ⚡ ПОЛНЫЙ PIPELINE:
   * 1️⃣ Выполнить действие (НЕМЕДЛЕННО)
   * 2️⃣ Логировать результат
   * 3️⃣ Обновить UI
   * 4️⃣ Озвучить ответ
   */
  const handleCommandResult = (text: string, match: CommandMatch) => {
    console.log('[VoiceNavigation] 📢 Recognized text:', text);
    console.log('[VoiceNavigation] 🎯 Intent match:', match.action, `(${match.confidence})`);

    // Обновляем историю в UI (это некритично)
    setRecognizedText(text);
    setRecentCommands(prev => [text, ...prev.slice(0, 4)]);

    // ❌ НЕИЗВЕСТНАЯ КОМАНДА → ОШИБКА
    if (match.action === 'UNKNOWN') {
      console.warn('[VoiceNavigation] ❌ UNKNOWN INTENT - не удалось распознать команду');
      setLastCommandStatus('error');
      setVoiceResponse(t('voice.notUnderstood'));
      speak(t('voice.notUnderstood'));
      return;
    }

    // ✅ ИЗВЕСТНАЯ КОМАНДА → ВЫПОЛНИТЬ НЕМЕДЛЕННО
    console.log('[VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY:', match.action);
    const result = dispatcher.execute(match.action);

    if (result.success) {
      // 📊 Результат: успешное выполнение
      setLastCommandStatus('success');
      console.log('[VoiceNavigation] ✅ ACTION COMPLETED:', result.message);

      // Формируем ответ
      const confidenceLabel = match.confidence === 'high' ? '(точное совпадение)' : '(с использованием AI)';
      const responseText = `${result.message} ${confidenceLabel}`;
      setVoiceResponse(responseText);

      // Озвучиваем результат
      speak(responseText);
    } else {
      // 📊 Результат: ошибка выполнения
      setLastCommandStatus('error');
      console.error('[VoiceNavigation] ❌ ACTION FAILED:', result.message);
      setVoiceResponse(result.message);
      speak(result.message);
    }
  };

  // ── Manual execution for UI buttons ─────────────────────────────────
  const executePhrase = async (phrase: string) => {
    console.log('[VoiceNavigation] 🔄 Executing phrase:', phrase);
    setRecognizedText(phrase);
    setRecentCommands(prev => [phrase, ...prev.slice(0, 4)]);
    setVoiceResponse(t('voice.processing'));
    
    // Parse using the existing engine
    const match = await processVoiceCommand(phrase, voiceLang);
    handleCommandResult(phrase, match);
  };

  // ── UI toggles ─────────────────────────────────────────────────────
  const toggleListening = () => {
    if (speechState === 'listening') {
      // For MediaRecorder path: stop recording to trigger transcription.
      // For native STT path: abort recognition entirely.
      if (isWhisperFallback) {
        stopRecording();
      } else {
        cancel();
      }
    } else if (speechState === 'processing') {
      cancel();
    } else {
      setVoiceResponse('');
      setRecognizedText('');
      startListening(handleCommandResult);
    }
  };

  const getPageText = () => {
    const main = document.querySelector('main');
    return main ? main.innerText : document.body.innerText;
  };

  const handleSpeak = (text: string, startIndex = 0) => {
    const textToSpeak = text.substring(startIndex);
    setCurrentSpeechText(text);
    speak(textToSpeak, voiceLang, {
      volume: settings.ttsVolume / 100,
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      onProgress: (percent, charIndex) => {
        const totalChars = text.length;
        const currentTotalIndex = startIndex + charIndex;
        setTtsProgress(Math.min(100, Math.round((currentTotalIndex / totalChars) * 100)));
      }
    });
  };

  const toggleSpeaking = () => {
    if (speechState === 'speaking') {
      pause();
    } else if (speechState === 'paused') {
      resume();
    } else {
      const text = getPageText() || t('voice.currentlyReading');
      handleSpeak(text);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    setTtsProgress(percent);
    if (!currentSpeechText) return;
    
    const startIndex = Math.floor(currentSpeechText.length * (percent / 100));
    if (speechState === 'speaking' || speechState === 'paused') {
      handleSpeak(currentSpeechText, startIndex);
    }
  };

  const skipForward = () => {
    if (!currentSpeechText) return;
    const newPercent = Math.min(100, ttsProgress + 10);
    setTtsProgress(newPercent);
    const startIndex = Math.floor(currentSpeechText.length * (newPercent / 100));
    handleSpeak(currentSpeechText, startIndex);
  };

  const skipBackward = () => {
    if (!currentSpeechText) return;
    const newPercent = Math.max(0, ttsProgress - 10);
    setTtsProgress(newPercent);
    const startIndex = Math.floor(currentSpeechText.length * (newPercent / 100));
    handleSpeak(currentSpeechText, startIndex);
  };

  // ── Determine mic button state label ───────────────────────────────
  const getMicLabel = () => {
    switch (speechState) {
      case 'listening': return t('voice.listening');
      case 'processing': return t('voice.processing');
      case 'speaking': return t('voice.speaking');
      case 'error': return t('voice.error');
      default: return t('voice.tapToSpeak');
    }
  };

  const getMicHint = () => {
    if (speechState === 'listening' || speechState === 'processing') return t('voice.sayCommand');
    if (speechState === 'error') return errorMessage;
    return t('voice.clickMic');
  };

  const isActive = speechState === 'listening' || speechState === 'processing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('voice.title')}</h1>
                  <p className="text-xs text-slate-600">{t('voice.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {(['en', 'ru', 'kk'] as VoiceLang[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      voiceLang === lang
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {VOICE_LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Radio className="w-4 h-4 text-pink-600 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">{t('voice.badge')}</span>
            </div>
            {isWhisperFallback && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full shadow-sm border border-amber-300">
                <span className="text-xs">🎙️</span>
                <span className="text-sm font-medium text-amber-700">Whisper AI fallback mode</span>
              </div>
            )}
            {isUnsupported && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full shadow-sm border border-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Voice not supported in this browser</span>
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t('voice.heroTitle')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('voice.heroSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Voice Control */}
          <div className="space-y-6">
            {/* Main Voice Control */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
              <div className="text-center">
                {/* Microphone Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 transition-all shadow-2xl ${
                    speechState === 'error'
                      ? 'bg-gradient-to-br from-red-500 to-orange-600'
                      : isActive
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 animate-pulse'
                        : 'bg-gradient-to-br from-pink-500 to-purple-600 hover:shadow-pink-500/50'
                  }`}
                  aria-label={getMicLabel()}
                >
                  {isActive ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {speechState === 'processing'
                        ? <Loader2 className="w-16 h-16 text-white animate-spin" />
                        : <Mic className="w-16 h-16 text-white" />
                      }
                    </motion.div>
                  ) : speechState === 'error' ? (
                    <AlertTriangle className="w-16 h-16 text-white" />
                  ) : (
                    <MicOff className="w-16 h-16 text-white" />
                  )}

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-pink-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {getMicLabel()}
                </h3>
                <p className={`mb-6 text-sm ${speechState === 'error' ? 'text-red-600' : 'text-slate-600'}`}>
                  {getMicHint()}
                </p>
                {isWhisperFallback && speechState === 'listening' && (
                  <p className="text-xs text-amber-600 mb-4 bg-amber-50 px-3 py-1.5 rounded-full">
                    🎙️ Recording... tap again to stop and transcribe
                  </p>
                )}
                {isNativeSTT && speechState !== 'listening' && speechState !== 'processing' && (
                  <p className="text-xs text-slate-400 mb-4">
                    Using browser's built-in recognition
                  </p>
                )}

                {/* Recognized Text Display */}
                <AnimatePresence>
                  {recognizedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 mb-4"
                    >
                      <p className="text-sm text-slate-600 mb-1">{t('voice.youSaid')}</p>
                      <p className="text-lg font-semibold text-slate-900">"{recognizedText}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voice Response */}
                <AnimatePresence>
                  {voiceResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-green-50 rounded-2xl border border-green-200 flex items-start gap-3"
                    >
                      <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{voiceResponse}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Text-to-Speech Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                {t('voice.ttsPlayer')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <button onClick={skipBackward} className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <SkipBack className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={toggleSpeaking}
                    className="p-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {speechState === 'speaking' ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button onClick={skipForward} className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <SkipForward className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{ttsProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ttsProgress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{t('voice.readingSpeed')}</span>
                    <span>{settings.ttsRate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.ttsRate}
                    onChange={(e) => updateSettings({ ttsRate: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{t('voice.volume')}</span>
                    <span>{settings.ttsVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.ttsVolume}
                    onChange={(e) => updateSettings({ ttsVolume: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700">
                    {speechState === 'speaking' ? t('voice.currentlyReading') : t('voice.readerPaused')}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Commands */}
            {recentCommands.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  {t('voice.recentCommands')}
                </h3>
                <div className="space-y-2">
                  {recentCommands.map((cmd, index) => (
                    <motion.div
                      key={`${cmd}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200"
                    >
                      <Command className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-slate-700">"{cmd}"</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Available Commands */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('voice.availableCommands')}</h3>
              <div className="space-y-3">
                {commands.map((cmd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => executePhrase(cmd.command)}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-3xl">{cmd.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">{cmd.command}</p>
                      <p className="text-sm text-slate-600">{cmd.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Phrases */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg border border-pink-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('voice.tryThesePhrases')}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(quickPhrases) && quickPhrases.map((phrase, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => executePhrase(phrase)}
                    className="px-4 py-2 bg-white border border-pink-200 rounded-full text-sm font-medium text-slate-700 hover:bg-pink-50 hover:border-pink-300 transition-all"
                  >
                    "{phrase}"
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('voice.voiceSettings')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.wakeWord')}</span>
                  <span className="text-sm text-blue-600">"Hey AccessMind"</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.language')}</span>
                  <span className="text-sm text-blue-600">{VOICE_LANG_LABELS[voiceLang]}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.voiceType')}</span>
                  <select 
                    className="text-sm text-blue-600 bg-transparent border-none outline-none text-right cursor-pointer max-w-[200px] truncate"
                    value={settings.ttsVoiceURI || ''}
                    onChange={(e) => updateSettings({ ttsVoiceURI: e.target.value || null })}
                  >
                    <option value="">{t('voice.naturalFemale')} (Default)</option>
                    {availableVoices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.autoRead')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.autoRead}
                      onChange={(e) => updateSettings({ autoRead: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
