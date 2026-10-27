import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  RotateCcw,
  CheckCircle2,
  Check,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  BrainCircuit
} from 'lucide-react';

export const StudentRevisionPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const { progress } = outletCtx;

  const [revisionItems, setRevisionItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'due' | 'reviewed'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildQueue();
  }, [progress]);

  const buildQueue = () => {
    if (!progress?.topic_masteries) {
      setLoading(false);
      return;
    }

    // Filter topics with score < 0.70 or that have incorrect attempts
    const needRevision = progress.topic_masteries
      .filter(
        (t) =>
          t.mastery_score < 0.7 ||
          (t.total_attempts > 0 && t.correct_attempts < t.total_attempts)
      )
      .sort((a, b) => a.mastery_score - b.mastery_score);

    const items = needRevision.map((t, idx) => ({
      id: t.topic_id,
      topicName: t.topic_name,
      subject: t.subject,
      chapter: t.chapter,
      mastery: Math.round(t.mastery_score * 100),
      totalAttempts: t.total_attempts,
      correctAttempts: t.correct_attempts,
      dueStatus:
        idx === 0
          ? 'आज देय (Due Today)'
          : idx === 1
          ? 'कल देय (Due Tomorrow)'
          : '3 दिन में (In 3 Days)',
      isDueToday: idx <= 1,
      reviewed: false,
    }));

    setRevisionItems(items);
    setLoading(false);
  };

  const handleMarkRevisionDone = (topicId) => {
    setRevisionItems((prev) =>
      prev.map((item) => (item.id === topicId ? { ...item, reviewed: !item.reviewed } : item))
    );
  };

  const filteredItems = revisionItems.filter((item) => {
    if (activeFilter === 'due') return !item.reviewed && item.isDueToday;
    if (activeFilter === 'reviewed') return item.reviewed;
    return true;
  });

  const dueTodayCount = revisionItems.filter((i) => !i.reviewed && i.isDueToday).length;
  const reviewedCount = revisionItems.filter((i) => i.reviewed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student" className="hover:text-orange-600 transition-colors">
          डैशबोर्ड
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">स्मार्ट पुनरावृत्ति (Smart Revision)</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-orange-50 backdrop-blur-sm">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>स्पैस्ड रिपीटीशन एल्गोरिदम • दीर्घकालिक स्मृति सुदृढ़ीकरण</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            स्मार्ट पुनरावृत्ति कतार (Smart Revision Queue)
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            जब आप किसी प्रश्न में गलती करते हैं, तो विद्यासाथी स्वचालित रूप से उस विषय को इस कतार में जोड़ देता है। समय-समय पर पुनरावृत्ति करने से भूलने की संभावना 80% कम हो जाती है।
          </p>
        </div>

        {/* Status Counter */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-amber-200">{dueTodayCount}</div>
            <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
              आज देय
            </div>
          </div>
          <div className="w-px h-10 bg-white/25"></div>
          <div className="text-center px-2">
            <div className="text-2xl font-black text-white">{reviewedCount}</div>
            <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
              समीक्षित
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          {[
            { id: 'all', label: `सभी (${revisionItems.length})` },
            { id: 'due', label: `आज देय (${dueTodayCount})` },
            { id: 'reviewed', label: `समीक्षित (${reviewedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          कम महारत (&lt;70%) एवं पिछली गलतियों के आधार पर क्रमबद्ध
        </span>
      </div>

      {/* Revision Items List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              पुनरावृत्ति कतार खाली है!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              बहुत बढ़िया! इस श्रेणी में कोई लंबित रिवीजन नहीं है। नए प्रश्नों का अभ्यास जारी रखें ताकि आपकी प्रवीणता बनी रहे।
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs btn-tactile inline-flex items-center gap-1.5"
            >
              <span>नया अभ्यास शुरू करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                item.reviewed
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-orange-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    {item.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.chapter || 'NCERT Class 8'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.isDueToday
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {item.dueStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {item.topicName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    कुल प्रयास: {item.totalAttempts} • सही उत्तर: {item.correctAttempts}
                  </p>
                </div>

                {/* Mastery Bar */}
                <div className="space-y-1 max-w-xs">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">वर्तमान महारत</span>
                    <span
                      className={
                        item.mastery >= 70
                          ? 'text-emerald-700'
                          : item.mastery >= 50
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }
                    >
                      {item.mastery}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.mastery >= 70
                          ? 'bg-emerald-500'
                          : item.mastery >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.mastery}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleMarkRevisionDone(item.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 btn-tactile ${
                    item.reviewed
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={item.reviewed ? 'पुनः लंबित करें' : 'समीक्षा पूर्ण चिह्नित करें'}
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {item.reviewed ? 'समीक्षित ✓' : 'पूर्ण चिह्नित करें'}
                  </span>
                </button>

                <button
                  onClick={() => navigate(`/quiz?topic=${item.id}&mode=revision`)}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs btn-tactile flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>रिवीजन क्विज़</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Leitner Spaced Repetition Methodology Card */}
      <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3 text-xs text-amber-950">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
          <BrainCircuit className="w-4 h-4 text-amber-600" />
          <span>स्पैस्ड रिपीटीशन कैसे काम करता है? (How it Works)</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          विद्यासाथी का स्मृति तंत्र प्रसिद्ध वैज्ञानिक जर्मन मनोवैज्ञानिक हरमन एबिंगहॉस के "भूलने के वक्र (Forgetting Curve)" पर आधारित है। जब आप किसी प्रश्न में अटकते हैं, तो सिस्टम 1 दिन, 3 दिन और 7 दिन के वैज्ञानिक अंतराल पर आपको पुनः वही अवधारणा दोहराने के लिए प्रेरित करता है, जिससे ज्ञान अल्पकालिक से दीर्घकालिक स्मृति में स्थापित हो जाता है।
        </p>
      </div>
    </div>
  );
};
