import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Sparkles,
  BookOpen,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  FileSpreadsheet,
  ChevronRight,
  Menu,
  X,
  Copy,
  Check,
  PlusCircle,
  Settings,
  GraduationCap
} from 'lucide-react';

export const TeacherLayout = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Shared state across all teacher pages
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Create Class Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) {
        const initialId = selectedClassId || res.data[0].id;
        setSelectedClassId(initialId);
        await loadDashboard(initialId);
      } else {
        setDashboardData(null);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (classId) => {
    try {
      const res = await api.get(`/classes/${classId}/dashboard`);
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load class dashboard:', err);
    }
  };

  const handleClassChange = async (e) => {
    const cid = Number(e.target.value);
    setSelectedClassId(cid);
    await loadDashboard(cid);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);
    try {
      const res = await api.post('/classes', { name: newClassName.trim() });
      setClasses((prev) => [...prev, res.data]);
      setSelectedClassId(res.data.id);
      await loadDashboard(res.data.id);
      setShowCreateModal(false);
      setNewClassName('');
    } catch (err) {
      console.error('Failed to create class:', err);
    } finally {
      setCreating(false);
    }
  };

  const copyJoinCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Structured Sidebar Navigation Groups (Fully Localized)
  const navigationGroups = [
    {
      title: t('teacherNavOverview'),
      items: [
        {
          id: 'overview',
          path: '/teacher-dashboard',
          label: t('teacherNavOverview'),
          subLabel: t('teacherNavOverviewSub'),
          icon: LayoutDashboard,
          isExact: true,
        },
      ],
    },
    {
      title: t('teacherNavClassroom'),
      items: [
        {
          id: 'classes',
          path: '/teacher-dashboard/classes',
          label: t('teacherNavClassMgmt'),
          subLabel: t('teacherNavClassMgmtSub'),
          icon: Users,
        },
        {
          id: 'analytics',
          path: '/teacher-dashboard/analytics',
          label: t('teacherNavAnalytics'),
          subLabel: t('teacherNavAnalyticsSub'),
          icon: TrendingUp,
        },
      ],
    },
    {
      title: t('teacherNavTools'),
      items: [
        {
          id: 'question-generator',
          path: '/teacher-dashboard/question-generator',
          label: t('teacherNavGen'),
          subLabel: t('teacherNavGenSub'),
          icon: Sparkles,
        },
        {
          id: 'lesson-planner',
          path: '/teacher-dashboard/lesson-planner',
          label: t('teacherNavLesson'),
          subLabel: t('teacherNavLessonSub'),
          icon: BookOpen,
        },
      ],
    },
    {
      title: t('teacherNavAssessment'),
      items: [
        {
          id: 'assignments',
          path: '/teacher-dashboard/assignments',
          label: t('teacherNavAssignments'),
          subLabel: t('teacherNavAssignmentsSub'),
          icon: ClipboardList,
        },
        {
          id: 'content-review',
          path: '/teacher-dashboard/content-review',
          label: t('teacherNavReview'),
          subLabel: t('teacherNavReviewSub'),
          icon: CheckSquare,
        },
      ],
    },
    {
      title: t('teacherNavSupport'),
      items: [
        {
          id: 'at-risk-students',
          path: '/teacher-dashboard/at-risk-students',
          label: t('teacherNavAtRisk'),
          subLabel: t('teacherNavAtRiskSub'),
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: t('teacherNavReportsGroup'),
      items: [
        {
          id: 'reports',
          path: '/teacher-dashboard/reports',
          label: t('teacherNavReports'),
          subLabel: t('teacherNavReportsSub'),
          icon: FileSpreadsheet,
        },
      ],
    },
  ];

  const isItemActive = (item) => {
    const currentPath = location.pathname;
    if (item.isExact) {
      return currentPath === item.path || currentPath === '/teacher';
    }
    return currentPath === item.path || currentPath.startsWith(item.path);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Mobile Top Header with Sidebar Drawer Toggle */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-xl flex items-center justify-center font-black shadow-xs">
            👨‍🏫
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">{user?.name}</div>
            <div className="text-[10px] text-slate-500">
              {dashboardData?.class_name || t('navTeacher')} • {classes.length} {t('teacherNavClassroom')}
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1.5 border border-orange-200 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? t('close') : t('navTeacher')}</span>
        </button>
      </div>

      {/* Main Grid Layout with Persistent Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* PERSISTENT SIDEBAR WITH SCROLLING SUPPORT */}
        <aside
          className={`lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 ${
            mobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Teacher Profile & Active Class Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                {t('roleTeacherTitle')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {t('active')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-2xl flex items-center justify-center border border-white/40 shadow-xs shrink-0">
                👨‍🏫
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 truncate">
                  {dashboardData?.class_name || t('navTeacher')}
                </p>
              </div>
            </div>

            {/* Active Class Switcher */}
            {classes.length > 0 ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">{t('selectSubject')}:</label>
                <select
                  value={selectedClassId || ''}
                  onChange={handleClassChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">—</div>
            )}

            {/* Join Code Widget */}
            {dashboardData && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1 text-xs">
                <span className="text-slate-500 text-[11px] block">{t('joinClass')}:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-orange-900 tracking-wider">
                    {dashboardData.join_code}
                  </span>
                  <button
                    onClick={() => copyJoinCode(dashboardData.join_code)}
                    className="p-1.5 rounded-lg bg-white border border-amber-200 text-orange-800 hover:bg-orange-100 transition-colors"
                    title="Copy Join Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowCreateModal(true);
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs btn-tactile"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ {t('teacherNavClassMgmt')}</span>
            </button>
          </div>

          {/* Grouped Sidebar Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-[#DFCBB5] shadow-xs space-y-3.5">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D15] px-3 py-0.5 block">
                  {group.title}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = isItemActive(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#341B10] text-white shadow-sm'
                          : 'text-[#6B5749] hover:bg-[#FAF3E4] hover:text-[#2A1810]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate">
                          <span className="block truncate font-bold text-xs">{item.label}</span>
                          {item.subLabel && (
                            <span className={`block truncate text-[10px] font-medium ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                              {item.subLabel}
                            </span>
                          )}
                        </span>
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'opacity-90 translate-x-0.5' : 'opacity-40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Quick AI & Support Footer Widget */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-4 border border-orange-100 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>NCERT एवं AI शिक्षक सहायक</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              सभी 8 सुविधाएं वास्तविक डेटा एवं NCERT पाठ्यक्रम मानकों पर आधारित हैं।
            </p>
          </div>
        </aside>

        {/* PERSISTENT CONTENT OUTLET */}
        <main className="lg:col-span-3 min-w-0">
          <Outlet
            context={{
              classes,
              selectedClassId,
              setSelectedClassId,
              dashboardData,
              loadClasses,
              loadDashboard,
              loading,
              setShowCreateModal,
            }}
          />
        </main>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-orange-100">
            <h3 className="font-bold text-slate-900 text-base">नई कक्षा जोड़ें (Create Classroom)</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा का नाम (Class Name)</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="जैसे: कक्षा 8 - ज्ञान निकेतन (Class 8-A)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs btn-tactile"
                >
                  {creating ? 'बना रहे हैं...' : 'बनाएं'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
