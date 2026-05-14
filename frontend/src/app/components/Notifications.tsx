import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Award,
  FileText,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNav from './MobileNav';
import { supabase } from '../lib/supabaseClient';

interface Notification {
  id: number;
  type: 'grade' | 'assignment' | 'deadline' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  date: Date;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setNotifications(data.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            description: n.description,
            timestamp: n.timestamp,
            isRead: n.is_read,
            date: new Date(n.created_at)
          })));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'grade', label: 'Grades' },
    { id: 'assignment', label: 'Assignments' },
    { id: 'deadline', label: 'Deadlines' },
    { id: 'system', label: 'System' }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'grade': return Award;
      case 'assignment': return FileText;
      case 'deadline': return Clock;
      case 'system': return Bell;
      default: return MessageSquare;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'grade': return 'bg-green-100 text-green-600';
      case 'assignment': return 'bg-blue-100 text-blue-600';
      case 'deadline': return 'bg-orange-100 text-orange-600';
      case 'system': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const groupNotifications = (notifs: Notification[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [] as Notification[],
      yesterday: [] as Notification[],
      thisWeek: [] as Notification[],
      older: [] as Notification[]
    };

    notifs.forEach(notif => {
      const notifDate = new Date(notif.date);
      if (notifDate >= today) {
        groups.today.push(notif);
      } else if (notifDate >= yesterday && notifDate < today) {
        groups.yesterday.push(notif);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notif);
      } else {
        groups.older.push(notif);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotifications(filteredNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;

      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl relative">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
                  <p className="text-xs text-slate-600">{unreadCount} unread</p>
                </div>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all as read</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Filter Chips */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notifications Feed */}
            <div className="space-y-8">
              {Object.entries(groupedNotifications).map(([group, notifs]) => {
                if (notifs.length === 0) return null;
                return (
                  <div key={group}>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                      {group === 'thisWeek' ? 'This Week' : group}
                    </h2>
                    <div className="space-y-3">
                      {notifs.map((notification, index) => {
                        const Icon = getIcon(notification.type);
                        const iconColor = getIconColor(notification.type);

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => markAsRead(notification.id)}
                            className={`bg-white rounded-2xl shadow-sm border-l-4 transition-all cursor-pointer ${
                              notification.isRead
                                ? 'border-l-slate-200 hover:shadow-md'
                                : 'border-l-blue-500 hover:shadow-lg'
                            }`}
                          >
                            <div className="p-5 flex items-start gap-4">
                              <div className={`p-3 rounded-xl flex-shrink-0 ${iconColor}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <h3 className={`font-semibold ${
                                    notification.isRead ? 'text-slate-700' : 'text-slate-900'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {notification.timestamp}
                                  </span>
                                </div>
                                <p className={`text-sm ${
                                  notification.isRead ? 'text-slate-500' : 'text-slate-600'
                                }`}>
                                  {notification.description}
                                </p>
                                {!notification.isRead && (
                                  <div className="flex items-center gap-2 mt-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-xs font-medium text-blue-600">Unread</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Empty State */}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-4">
                    <Bell className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications</h3>
                  <p className="text-slate-600">You're all caught up!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
