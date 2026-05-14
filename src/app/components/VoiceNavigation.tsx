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
  SkipBack
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VoiceNavigation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  const commands = [
    { command: `"${t('voice.cmd1')}"`, action: t('voice.act1'), icon: '📚' },
    { command: `"${t('voice.cmd2')}"`, action: t('voice.act2'), icon: '🔊' },
    { command: `"${t('voice.cmd3')}"`, action: t('voice.act3'), icon: '📝' },
    { command: `"${t('voice.cmd4')}"`, action: t('voice.act4'), icon: '🔍' },
    { command: `"${t('voice.cmd5')}"`, action: t('voice.act5'), icon: '🌙' },
    { command: `"${t('voice.cmd6')}"`, action: t('voice.act6'), icon: '🧭' },
    { command: `"${t('voice.cmd7')}"`, action: t('voice.act7'), icon: '🤖' },
    { command: `"${t('voice.cmd8')}"`, action: t('voice.act8'), icon: '⏰' }
  ];

  const quickPhrases = [
    t('voice.phrase1'),
    t('voice.phrase2'),
    t('voice.phrase3'),
    t('voice.phrase4'),
    t('voice.phrase5'),
    t('voice.phrase6')
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const sampleTexts = quickPhrases;
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setRecognizedText(randomText);
        setRecentCommands([randomText, ...recentCommands.slice(0, 4)]);
        setVoiceResponse(t('voice.commandRecognized'));
        setIsListening(false);
      }, 2000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

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
                  <h1 className="text-lg font-bold text-slate-900">{t('voice.pageTitle')}</h1>
                  <p className="text-xs text-slate-600">{t('voice.pageSubtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <Radio className="w-4 h-4 text-pink-600 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">{t('voice.heroBadge')}</span>
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
                    isListening
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 animate-pulse'
                      : 'bg-gradient-to-br from-pink-500 to-purple-600 hover:shadow-pink-500/50'
                  }`}
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Mic className="w-16 h-16 text-white" />
                    </motion.div>
                  ) : (
                    <MicOff className="w-16 h-16 text-white" />
                  )}

                  {isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-pink-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {isListening ? t('voice.listening') : t('voice.tapToSpeak')}
                </h3>
                <p className="text-slate-600 mb-6">
                  {isListening
                    ? t('voice.sayCommand')
                    : t('voice.clickMic')}
                </p>

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
                {t('voice.ttsTitle')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <SkipBack className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={toggleSpeaking}
                    className="p-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSpeaking ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <SkipForward className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{t('voice.readingSpeed')}</span>
                    <span>1.0x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{t('voice.volume')}</span>
                    <span>80%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700">
                    {isSpeaking ? t('voice.currentlyReading') : t('voice.readerPaused')}
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
                      key={index}
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
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('voice.tryPhrases')}</h3>
              <div className="flex flex-wrap gap-2">
                {quickPhrases.map((phrase, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setRecognizedText(phrase);
                      setRecentCommands([phrase, ...recentCommands.slice(0, 4)]);
                      setVoiceResponse(`${t('voice.executing')} "${phrase}"`);
                    }}
                    className="px-4 py-2 bg-white border border-pink-200 rounded-full text-sm font-medium text-slate-700 hover:bg-pink-50 hover:border-pink-300 transition-all"
                  >
                    "{phrase}"
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('voice.settingsTitle')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.wakeWord')}</span>
                  <span className="text-sm text-blue-600">"Hey AccessMind"</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.language')}</span>
                  <span className="text-sm text-blue-600">
                    {i18n.language === 'ru' ? 'Русский' : i18n.language === 'kk' ? 'Қазақша' : 'English (US)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.voiceType')}</span>
                  <span className="text-sm text-blue-600">Natural Female</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{t('voice.autoRead')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
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
