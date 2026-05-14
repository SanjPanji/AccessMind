import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
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
  Moon,
  Minimize2,
  Sun
} from 'lucide-react';
import { useAccessibility, type AccessibilityMode } from '../context/AccessibilityContext';

export default function Accessibility() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Connect to the global accessibility context ──────────────────────────────
  // activeMode and settings are shared across the entire app. Any change here
  // is immediately reflected on Dashboard, Profile, and all other pages.
  const { activeMode, setActiveMode, settings, updateSettings } = useAccessibility();

  // ── Accessibility mode definitions ─────────────────────────────────────────
  const modes: Array<{
    id: AccessibilityMode;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    features: string[];
  }> = [
    {
      id: 'adhd',
      name: t('accessibility.adhdName'),
      description: t('accessibility.adhdDesc'),
      icon: Zap,
      color: 'blue',
      features: [
        t('accessibility.adhdF1'),
        t('accessibility.adhdF2'),
        t('accessibility.adhdF3'),
        t('accessibility.adhdF4'),
        t('accessibility.adhdF5'),
        t('accessibility.adhdF6'),
      ],
    },
    {
      id: 'dyslexia',
      name: t('accessibility.dyslexiaName'),
      description: t('accessibility.dyslexiaDesc'),
      icon: BookOpen,
      color: 'purple',
      features: [
        t('accessibility.dyslexiaF1'),
        t('accessibility.dyslexiaF2'),
        t('accessibility.dyslexiaF3'),
        t('accessibility.dyslexiaF4'),
        t('accessibility.dyslexiaF5'),
        t('accessibility.dyslexiaF6'),
      ],
    },
    {
      id: 'low-vision',
      name: t('accessibility.lowVisionName'),
      description: t('accessibility.lowVisionDesc'),
      icon: Eye,
      color: 'green',
      features: [
        t('accessibility.lowVisionF1'),
        t('accessibility.lowVisionF2'),
        t('accessibility.lowVisionF3'),
        t('accessibility.lowVisionF4'),
        t('accessibility.lowVisionF5'),
        t('accessibility.lowVisionF6'),
      ],
    },
    {
      id: 'simplified',
      name: t('accessibility.simplifiedName'),
      description: t('accessibility.simplifiedDesc'),
      icon: Minimize2,
      color: 'orange',
      features: [
        t('accessibility.simplifiedF1'),
        t('accessibility.simplifiedF2'),
        t('accessibility.simplifiedF3'),
        t('accessibility.simplifiedF4'),
        t('accessibility.simplifiedF5'),
        t('accessibility.simplifiedF6'),
      ],
    },
    {
      id: 'voice',
      name: t('accessibility.voiceName'),
      description: t('accessibility.voiceDesc'),
      icon: Mic,
      color: 'pink',
      features: [
        t('accessibility.voiceF1'),
        t('accessibility.voiceF2'),
        t('accessibility.voiceF3'),
        t('accessibility.voiceF4'),
        t('accessibility.voiceF5'),
        t('accessibility.voiceF6'),
      ],
    },
  ] as const;

  // ── Individual settings definitions ────────────────────────────────────────
  // Each setting is wired to a real value in the context instead of static defaults.
  const generalSettings = [
    {
      id: 'dark-mode' as const,
      label: t('accessibility.darkMode'),
      icon: settings.darkMode ? Sun : Moon,
      enabled: settings.darkMode,
      onToggle: () => updateSettings({ darkMode: !settings.darkMode }),
    },
    {
      id: 'text-to-speech' as const,
      label: t('accessibility.textToSpeech'),
      icon: Volume2,
      enabled: settings.textToSpeech,
      onToggle: () => updateSettings({ textToSpeech: !settings.textToSpeech }),
    },
    {
      id: 'high-contrast' as const,
      label: t('accessibility.highContrast'),
      icon: Palette,
      enabled: settings.highContrast,
      onToggle: () => updateSettings({ highContrast: !settings.highContrast }),
    },
    {
      id: 'large-text' as const,
      label: t('accessibility.largeText'),
      icon: Type,
      enabled: settings.largeText,
      onToggle: () => updateSettings({ largeText: !settings.largeText }),
    },
  ];

  // ── Color name for contrast slider label ────────────────────────────────────
  const contrastLabels = [
    t('accessibility.low'),
    t('accessibility.normal'),
    t('accessibility.high'),
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
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('accessibility.title')}</h1>
                  <p className="text-xs text-slate-600">{t('accessibility.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Active mode badge in header */}
            {activeMode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-blue-700">
                  {modes.find((m) => m.id === activeMode)?.name} {t('accessibility.activated')}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">{t('accessibility.personalized')}</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t('accessibility.heroTitle')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('accessibility.heroDesc')}
          </p>
        </div>

        {/* Accessibility Mode Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modes.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <div
                key={mode.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? `border-${mode.color}-500 shadow-${mode.color}-500/20 ring-2 ring-${mode.color}-300`
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
                }`}
                onClick={() => setActiveMode(mode.id)}
                // Accessibility: make card keyboard-activatable
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${mode.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveMode(mode.id);
                  }
                }}
              >
                {/* Card header */}
                <div className={`bg-gradient-to-br from-${mode.color}-50 to-${mode.color}-100 p-6 border-b border-${mode.color}-200`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-white rounded-xl shadow-sm border border-${mode.color}-200`}>
                      <mode.icon className={`w-6 h-6 text-${mode.color}-600`} />
                    </div>
                    {/* Checkmark shown when mode is active */}
                    {isActive && (
                      <div className={`bg-${mode.color}-600 text-white p-1.5 rounded-full`}>
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{mode.name}</h3>
                  <p className="text-sm text-slate-600">{mode.description}</p>
                </div>

                {/* Feature list */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">{t('accessibility.featuresIncluded')}</h4>
                  <ul className="space-y-2">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className={`w-4 h-4 mt-0.5 text-${mode.color}-600 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activate button */}
                <div className="px-6 pb-6">
                  <button
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? `bg-gradient-to-r from-${mode.color}-600 to-${mode.color}-500 text-white shadow-lg`
                        : `bg-${mode.color}-50 text-${mode.color}-700 hover:bg-${mode.color}-100`
                    }`}
                    onClick={(e) => {
                      // Prevent double-firing from parent card onClick
                      e.stopPropagation();
                      setActiveMode(mode.id);
                    }}
                    aria-label={isActive ? `Deactivate ${mode.name}` : `Activate ${mode.name}`}
                  >
                    {isActive ? t('accessibility.activated') : t('accessibility.activateMode')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Settings Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            {t('accessibility.individualSettings')}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Toggle switches — wired to real context state */}
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
                    <p className="text-sm text-slate-600">{t('accessibility.toggleFeature')}</p>
                  </div>
                </div>
                {/* Toggle switch — clicking calls the context updater */}
                <label className="relative inline-flex items-center cursor-pointer" aria-label={setting.label}>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={setting.enabled}
                    onChange={setting.onToggle}
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}

            {/* Font Size Slider — live-updates CSS variable via context */}
            <div className="md:col-span-2 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Type className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{t('accessibility.fontSize')}</h4>
                    <p className="text-sm text-slate-600">{t('accessibility.adjustTextSize')}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 tabular-nums">
                  {settings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="14"
                max="24"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                aria-label={`Font size: ${settings.fontSize}px`}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{t('accessibility.smaller')}</span>
                <span>{t('accessibility.default')}</span>
                <span>{t('accessibility.larger')}</span>
              </div>
            </div>

            {/* Color Contrast Slider — 0=low, 1=normal, 2=high */}
            <div className="md:col-span-2 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Palette className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{t('accessibility.colorContrast')}</h4>
                    <p className="text-sm text-slate-600">{t('accessibility.enhanceClarity')}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {contrastLabels[settings.colorContrast]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={settings.colorContrast}
                onChange={(e) => updateSettings({ colorContrast: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                aria-label={`Color contrast: ${contrastLabels[settings.colorContrast]}`}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{t('accessibility.low')}</span>
                <span>{t('accessibility.normal')}</span>
                <span>{t('accessibility.high')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Mode Preview Banner */}
        {activeMode && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Focus className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t('accessibility.previewModeActive')}</h3>
                <p className="text-sm text-slate-600">
                  {t('accessibility.experiencing')}{' '}
                  <strong>{modes.find((m) => m.id === activeMode)?.name}</strong>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <p className="text-slate-700 mb-4">{t('accessibility.previewDesc')}</p>
              {/* Save Settings is automatic — this just navigates back to confirm */}
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {t('accessibility.saveSettings')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
