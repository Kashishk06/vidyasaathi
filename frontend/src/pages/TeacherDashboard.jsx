import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Users,
  PlusCircle,
  TrendingDown,
  Clock,
  UserX,
  Sparkles,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  CheckSquare,
  Menu,
  X,
  Settings,
  ChevronRight,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  // New Class Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0].id);
        await loadDashboard(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (classId) => {
    try {
      const res = await api.get(`/classes/${classId}/dashboard`);
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to load class dashboard:", err);
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
      console.error("Failed to create class:", err);
    } finally {
      setCreating(false);
    }
  };

  const copyJoinCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">कक्षा डैशबोर्ड तैयार हो रहा है...</p>
      </div>
    );
  }

  const weakTopicsChart = dashboardData?.weakest_topics?.map((wt) => ({
    name: wt.topic_name.split(' ')[0],
    fullName: wt.topic_name,
    score: Math.round(wt.average_mastery * 100),
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 font-black text-sm flex items-center justify-center">
            👨‍🏫
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">शिक्षक पोर्टल</div>
            <div className="text-[10px] text-slate-500">{dashboardData?.class_name || 'कक्षा प्रबंधन'}</div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1.5 border border-orange-200 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? 'मेनू बंद' : 'डैशबोर्ड मेनू'}</span>
        </button>
      </div>

      {/* Main Layout Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className={`lg:col-span-1 space-y-4 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Teacher Identity & Active Class Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                शिक्षक प्रोफ़ाइल
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                सक्रिय सत्र
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-2xl flex items-center justify-center border border-white/40 shadow-xs">
                👨‍🏫
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">{dashboardData?.class_name || 'आपकी कक्षा'}</h3>
                <p className="text-xs text-slate-500">{classes.length} कक्षाएं पंजीकृत</p>
              </div>
            </div>

            {/* Class Selector in Sidebar */}
            {classes.length > 0 && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">कक्षा बदलें:</label>
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
            )}

            {/* Join Code Widget */}
            {dashboardData && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1 text-xs">
                <span className="text-slate-500 text-[11px] block">विद्यार्थी जॉइन कोड:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-orange-900">{dashboardData.join_code}</span>
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
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ नई कक्षा बनाएं (Create Class)</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
              डैशबोर्ड नेविगेशन
            </span>
            {[
              { id: 'overview', label: 'कक्षा अवलोकन (Overview)', icon: LayoutDashboard, action: () => { document.getElementById('class-overview-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('overview'); } },
              { id: 'weak-topics', label: 'कमजोर विषय विश्लेषण (Weak Topics)', icon: TrendingDown, action: () => { document.getElementById('weak-topics-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('weak-topics'); } },
              { id: 'students-table', label: 'विद्यार्थी प्रवीणता (Students Table)', icon: Users, action: () => { document.getElementById('students-table-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('students-table'); } },
              { id: 'review', label: 'AI प्रश्न निर्माण व समीक्षा (Review)', icon: CheckSquare, action: () => navigate('/teacher/review') },
              { id: 'settings', label: 'भाषा व सेटिंग्स (Settings)', icon: Settings, action: () => navigate('/settings') },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 shrink-0 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick AI & Review Action */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-4 border border-orange-100 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>AI प्रश्न बैंक सहायक</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              NCERT पाठ्यक्रम से नए प्रश्न बनाएं या छात्रों द्वारा रिपोर्ट की गई समस्याओं की समीक्षा करें।
            </p>
            <button
              onClick={() => {
                navigate('/teacher/review');
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-800 font-bold border border-orange-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile text-xs shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>प्रश्न समीक्षा पोर्टल खोलें</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Banner & Class Selector */}
          <div id="class-overview-section" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            शिक्षक प्रबंधन पोर्टल (Teacher Analytics Portal)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            {dashboardData?.class_name || "आपकी कक्षाएं"}
          </h1>
          {dashboardData && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">विद्यार्थियों के जुड़ने का कोड:</span>
              <button
                onClick={() => copyJoinCode(dashboardData.join_code)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black hover:bg-orange-100 transition-colors"
                title="Copy Join Code"
              >
                <span>{dashboardData.join_code}</span>
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Actions: Switch Class & Create Class */}
        <div className="flex items-center gap-3">
          {classes.length > 0 && (
            <select
              value={selectedClassId || ''}
              onChange={handleClassChange}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 btn-tactile shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>नई कक्षा बनाएं</span>
          </button>
        </div>
      </div>

      {dashboardData ? (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Enrolled */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{dashboardData.total_students}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">नामांकित विद्यार्थी</div>
              </div>
            </div>

            {/* Class Average Mastery */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {Math.round(dashboardData.class_average_mastery * 100)}%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">कक्षा का औसत (Mastery)</div>
              </div>
            </div>

            {/* Inactive Students Alert */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {dashboardData.inactive_students?.length || 0}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">निष्क्रिय विद्यार्थी (Inactive)</div>
              </div>
            </div>
          </div>

          {/* Weakest Topics Chart & AI Question Generator Promo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Weakest Topics */}
            <div id="weak-topics-section" className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    कमजोर विषय विश्लेषण (Weakest Topics in Class)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    इन विषयों पर कक्षा में दोबारा ध्यान देने की आवश्यकता है
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">औसत स्कोर %</span>
              </div>

              {weakTopicsChart.length > 0 ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weakTopicsChart} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'कक्षा औसत']}
                        labelFormatter={(name) => {
                          const m = weakTopicsChart.find((w) => w.name === name);
                          return m ? m.fullName : name;
                        }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {weakTopicsChart.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.score < 40 ? '#ef4444' : entry.score <= 65 ? '#f59e0b' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-8 text-center">पर्याप्त अभ्यास डाटा उपलब्ध नहीं है।</p>
              )}
            </div>

            {/* Quick Action Card: AI Question Generator */}
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="font-bold text-lg leading-snug">
                  AI प्रश्न बैंक सहायक <br />
                  (Watsonx Generator)
                </h3>
                <p className="text-xs text-orange-100 leading-relaxed">
                  कमजोर विषयों के लिए NCERT पाठ्यक्रम से नए प्रश्न ऑटो-जनरेट करें और मंजूरी देने से पहले समीक्षा करें।
                </p>
              </div>

              <button
                onClick={() => navigate('/teacher/review')}
                className="w-full py-3 rounded-2xl bg-white hover:bg-orange-50 text-orange-900 font-bold text-xs shadow-sm flex items-center justify-center gap-2 btn-tactile transition-all"
              >
                <CheckSquare className="w-4 h-4 text-orange-600" />
                <span>प्रश्न समीक्षा और निर्माण</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Mastery Table */}
          <div id="students-table-section" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              प्रत्येक विद्यार्थी की स्थिति (Per-Student Mastery Table)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    <th className="pb-3">विद्यार्थी का नाम</th>
                    <th className="pb-3">संपर्क</th>
                    <th className="pb-3">औसत प्रवीणता</th>
                    <th className="pb-3">हल किए प्रश्न</th>
                    <th className="pb-3">सुधार का विषय</th>
                    <th className="pb-3">अंतिम सक्रियता</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {dashboardData.students_mastery.map((s) => (
                    <tr key={s.student_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3.5 text-slate-500">{s.phone_or_email}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            s.average_mastery >= 0.7
                              ? 'bg-emerald-50 text-emerald-700'
                              : s.average_mastery >= 0.4
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {Math.round(s.average_mastery * 100)}%
                        </span>
                      </td>
                      <td className="py-3.5">{s.questions_attempted}</td>
                      <td className="py-3.5 text-amber-900 font-semibold">{s.weakest_topic}</td>
                      <td className="py-3.5 text-slate-400 text-xs">
                        {s.last_active ? new Date(s.last_active).toLocaleDateString() : 'कभी नहीं'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-slate-200">
          <p className="text-slate-500 font-medium">अभी तक कोई कक्षा नहीं बनाई गई है।</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
          >
            पहली कक्षा बनाएं
          </button>
        </div>
      )}
        </main>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-orange-100">
            <h3 className="font-bold text-slate-900 text-base">नई कक्षा जोड़ें (New Classroom)</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा का नाम</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="जैसे: कक्षा 8 - ज्ञान निकेतन"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs"
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
