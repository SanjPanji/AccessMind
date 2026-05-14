import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Brain, Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return( 
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col p-4 md:p-8">
      <div className="w-full flex justify-end z-50 mb-4">
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white/50">
          <button 
            onClick={() => i18n.changeLanguage('ru')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${i18n.language === 'ru' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            RU
          </button>
          <button 
            onClick={() => i18n.changeLanguage('kk')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${i18n.language === 'kk' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            KK
          </button>
          <button 
            onClick={() => i18n.changeLanguage('en')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${(i18n.language === 'en' || i18n.language?.startsWith('en')) ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Brand */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl">
              <Brain className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Join AccessMind
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
              Experience inclusive education powered by AI technology designed for everyone
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-xs text-slate-600">Students</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-xs text-slate-600">Universities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="md:hidden flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.registerTitle')}</h2>
            <p className="text-slate-600">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.fullNameLabel')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 hover:bg-white"
                  placeholder={t('auth.fullNamePlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.roleLabel')}
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="student">{t('auth.roleStudent')}</option>
                  <option value="teacher">{t('auth.roleTeacher')}</option>
                  <option value="admin">{t('auth.roleAdmin')}</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                {t('auth.agreeTo')}{' '}
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('auth.tos')}
                </button>{' '}
                {t('auth.and')}{' '}
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('auth.privacyPolicy')}
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
            >
              {t('auth.createAccountBtn')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t('auth.haveAccount')}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.signInLink')}
            </button>
          </p>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-xs text-slate-700 text-center font-medium">
              {t('auth.registerA11y')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
