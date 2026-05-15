import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Award,
  TrendingUp,
  ChevronDown,
  Download,
  User,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GradeCell {
  value: number;
  maxValue: number;
  type: 'homework' | 'quiz' | 'exam' | 'participation';
}

interface AssignmentRow {
  id: number;
  name: string;
  type: 'homework' | 'quiz' | 'exam' | 'participation';
  grades: { [date: string]: GradeCell };
}

interface SubjectData {
  id: string;
  name: string;
  teacher: string;
  assignments: AssignmentRow[];
  average: number;
}

const subjectsData: SubjectData[] = [
  {
    id: 'Mathematics',
    name: 'dashboard.math',
    teacher: 'attendance.drSmith',
    average: 91.25,
    assignments: [
      {
        id: 1,
        name: 'grades.derivInt',
        type: 'exam',
        grades: {
          '01.05': { value: 92, maxValue: 100, type: 'exam' },
          '08.05': { value: 95, maxValue: 100, type: 'exam' }
        }
      },
      {
        id: 2,
        name: 'grades.chap7',
        type: 'quiz',
        grades: {
          '03.05': { value: 88, maxValue: 100, type: 'quiz' },
          '10.05': { value: 90, maxValue: 100, type: 'quiz' }
        }
      },
      {
        id: 3,
        name: 'grades.probSet4',
        type: 'homework',
        grades: {
          '02.05': { value: 95, maxValue: 100, type: 'homework' },
          '09.05': { value: 93, maxValue: 100, type: 'homework' },
          '14.05': { value: 97, maxValue: 100, type: 'homework' }
        }
      },
      {
        id: 4,
        name: 'grades.classEng',
        type: 'participation',
        grades: {
          '05.05': { value: 90, maxValue: 100, type: 'participation' },
          '12.05': { value: 92, maxValue: 100, type: 'participation' }
        }
      },
      {
        id: 5,
        name: 'grades.algQuiz',
        type: 'quiz',
        grades: {
          '06.05': { value: 87, maxValue: 100, type: 'quiz' },
          '13.05': { value: 91, maxValue: 100, type: 'quiz' }
        }
      }
    ]
  },
  {
    id: 'Computer Science',
    name: 'dashboard.cs',
    teacher: 'attendance.profJohnson',
    average: 88.75,
    assignments: [
      {
        id: 1,
        name: 'grades.webDev',
        type: 'exam',
        grades: {
          '02.05': { value: 85, maxValue: 100, type: 'exam' },
          '14.05': { value: 89, maxValue: 100, type: 'exam' }
        }
      },
      {
        id: 2,
        name: 'grades.reactComp',
        type: 'quiz',
        grades: {
          '04.05': { value: 90, maxValue: 100, type: 'quiz' },
          '11.05': { value: 88, maxValue: 100, type: 'quiz' }
        }
      },
      {
        id: 3,
        name: 'grades.algoChal',
        type: 'homework',
        grades: {
          '01.05': { value: 92, maxValue: 100, type: 'homework' },
          '08.05': { value: 87, maxValue: 100, type: 'homework' },
          '13.05': { value: 89, maxValue: 100, type: 'homework' }
        }
      },
      {
        id: 4,
        name: 'grades.codeRev',
        type: 'participation',
        grades: {
          '06.05': { value: 95, maxValue: 100, type: 'participation' }
        }
      }
    ]
  },
  {
    id: 'Physics',
    name: 'dashboard.physics',
    teacher: 'attendance.drWilliams',
    average: 83.25,
    assignments: [
      {
        id: 1,
        name: 'grades.mechExam',
        type: 'exam',
        grades: {
          '03.05': { value: 85, maxValue: 100, type: 'exam' }
        }
      },
      {
        id: 2,
        name: 'grades.momProb',
        type: 'quiz',
        grades: {
          '02.05': { value: 78, maxValue: 100, type: 'quiz' },
          '09.05': { value: 82, maxValue: 100, type: 'quiz' }
        }
      },
      {
        id: 3,
        name: 'grades.labRep3',
        type: 'homework',
        grades: {
          '05.05': { value: 82, maxValue: 100, type: 'homework' },
          '12.05': { value: 85, maxValue: 100, type: 'homework' }
        }
      },
      {
        id: 4,
        name: 'grades.labPart',
        type: 'participation',
        grades: {
          '07.05': { value: 88, maxValue: 100, type: 'participation' },
          '14.05': { value: 86, maxValue: 100, type: 'participation' }
        }
      }
    ]
  },
  {
    id: 'English',
    name: 'dashboard.english',
    teacher: 'attendance.msDavis',
    average: 94.25,
    assignments: [
      {
        id: 1,
        name: 'grades.litEssay',
        type: 'exam',
        grades: {
          '01.05': { value: 94, maxValue: 100, type: 'exam' }
        }
      },
      {
        id: 2,
        name: 'grades.gramTest',
        type: 'quiz',
        grades: {
          '04.05': { value: 92, maxValue: 100, type: 'quiz' },
          '11.05': { value: 95, maxValue: 100, type: 'quiz' }
        }
      },
      {
        id: 3,
        name: 'grades.readHw',
        type: 'homework',
        grades: {
          '03.05': { value: 96, maxValue: 100, type: 'homework' },
          '10.05': { value: 94, maxValue: 100, type: 'homework' },
          '13.05': { value: 97, maxValue: 100, type: 'homework' }
        }
      },
      {
        id: 4,
        name: 'grades.discuss',
        type: 'participation',
        grades: {
          '06.05': { value: 95, maxValue: 100, type: 'participation' },
          '13.05': { value: 93, maxValue: 100, type: 'participation' }
        }
      }
    ]
  }
];

