import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Globe2,
  Building2,
  Users,
  TrendingUp,
  Download,
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  PieChart as PieChartIcon,
  ChevronRight,
  Calendar,
  Layers,
  FileSpreadsheet,
  HeartHandshake,
  Zap,
  ShieldCheck,
  Search,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { SampleDashboardHeader } from '../components/SampleDashboardHeader';

export const NgoDashboard = () => {
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [actionNotice, setActionNotice] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  // Mock Block-Level Summary
  const blockData = [
    {
      id: 'baramati',
      name: 'बारामती ब्लॉक (Baramati)',
      schools: 18,
      students: 4680,
      baselineScore: 46,
      currentScore: 78,
      uplift: '+32%',
      gapStatus: 'कम (Low)',
      statusColor: 'emerald'
    },
    {
      id: 'haveli',
      name: 'हवेली ब्लॉक (Haveli)',
      schools: 16,
      students: 4210,
      baselineScore: 50,
      currentScore: 76,
      uplift: '+26%',
      gapStatus: 'मध्यम (Moderate)',
      statusColor: 'amber'
    },
    {
      id: 'shirur',
      name: 'शिरूर ब्लॉक (Shirur)',
      schools: 14,
      students: 3560,
      baselineScore: 44,
      currentScore: 71,
      uplift: '+27%',
      gapStatus: 'ध्यान दें (Attention)',
      statusColor: 'rose'
    },
  ];

  // Mock Learning Gap Heatmap Matrix (Blocks vs Core Curriculum Domains)
  const heatmapData = [
    {
      domain: 'फसल उत्पादन एवं कृषि विज्ञान (Crop Science)',
      baramati: { score: 84, level: 'high' },
      haveli: { score: 82, level: 'high' },
      shirur: { score: 79, level: 'high' },
    },
    {
      domain: 'परिमेय संख्याएँ एवं बीजगणित (Rational Numbers & Algebra)',
      baramati: { score: 76, level: 'medium' },
      haveli: { score: 71, level: 'medium' },
      shirur: { score: 62, level: 'medium' },
    },
    {
      domain: 'बल, दाब एवं घर्षण (Force, Pressure & Friction)',
      baramati: { score: 74, level: 'medium' },
      haveli: { score: 68, level: 'medium' },
      shirur: { score: 58, level: 'low' }, // Learning Gap Area!
    },
    {
      domain: 'प्रकाश का परावर्तन एवं अपवर्तन (Optics & Light)',
      baramati: { score: 68, level: 'medium' },
      haveli: { score: 61, level: 'medium' },
      shirur: { score: 54, level: 'low' }, // Learning Gap Area!
    },
    {
      domain: 'कोशिका संरचना एवं कार्य (Cell Biology)',
      baramati: { score: 81, level: 'high' },
      haveli: { score: 77, level: 'high' },
      shirur: { score: 73, level: 'medium' },
    },
  ];

  // Mock Monthly Progress Uplift Over Time
  const monthlyTrend = [
    { month: 'जून (Baseline)', baseline: 47, current: 47 },
    { month: 'जुलाई', baseline: 47, current: 54 },
    { month: 'अगस्त', baseline: 47, current: 62 },
    { month: 'सितम्बर', baseline: 47, current: 69 },
    { month: 'अक्टूबर (Latest)', baseline: 47, current: 76 },
  ];

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const getHeatmapBadge = (item) => {
    if (item.level === 'high') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200">
          {item.score}% • सशक्त
        </span>
      );
    }
    if (item.level === 'medium') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-xs border border-amber-200">
          {item.score}% • मध्यम
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-black text-xs border border-rose-300 animate-pulse">
        {item.score}% • गैप क्षेत्र ⚠️
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sample Header & Switcher */}
      <SampleDashboardHeader
        currentRole="ngo"
        title="NGO / Government Education Officer (जिला / ब्लॉक शिक्षा अधिकारी) Dashboard"
        subtitle="Monitor multi-school educational impact, district-wide learning-gap heatmaps, and SDG 4 equity metrics."
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
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">जिला संकुल पोर्टल</div>
            <div className="text-[10px] text-slate-500">पुणे ग्रामीण • 48 विद्यालय</div>
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

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className={`lg:col-span-1 space-y-4 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Cluster Identity Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                DISTRICT CLUSTER (DEMO)
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> सक्रिय
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  पुणे ग्रामीण जिला संकुल
                </h3>
                <p className="text-[11px] text-slate-500">3 ब्लॉक • 48 स्कूल • 12,450 विद्यार्थी</p>
              </div>
            </div>

            {/* Block Filter in Sidebar */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">ब्लॉक चयन (Filter):</label>
              <select
                value={selectedBlock}
                onChange={(e) => {
                  setSelectedBlock(e.target.value);
                  handleAction(`फिल्टर लागू: ${e.target.value === 'all' ? 'सभी ब्लॉक' : e.target.value} (Demo Filter applied)`);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">सभी ब्लॉक (All 3 Blocks)</option>
                <option value="baramati">बारामती ब्लॉक (Baramati)</option>
                <option value="haveli">हवेली ब्लॉक (Haveli)</option>
                <option value="shirur">शिरूर ब्लॉक (Shirur)</option>
              </select>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
              डैशबोर्ड नेविगेशन
            </span>
            {[
              { id: 'overview', label: 'व्यापक प्रभाव (Overview)', icon: LayoutDashboard, action: () => { document.getElementById('ngo-overview-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('overview'); } },
              { id: 'heatmap', label: 'अधिगम अंतर हीटमैप (Heatmap)', icon: BookOpen, action: () => { document.getElementById('heatmap-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('heatmap'); } },
              { id: 'uplift', label: 'सुधार वक्र विश्लेषण (Uplift)', icon: TrendingUp, action: () => { document.getElementById('uplift-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('uplift'); } },
              { id: 'blocks', label: 'ब्लॉक स्तरीय विवरण (Blocks)', icon: Building2, action: () => { document.getElementById('block-breakdown-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('blocks'); } },
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

          {/* Quick Impact Actions */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              त्वरित कार्य (Quick Actions)
            </span>
            <button
              onClick={() => handleAction('जिला प्रभाव दस्तावेज (District Impact Dossier PDF) डाउनलोड हो रहा है (Demo PDF)')}
              className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 btn-tactile"
            >
              <Download className="w-3.5 h-3.5" />
              <span>प्रभाव रिपोर्ट डाउनलोड (PDF)</span>
            </button>
            <button
              onClick={() => handleAction('ब्लॉक स्तर CSV डेटा संकलित कर डाउनलोड किया गया (Block CSV - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>48 स्कूलों का CSV डाउनलोड</span>
            </button>
            <button
              onClick={() => handleAction('शिरूर ब्लॉक में विशेष शिक्षण सहायता दल भेजा गया (Remedial Action Dispatched - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>हस्तक्षेप कार्य योजना बनाएं</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Geographical & Demo Notice Bar */}
          <div id="ngo-overview-section" className="p-4 rounded-3xl bg-white border border-orange-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900">
                पुणे ग्रामीण जिला संकुल (Pune Rural District Cluster)
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-500">
              3 ब्लॉक • 48 ग्रामीण विद्यालय • 12,450 विद्यार्थी पंजीकृत
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>ब्लॉक:</span>
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                handleAction(`फिल्टर लागू: ${e.target.value === 'all' ? 'सभी ब्लॉक' : e.target.value} (Demo Filter applied)`);
              }}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">सभी ब्लॉक (All 3 Blocks)</option>
              <option value="baramati">बारामती ब्लॉक (Baramati)</option>
              <option value="haveli">हवेली ब्लॉक (Haveli)</option>
              <option value="shirur">शिरूर ब्लॉक (Shirur)</option>
            </select>
          </div>

          <button
            onClick={() => handleAction('जिला प्रभाव दस्तावेज (District Impact Dossier PDF) डाउनलोड हो रहा है (Demo PDF)')}
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 btn-tactile"
          >
            <Download className="w-3.5 h-3.5" />
            <span>प्रभाव रिपोर्ट (PDF)</span>
          </button>
        </div>
      </div>

      {/* 4 Macro KPI Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>आच्छादित विद्यालय</span>
            <Building2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">48 <span className="text-xs font-normal text-slate-500">स्कूल</span></div>
          <div className="text-[11px] font-semibold text-slate-600">
            3 ग्रामीण ब्लॉकों में सक्रिय
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>कुल छात्र पहुंच</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">12,450</div>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <HeartHandshake className="w-3 h-3" /> 49% छात्राएँ (Gender Parity)
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>औसत अधिगम उत्थान (Uplift)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">+28.4%</div>
          <div className="text-[11px] font-semibold text-slate-600">
            47.2% प्रारंभिक ➔ 75.6% वर्तमान
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>कम इंटरनेट (2G) अनुकूलन</span>
            <Zap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">73.8%</div>
          <div className="text-[11px] font-semibold text-sky-700">
            ऑफलाइन PWA कैश में अध्ययन
          </div>
        </div>
      </div>

      {/* Primary Section: Learning Gap Heatmap */}
      <div id="heatmap-section" className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                अधिगम अंतर हीटमैप (District Learning-Gap Heatmap Matrix)
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                SDG 4 DIAGNOSTIC
              </span>
            </div>
            <p className="text-xs text-slate-500">
              प्रत्येक ब्लॉक में पाठ्यक्रम विषयों की औसत महारत दर। लाल रंग उन क्षेत्रों को दर्शाता है जहाँ विशेष शिक्षण हस्तक्षेप की आवश्यकता है।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold self-start sm:self-auto">
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> &gt;75% मजबूत
            </span>
            <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> 60-75% मध्यम
            </span>
            <span className="flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> &lt;60% गैप क्षेत्र
            </span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                <th className="py-3 px-4 rounded-l-xl">पाठ्यक्रम विषय / अध्याय (Curriculum Domain)</th>
                <th className="py-3 px-4 text-center">बारामती ब्लॉक (Baramati)</th>
                <th className="py-3 px-4 text-center">हवेली ब्लॉक (Haveli)</th>
                <th className="py-3 px-4 text-center rounded-r-xl">शिरूर ब्लॉक (Shirur)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heatmapData.map((row, idx) => (
                <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{row.domain}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">{getHeatmapBadge(row.baramati)}</td>
                  <td className="py-3.5 px-4 text-center">{getHeatmapBadge(row.haveli)}</td>
                  <td className="py-3.5 px-4 text-center">{getHeatmapBadge(row.shirur)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Callout for Red Zones */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">शिरूर ब्लॉक प्राथमिकता कार्य:</span> 'बल व दाब' (58%) और 'प्रकाश परावर्तन' (54%) में गंभीर अधिगम अंतर।
              शिक्षकों को VidyaSaathi AI लेसन प्लान सहायक एवं व्यावहारिक विज्ञान किट का प्रयोग करने की अनुशंसा।
            </div>
          </div>
          <button
            onClick={() => handleAction('शिरूर ब्लॉक में विशेष शिक्षण सहायता दल भेजा गया (Remedial Action Dispatched - Demo)')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 transition-colors btn-tactile shadow-xs"
          >
            हस्तक्षेप कार्य योजना बनाएं
          </button>
        </div>
      </div>

      {/* Progress Over Time & Block Level Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Uplift Area Chart */}
        <div id="uplift-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                प्रारंभिक बनाम वर्तमान प्रगति (Diagnostic vs Current Uplift)
              </h3>
              <p className="text-[11px] text-slate-500">जून 2026 से अक्टूबर 2026 तक समग्र सुधार वक्र</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              DEMO DATA
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentUplift" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[30, 90]} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#fed7aa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="current" name="वर्तमान औसत महारत (Current %)" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#currentUplift)" />
                <Line type="monotone" dataKey="baseline" name="आधारभूत स्तर (Baseline %)" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Block Breakdown Cards */}
        <div id="block-breakdown-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                ब्लॉक स्तरीय विस्तृत विवरण (Block Breakdown)
              </h3>
              <p className="text-[11px] text-slate-500">प्रत्येक संकुल का छात्र अनुपात एवं प्रदर्शन</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              3 BLOCKS
            </span>
          </div>

          <div className="space-y-3">
            {blockData.map((b) => (
              <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs sm:text-sm">{b.name}</span>
                  <span className="text-emerald-700 font-extrabold text-xs bg-emerald-100 px-2 py-0.5 rounded-md">
                    सुधार: {b.uplift}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="font-black text-slate-800">{b.schools}</div>
                    <div className="text-[10px] text-slate-500">स्कूल</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="font-black text-slate-800">{b.students}</div>
                    <div className="text-[10px] text-slate-500">विद्यार्थी</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <div className="font-black text-orange-600">{b.currentScore}%</div>
                    <div className="text-[10px] text-slate-500">औसत समझ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleAction('ब्लॉक स्तर CSV डेटा संकलित कर डाउनलोड किया गया (Block CSV - Demo)')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>सभी 48 स्कूलों का विस्तृत डेटा डाउनलोड (CSV)</span>
          </button>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
};
