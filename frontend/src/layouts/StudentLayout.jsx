import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { StudentProfileModal } from '../components/StudentProfileModal';
import { ReportQuestionModal } from '../components/ReportQuestionModal';
import {
  LayoutDashboard,
  Calendar,
  Target,
  BookOpen,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Award,
  Users,
  Settings,
  Edit3,
  Flame,
  Zap,
  RefreshCw,
  Flag,
  ChevronRight,
  Menu,
  X,
  WifiOff
} from 'lucide-react';

export const StudentLayout = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Progress & State
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Offline Sync State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineAttemptsCount, setOfflineAttemptsCount] = useState(0);
  const [syncingOffline, setSyncingOffline] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Avatar Preference
  const avatar = localStorage.getItem('vidyasaathi_student_avatar') || '👨‍🎓';

  // Fetch student progress
  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress/me');
      setProgress(res.data);
      try {
        localStorage.setItem('vidyasaathi_cached_progress', JSON.stringify(res.data));
      } catch (e) {}
    } catch (err) {
      console.warn('Failed to fetch student progress, using cached fallback:', err);
      try {
        const cached = JSON.parse(localStorage.getItem('vidyasaathi_cached_progress') || 'null');
        if (cached) setProgress(cached);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const checkOfflineQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('vidyasaathi_offline_attempts') || '[]');
      setOfflineAttemptsCount(queue.length);
    } catch (e) {
      setOfflineAttemptsCount(0);
    }
  };

  useEffect(() => {
    fetchProgress();
    checkOfflineQueue();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Sync offline attempts
  const handleSyncOffline = async () => {
    setSyncingOffline(true);
    setSyncMsg('');
    try {
      const queue = JSON.parse(localStorage.getItem('vidyasaathi_offline_attempts') || '[]');
      if (queue.length === 0) {
        setSyncMsg(t('studentSyncNone'));
        setSyncingOffline(false);
        return;
      }

      for (const item of queue) {
        try {
          await api.post('/quiz/answer', {
            question_id: item.question_id,
            selected_index: item.selected_index,
            time_taken: item.time_taken || 15,
          });
        } catch (e) {
          console.warn('Sync error on item:', e);
        }
      }

      localStorage.removeItem('vidyasaathi_offline_attempts');
      setOfflineAttemptsCount(0);
      setSyncMsg(t('studentSyncSuccess'));
      await fetchProgress();
      setTimeout(() => setSyncMsg(''), 4000);
    } catch (err) {
      setSyncMsg(t('studentSyncError'));
    } finally {
      setSyncingOffline(false);
    }
  };

  // Gamification Calculations
  const totalAttempts = progress?.total_attempts || 0;
  const totalCorrect = progress?.total_correct || 0;
  const streak = progress?.current_streak || 0;

  // Study plan tasks for XP calculation
  const studyPlanStorageKey = `vidyasaathi_study_plan_${user?.id || 'guest'}_${new Date().toDateString()}`;
  let completedTasksCount = 0;
  try {
    const savedTasks = JSON.parse(localStorage.getItem(studyPlanStorageKey) || '[]');
    completedTasksCount = savedTasks.filter((t) => t.completed).length;
  } catch (e) {}

  const totalXp = totalCorrect * 10 + totalAttempts * 5 + completedTasksCount * 15;

  const getStudentLevel = (xp) => {
    if (xp < 100) return { level: 1, title: t('tierSeeker'), nextXp: 100, badgeIcon: '🌱' };
    if (xp < 300) return { level: 2, title: t('tierExplorer'), nextXp: 300, badgeIcon: '⚡' };
    if (xp < 600) return { level: 3, title: t('tierScholar'), nextXp: 600, badgeIcon: '🎯' };
    return { level: 4, title: t('tierMaster'), nextXp: 1000, badgeIcon: '🏆' };
  };

  const studentTier = getStudentLevel(totalXp);

  // Grouped Navigation Items
  const navigationGroups = [
    {
      title: t('studentNavOverview'),
      items: [
        {
          id: 'home',
          path: '/student',
          label: t('studentNavHome'),
          icon: LayoutDashboard,
          isExact: true,
        },
        {
          id: 'study-plan',
          path: '/student/study-plan',
          label: t('studentNavStudyPlan'),
          icon: Calendar,
        },
      ],
    },
    {
      title: t('studentNavLearning'),
      items: [
        {
          id: 'diagnostic',
          path: '/student/diagnostic',
          label: t('studentNavDiagnostic'),
          icon: Target,
        },
        {
          id: 'practice',
          path: '/quiz',
          alternatePath: '/student/practice',
          label: t('studentNavAdaptive'),
          icon: BookOpen,
        },
        {
          id: 'doubt',
          path: '/doubt',
          alternatePath: '/student/doubt',
          label: t('studentNavDoubt'),
          icon: HelpCircle,
        },
      ],
    },
    {
      title: t('studentNavProgressGroup'),
      items: [
        {
          id: 'progress',
          path: '/progress',
          alternatePath: '/student/progress',
          label: t('studentNavProgressReport'),
          icon: TrendingUp,
        },
        {
          id: 'revision',
          path: '/student/revision',
          label: t('studentNavRevision'),
          icon: RotateCcw,
        },
        {
          id: 'achievements',
          path: '/student/achievements',
          label: t('studentNavAchievements'),
          icon: Award,
        },
      ],
    },
    {
      title: t('studentNavClassroomGroup'),
      items: [
        {
          id: 'classroom',
          path: '/student/classroom',
          label: t('studentNavJoinClass'),
          icon: Users,
        },
        {
          id: 'settings',
          path: '/student/settings',
          alternatePath: '/settings',
          label: t('studentNavSettings'),
          icon: Settings,
        },
      ],
    },
  ];

  // Helper to determine if item is active based on location
  const isItemActive = (item) => {
    const currentPath = location.pathname;
    if (item.isExact) {
      return currentPath === item.path;
    }
    if (currentPath === item.path) return true;
    if (item.alternatePath && currentPath === item.alternatePath) return true;
    if (currentPath.startsWith(item.path) && item.path !== '/student') return true;
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Offline Status Warning Banner */}
      {!isOnline && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-white text-xs font-bold flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-100" />
            <span>{t('studentOfflineBanner')}</span>
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">{t('offline')}</span>
        </div>
      )}

      {/* Offline Sync Banner */}
      {offlineAttemptsCount > 0 && isOnline && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span><strong>{offlineAttemptsCount}</strong> {t('studentSyncReady')}</span>
          </span>
          <button
            onClick={handleSyncOffline}
            disabled={syncingOffline}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs btn-tactile flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingOffline ? 'animate-spin' : ''}`} />
            <span>{syncingOffline ? t('studentSyncing') : t('studentSyncNow')}</span>
          </button>
        </div>
      )}

      {syncMsg && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold animate-fade-in">
          {syncMsg}
        </div>
      )}

      {/* Mobile Top Header with Sidebar Drawer Toggle */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{avatar}</span>
          <div>
            <div className="font-extrabold text-xs text-slate-900">{user?.name}</div>
            <div className="text-[10px] text-slate-500">
              {t('studentClass')} {user?.class_level || 8} • {t('tierPrefix')} {studentTier.level}: {studentTier.title}
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1.5 border border-orange-200 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? t('studentCloseMenu') : t('studentMenu')}</span>
        </button>
      </div>

      {/* Main Grid Layout with Persistent Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* PERSISTENT SIDEBAR */}
        <aside
          className={`lg:col-span-1 space-y-4 ${
            mobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                {t('studentProfile')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {t('studentActive')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-2xl flex items-center justify-center border border-white/40 shadow-xs shrink-0">
                {avatar}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 truncate">
                  {t('studentClass')} {user?.class_level || 8} • {t('studentCurriculum')}
                </p>
              </div>
            </div>

            {/* Level & XP Strip */}
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600">{t('tierPrefix')} {studentTier.level}: {studentTier.title}</span>
                <span className="text-amber-800">{totalXp} XP</span>
              </div>
              <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-600 to-amber-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalXp / studentTier.nextXp) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-orange-700">🔥 {t('streak')}: {streak} {t('days')}</span>
                <span>{t('studentAccuracy')}: {progress?.overall_accuracy || 0}%</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('studentEditProfile')}</span>
            </button>
          </div>

          {/* Grouped Sidebar Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-xs space-y-3">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-0.5 block">
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
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-200' : 'text-[#8C6D15]'}`} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'opacity-90 translate-x-0.5 text-amber-200' : 'opacity-40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Quick Support & Sync */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-xs space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {t('studentQuickSupport')}
            </span>
            <button
              onClick={() => {
                setIsReportModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-2 btn-tactile"
            >
              <Flag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{t('studentReportIssue')}</span>
            </button>
            {offlineAttemptsCount > 0 && isOnline && (
              <button
                onClick={() => {
                  handleSyncOffline();
                  setMobileSidebarOpen(false);
                }}
                disabled={syncingOffline}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center justify-between btn-tactile"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('studentOfflineSync')} ({offlineAttemptsCount})</span>
                </span>
                <RefreshCw className={`w-3 h-3 text-emerald-600 ${syncingOffline ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </aside>

        {/* PERSISTENT CONTENT OUTLET */}
        <main className="lg:col-span-3 min-w-0">
          <Outlet
            context={{
              progress,
              refreshProgress: fetchProgress,
              studentTier,
              totalXp,
              streak,
              avatar,
              setIsProfileModalOpen,
              setIsReportModalOpen,
            }}
          />
        </main>
      </div>

      {/* Shared Modals accessible from any page */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdate={fetchProgress}
      />

      <ReportQuestionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        questionId={1}
        questionText="सामान्य प्रश्न रिपोर्ट विंडो"
        topicName="पाठ्यक्रम प्रश्न"
      />
    </div>
  );
};
