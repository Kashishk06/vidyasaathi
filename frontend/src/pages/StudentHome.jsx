import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Calculator,
  Atom,
  HelpCircle,
  PlusCircle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  ChevronRight,
  Users,
  Calendar,
  Zap,
  Edit3
} from 'lucide-react';

export const StudentHome = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Shared context from StudentLayout
  const outletCtx = useOutletContext() || {};
  const {
    progress: layoutProgress,
    studentTier: layoutTier,
    totalXp: layoutTotalXp,
    streak: layoutStreak,
    avatar: layoutAvatar,
    setIsProfileModalOpen,
  } = outletCtx;

  const [progress, setProgress] = useState(layoutProgress || null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(!layoutProgress);

  // Avatar & gamification fallbacks
  const avatar = layoutAvatar || localStorage.getItem('vidyasaathi_student_avatar') || '👨‍🎓';

  // Feature 11: Personal Study Plan Preview
  const studyPlanStorageKey = `vidyasaathi_study_plan_${user?.id || 'guest'}_${new Date().toDateString()}`;
  const [studyPlanTasks, setStudyPlanTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(studyPlanStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, key: 'taskGoal1', completed: false, xp: 20 },
      { id: 2, key: 'taskGoal2', completed: false, xp: 25 },
      { id: 3, key: 'taskGoal3', completed: false, xp: 15 },
      { id: 4, key: 'taskGoal4', completed: false, xp: 15 },
    ];
  });

  // Feature 9: Spaced Repetition Queue Preview
  const [revisionItems, setRevisionItems] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, [user, layoutProgress, language]);

  const fetchHomeData = async () => {
    try {
      if (!layoutProgress) {
        const progRes = await api.get('/progress/me');
        setProgress(progRes.data);
        buildRevisionQueue(progRes.data);
      } else {
        setProgress(layoutProgress);
        buildRevisionQueue(layoutProgress);
      }

      const topicsRes = await api.get('/topics');
      setTopics(topicsRes.data);
    } catch (err) {
      console.warn('Error loading home data, using cached fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildRevisionQueue = (progData) => {
    if (!progData?.topic_masteries) return;
    const needRevision = progData.topic_masteries
      .filter(
        (t) =>
          t.mastery_score < 0.7 ||
          (t.total_attempts > 0 && t.correct_attempts < t.total_attempts)
      )
      .sort((a, b) => a.mastery_score - b.mastery_score);

    const items = needRevision.slice(0, 3).map((t, idx) => ({
      id: t.topic_id,
      topicName: t.topic_name,
      subject: t.subject,
      chapter: t.chapter,
      mastery: Math.round(t.mastery_score * 100),
      dueStatus: idx === 0 ? t('dueToday') : idx === 1 ? t('dueTomorrow') : t('dueIn3Days'),
    }));

    setRevisionItems(items);
  };

  const toggleStudyTask = (taskId) => {
    setStudyPlanTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      try {
        localStorage.setItem(studyPlanStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // KPIs
  const totalAttempts = progress?.total_attempts || 0;
  const totalCorrect = progress?.total_correct || 0;
  const streak = layoutStreak ?? (progress?.current_streak || 0);
  const completedTasksCount = studyPlanTasks.filter((t) => t.completed).length;
  const totalXp = layoutTotalXp ?? (totalCorrect * 10 + totalAttempts * 5 + completedTasksCount * 15);

  const getStudentLevel = (xp) => {
    if (xp < 100) return { level: 1, title: t('tierSeeker'), nextXp: 100, badgeIcon: '🌱' };
    if (xp < 300) return { level: 2, title: t('tierExplorer'), nextXp: 300, badgeIcon: '⚡' };
    if (xp < 600) return { level: 3, title: t('tierScholar'), nextXp: 600, badgeIcon: '🎯' };
    return { level: 4, title: t('tierMaster'), nextXp: 1000, badgeIcon: '🏆' };
  };

  const studentTier = layoutTier || getStudentLevel(totalXp);
  const weakestTopic = progress?.topic_masteries?.length
    ? [...progress.topic_masteries].sort((a, b) => a.mastery_score - b.mastery_score)[0]
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* FEATURE 1: Student Welcome & Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-3xl flex items-center justify-center shrink-0 shadow-md">
            {avatar}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-orange-50">
                {t('studentClass')} {user?.class_level || 8} • {t('studentCurriculum')}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold uppercase text-amber-200">
                {t('tierPrefix')} {studentTier.level}: {studentTier.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-lg">
              {t('schoolMotto')}
            </p>
          </div>
        </div>

        {/* Profile Edit & Streak Counter */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          <button
            onClick={() => setIsProfileModalOpen && setIsProfileModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/30 backdrop-blur-sm flex items-center gap-1.5 btn-tactile"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('studentEditProfile')}</span>
          </button>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/25">
            <div className="p-1.5 rounded-xl bg-amber-400 text-orange-950 font-black">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black leading-none">{streak}</div>
              <div className="text-[10px] font-bold text-orange-100 uppercase tracking-wider">
                {t('streak')} ({t('days')})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 8 & 7: Gamification XP & Progress Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/student/achievements"
          className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs hover:border-orange-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalXp} XP</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('studentTotalXp')}</div>
          </div>
        </Link>

        <Link
          to="/progress"
          className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs hover:border-emerald-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{progress?.overall_accuracy || 0}%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('studentAccuracy')}</div>
          </div>
        </Link>

        <Link
          to="/quiz"
          className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs hover:border-sky-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalAttempts}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('studentSolvedQuestions')}</div>
          </div>
        </Link>

        <Link
          to="/student/achievements"
          className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs hover:border-purple-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {progress?.badges?.filter((b) => b.unlocked).length || 0} / {progress?.badges?.length || 5}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('studentEarnedBadges')}</div>
          </div>
        </Link>
      </div>

      {/* FEATURE 2: Diagnostic Assessment Banner */}
      <div className="bg-white rounded-3xl p-6 border border-orange-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-600" />
            {t('studentDiagnosticCard')}
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('diagnosticBannerTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {t('diagnosticBannerDesc')} {t('studentDiagnosticSub')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 z-10 flex-wrap">
          <button
            onClick={() => navigate('/quiz?mode=diagnostic&subject=Math')}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 btn-tactile flex items-center gap-1.5"
          >
            <span>{t('studentMathDiag')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/student/diagnostic')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
          >
            <span>{t('studentViewDetails')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FEATURE 11 & 9: Personal Study Plan & Spaced Revision Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Plan Preview Card */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {t('studentNavStudyPlan')}
                  </h3>
                  <p className="text-[11px] text-slate-500">{t('studentDailyTasks')}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {completedTasksCount} / {studyPlanTasks.length} {t('studentCompleted')}
              </span>
            </div>

            {/* Tasks Summary */}
            <div className="space-y-2">
              {studyPlanTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleStudyTask(task.id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 line-through opacity-85'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                    <span className="truncate font-semibold">{task.key ? t(task.key) : task.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 shrink-0">+{task.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/student/study-plan')}
            className="w-full py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile"
          >
            <span>{t('studentViewFullPlan')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Spaced Revision Preview Card */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {t('studentRevisionQueue')}
                  </h3>
                  <p className="text-[11px] text-slate-500">{t('studentRevisionDesc')}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                {revisionItems.length} {t('studentInQueue')}
              </span>
            </div>

            {/* Quick Revision Topics */}
            <div className="space-y-2">
              {revisionItems.length === 0 ? (
                <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <p className="font-bold text-xs text-slate-800">{t('studentRevisionEmpty')}</p>
                </div>
              ) : (
                revisionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2 bg-white"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{item.topicName}</div>
                      <div className="text-[10px] text-slate-500">{item.subject} • {item.mastery}%</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {item.dueStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/student/revision')}
            className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile"
          >
            <span>{t('studentOpenRevision')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FEATURE 3: Adaptive Practice Subjects & Weak Topic Alert */}
      {weakestTopic && weakestTopic.mastery_score < 0.7 && (
        <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-200/70 text-amber-900">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {t('weakestTopic')}
              </h4>
              <p className="text-sm font-semibold text-amber-950 mt-0.5">
                {weakestTopic.topic_name} — {Math.round(weakestTopic.mastery_score * 100)}%
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/quiz?topic=${weakestTopic.topic_id}`)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs btn-tactile shrink-0"
          >
            {t('practiceNow')}
          </button>
        </div>
      )}

      {/* FEATURE 3 & 4: Subjects Grid for Adaptive Practice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            {t('selectSubject')}
          </h2>
          <span className="text-xs text-slate-500">NCERT {t('studentClass')} {user?.class_level || 8}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Math Card */}
          <div
            onClick={() => navigate('/quiz?subject=Math')}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                NCERT
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {t('math')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('courseMathDesc')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 pt-2 border-t border-slate-100">
              <span>{t('practiceNow')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Science Card */}
          <div
            onClick={() => navigate('/quiz?subject=Science')}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Atom className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                NCERT
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {t('science')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('courseScienceDesc')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 pt-2 border-t border-slate-100">
              <span>{t('practiceNow')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 5 & 6: Doubt Chat Quick Launcher */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {t('studentNavDoubt')}
              </h3>
              <p className="text-xs text-slate-500">{t('featAiTutorDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/doubt')}
            className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
          >
            <span>{t('studentViewDetails')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Classroom Status Link Card */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {t('studentNavJoinClass')}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('schoolMotto')}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/classroom')}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 btn-tactile shrink-0"
        >
          <span>{t('joinClass')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
