import { useNavigate, useLocation } from 'react-router';
import { Home, FileText, Award, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('nav.home') },
    { path: '/assignments', icon: FileText, label: t('nav.assignments') },
    { path: '/grades', icon: Award, label: t('nav.grades') },
    { path: '/attendance', icon: Calendar, label: t('nav.journal') },
    { path: '/profile', icon: User, label: t('nav.profile') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive(item.path)
                ? 'text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
