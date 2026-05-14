import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  const commands = [
    { command: '"Open materials"', action: 'Navigate to your learning materials', icon: '📚' },
    { command: '"Read text"', action: 'Start text-to-speech for current content', icon: '🔊' },
    { command: '"Go to assignments"', action: 'Open assignments page', icon: '📝' },
    { command: '"Increase font"', action: 'Make text larger', icon: '🔍' },
    { command: '"Enable dark mode"', action: 'Switch to dark theme', icon: '🌙' },
    { command: '"Help me navigate"', action: 'Get navigation assistance', icon: '🧭' },
    { command: '"Open AI assistant"', action: 'Launch AI learning helper', icon: '🤖' },
    { command: '"What\'s next"', action: 'Show upcoming tasks and classes', icon: '⏰' }
  ];

  const quickPhrases = [
    'Open dashboard',
    'Read this page',
    'Show my grades',
    'What assignments are due?',
    'Enable focus mode',
    'Start a quiz'
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const sampleTexts = [
          'Open assignments',
          'Read text aloud',
          'Go to dashboard',
          'Enable dark mode',
          'What\'s my next class?'
        ];
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setRecognizedText(randomText);
        setRecentCommands([randomText, ...recentCommands.slice(0, 4)]);
        setVoiceResponse('Command recognized! Executing...');
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
                  <h1 className="text-lg font-bold text-slate-900">Voice Navigation</h1>
                  <p className="text-xs text-slate-600">Control with your voice</p>
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
            <span className="text-sm font-medium text-slate-700">Voice Commands Active</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Speak to Navigate
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Use voice commands to control AccessMind hands-free. Just speak naturally.
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
                  {isListening ? 'Listening...' : 'Tap to Speak'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {isListening
                    ? 'Say a command clearly'
                    : 'Click the microphone to start voice control'}
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
                      <p className="text-sm text-slate-600 mb-1">You said:</p>
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
                Text-to-Speech Player
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
                    <span>Reading speed</span>
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
                    <span>Volume</span>
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
                    {isSpeaking ? '🔊 Currently reading page content...' : '⏸️ Reader paused'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Commands */}
            {recentCommands.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Recent Commands
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
              <h3 className="text-xl font-bold text-slate-900 mb-6">Available Commands</h3>
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
              <h3 className="text-lg font-bold text-slate-900 mb-4">Try These Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {quickPhrases.map((phrase, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setRecognizedText(phrase);
                      setRecentCommands([phrase, ...recentCommands.slice(0, 4)]);
                      setVoiceResponse(`Executing: ${phrase}`);
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
              <h3 className="text-lg font-bold text-slate-900 mb-4">Voice Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Wake Word</span>
                  <span className="text-sm text-blue-600">"Hey AccessMind"</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Language</span>
                  <span className="text-sm text-blue-600">English (US)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Voice Type</span>
                  <span className="text-sm text-blue-600">Natural Female</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Auto-Read Content</span>
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
