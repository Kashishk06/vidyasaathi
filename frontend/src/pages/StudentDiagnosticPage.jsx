import React from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Target,
  Calculator,
  Atom,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Award
} from 'lucide-react';

export const StudentDiagnosticPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const { progress } = outletCtx;

  const totalAttempts = progress?.total_attempts || 0;
  const overallAccuracy = progress?.overall_accuracy || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/student" className="hover:text-orange-600 transition-colors">
          डैशबोर्ड
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">स्तर परीक्षा (Diagnostic Quiz)</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-orange-50 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>आधारभूत ज्ञान मूल्यांकन • NCERT कक्षा {user?.class_level || 8}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            प्रारंभिक समझ स्तर परीक्षा (Diagnostic Assessment)
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            केवल 8 प्रश्नों के छोटे नैदानिक परीक्षण से अपनी प्रारंभिक समझ का स्तर पहचानें। AI आपके मजबूत और कमजोर विषयों को मैप करके आपका व्यक्तिगत अभ्यास पथ तैयार करेगा।
          </p>
        </div>

        {/* Diagnostic Meta Status Card */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 shrink-0 self-stretch md:self-auto text-left space-y-1">
          <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">
            परीक्षण प्रारूप (Format)
          </div>
          <div className="text-lg font-black text-white">8 बहुविकल्पीय प्रश्न</div>
          <div className="text-xs text-amber-200 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>लगभग 10 मिनट प्रति विषय</span>
          </div>
        </div>
      </div>

      {/* Subject Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math Diagnostic Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
                <Calculator className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                गणित (Mathematics)
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                गणित स्तर परीक्षा (Math Diagnostic)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                8 चयनित प्रश्नों के माध्यम से परिमेय संख्याएँ, रैखिक समीकरण, ज्यामिति और घातांक में अपनी दक्षता का परीक्षण करें।
              </p>
            </div>

            {/* Test Features */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NCERT कक्षा 8 के 4 मुख्य अध्यायों का कवरेज</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>तत्काल कठिनाई स्तर (Easy, Medium, Hard) विश्लेषण</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>कमजोर सूत्रों और अवधारणाओं की पहचान</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/quiz?mode=diagnostic&subject=Math')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 btn-tactile flex items-center justify-center gap-2"
          >
            <span>गणित डायग्नोस्टिक शुरू करें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Science Diagnostic Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                <Atom className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                विज्ञान (Science)
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                विज्ञान स्तर परीक्षा (Science Diagnostic)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                फसल उत्पादन एवं प्रबंध, प्रकाश का परावर्तन और बल व दाब पर आधारित 8 प्रश्नों से वैज्ञानिक समझ का मूल्यांकन करें।
              </p>
            </div>

            {/* Test Features */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>व्यावहारिक और प्रयोग-आधारित प्रश्नों का समावेशन</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ग्रामीण एवं कृषि-आधारित देसी संदर्भ व उदाहरण</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>वैज्ञानिक शब्दावली और सिद्धांतों की स्पष्टता जांच</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/quiz?mode=diagnostic&subject=Science')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 btn-tactile flex items-center justify-center gap-2"
          >
            <span>विज्ञान डायग्नोस्टिक शुरू करें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guidelines & Advice */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>स्तर परीक्षा के नियम एवं निर्देश (Instructions)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800">1. स्वयं हल करें</h4>
            <p className="text-slate-500">किसी अन्य की सहायता न लें ताकि AI आपके वास्तविक ज्ञान के स्तर को पहचान सके।</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800">2. कोई नकारात्मक अंकन नहीं</h4>
            <p className="text-slate-500">सभी 8 प्रश्नों के उत्तर दें। यदि उत्तर नहीं आता तो भी सबसे उचित विकल्प का चयन करें।</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800">3. तत्काल अनुकूलित योजना</h4>
            <p className="text-slate-500">क्विज़ समाप्त होते ही आपको कमजोर और मजबूत विषयों का व्यापक विश्लेषण प्राप्त होगा।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
