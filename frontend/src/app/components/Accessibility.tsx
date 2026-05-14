import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Brain,
  Zap,
  Eye,
  Volume2,
  Focus,
  Type,
  Palette,
  Sliders,
  Check,
  ArrowLeft,
  BookOpen,
  Mic,
  Sun,
  Moon,
  Minimize2
} from 'lucide-react';

export default function Accessibility() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const modes = [
    {
      id: 'adhd',
      name: 'ADHD Mode',
      description: 'Minimizes distractions with focused, clean interface',
      icon: Zap,
      color: 'blue',
      features: [
        'Hidden secondary buttons',
        'Reduced color palette',
        'Highlighted primary actions',
        'Text broken into small blocks',
        'Built-in focus timer',
        'Step-by-step task guidance'
      ]
    },
    {
      id: 'dyslexia',
      name: 'Dyslexia Mode',
      description: 'Optimized typography and spacing for easier reading',
      icon: BookOpen,
      color: 'purple',
      features: [
        'Dyslexia-friendly font (OpenDyslexic)',
        'Increased letter spacing',
        'Left-aligned text',
        'Reading line highlight',
        'Shorter sentence formatting',
        'Reduced visual noise'
      ]
    },
    {
      id: 'low-vision',
      name: 'Low Vision Mode',
      description: 'Enhanced visibility with larger text and high contrast',
      icon: Eye,
      color: 'green',
      features: [
        'Larger text sizes',
        'High contrast colors',
        'Bigger interactive elements',
        'Zoom controls',
        'Screen reader optimization',
        'Keyboard navigation support'
      ]
    },
    {
      id: 'simplified',
      name: 'Simplified Mode',
      description: 'Essential features only, minimal complexity',
      icon: Minimize2,
      color: 'orange',
      features: [
        'Basic functions only',
        'Simplified navigation',
        'Large card layouts',
        'Step-by-step UI flow',
        'Minimal menu options',
        'Clear visual hierarchy'
      ]
    },
    {
      id: 'voice',
      name: 'Voice Navigation',
      description: 'Control the platform with voice commands',
      icon: Mic,
      color: 'pink',
      features: [
        '"Open materials"',
        '"Read text aloud"',
        '"Go to assignments"',
        '"Increase font size"',
        '"Enable dark mode"',
        '"Help me navigate"'
      ]
    }
  ];

  const generalSettings = [
    { id: 'dark-mode', label: 'Dark Mode', icon: Moon, enabled: false },
    { id: 'text-to-speech', label: 'Text-to-Speech', icon: Volume2, enabled: false },
    { id: 'high-contrast', label: 'High Contrast', icon: Palette, enabled: false },
    { id: 'large-text', label: 'Large Text', icon: Type, enabled: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Accessibility Settings</h1>
                  <p className="text-xs text-slate-600">Customize your learning experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Personalized for You</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Learning Mode
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AccessMind adapts to your unique needs. Select the mode that works best for you,
            or mix and match individual features.
          </p>
        </div>

        {/* Accessibility Modes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer overflow-hidden ${
                activeMode === mode.id
                  ? `border-${mode.color}-500 shadow-${mode.color}-500/20`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
              }`}
              onClick={() => setActiveMode(activeMode === mode.id ? null : mode.id)}
            >
              <div className={`bg-gradient-to-br from-${mode.color}-50 to-${mode.color}-100 p-6 border-b border-${mode.color}-200`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm border border-${mode.color}-200`}>
                    <mode.icon className={`w-6 h-6 text-${mode.color}-600`} />
                  </div>
                  {activeMode === mode.id && (
                    <div className={`bg-${mode.color}-600 text-white p-1.5 rounded-full`}>
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{mode.name}</h3>
                <p className="text-sm text-slate-600">{mode.description}</p>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Features Included:</h4>
                <ul className="space-y-2">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className={`w-4 h-4 mt-0.5 text-${mode.color}-600 flex-shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-6">
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    activeMode === mode.id
                      ? `bg-gradient-to-r from-${mode.color}-600 to-${mode.color}-500 text-white shadow-lg`
                      : `bg-${mode.color}-50 text-${mode.color}-700 hover:bg-${mode.color}-100`
                  }`}
                >
                  {activeMode === mode.id ? 'Activated' : 'Activate Mode'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            Individual Settings
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {generalSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <setting.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{setting.label}</h4>
                    <p className="text-sm text-slate-600">Toggle this feature</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}

            {/* Font Size Slider */}
            <div className="md:col-span-2 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Type className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Font Size</h4>
                    <p className="text-sm text-slate-600">Adjust text size globally</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">16px</span>
              </div>
              <input
                type="range"
                min="14"
                max="24"
                defaultValue="16"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Smaller</span>
                <span>Default</span>
                <span>Larger</span>
              </div>
            </div>

            {/* Color Contrast Slider */}
            <div className="md:col-span-2 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Palette className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Color Contrast</h4>
                    <p className="text-sm text-slate-600">Enhance visual clarity</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">Normal</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                defaultValue="0"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Mode */}
        {activeMode && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Focus className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Preview Mode Active</h3>
                <p className="text-sm text-slate-600">Experiencing {modes.find(m => m.id === activeMode)?.name}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <p className="text-slate-700 mb-4">
                This is how your interface will look with the selected accessibility mode.
                All screens will adapt to these settings automatically.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
