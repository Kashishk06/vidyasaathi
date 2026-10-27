import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  Users,
  PlusCircle,
  School,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Flag,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const StudentClassroomPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const outletCtx = useOutletContext() || {};
  const { setIsReportModalOpen } = outletCtx;

  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setJoining(true);
    setJoinMsg('');
    setIsError(false);

    try {
      const res = await api.post('/classes/join', { join_code: joinCode.trim() });
      setJoinMsg(res.data.message || 'कक्षा में सफलतापूर्वक जुड़ गए!');
      setJoinCode('');
    } catch (err) {
      setIsError(true);
      setJoinMsg(
        err.response?.data?.detail ||
          'अमान्य कक्षा कोड। कृपया अपने स्कूल के शिक्षक से सही कोड प्राप्त करें।'
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student" className="hover:text-orange-600 transition-colors">
          डैशबोर्ड
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">मेरी कक्षा व शिक्षक</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-orange-50 backdrop-blur-sm">
            <School className="w-3.5 h-3.5" />
            <span>विद्यालय एवं शिक्षक समन्वय प्रणाली</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            मेरी कक्षा एवं शिक्षक (Classroom Connection)
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            अपने स्कूल के शिक्षक से प्राप्त 6-अक्षरों का कोड दर्ज करके अपनी कक्षा से जुड़ें। इससे शिक्षक आपके अभ्यास, कमजोर विषयों और प्रगति की निगरानी कर सकेंगे।
          </p>
        </div>

        {/* Active Badge */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 shrink-0 self-stretch md:self-auto text-left space-y-1">
          <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
            नामांकन स्थिति (Status)
          </div>
          <div className="text-lg font-black text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>सक्रिय नामांकित</span>
          </div>
          <div className="text-xs text-amber-200 font-semibold">
            कक्षा 8 • सत्र 2026-27
          </div>
        </div>
      </div>

      {/* Join Classroom Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              नई कक्षा में शामिल हों (Join New Classroom)
            </h2>
            <p className="text-xs text-slate-500">
              शिक्षक द्वारा प्रदान किया गया कोड (उदा. <strong>VSA801</strong>) यहाँ दर्ज करें:
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="कक्षा कोड (जैसे VSA801)"
            maxLength={10}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={joining || !joinCode.trim()}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-orange-500/20 btn-tactile transition-all shrink-0"
          >
            {joining ? 'जांच रहे हैं...' : 'कक्षा से जुड़ें (Join)'}
          </button>
        </form>

        {joinMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border animate-fade-in flex items-center gap-2 ${
              isError
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{joinMsg}</span>
          </div>
        )}
      </div>

      {/* Enrolled Classroom Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              सक्रिय विद्यालय (Active School)
            </span>
            <span className="text-xs font-semibold text-slate-500">कोड: VSA801</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900">
              ज्ञान निकेतन उच्च प्राथमिक विद्यालय
            </h3>
            <p className="text-xs text-slate-500">
              कक्षा 8-A (सत्र 2026-27) • हिंदी माध्यम NCERT
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-500">कक्षा प्रभारी:</span>
              <span className="text-slate-900 font-bold">श्री राकेश शर्मा</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-500">विषय:</span>
              <span>गणित एवं सामान्य विज्ञान</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-500">सिंक्रनाइज़ेशन स्थिति:</span>
              <span className="text-emerald-700 font-bold">लाइव कनेक्टेड ✓</span>
            </div>
          </div>
        </div>

        {/* Benefits & Guidance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              कक्षा जुड़ाव के लाभ (Classroom Benefits)
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>शिक्षक आपके दैनिक अभ्यास और सटीकता का विश्लेषण देखते हैं</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>कमजोर अध्यायों पर कक्षा में विशेष उपचारात्मक शिक्षण मिलता है</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>कक्षा के सहपाठियों के साथ स्वस्थ प्रतिस्पर्धा और प्रेरणा</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsReportModalOpen && setIsReportModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Flag className="w-3.5 h-3.5 text-rose-600" />
              <span>कक्षा या प्रश्न में समस्या दर्ज करें (Report Issue)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
