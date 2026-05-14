import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccessibility, type AccessibilityMode } from '../context/AccessibilityContext';
import {
  User,
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Settings,
  Bell,
  Shield,
  Eye,
  Mic,
  Zap,
  BookOpen,
  LogOut,
  Award,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNav from './MobileNav';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  // Use the global accessibility context so mode selection here
  // is in sync with the Accessibility page and Dashboard quick toggles.
  const { activeMode: activeAccessibilityMode, setActiveMode: setActiveAccessibilityMode } = useAccessibility();

  // Only the three core modes supported by the context (voice navigates to its own page)
  const quickAccessibilityModes: Array<{
    id: AccessibilityMode;
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
  }> = [
    {
      id: 'adhd',
      name: t('profile.adhdMode'),
      icon: Zap,
      color: 'blue',
      description: t('profile.adhdDesc')
    },
    {
      id: 'dyslexia',
      name: t('profile.dyslexiaMode'),
      icon: BookOpen,
      color: 'purple',
      description: t('profile.dyslexiaDesc')
    },
    {
      id: 'low-vision',
      name: t('profile.lowVisionMode'),
      icon: Eye,
      color: 'green',
      description: t('profile.lowVisionDesc')
    },
    {
      id: null,
      name: t('profile.voiceMode'),
      icon: Mic,
      color: 'pink',
      description: t('profile.voiceDesc')
    }
  ];

  const stats = [
    { label: t('profile.statAttendance'), value: '94%', icon: CheckCircle2, color: 'green' },
    { label: t('profile.statGpa'), value: '89.3', icon: Award, color: 'blue' },
    { label: t('profile.statAssignments'), value: '24/26', icon: BarChart3, color: 'purple' },
    { label: t('profile.statStudyHours'), value: '48h', icon: Clock, color: 'orange' }
  ];

  const profileData = {
    name: t('profile.alex'),
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    location: t('profile.stanford'),
    studentId: 'STU-2024-1234',
    enrollmentDate: t('profile.sept2023'),
    major: t('profile.majorCs'),
    year: t('profile.sophomore')
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('profile.title')}</h1>
                  <p className="text-xs text-slate-600">{t('profile.subtitle')}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('profile.save')}</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('profile.edit')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-blue-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t('dashboard.quickAccessibility')}</h2>
              <p className="text-sm text-slate-600">{t('profile.chooseLearningMode')}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessibilityModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (mode.id === null) {
                    // Voice button navigates to voice navigation page instead
                    navigate('/voice-navigation');
                  } else {
                    // setActiveMode handles toggle: clicking active mode turns it off
                    setActiveAccessibilityMode(mode.id);
                  }
                }}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  activeAccessibilityMode === mode.id
                    ? `bg-white border-${mode.color}-500 shadow-lg shadow-${mode.color}-500/20`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {activeAccessibilityMode === mode.id && (
                  <div className={`absolute top-3 right-3 w-6 h-6 bg-${mode.color}-600 rounded-full flex items-center justify-center`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`inline-flex p-3 rounded-xl bg-${mode.color}-50 mb-3`}>
                  <mode.icon className={`w-6 h-6 text-${mode.color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{mode.name}</h3>
                <p className="text-xs text-slate-600">{mode.description}</p>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
            <span className="text-sm font-medium text-slate-700">
              {activeAccessibilityMode ? `${quickAccessibilityModes.find(m => m.id === activeAccessibilityMode)?.name} ${t('profile.isActive')}` : t('profile.noModeSelected')}
            </span>
            <button
              onClick={() => navigate('/accessibility')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {t('profile.advancedSettings')} →
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"></div>
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
                      alt="Profile"
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white"
                    />
                    <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">{profileData.name}</h2>
                    <p className="text-slate-600 mb-2">{profileData.major} • {profileData.year}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{t('profile.enrolledSince')} {profileData.enrollmentDate}</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 mb-1">{t('profile.email')}</p>
                      <p className="text-sm font-medium text-slate-900 truncate">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">{t('profile.phone')}</p>
                      <p className="text-sm font-medium text-slate-900">{profileData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">{t('profile.location')}</p>
                      <p className="text-sm font-medium text-slate-900">{profileData.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">{t('profile.studentId')}</p>
                      <p className="text-sm font-medium text-slate-900">{profileData.studentId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('profile.academicOverview')}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    className={`p-5 bg-${stat.color}-50 rounded-xl border border-${stat.color}-200`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 bg-white rounded-lg`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <div className={`text-3xl font-bold text-${stat.color}-700 mb-1`}>{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t('profile.quickActions')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/grades')}
                  className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-medium text-left"
                >
                  {t('profile.viewMyGrades')}
                </button>
                <button
                  onClick={() => navigate('/attendance')}
                  className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium text-left"
                >
                  {t('profile.checkAttendance')}
                </button>
                <button
                  onClick={() => navigate('/assignments')}
                  className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors font-medium text-left"
                >
                  {t('profile.viewAssignments')}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                {t('profile.signOut')}
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
