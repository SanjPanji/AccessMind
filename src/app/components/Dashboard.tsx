import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import MobileNav from './MobileNav';
import {
  Brain,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  Plus,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Mic,
  Eye,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Connect to global accessibility context for quick toggles
  const { activeMode, setActiveMode, settings, updateSettings } = useAccessibility();

  const upcomingClasses = [
    { id: 1, name: t('dashboard.mathAdv'), time: '10:00 AM', room: t('dashboard.hall204'), color: 'blue' },
    { id: 2, name: t('dashboard.cs'), time: '2:00 PM', room: t('dashboard.lab3'), color: 'purple' },
    { id: 3, name: t('dashboard.physLab'), time: '4:30 PM', room: t('dashboard.lab1'), color: 'green' }
  ];

  const assignments = [
    { id: 1, title: t('dashboard.mathProb'), dueDate: t('dashboard.tomorrow'), status: 'pending', subject: t('dashboard.math') },
    { id: 2, title: t('dashboard.csProj'), dueDate: t('dashboard.may16'), status: 'in-progress', subject: t('dashboard.cs') },
    { id: 3, title: t('dashboard.physRep'), dueDate: t('dashboard.may18'), status: 'pending', subject: t('dashboard.physics') }
  ];

  const grades = [
    { subject: t('dashboard.math'), grade: 'A', percentage: 92, trend: 'up' },
    { subject: t('dashboard.cs'), grade: 'A-', percentage: 88, trend: 'up' },
    { subject: t('dashboard.physics'), grade: 'B+', percentage: 85, trend: 'stable' },
    { subject: t('dashboard.english'), grade: 'A', percentage: 94, trend: 'up' }
  ];

  const quickActions = [
    { icon: FileText, label: t('dashboard.uploadAssignment'), action: () => navigate('/assignments'), color: 'blue' },
    { icon: Brain, label: t('dashboard.aiLearningAssistant'), action: () => navigate('/ai-assistant'), color: 'purple' },
    { icon: Mic, label: t('dashboard.voiceNavigation'), action: () => navigate('/voice-navigation'), color: 'green' },
    { icon: Eye, label: t('dashboard.accessibilitySettings'), action: () => navigate('/accessibility'), color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                AccessMind
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('dashboard.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={i18n.language} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-slate-100 border-none rounded-xl px-2 py-1.5 text-sm font-medium outline-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <option value="ru">RU</option>
                <option value="kk">KK</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all"
                aria-label="AI Assistant"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/notifications')} className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate('/accessibility')}
                className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <div 
                className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer hover:bg-slate-50 rounded-lg p-1 transition-colors"
                onClick={() => navigate('/profile')}
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-blue-200"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-900">{i18n.language === 'ru' ? 'Алекс Джонсон' : i18n.language === 'kk' ? 'Алекс Джонсон' : 'Alex Johnson'}</p>
                  <p className="text-xs text-slate-500">{t('dashboard.student')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('dashboard.welcome', { name: i18n.language === 'ru' || i18n.language === 'kk' ? 'Алекс' : 'Alex' })}</h2>
          <p className="text-slate-600">{t('dashboard.subtitle')}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className={`inline-flex p-3 rounded-xl bg-${action.color}-50 text-${action.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="font-medium text-slate-900 text-left">{action.label}</p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {t('dashboard.todaysSchedule')}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">{t('dashboard.dateToday')}</span>
                  <button 
                    onClick={() => navigate('/attendance')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('dashboard.viewAll')}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-${classItem.color}-50 border border-${classItem.color}-100 hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className={`w-1 h-14 bg-${classItem.color}-500 rounded-full`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{classItem.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.time}
                        </span>
                        <span>{classItem.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  {t('dashboard.upcomingAssignments')}
                </h3>
                <button
                  onClick={() => navigate('/assignments')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('dashboard.viewAll')}
                </button>
              </div>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${
                      assignment.status === 'pending' ? 'bg-orange-50' :
                      assignment.status === 'in-progress' ? 'bg-blue-50' : 'bg-green-50'
                    }`}>
                      {assignment.status === 'pending' ? (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      ) : assignment.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{assignment.title}</h4>
                      <p className="text-sm text-slate-600">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{t('dashboard.due')} {assignment.dueDate}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {assignment.status === 'pending' ? t('dashboard.notStarted') :
                         assignment.status === 'in-progress' ? t('dashboard.inProgress') : t('dashboard.completed')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Accessibility Quick Toggle — wired to global context */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('dashboard.quickAccessibility')}</h3>
              <div className="space-y-3">

                {/* ADHD Mode — toggles global mode via context */}
                <button
                  onClick={() => setActiveMode('adhd')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    activeMode === 'adhd'
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border-slate-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${activeMode === 'adhd' ? 'text-blue-800' : 'text-slate-700'}`}>
                    {t('dashboard.adhdMode')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeMode === 'adhd' && (
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">ON</span>
                    )}
                    <Zap className={`w-4 h-4 ${activeMode === 'adhd' ? 'text-blue-500' : 'text-slate-400'}`} />
                  </div>
                </button>

                {/* Voice Commands — navigates to voice navigation page */}
                <button
                  onClick={() => navigate('/voice-navigation')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-all"
                >
                  <span className="text-sm font-medium text-slate-700">{t('dashboard.voiceCommands')}</span>
                  <Mic className="w-4 h-4 text-slate-400" />
                </button>

                {/* Text-to-Speech — toggles individual setting in context */}
                <button
                  onClick={() => updateSettings({ textToSpeech: !settings.textToSpeech })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    settings.textToSpeech
                      ? 'bg-purple-50 border-purple-400'
                      : 'bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border-slate-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${settings.textToSpeech ? 'text-purple-800' : 'text-slate-700'}`}>
                    {t('dashboard.textToSpeech')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {settings.textToSpeech && (
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">ON</span>
                    )}
                    <BookOpen className={`w-4 h-4 ${settings.textToSpeech ? 'text-purple-500' : 'text-slate-400'}`} />
                  </div>
                </button>

              </div>
            </div>

            {/* Grades Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  {t('dashboard.currentGrades')}
                </h3>
                <button 
                  onClick={() => navigate('/grades')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('dashboard.viewAll')}
                </button>
              </div>
              <div className="space-y-4">
                {grades.map((grade, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{grade.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">{grade.grade}</span>
                        {grade.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${grade.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{grade.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('dashboard.thisWeeksProgress')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">{t('dashboard.studyTime')}</span>
                  <span className="text-xl font-bold">12.5 {i18n.language === 'ru' ? 'ч' : i18n.language === 'kk' ? 'сағ' : 'hrs'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">{t('dashboard.assignmentsCompleted')}</span>
                  <span className="text-xl font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">{t('dashboard.aiAssistsUsed')}</span>
                  <span className="text-xl font-bold">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      {showAIAssistant && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">{t('ai.title')}</h3>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-sm text-slate-700">{t('ai.greeting')}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  {t('ai.prompt1')}
                </button>
                <button className="px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  {t('ai.prompt2')}
                </button>
                <button className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  {t('ai.prompt3')}
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('ai.placeholder')}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
              />
              <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  );
}