function generateDates() {
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    dates.push(`${String(i).padStart(2, '0')}.05`);
  }
  return dates;
}

const dates = generateDates();

function getGradeColor(value: number, maxValue: number) {
  const pct = (value / maxValue) * 100;
  if (pct >= 90) return 'bg-green-100 text-green-800';
  if (pct >= 80) return 'bg-blue-100 text-blue-800';
  if (pct >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function getGradeDisplay(value: number) {
  return value;
}

function getTypeLabel(type: string, t: any) {
  switch (type) {
    case 'homework': return t('grades.hw');
    case 'quiz': return t('grades.quiz');
    case 'exam': return t('grades.exam');
    case 'participation': return t('grades.part');
    default: return '';
  }
}

// Returns the highest grade a subject received on a given date across all its assignments
function getBestGradeForDate(subject: SubjectData, date: string): GradeCell | null {
  let best: GradeCell | null = null;
  for (const assignment of subject.assignments) {
    const cell = assignment.grades[date];
    if (cell && (!best || cell.value > best.value)) {
      best = cell;
    }
  }
  return best;
}

export default function Grades() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const isAll = selectedSubject === 'all';
  const selectedSubjectData = isAll ? null : subjectsData.find(s => s.id === selectedSubject)!;
  const overallAverage = subjectsData.reduce((sum, s) => sum + s.average, 0) / subjectsData.length;
  const displayAverage = isAll ? overallAverage : selectedSubjectData!.average;

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
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('grades.title')}</h1>
                  <p className="text-xs text-slate-600">{t('grades.subtitle')}</p>
                </div>
              </div>
            </div>
            <button
              data-testid="button-export"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('grades.export')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Subject Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('grades.subject')}</label>
          <div className="relative max-w-xs">
            <select
              data-testid="select-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none w-full px-4 py-3 pr-10 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
            >
              <option value="all">{t('grades.allSubjects')}</option>
              {subjectsData.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {t(subject.name)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Summary Card */}
        <motion.div
          key={selectedSubject}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isAll ? 'bg-green-50' : 'bg-blue-50'}`}>
                <BarChart3 className={`w-6 h-6 ${isAll ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div>
                {isAll ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('grades.allSubjects')}</h2>
                    <p className="text-sm text-slate-600">{t('grades.combinedOverview')}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{t(selectedSubjectData!.name)}</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{t(selectedSubjectData!.teacher)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs font-medium text-slate-600 mb-1">
                  {isAll ? t('grades.overallAverage') : t('grades.averageGrade')}
                </div>
                <div
                  className="text-4xl font-bold text-green-600"
                  data-testid="text-average"
                >
                  {displayAverage.toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>{t('grades.progress')}</span>
              <span>{displayAverage.toFixed(0)}% / 100%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${displayAverage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Grades Table */}
        <motion.div
          key={`table-${selectedSubject}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="sticky left-0 z-10 bg-slate-50 px-6 py-4 text-left text-sm font-semibold text-slate-900 border-r border-slate-200 min-w-[280px]">
                    {isAll ? t('grades.subject') : t('grades.assignmentLesson')}
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date}
                      className="px-4 py-4 text-center text-sm font-semibold text-slate-900 min-w-[70px]"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isAll ? (
                  /* ALL SUBJECTS MODE — rows = subjects */
                  subjectsData.map((subject, rowIndex) => (
                    <tr
                      key={subject.id}
                      data-testid={`row-subject-${subject.id}`}
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-6 py-4 border-r border-slate-200 font-semibold text-slate-900">
                        {t(subject.name)}
                      </td>
                      {dates.map((date) => {
                        const grade = getBestGradeForDate(subject, date);
                        return (
                          <td key={date} className="px-4 py-4 text-center">
                            {grade ? (
                              <div
                                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg font-bold text-base transition-transform hover:scale-110 ${getGradeColor(grade.value, grade.maxValue)}`}
                              >
                                {getGradeDisplay(grade.value)}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  /* SINGLE SUBJECT MODE — rows = assignments */
                  selectedSubjectData!.assignments.map((assignment, rowIndex) => (
                    <tr
                      key={assignment.id}
                      data-testid={`row-assignment-${assignment.id}`}
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-6 py-4 border-r border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${assignment.type === 'exam' ? 'bg-red-100 text-red-700' :
                              assignment.type === 'quiz' ? 'bg-blue-100 text-blue-700' :
                                assignment.type === 'homework' ? 'bg-purple-100 text-purple-700' :
                                  'bg-green-100 text-green-700'
                            }`}>
                            {getTypeLabel(assignment.type, t)}
                          </div>
                          <span className="font-medium text-slate-900">{t(assignment.name)}</span>
                        </div>
                      </td>
                      {dates.map((date) => {
                        const grade = assignment.grades[date];
                        return (
                          <td key={date} className="px-4 py-4 text-center">
                            {grade ? (
                              <div
                                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg font-bold text-sm transition-transform hover:scale-110 ${getGradeColor(grade.value, grade.maxValue)}`}
                              >
                                {getGradeDisplay(grade.value)}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              {!isAll && (
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">{t('grades.types')}:</span>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md font-semibold">{t('grades.exam')}</div>
                    <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">{t('grades.quiz')}</div>
                    <div className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md font-semibold">{t('grades.hw')}</div>
                    <div className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md font-semibold">{t('grades.part')}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">{t('grades.scale')}:</span>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-semibold">90–100</div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-semibold">80–89</div>
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-semibold">70–79</div>
                  <div className="px-2 py-1 bg-red-100 text-red-800 rounded-md font-semibold">&lt;70</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
