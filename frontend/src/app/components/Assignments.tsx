import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import MobileNav from './MobileNav';
import {
  FileText,
  Upload,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Send,
  MessageSquare,
  Star,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function Assignments() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*, subjects(name)');
        
        if (error) throw error;

        if (data) {
          const formatted = data.map(a => ({
            id: a.id,
            title: a.name,
            subject: a.subjects?.name || 'Subject',
            dueDate: 'May 15, 2026', // Mock due date
            dueTime: '11:59 PM',
            status: 'pending',
            grade: null,
            description: 'Please complete the assigned tasks.',
            teacherComments: [],
            attachments: [],
            submissionDate: null
          }));
          setAssignments(formatted);
          if (formatted.length > 0) setSelectedAssignment(formatted[0]);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in-progress': return 'blue';
      case 'submitted': return 'green';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in-progress': return Clock;
      case 'submitted': return CheckCircle2;
      default: return FileText;
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
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('assignments.title')}</h1>
                  <p className="text-xs text-slate-600">{t('assignments.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Assignment List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t('assignments.all')}</h2>
                <div className="space-y-3">
                  {assignments.map((assignment) => {
                    const StatusIcon = getStatusIcon(assignment.status);
                    const color = getStatusColor(assignment.status);

                    return (
                      <motion.button
                        key={assignment.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAssignment(assignment)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedAssignment?.id === assignment.id
                            ? `border-${color}-500 bg-${color}-50 shadow-md`
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-${color}-100 flex-shrink-0`}>
                            <StatusIcon className={`w-4 h-4 text-${color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate">
                              {assignment.title}
                            </h3>
                            <p className="text-xs text-slate-600 mb-2">{assignment.subject}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{assignment.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Assignment Details */}
            <div className="lg:col-span-2">
              {selectedAssignment ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Assignment Header */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                          {selectedAssignment.title}
                        </h2>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {selectedAssignment.subject}
                        </span>
                      </div>
                      {selectedAssignment.grade && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">{selectedAssignment.grade}</div>
                          <div className="text-sm text-slate-600">{selectedAssignment.gradePercentage}%</div>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-600">{t('assignments.dueDate')}</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedAssignment.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-slate-600">Due Time</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedAssignment.dueTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        {(() => {
                          const StatusIcon = getStatusIcon(selectedAssignment.status);
                          const color = getStatusColor(selectedAssignment.status);
                          return <StatusIcon className={`w-5 h-5 text-${color}-600`} />;
                        })()}
                        <div>
                          <p className="text-xs text-slate-600">{t('assignments.status')}</p>
                          <p className="text-sm font-semibold text-slate-900 capitalize">
                            {selectedAssignment.status.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedAssignment.description}</p>
                  </div>

                  {/* Attachments */}
                  {selectedAssignment.attachments.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-blue-600" />
                        Assignment Materials
                      </h3>
                      <div className="space-y-2">
                        {selectedAssignment.attachments.map((file: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-slate-900">{file}</span>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-blue-200 transition-colors">
                              <Download className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Section */}
                  {selectedAssignment.status !== 'submitted' && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        Submit Your Work
                      </h3>

                      <label className="block">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-100/50 transition-all group">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-1">
                            Click to upload or drag and drop
                          </h4>
                          <p className="text-sm text-slate-600">
                            PDF, DOCX, ZIP files supported
                          </p>
                        </div>
                      </label>

                      {uploadedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-white rounded-xl border border-blue-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
                              <p className="text-xs text-slate-600">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            {t('assignments.submit')}
                          </button>
                        </motion.div>
                      )}

                      <div className="mt-4">
                        <textarea
                          placeholder="Add a comment for your teacher (optional)..."
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                          rows={3}
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* Teacher Comments */}
                  {selectedAssignment.teacherComments.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        Teacher Feedback
                      </h3>
                      <div className="space-y-3">
                        {selectedAssignment.teacherComments.map((comment: string, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-green-50 rounded-xl border border-green-200"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"
                                alt="Teacher"
                                className="w-10 h-10 rounded-full border-2 border-green-200"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900 mb-1">Dr. Smith</p>
                                <p className="text-sm text-slate-700">{comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission History */}
                  {selectedAssignment.submissionDate && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Submission Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Submitted On</p>
                          <p className="text-base font-semibold text-slate-900">{selectedAssignment.submissionDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Grade Received</p>
                          <p className="text-base font-semibold text-green-600">{selectedAssignment.grade}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl mb-6">
                    <FileText className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Select an Assignment</h3>
                  <p className="text-slate-600">
                    Choose an assignment from the list to view details and submit your work
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
