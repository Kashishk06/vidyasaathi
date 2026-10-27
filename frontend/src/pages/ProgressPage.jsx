import React, { useState, useEffect } from 'react';
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
  Trophy,
  Flame,
  Award,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export const ProgressPage = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setData(res.data);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">प्रगति रिपोर्ट तैयार हो रही है...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-500">डाटा उपलब्ध नहीं है।</div>;
  }

  // Format chart data
  const chartData = data.topic_masteries.map((t) => ({
    name: t.topic_name.split(' ')[0], // short name
    fullName: t.topic_name,
    mastery: Math.round(t.mastery_score * 100),
  }));

  const getBarColor = (score) => {
    if (score < 40) return '#ef4444'; // Red
    if (score <= 70) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const incorrectCount = Math.max(0, (data.total_attempts || 0) - (data.total_correct || 0));

  // Subject-wise calculations
  const mathTopics = data.topic_masteries?.filter((t) => t.subject?.toLowerCase().includes('math')) || [];
  const scienceTopics = data.topic_masteries?.filter((t) => t.subject?.toLowerCase().includes('science')) || [];
  const mathAvg = mathTopics.length > 0 ? Math.round((mathTopics.reduce((acc, cur) => acc + cur.mastery_score, 0) / mathTopics.length) * 100) : 0;
  const scienceAvg = scienceTopics.length > 0 ? Math.round((scienceTopics.reduce((acc, cur) => acc + cur.mastery_score, 0) / scienceTopics.length) * 100) : 0;

  // Topics completed vs needing improvement
  const completedTopics = data.topic_masteries?.filter((t) => t.mastery_score >= 0.70) || [];
  const improvingTopics = data.topic_masteries?.filter((t) => t.mastery_score < 0.40) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          मेरी प्रगति और उपलब्धियाँ (My Learning Progress)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          प्रत्येक विषय में प्रवीणता, सही/गलत उत्तर और अर्जित बैज की संपूर्ण समीक्षा
        </p>
      </div>

      {/* Empty State for New Students (Feature 7) */}
      {data.total_attempts === 0 && (
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-amber-950 text-base">
              स्वागत है! आपने अभी तक कोई अभ्यास पूरा नहीं किया है।
            </h3>
            <p className="text-xs text-amber-800">
              अपनी प्रारंभिक समझ का स्तर जानने के लिए 8 प्रश्नों का छोटा डायग्नोस्टिक टेस्ट दें!
            </p>
          </div>
          <a
            href="/quiz?mode=diagnostic"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 btn-tactile shrink-0"
          >
            डायग्नोस्टिक टेस्ट शुरू करें
          </a>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions & Correct/Incorrect Split */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data.total_attempts}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">कुल प्रश्न हल किए</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              <span className="text-emerald-700 font-bold">{data.total_correct} सही</span> • <span className="text-rose-600 font-bold">{incorrectCount} गलत</span>
            </div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data.overall_accuracy}%</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">सटीकता (Accuracy)</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              {data.total_attempts > 0 ? 'प्रमाणित प्रदर्शन' : 'शुरुआत करें'}
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data.current_streak}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">लगातार सही (Streak)</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">दिनों की लड़ी</div>
          </div>
        </div>

        {/* Highest Streak */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{data.highest_streak}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">सर्वोत्तम लड़ी (Best)</div>
            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">व्यक्तिगत रिकॉर्ड</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery & Topics Completed/Improving Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">गणित प्रवीणता (Maths)</span>
          <div className="text-2xl font-black text-slate-900">{mathAvg}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-600 h-full rounded-full" style={{ width: `${mathAvg}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">विज्ञान प्रवीणता (Science)</span>
          <div className="text-2xl font-black text-slate-900">{scienceAvg}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${scienceAvg}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">सशक्त अध्याय (&gt;70%)</span>
          <div className="text-2xl font-black text-emerald-800">{completedTopics.length} <span className="text-xs text-slate-500 font-normal">अध्याय</span></div>
          <div className="text-[10px] text-emerald-700 font-medium truncate">
            {completedTopics.map((t) => t.topic_name).join(', ') || 'अभ्यास जारी रखें'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">सुधार आवश्यक (&lt;40%)</span>
          <div className="text-2xl font-black text-rose-800">{improvingTopics.length} <span className="text-xs text-slate-500 font-normal">अध्याय</span></div>
          <div className="text-[10px] text-rose-700 font-medium truncate">
            {improvingTopics.map((t) => t.topic_name).join(', ') || 'कोई कमजोर विषय नहीं'}
          </div>
        </div>
      </div>

      {/* Mastery Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            विषयवार प्रवीणता स्कोर (Topic Mastery %)
          </h3>
          <span className="text-xs font-semibold text-slate-400">0% से 100%</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val) => [`${val}%`, 'प्रवीणता (Mastery)']}
                labelFormatter={(name) => {
                  const match = chartData.find((c) => c.name === name);
                  return match ? match.fullName : name;
                }}
              />
              <Bar dataKey="mastery" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.mastery)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          उपलब्धि बैज (Badges Showcase)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {data.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/70 border-amber-300/80 shadow-xs'
                  : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl">{b.icon}</div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 leading-tight">{b.title}</div>
                <div className="text-[10px] text-slate-500 line-clamp-2">{b.description}</div>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  b.unlocked
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {b.unlocked ? 'अर्जित (Earned)' : 'बंद (Locked)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Topic List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          विस्तृत विषय सूची (Detailed Breakdown)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.topic_masteries.map((t) => (
            <div
              key={t.topic_id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    {t.subject}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{t.topic_name}</h4>
                </div>
                <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                  {Math.round(t.mastery_score * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round(t.mastery_score * 100)}%`,
                    backgroundColor: getBarColor(Math.round(t.mastery_score * 100)),
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>स्तर: {t.level}</span>
                <span>{t.correct_attempts} / {t.total_attempts} सही उत्तर</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attempts History */}
      {data.recent_attempts?.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            हाल ही का अभ्यास इतिहास (Recent Practice History)
          </h3>

          <div className="divide-y divide-slate-100">
            {data.recent_attempts.map((a) => (
              <div key={a.attempt_id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  {a.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-slate-800 line-clamp-1">{a.question_text}</p>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {a.subject} • {a.topic_name} • {a.time_taken}s
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    a.is_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {a.is_correct ? 'सही' : 'गलत'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
