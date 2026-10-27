import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  BookOpen,
  PieChart as PieIcon,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Sparkles
} from 'lucide-react';
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

export const ClassAnalyticsPage = () => {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    dashboardData,
    loadDashboard,
    loading
  } = useOutletContext();

  const [subjectFilter, setSubjectFilter] = useState('all');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Topics filtered by subject
  const allWeakTopics = dashboardData?.weakest_topics || [];
  const filteredTopics = allWeakTopics.filter((wt) => {
    if (subjectFilter === 'all') return true;
    return wt.subject?.toLowerCase() === subjectFilter.toLowerCase();
  });

  const topicChartData = filteredTopics.map((wt) => ({
    name: wt.topic_name.length > 15 ? wt.topic_name.substring(0, 15) + '...' : wt.topic_name,
    fullName: wt.topic_name,
    subject: wt.subject,
    score: Math.round(wt.average_mastery * 100),
    attempts: wt.attempts_count
  }));

  // Student Mastery Tiers
  const students = dashboardData?.students_mastery || [];
  const highPerformers = students.filter((s) => s.average_mastery >= 0.7).length;
  const mediumPerformers = students.filter((s) => s.average_mastery >= 0.4 && s.average_mastery < 0.7).length;
  const strugglingStudents = students.filter((s) => s.average_mastery < 0.4).length;

  const distributionData = [
    { name: 'उत्कृष्ट (>70%)', value: highPerformers, color: '#10b981' },
    { name: 'मध्यम (40-70%)', value: mediumPerformers, color: '#f59e0b' },
    { name: 'ध्यान आवश्यक (<40%)', value: strugglingStudents, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const totalQuestionsSolved = students.reduce((sum, s) => sum + (s.questions_attempted || 0), 0);
  const activeStudentsCount = (dashboardData?.total_students || 0) - (dashboardData?.inactive_students?.length || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
            सुविधा 2 • कक्षा विश्लेषण (Feature 2: Class Analytics)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            समग्र कक्षा प्रदर्शन एवं विषयवार प्रगति
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            विद्यार्थियों के अभ्यास डेटा और NCERT पाठ्यक्रम प्रवीणता का दृश्य विश्लेषण
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {classes.length > 0 && (
            <select
              value={selectedClassId || ''}
              onChange={(e) => {
                const cid = Number(e.target.value);
                setSelectedClassId(cid);
                loadDashboard(cid);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                subjectFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              सभी विषय
            </button>
            <button
              onClick={() => setSubjectFilter('Math')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                subjectFilter === 'Math' ? 'bg-indigo-600 text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              गणित (Math)
            </button>
            <button
              onClick={() => setSubjectFilter('Science')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                subjectFilter === 'Science' ? 'bg-indigo-600 text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              विज्ञान (Science)
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">कक्षा औसत प्रवीणता</span>
          <div className="text-2xl font-black text-slate-900">
            {Math.round((dashboardData?.class_average_mastery || 0) * 100)}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.round((dashboardData?.class_average_mastery || 0) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">कुल हल किए प्रश्न</span>
          <div className="text-2xl font-black text-indigo-600">{totalQuestionsSolved}</div>
          <p className="text-xs text-slate-500">सभी विद्यार्थियों द्वारा कुल प्रयास</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">सक्रिय भागीदारी दर</span>
          <div className="text-2xl font-black text-emerald-600">
            {dashboardData?.total_students
              ? `${Math.round((activeStudentsCount / dashboardData.total_students) * 100)}%`
              : '0%'}
          </div>
          <p className="text-xs text-slate-500">{activeStudentsCount} / {dashboardData?.total_students || 0} छात्र सक्रिय</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">कमजोर विषय चिह्नित</span>
          <div className="text-2xl font-black text-red-500">
            {allWeakTopics.filter((t) => t.average_mastery < 0.4).length}
          </div>
          <p className="text-xs text-slate-500">जिनमें विशेष उपचारात्मक कक्षा आवश्यक</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>विषयवार औसत प्रवीणता स्कोर (Topic-wise Mastery % )</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                लाल: कमजोर (&lt;40%) | पीला: मध्यम (40-65%) | हरा: उत्कृष्ट (&gt;65%)
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400">स्कोर % (0-100)</span>
          </div>

          {topicChartData.length > 0 ? (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${val}% (${item.payload.attempts} प्रयास)`,
                      'कक्षा औसत'
                    ]}
                    labelFormatter={(name, items) => {
                      return items?.[0]?.payload?.fullName || name;
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {topicChartData.map((entry, index) => (
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
            <p className="text-xs text-slate-400 py-12 text-center">इस विषय में कोई अभ्यास डेटा उपलब्ध नहीं है।</p>
          )}
        </div>

        {/* Student Mastery Distribution Tier */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <span>छात्र प्रवीणता वितरण</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              कक्षा के कुल {students.length} छात्रों का दक्षता स्तर
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-emerald-950">उत्कृष्ट (&gt;70%)</span>
              </div>
              <span className="font-black text-sm text-emerald-700">{highPerformers} छात्र</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-amber-950">मध्यम (40-70%)</span>
              </div>
              <span className="font-black text-sm text-amber-700">{mediumPerformers} छात्र</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs font-bold text-red-950">कमजोर / ध्यान आवश्यक (&lt;40%)</span>
              </div>
              <span className="font-black text-sm text-red-700">{strugglingStudents} छात्र</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
            <strong>सुझाव:</strong> कमजोर श्रेणी के छात्रों के लिए AI प्रश्न बैंक से सरल स्तर के प्रश्नों का अभ्यास असाइन करें।
          </div>
        </div>
      </div>

      {/* Topic Diagnostic Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          विस्तृत विषयवार नैदानिक रिपोर्ट (Topic Diagnostic Table)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="pb-3">विषय (Subject)</th>
                <th className="pb-3">अध्याय / टॉपिक का नाम</th>
                <th className="pb-3">कक्षा औसत प्रवीणता</th>
                <th className="pb-3">कुल हल किए प्रश्न</th>
                <th className="pb-3">स्थिति (Status)</th>
                <th className="pb-3">सिफारिश (Recommendation)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTopics.map((t) => (
                <tr key={t.topic_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">{t.subject}</td>
                  <td className="py-3.5 font-bold text-slate-800">{t.topic_name}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.average_mastery >= 0.7
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.average_mastery >= 0.4
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {Math.round(t.average_mastery * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5">{t.attempts_count} बार अभ्यास</td>
                  <td className="py-3.5">
                    {t.average_mastery < 0.4 ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>कमजोर</span>
                      </span>
                    ) : t.average_mastery <= 0.65 ? (
                      <span className="text-amber-600 font-bold">मध्यम</span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>संतुष्टप्रद</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-600 text-xs">
                    {t.average_mastery < 0.4
                      ? 'कक्षा में पुनरावृत्ति एवं पाठ योजना बनाएं'
                      : t.average_mastery <= 0.65
                      ? 'मध्यम स्तर के अतिरिक्त प्रश्न असाइन करें'
                      : 'उन्नत स्तर के बहुविकल्पीय प्रश्नों का अभ्यास'}
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
