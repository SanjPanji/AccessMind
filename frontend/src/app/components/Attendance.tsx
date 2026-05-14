import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import MobileNav from './MobileNav';

export default function Attendance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const attendanceData = [
    {
      id: 1,
      date: 'May 14, 2026',
      day: 'Wednesday',
      subject: 'Mathematics',
      time: '10:00 AM - 11:30 AM',
      status: 'present',
      teacher: 'Dr. Smith',
      room: 'Hall 204'
    },
    {
      id: 2,
      date: 'May 14, 2026',
      day: 'Wednesday',
      subject: 'Computer Science',
      time: '2:00 PM - 3:30 PM',
      status: 'present',
      teacher: 'Prof. Johnson',
      room: 'Lab 3'
    },
    {
      id: 3,
      date: 'May 13, 2026',
      day: 'Tuesday',
      subject: 'Physics',
      time: '9:00 AM - 10:30 AM',
      status: 'absent',
      teacher: 'Dr. Williams',
      room: 'Lab 1'
    },
    {
      id: 4,
      date: 'May 13, 2026',
      day: 'Tuesday',
      subject: 'English',
      time: '1:00 PM - 2:30 PM',
      status: 'present',
      teacher: 'Ms. Davis',
      room: 'Hall 101'
    },
    {
      id: 5,
      date: 'May 12, 2026',
      day: 'Monday',
      subject: 'Mathematics',
      time: '10:00 AM - 11:30 AM',
      status: 'late',
      teacher: 'Dr. Smith',
      room: 'Hall 204'
    }
  ];

  const subjects = ['all', 'Mathematics', 'Computer Science', 'Physics', 'English'];

  const filteredData = selectedSubject === 'all'
    ? attendanceData
    : attendanceData.filter(item => item.subject === selectedSubject);

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(a => a.status === 'present').length,
    absent: attendanceData.filter(a => a.status === 'absent').length,
    late: attendanceData.filter(a => a.status === 'late').length
  };

  const attendanceRate = ((stats.present / stats.total) * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'green';
      case 'absent': return 'red';
      case 'late': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle2;
      case 'absent': return XCircle;
      case 'late': return Clock;
      default: return Calendar;
    }
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
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('attendance.title')}</h1>
                  <p className="text-xs text-slate-600">{t('attendance.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</div>
            <div className="text-sm text-slate-600">{t('attendance.classesAttended')}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">{attendanceRate}%</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.present}</div>
            <div className="text-sm text-green-100">{t('attendance.overallAttendance')}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              {stats.absent > 0 && <AlertTriangle className="w-4 h-4 text-red-600" />}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.absent}</div>
            <div className="text-sm text-slate-600">{t('attendance.totalAbsences')}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.late}</div>
            <div className="text-sm text-slate-600">Late</div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {subject === 'all' ? t('grades.allSubjects') : subject}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredData.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            const color = getStatusColor(item.status);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 bg-${color}-50 rounded-xl flex-shrink-0`}>
                      <StatusIcon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{item.subject}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700 capitalize`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{item.date} ({item.day})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-slate-900">{item.teacher}</p>
                    <p className="text-xs text-slate-600">{item.room}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
