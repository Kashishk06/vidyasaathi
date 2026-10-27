import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  CheckCircle2,
  Check,
  Award,
  Flame,
  ArrowRight,
  BookOpen,
  Target,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const StudentStudyPlanPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const { streak = 0, totalXp = 0 } = outletCtx;

  const todayStr = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const studyPlanStorageKey = `vidyasaathi_study_plan_${user?.id || 'guest'}_${new Date().toDateString()}`;

  const defaultTasks = [
    {
      id: 1,
      title: 'दैनिक लक्ष्य: 5 अभ्यास प्रश्न हल करें',
      desc: 'अनुकूलित अभ्यास मोड में कम से कम 5 प्रश्नों का समाधान करें।',
      completed: false,
      xp: 20,
      icon: BookOpen,
      actionLabel: 'अभ्यास शुरू करें',
      actionUrl: '/quiz',
    },
    {
      id: 2,
      title: 'कमजोर विषय पर विशेष ध्यान दें',
      desc: 'अपनी पिछली गलतियों वाले विषय को मजबूत बनाने हेतु अभ्यास करें।',
      completed: false,
      xp: 25,
      icon: Target,
      actionLabel: 'फोकस क्विज़',
      actionUrl: '/quiz?subject=Math',
    },
    {
      id: 3,
      title: 'स्मार्ट पुनरावृत्ति: पिछली गलतियों की समीक्षा',
      desc: 'स्पैस्ड रिपीटीशन कतार में मौजूद विषयों की समीक्षा करें।',
      completed: false,
      xp: 15,
      icon: RotateCcw,
      actionLabel: 'रिवीजन कतार',
      actionUrl: '/student/revision',
    },
    {
      id: 4,
      title: 'AI ट्यूटर से 1 नया सवाल पूछें',
      desc: 'संदेह निवारण AI से अपनी पाठ्यपुस्तक का कोई कठिन सवाल पूछें।',
      completed: false,
      xp: 15,
      icon: HelpCircle,
      actionLabel: 'सवाल पूछें',
      actionUrl: '/doubt',
    },
  ];

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(studyPlanStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return defaultTasks.map((def) => {
          const match = parsed.find((p) => p.id === def.id);
          return match ? { ...def, completed: match.completed } : def;
        });
      }
    } catch (e) {}
    return defaultTasks;
  });

  const toggleTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      try {
        localStorage.setItem(studyPlanStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);
  const earnedXp = tasks.filter((t) => t.completed).reduce((acc, curr) => acc + curr.xp, 0);
  const totalPotentialXp = tasks.reduce((acc, curr) => acc + curr.xp, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student" className="hover:text-orange-600 transition-colors">
          डैशबोर्ड
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">दैनिक अध्ययन योजना</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-orange-50 backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            आज की अध्ययन योजना (Daily Study Plan)
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            कक्षा {user?.class_level || 8} NCERT पाठ्यक्रम के अनुसार तैयार दैनिक अध्ययन लक्ष्य। प्रत्येक कार्य पूरा करने पर अतिरिक्त XP अंक अर्जित करें!
          </p>
        </div>

        {/* Streak & XP Counter Card */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-amber-200">+{earnedXp}</div>
            <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
              अर्जित XP
            </div>
          </div>
          <div className="w-px h-10 bg-white/25"></div>
          <div className="text-center px-2">
            <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-300" />
              <span>{streak}</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
              दैनिक लड़ी
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              आज की प्रगति (Today's Completion)
            </h2>
            <p className="text-xs text-slate-500">
              {completedCount} में से {tasks.length} कार्य पूर्ण • कुल संभावित {totalPotentialXp} XP
            </p>
          </div>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full border ${
              progressPct === 100
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {progressPct}% पूर्ण
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 px-1">
          आज के अनुशंसित कार्य (Recommended Tasks)
        </h2>

        <div className="grid grid-cols-1 gap-3.5">
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                  task.completed
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                {/* Checkbox & Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 bg-white hover:border-orange-500'
                    }`}
                    title={task.completed ? 'पूर्ण चिह्नित करें' : 'अपूर्ण चिह्नित करें'}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-3" />}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-sm ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        +{task.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{task.desc}</p>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => navigate(task.actionUrl)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 btn-tactile ${
                      task.completed
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                    }`}
                  >
                    <span>{task.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Study Tips Card */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>स्मार्ट अध्ययन युक्तियाँ (Smart Study Habits)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="p-3.5 rounded-2xl bg-white/70 border border-amber-200/60 space-y-1">
            <h4 className="font-bold text-slate-900">1. 20 मिनट अभ्यास, 5 मिनट विश्राम</h4>
            <p className="text-slate-600">लगातार पढ़ाई के बजाय छोटे अंतरालों में अभ्यास करने से एकाग्रता और स्मृति बढ़ती है।</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/70 border border-amber-200/60 space-y-1">
            <h4 className="font-bold text-slate-900">2. AI स्पष्टीकरण अवश्य पढ़ें</h4>
            <p className="text-slate-600">गलत उत्तर होने पर देसी उदाहरणों वाले AI स्पष्टीकरण को पढ़ें ताकि अवधारणा स्पष्ट हो सके।</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/70 border border-amber-200/60 space-y-1">
            <h4 className="font-bold text-slate-900">3. दैनिक लड़ी (Streak) बनाएं</h4>
            <p className="text-slate-600">प्रतिदिन सिर्फ 10 मिनट का नियमित अभ्यास बोर्ड परीक्षा में 25% तक बेहतर परिणाम देता है।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
