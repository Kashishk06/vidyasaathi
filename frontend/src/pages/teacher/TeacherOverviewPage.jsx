import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Users,
  TrendingDown,
  BookOpen,
  UserX,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  CheckSquare,
  ClipboardList,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
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

export const TeacherOverviewPage = () => {
  const navigate = useNavigate();
  const {
    classes,
    selectedClassId,
    dashboardData,
    loading,
    setShowCreateModal
  } = useOutletContext();

  const [copiedCode, setCopiedCode] = React.useState(false);

  const copyJoinCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">कक्षा डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center space-y-4 border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-3xl flex items-center justify-center mx-auto">
          👨‍🏫
        </div>
        <h3 className="font-bold text-slate-800 text-lg">अभी तक कोई कक्षा नहीं बनाई गई है</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          अपने विद्यार्थियों के साथ जुड़ने और उनकी सीखने की प्रगति को ट्रैक करने के लिए पहली कक्षा बनाएं।
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs btn-tactile"
        >
          पहली कक्षा बनाएं (Create Class)
        </button>
      </div>
    );
  }

  const weakTopicsChart = dashboardData.weakest_topics?.map((wt) => ({
    name: wt.topic_name.split(' ')[0],
    fullName: wt.topic_name,
    score: Math.round(wt.average_mastery * 100),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-600">
            कक्षा सारांश • मुख्य अवलोकन (Class Overview)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {dashboardData.class_name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500">विद्यार्थी जॉइन कोड:</span>
            <button
              onClick={() => copyJoinCode(dashboardData.join_code)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black hover:bg-orange-100 transition-colors"
              title="Copy Join Code"
            >
              <span className="font-mono">{dashboardData.join_code}</span>
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/teacher-dashboard/classes')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            कक्षा प्रबंधन देखें
          </button>
          <button
            onClick={() => navigate('/teacher-dashboard/analytics')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            विस्तृत विश्लेषण खोलें
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Enrolled */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-orange-100 text-orange-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{dashboardData.total_students}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">नामांकित विद्यार्थी</div>
          </div>
        </div>

        {/* Class Average Mastery */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {Math.round(dashboardData.class_average_mastery * 100)}%
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">कक्षा औसत प्रवीणता</div>
          </div>
        </div>

        {/* Inactive Students Alert */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {dashboardData.inactive_students?.length || 0}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">निष्क्रिय विद्यार्थी (3+ दिन)</div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Grid (All 8 Features quick jump) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">शिक्षक सुविधाएं (8 Dedicated Teacher Modules)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Class Management', desc: 'कक्षा एवं छात्र सूची विवरण', path: '/teacher-dashboard/classes', icon: Users, color: 'text-blue-600 bg-blue-50' },
            { title: 'Class Analytics', desc: 'समग्र प्रदर्शन एवं प्रगति चार्ट', path: '/teacher-dashboard/analytics', icon: TrendingDown, color: 'text-indigo-600 bg-indigo-50' },
            { title: 'AI Question Generator', desc: 'NCERT AI प्रश्न बैंक सहायक', path: '/teacher-dashboard/question-generator', icon: Sparkles, color: 'text-orange-600 bg-orange-50' },
            { title: 'Lesson Plan Assistant', desc: 'ग्रामीण संदर्भ सहित पाठ योजना', path: '/teacher-dashboard/lesson-planner', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
            { title: 'Assignments & Tests', desc: 'गृहकार्य एवं टेस्ट परिणाम', path: '/teacher-dashboard/assignments', icon: ClipboardList, color: 'text-purple-600 bg-purple-50' },
            { title: 'Content Review Queue', desc: 'प्रश्न बैंक सामग्री सत्यापन', path: '/teacher-dashboard/content-review', icon: CheckSquare, color: 'text-amber-600 bg-amber-50' },
            { title: 'At-Risk Student Alerts', desc: 'कमजोर छात्र अकादमिक सहायता', path: '/teacher-dashboard/at-risk-students', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
            { title: 'Reports & Exports', desc: 'PDF / CSV रिपोर्ट डाउनलोड', path: '/teacher-dashboard/reports', icon: FileSpreadsheet, color: 'text-teal-600 bg-teal-50' },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(feat.path)}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-2 group bg-slate-50/50 hover:bg-white"
              >
                <div className={`w-8 h-8 rounded-xl ${feat.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                    {feat.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{feat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weakest Topics Chart Spotlight */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              कक्षा के कमजोर विषय (Weakest Topics Requiring Attention)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              छात्रों के अभ्यास परिणामों के आधार पर इन विषयों पर दोबारा ध्यान देने की आवश्यकता है
            </p>
          </div>
          <button
            onClick={() => navigate('/teacher-dashboard/analytics')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>पूर्ण विश्लेषण</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {weakTopicsChart.length > 0 ? (
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weakTopicsChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-10} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'कक्षा औसत प्रवीणता']}
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
          <p className="text-xs text-slate-400 py-6 text-center">पर्याप्त अभ्यास डाटा उपलब्ध नहीं है।</p>
        )}
      </div>

      {/* Student Roster Snapshot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            विद्यार्थी प्रवीणता सारांश (Student Mastery Snapshot)
          </h3>
          <button
            onClick={() => navigate('/teacher-dashboard/classes')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>सभी विद्यार्थी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="pb-3">विद्यार्थी का नाम</th>
                <th className="pb-3">संपर्क</th>
                <th className="pb-3">औसत प्रवीणता</th>
                <th className="pb-3">हल किए प्रश्न</th>
                <th className="pb-3">कमजोर विषय</th>
                <th className="pb-3">अंतिम सक्रियता</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {dashboardData.students_mastery?.slice(0, 5).map((s) => (
                <tr key={s.student_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 text-slate-500">{s.phone_or_email}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
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
                  <td className="py-3">{s.questions_attempted}</td>
                  <td className="py-3 text-amber-900 font-semibold">{s.weakest_topic}</td>
                  <td className="py-3 text-slate-400 text-xs">
                    {s.last_active ? new Date(s.last_active).toLocaleDateString() : 'कभी नहीं'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
