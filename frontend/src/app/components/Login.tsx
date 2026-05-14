import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Brain, Eye, EyeOff, Users, Mail, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col p-4 md:p-8">
      <div className="w-full flex justify-end z-50 mb-4">
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white/50">
          <button 
            onClick={() => i18n.changeLanguage('ru')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${i18n.language === 'ru' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            RU
          </button>
          <button 
            onClick={() => i18n.changeLanguage('kk')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${i18n.language === 'kk' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            KK
          </button>
          <button 
            onClick={() => i18n.changeLanguage('en')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${(i18n.language === 'en' || i18n.language?.startsWith('en')) ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration & Brand */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-2xl">
              <Brain className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              AccessMind
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
              AI-Powered Inclusive Learning Platform for Every Student
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI Assistant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Accessible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="md:hidden flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.loginTitle')}</h2>
            <p className="text-slate-600">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 hover:bg-white"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 hover:bg-white"
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600">{t('auth.rememberMe')}</span>
              </label>
              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('auth.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
            >
              {t('auth.signInBtn')}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">{t('auth.orContinueWith')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-slate-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <svg className="w-5 h-5" fill="#5E5E5E" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-slate-700">Microsoft</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t('auth.noAccount')}{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.signUpLink')}
            </button>
          </p>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 text-center">
              {t('auth.loginA11y')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
