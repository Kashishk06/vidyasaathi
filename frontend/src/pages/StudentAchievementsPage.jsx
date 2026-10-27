import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Award,
  Trophy,
  Flame,
  Star,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';

export const StudentAchievementsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const outletCtx = useOutletContext() || {};
  const { progress, studentTier, totalXp = 0, streak = 0 } = outletCtx;

  const totalAttempts = progress?.total_attempts || 0;
  const totalCorrect = progress?.total_correct || 0;
  const overallAccuracy = progress?.overall_accuracy || 0;

  // Badges inventory with status
  const badgesList = [
    {
      id: 'b1',
      title: 'जिज्ञासु (Seeker)',
      desc: 'पहला अभ्यास प्रश्न हल करके सीखने की यात्रा शुरू की।',
      icon: '🌱',
      unlocked: totalAttempts >= 1,
      date: 'अक्टूबर 2026',
      rarity: 'सामान्य (Common)',
    },
    {
      id: 'b2',
      title: 'अभ्यासी (Explorer)',
      desc: '15 से अधिक अभ्यास प्रश्न सफलतापूर्वक हल किए।',
      icon: '⚡',
      unlocked: totalAttempts >= 15,
      date: 'अक्टूबर 2026',
      rarity: 'विशेष (Rare)',
    },
    {
      id: 'b3',
      title: 'निरंतरता महारथी (Streak Master)',
      desc: 'लगातार 7 दिन प्रतिदिन अभ्यास करके लड़ी कायम रखी।',
      icon: '🔥',
      unlocked: streak >= 7,
      date: 'सक्रिय लड़ी',
      rarity: 'दुर्लभ (Epic)',
    },
    {
      id: 'b4',
      title: 'अचूक निशानेबाज (Accuracy Ace)',
      desc: 'अभ्यास में 85% या उससे अधिक समग्र सटीकता दर्ज की।',
      icon: '🎯',
      unlocked: overallAccuracy >= 85,
      date: 'अक्टूबर 2026',
      rarity: 'दुर्लभ (Epic)',
    },
    {
      id: 'b5',
      title: 'महारथी (Grandmaster)',
      desc: '500 से अधिक कुल XP अंक और सभी विषयों में महारत हासिल की।',
      icon: '🏆',
      unlocked: totalXp >= 500,
      date: totalXp >= 500 ? 'अक्टूबर 2026' : 'लॉक्ड (500 XP आवश्यक)',
      rarity: 'अति-दुर्लभ (Legendary)',
    },
  ];

  const unlockedCount = badgesList.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student" className="hover:text-orange-600 transition-colors">
          डैशबोर्ड
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">उपलब्धियां व बैज (Achievements)</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-orange-50 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>विद्यार्थी स्तर एवं बैज प्रणाली</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            उपलब्धियां व बैज गैलरी (Achievements)
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            प्रत्येक सही उत्तर, दैनिक अध्ययन लक्ष्य और लगातार अभ्यास से XP अंक अर्जित करें और विशिष्ट बैज अनलॉक करें।
          </p>
        </div>

        {/* Level & XP Overview */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 shrink-0 self-stretch md:self-auto text-left space-y-1">
          <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
            वर्तमान स्तर (Current Tier)
          </div>
          <div className="text-xl font-black text-white flex items-center gap-2">
            <span>{studentTier?.badgeIcon || '⚡'}</span>
            <span>स्तर {studentTier?.level}: {studentTier?.title}</span>
          </div>
          <div className="text-xs text-amber-200 font-semibold">
            {totalXp} XP कुल अंक अर्जित
          </div>
        </div>
      </div>

      {/* Level Progression Progress Bar Card */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">
              अगले स्तर की प्रगति (Next Level Progress)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {totalXp} / {studentTier?.nextXp || 600} XP
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (totalXp / (studentTier?.nextXp || 600)) * 100
              )}%`,
            }}
          ></div>
        </div>

        <p className="text-xs text-slate-500">
          अगले स्तर पर पहुँचने के लिए केवल{' '}
          <strong className="text-orange-700">
            {Math.max(0, (studentTier?.nextXp || 600) - totalXp)} XP
          </strong>{' '}
          अंक शेष हैं।
        </p>
      </div>

      {/* Badges Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span>अर्जित बैज (Badges Showcase)</span>
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            {unlockedCount} / {badgesList.length} अनलॉक किए गए
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                badge.unlocked
                  ? 'bg-white border-amber-200 shadow-sm hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center border shadow-xs ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-orange-100 border-amber-300'
                        : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      badge.unlocked
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {badge.unlocked ? 'अनलॉक ✓' : 'लॉक्ड 🔒'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{badge.rarity}</span>
                <span className={badge.unlocked ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                  {badge.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Point Rules Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-600" />
          <span>XP अंक कैसे अर्जित करें? (XP Rules)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">सही उत्तर (Correct)</div>
            <div className="text-amber-700 font-extrabold text-sm">+10 XP</div>
            <p className="text-[11px] text-slate-500">प्रत्येक सही हल किए गए प्रश्न पर</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">अभ्यास प्रयास (Attempt)</div>
            <div className="text-amber-700 font-extrabold text-sm">+5 XP</div>
            <p className="text-[11px] text-slate-500">प्रयास करने की लगन पर</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">दैनिक अध्ययन लक्ष्य</div>
            <div className="text-amber-700 font-extrabold text-sm">+15 XP</div>
            <p className="text-[11px] text-slate-500">दैनिक योजना कार्य पूर्ण करने पर</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">दैनिक लड़ी (Streak)</div>
            <div className="text-amber-700 font-extrabold text-sm">+20 XP</div>
            <p className="text-[11px] text-slate-500">लगातार 7 दिन अभ्यास पर बोनस</p>
          </div>
        </div>
      </div>
    </div>
  );
};
