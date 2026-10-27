import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  Users,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  BookOpen,
  Smartphone,
  Shield,
  Bell,
  HeartHandshake,
  Download,
  Calendar,
  ChevronRight,
  Flame,
  Check,
  Eye,
  Sliders,
  Send,
  HelpCircle,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { SampleDashboardHeader } from '../components/SampleDashboardHeader';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [screenLimit, setScreenLimit] = useState(45);
  const [actionNotice, setActionNotice] = useState('');
  const [reminderSent, setReminderSent] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // API-driven state
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Link Child Modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMsg, setLinkMsg] = useState('');

  // Load linked children on mount
  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const res = await api.get('/parent/children');
        const kids = res.data || [];
        setChildren(kids);
        if (kids.length > 0) setSelectedChild(kids[0]);
      } catch (err) {
        console.error('Failed to fetch children:', err);
      } finally {
        setLoadingChildren(false);
      }
    };
    fetchChildren();
  }, []);

  // Load progress when selected child changes
  useEffect(() => {
    if (!selectedChild) return;
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const res = await api.get(`/parent/children/${selectedChild.id}/progress`);
        setProgress(res.data);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
        setProgress(null);
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [selectedChild]);

  const handleLinkChild = async () => {
    if (!linkInput.trim()) return;
    setLinkLoading(true);
    setLinkMsg('');
    try {
      const res = await api.post('/parent/link-child', { student_phone_or_email: linkInput.trim() });
      setLinkMsg('✓ ' + res.data.message);
      const listRes = await api.get('/parent/children');
      const kids = listRes.data || [];
      setChildren(kids);
      if (!selectedChild && kids.length > 0) setSelectedChild(kids[0]);
      setTimeout(() => { setShowLinkModal(false); setLinkInput(''); setLinkMsg(''); }, 1800);
    } catch (err) {
      setLinkMsg('✗ ' + (err.response?.data?.detail || 'Failed to link child.'));
    } finally {
      setLinkLoading(false);
    }
  };

  // Derived display values from API data
  const child = selectedChild
    ? {
        name: selectedChild.name || 'Student',
        classLevel: selectedChild.class_level || 8,
        section: 'A',
        school: `Class ${selectedChild.class_level || 8} - VidyaSaathi`,
        teacher: 'Class Teacher (VidyaSaathi)',
        rollNo: `VS-0${selectedChild.id}`,
        streak: selectedChild.streak || 0,
        xp: Math.round((selectedChild.average_mastery || 0) * 1000),
        avatar: '(student)',
      }
    : {
        name: 'No Child Linked',
        classLevel: 8, section: 'A', school: '—', teacher: '—', rollNo: '—',
        streak: 0, xp: 0, avatar: '(none)',
      };

  // Chart data from progress API or empty fallback
  const studyData = progress?.weekly_activity || [
    { day: 'Mon', minutes: 0 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 },
  ];

  // Subject mastery from API topics (de-duped by subject)
  const subjectColors = ['#f97316', '#eab308', '#10b981', '#0ea5e9', '#8b5cf6'];
  const subjectMastery = progress?.topics
    ? [...new Map(progress.topics.map(t => [t.subject, t])).values()].slice(0, 5).map((t, i) => ({
        subject: t.subject,
        score: t.mastery,
        color: subjectColors[i % 5],
      }))
    : [];

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    handleAction(`Study reminder sent to ${child.name}'s app (Demo)`);
    setTimeout(() => setReminderSent(false), 4000);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sample Header & Switcher */}
      <SampleDashboardHeader
        currentRole="parent"
        title={t('parentHeaderTitle')}
        subtitle={t('parentHeaderSub')}
      />

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionNotice}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">
            SAMPLE ACTION
          </span>
        </div>
      )}

      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{child.avatar}</span>
          <div>
            <div className="font-extrabold text-xs text-slate-900">{child.name}</div>
            <div className="text-[10px] text-slate-500">{t('roleParentTitle')} • {t('studentClass')} {child.classLevel}-{child.section}</div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1.5 border border-orange-200 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? t('close') : t('navParent')}</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className={`lg:col-span-1 space-y-4 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Linked Child Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {loadingChildren ? 'Loading...' : children.length > 0 ? 'LINKED CHILD' : 'NO CHILD LINKED'}
              </span>
              <span className="text-xs text-slate-500 font-medium">{children.length} Linked</span>
            </div>

            {loadingChildren ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-3 space-y-3">
                <p className="text-xs text-slate-500">No child linked to your account yet.</p>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ Link Child Account</span>
                </button>
              </div>
            ) : (
              <>
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChild(c)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                      selectedChild?.id === c.id ? 'bg-orange-50 border border-orange-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-lg flex items-center justify-center border border-orange-200 shrink-0">
                      A
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-slate-900 text-xs truncate">{c.name}</h3>
                      <p className="text-[10px] text-slate-500">Class {c.class_level} &bull; {c.questions_attempted} Q solved</p>
                    </div>
                  </button>
                ))}

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">School:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">{child.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class Teacher:</span>
                    <span className="font-semibold text-slate-800">{child.teacher}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center justify-center gap-1 text-orange-600 font-black text-lg">
                      <Flame className="w-4 h-4 fill-orange-500" />
                      {child.streak}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">Streak (Days)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center justify-center gap-1 text-amber-700 font-black text-lg">
                      <Award className="w-4 h-4" />
                      {child.xp}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">XP Score</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowLinkModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Add Another Child</span>
                </button>
              </>
            )}
          </div>

          {/* Role Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            {[
              { id: 'overview', label: t('tabWeeklyProgress'), icon: TrendingUp },
              { id: 'screentime', label: t('tabScreenTime'), icon: Smartphone },
              { id: 'tips', label: t('tabHomeTips'), icon: Sparkles },
              { id: 'notes', label: t('tabTeacherNotes'), icon: HeartHandshake },
              { id: 'consent', label: t('tabParentConsent'), icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Actions in Sidebar */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              त्वरित कार्य (Quick Actions)
            </span>
            <button
              onClick={handleSendReminder}
              disabled={reminderSent}
              className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors flex items-center gap-2"
            >
              <Bell className="w-3.5 h-3.5 text-orange-600" />
              <span>{reminderSent ? 'अनुस्मारक भेजा गया ✓' : 'पढ़ाई का अनुस्मारक भेजें'}</span>
            </button>
            <button
              onClick={() => handleAction('साप्ताहिक प्रगति रिपोर्ट PDF डाउनलोड की जा रही है (Weekly Report Demo PDF downloaded)')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>रिपोर्ट डाउनलोड (PDF)</span>
            </button>
          </div>

          {/* Quick Support / Contact Teacher */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-4 border border-orange-100 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <HeartHandshake className="w-4 h-4 text-orange-600" />
              <span>शिक्षक से संपर्क (Direct Check-in)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              शिक्षिका सुनीता शर्मा से आरव की गणित प्रगति या गृहकार्य पर चर्चा के लिए अनुरोध भेजें।
            </p>
            <button
              onClick={() => handleAction('शिक्षिका सुनीता शर्मा को परामर्श अनुरोध भेजा गया (Teacher consultation requested - Demo)')}
              className="w-full py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-800 font-bold border border-orange-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile text-xs shadow-xs"
            >
              <Send className="w-3 h-3 text-orange-600" />
              <span>बातचीत का अनुरोध भेजें</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Welcome & Top Summary Cards */}
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                  </h1>
                  {children.length > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      LIVE DATA
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {selectedChild
                    ? <span>This week's learning progress for <strong>{selectedChild.name} (Class {selectedChild.class_level})</strong>.</span>
                    : 'Link your child account to monitor their daily learning and progress.'}
                </p>
              </div>

              {/* Quick Actions Button Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSendReminder}
                  disabled={reminderSent}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 btn-tactile"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{reminderSent ? 'अनुस्मारक भेजा गया ✓' : 'पढ़ाई का अनुस्मारक'}</span>
                </button>
                <button
                  onClick={() => handleAction('साप्ताहिक प्रगति रिपोर्ट PDF डाउनलोड की जा रही है (Weekly Report Demo PDF downloaded)')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>रिपोर्ट डाउनलोड (PDF)</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">अध्ययन समय</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">4.8 <span className="text-xs font-medium text-slate-500">घंटे/हफ़्ता</span></div>
                <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +45 मिनट पिछले हफ़्ते से
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">Accuracy</span>
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {loadingProgress ? '...' : progress ? `${progress.overall_accuracy}%` : 'N/A'}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  {progress ? `${progress.total_questions_solved} questions solved` : 'No data yet'}
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">Strong Topics</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {loadingProgress ? '...' : progress ? progress.topics.filter(t => t.mastery >= 70).length : 0}
                  <span className="text-xs font-medium text-slate-500"> topics</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-600">
                  {progress?.topics?.filter(t => t.mastery >= 70).slice(0, 2).map(t => t.topic_name).join(', ') || 'Complete quizzes to track'}
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">Need Revision</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {loadingProgress ? '...' : progress ? progress.topics.filter(t => t.mastery < 40).length : 0}
                  <span className="text-xs font-medium text-slate-500"> topics</span>
                </div>
                <div className="text-[11px] font-semibold text-rose-700">
                  {progress?.topics?.filter(t => t.mastery < 40).slice(0, 2).map(t => t.topic_name).join(', ') || 'No weak topics found'}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Study Time Chart & Strengths / Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart: Daily Study Minutes */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>दैनिक पढ़ाई समय (Weekly Study Minutes)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">इस सप्ताह ऐप पर बिताया गया समय (मिनटों में)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  DEMO DATA
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="m" />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#fed7aa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(val) => [`${val} मिनट`, 'पढ़ाई समय']}
                    />
                    <Bar dataKey="minutes" fill="#ea580c" radius={[6, 6, 0, 0]}>
                      {studyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.minutes >= 45 ? '#ea580c' : '#f59e0b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> 45+ मिनट (दैनिक लक्ष्य पूर्ण)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 45 मिनट से कम
                </span>
              </div>
            </div>

            {/* Strengths & Learning Gap Topics */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    मजबूत एवं कमजोर अध्याय (Concept Mastery)
                  </h3>
                  <p className="text-[11px] text-slate-500">AI द्वारा पहचाने गए विषय स्तर</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  DEMO DATA
                </span>
              </div>

              <div className="space-y-3">
                {/* Topic 1 */}
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      फसल उत्पादन एवं प्रबंध (Crop Production)
                    </span>
                    <span className="text-xs font-black text-emerald-700">92% महारत</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-[10px] text-emerald-800">खेत के देसी उदाहरणों की मदद से आरव ने सभी प्रश्न सही हल किए।</p>
                </div>

                {/* Topic 2 */}
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      परिमेय संख्याएँ (Rational Numbers)
                    </span>
                    <span className="text-xs font-black text-amber-700">78% महारत</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-[10px] text-amber-800">रोटी और खेत विभाजन के उदाहरण से अच्छी प्रगति हुई।</p>
                </div>

                {/* Topic 3 (Weak) */}
                <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      प्रकाश: परावर्तन के नियम (Reflection of Light)
                    </span>
                    <span className="text-xs font-black text-rose-700">46% महारत</span>
                  </div>
                  <div className="w-full bg-rose-200/60 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                  <p className="text-[10px] text-rose-800">
                    आपतन कोण और परावर्तन कोण के प्रश्नों में भ्रम। अतिरिक्त अभ्यास अनुशंसित है।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Time Controls & Home Tutoring Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screen Time Controls Card */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      स्क्रीन-समय और आँख सुरक्षा (Screen-Time Controls)
                    </h3>
                    <p className="text-[11px] text-slate-500">अभिभावक नियंत्रण एवं स्वस्थ डिजिटल आदतें</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  DEMO CONTROLS
                </span>
              </div>

              {/* Today's Usage Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">आज का कुल उपयोग:</span>
                  <span className="font-black text-slate-900">28 मिनट / {screenLimit} मिनट सीमा</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (28 / screenLimit) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  सुरक्षित सीमा में है। 20 मिनट बाद आँख आराम का संकेत दिया जाएगा।
                </p>
              </div>

              {/* Daily Limit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>दैनिक अध्ययन सीमा निर्धारित करें:</span>
                  <span className="text-orange-600 font-bold">{screenLimit} मिनट</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={screenLimit}
                  onChange={(e) => {
                    setScreenLimit(Number(e.target.value));
                    handleAction(`दैनिक सीमा बदलकर ${e.target.value} मिनट कर दी गई (Demo Limit Updated)`);
                  }}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>20m (हल्का)</span>
                  <span>45m (सुझावित)</span>
                  <span>90m (अधिकतम)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span className="font-semibold text-slate-700">कम इंटरनेट मोड (2G/3G अनुकूलन)</span>
                  <input type="checkbox" defaultChecked className="accent-orange-600 rounded" />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span className="font-semibold text-slate-700">रात 8 बजे के बाद ऐप लॉक</span>
                  <input type="checkbox" defaultChecked className="accent-orange-600 rounded" />
                </label>
              </div>
            </div>

            {/* Personalized Home Learning Tips */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      घर पर सिखाने के टिप्स (Parent Tutoring Tips)
                    </h3>
                    <p className="text-[11px] text-slate-500">बिना तकनीकी ज्ञान के बच्चे की मदद कैसे करें</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI GUIDED
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs space-y-1">
                  <div className="font-bold text-orange-950 flex items-center gap-1.5">
                    🌾 1. विज्ञान - बीज और सिंचाई (Farming Link)
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    शाम को बात करते समय आरव से पूछें कि धान और गेहूँ की बुवाई में पानी की कितनी आवश्यकता होती है। इससे उसका 'फसल उत्पादन' अध्याय पक्का होगा।
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    🪞 2. प्रकाश परावर्तन - चम्मच व आईना
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    स्टील के नए चम्मच में सीधा और उल्टा चेहरा दिखाकर पूछें कि ऐसा क्यों हो रहा है। प्रकाश अध्याय के प्रश्नों में यह व्यावहारिक रूप से मदद करेगा।
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    🗣️ 3. बोलकर समझाने के लिए कहें
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    आरव से कहें कि वह दिन में सीखी कोई एक बात अपनी मातृभाषा में आपको समझाए। इससे उसका आत्मविश्वास दोगुना होता है।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Child Activities Feed */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                हाल की गतिविधियाँ (Recent Activity Log - Demo)
              </h3>
              <span className="text-[10px] text-slate-500">अंतिम 48 घंटे</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-800 font-semibold">विज्ञान क्विज़ पूरा किया (फसल उत्पादन)</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    90% अंक
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">2 घंटे पहले</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-slate-800 font-semibold">5 दिनों की निरंतर पढ़ाई की लड़ी (Streak) पूरी की</span>
                  <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    🔥 5 दिन
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">कल शाम</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span className="text-slate-800 font-semibold">AI ट्यूटर से 'स्टोमेटा' पर सवाल पूछा और ऑडियो सुना</span>
                </div>
                <span className="text-slate-400 text-[11px]">2 दिन पहले</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Link Child Modal Overlay */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Link Child Account</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter your child's registered phone number or email</p>
              </div>
              <button
                onClick={() => { setShowLinkModal(false); setLinkInput(''); setLinkMsg(''); }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkChild()}
                placeholder="e.g. aarav@vidyasaathi.in or 9876543210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {linkMsg && (
                <p className={`text-xs font-semibold px-3 py-2 rounded-xl ${
                  linkMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {linkMsg}
                </p>
              )}
              <button
                onClick={handleLinkChild}
                disabled={linkLoading || !linkInput.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {linkLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {linkLoading ? 'Linking...' : 'Link Child Account'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              The student must already have a VidyaSaathi account. Only students (role: student) can be linked.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
