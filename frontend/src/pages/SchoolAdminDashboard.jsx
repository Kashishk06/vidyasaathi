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
  Legend
} from 'recharts';
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Bell,
  TrendingUp,
  PlusCircle,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Send,
  UploadCloud,
  Check,
  Activity,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { SampleDashboardHeader } from '../components/SampleDashboardHeader';

export const SchoolAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'सत्र 1 प्रारंभिक स्तर पहचान (Diagnostic Assessment)',
      date: '28 अक्टूबर 2026',
      target: 'कक्षा 6 से 10 के सभी छात्र',
      priority: 'high'
    },
    {
      id: 2,
      title: 'गणित व विज्ञान के कमजोर विषयों की अतिरिक्त कक्षाएं',
      date: '25 अक्टूबर 2026',
      target: 'कक्षा 8 व 9',
      priority: 'normal'
    },
    {
      id: 3,
      title: 'स्मार्टफोन / टैबलेट लैब का समय सारिणी पुनरीक्षण',
      date: '22 अक्टूबर 2026',
      target: 'सभी शिक्षक',
      priority: 'normal'
    }
  ]);
  const [actionNotice, setActionNotice] = useState('');

  // Mock Performance By Class
  const classPerformance = [
    { class: 'कक्षा 6', science: 82, math: 75, avg: 78 },
    { class: 'कक्षा 7', science: 76, math: 68, avg: 72 },
    { class: 'कक्षा 8', science: 84, math: 71, avg: 77 },
    { class: 'कक्षा 9', science: 71, math: 64, avg: 67 },
    { class: 'कक्षा 10', science: 79, math: 70, avg: 74 },
  ];

  // Mock Teachers Directory
  const teachers = [
    {
      id: 1,
      name: 'सुनीता शर्मा (Sunita Sharma)',
      subject: 'गणित व विज्ञान',
      classes: 'कक्षा 8-A, 8-B',
      students: 78,
      questionsGenerated: 24,
      lastActive: '10 मिनट पहले',
      status: 'active'
    },
    {
      id: 2,
      name: 'रमेश कुलकर्णी (Ramesh Kulkarni)',
      subject: 'भौतिक व रसायन',
      classes: 'कक्षा 9-A, 10-A',
      students: 86,
      questionsGenerated: 18,
      lastActive: '2 घंटे पहले',
      status: 'active'
    },
    {
      id: 3,
      name: 'अंजली रॉय (Anjali Roy)',
      subject: 'जीव विज्ञान',
      classes: 'कक्षा 7, 8',
      students: 72,
      questionsGenerated: 32,
      lastActive: 'आज सुबह 9:15',
      status: 'active'
    },
    {
      id: 4,
      name: 'प्रकाश यादव (Prakash Yadav)',
      subject: 'गणित',
      classes: 'कक्षा 6-A, 6-B',
      students: 64,
      questionsGenerated: 12,
      lastActive: 'कल',
      status: 'idle'
    }
  ];

  // Mock Syllabus Coverage
  const syllabusData = [
    { subject: 'कक्षा 8 विज्ञान (NCERT)', totalChapters: 18, completed: 12, progress: 67 },
    { subject: 'कक्षा 8 गणित (NCERT)', totalChapters: 16, completed: 9, progress: 56 },
    { subject: 'कक्षा 9 विज्ञान (NCERT)', totalChapters: 15, completed: 10, progress: 66 },
    { subject: 'कक्षा 10 गणित (NCERT)', totalChapters: 14, completed: 11, progress: 78 },
  ];

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    const newAnn = {
      id: Date.now(),
      title: announcementText.trim(),
      date: 'अभी-अभी (Just now)',
      target: 'विद्यालय के सभी सदस्य',
      priority: 'high'
    };
    setAnnouncements([newAnn, ...announcements]);
    setAnnouncementText('');
    handleAction('नई विद्यालय सूचना सफलतापूर्वक प्रसारित की गई (Announcement published - Demo)');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sample Header & Switcher */}
      <SampleDashboardHeader
        currentRole="school-admin"
        title="School Admin / Principal (प्रधानाचार्य) Dashboard"
        subtitle="Manage school teachers, class syllabus progress, school-wide student analytics, and administrative announcements."
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
            <Building2 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">प्रधानाचार्य पोर्टल</div>
            <div className="text-[10px] text-slate-500">ज्ञान निकेतन उच्च प्राथमिक विद्यालय</div>
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
          {/* School Identity Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                SCHOOL PROFILE (DEMO)
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> सक्रिय
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  ज्ञान निकेतन उच्च प्राथमिक विद्यालय
                </h3>
                <p className="text-[11px] text-slate-500">UDISE: 27240100234 • हवेली ब्लॉक, पुणे</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">प्रधानाचार्य:</span>
                <span className="font-semibold text-slate-800">डॉ. अरविंद कुलकर्णी</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">मान्यता:</span>
                <span className="font-semibold text-slate-800">NCERT / राज्य बोर्ड</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">सक्रिय सत्र:</span>
                <span className="font-semibold text-slate-800">2026-27</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            {[
              { id: 'overview', label: 'विद्यालय अवलोकन (Overview)', icon: Layers },
              { id: 'teachers', label: 'शिक्षक दल (Teachers Directory)', icon: Users },
              { id: 'classes', label: 'कक्षा एवं अनुभाग (Classrooms)', icon: GraduationCap },
              { id: 'analytics', label: 'विद्यालय स्तर विश्लेषण (Analytics)', icon: TrendingUp },
              { id: 'announcements', label: 'सूचना पट्ट (Announcements)', icon: Bell },
              { id: 'syllabus', label: 'पाठ्यक्रम प्रबंधन (Syllabus)', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm space-y-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              त्वरित कार्य (Admin Actions)
            </span>
            <button
              onClick={() => handleAction('नया शिक्षक जोड़ने का फॉर्म खोला गया (Add Teacher Modal - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>नया शिक्षक जोड़ें (Add Teacher)</span>
            </button>
            <button
              onClick={() => handleAction('UDISE विद्यालय रिपोर्ट CSV डाउनलोड की गई (UDISE Report CSV - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>UDISE रिपोर्ट डाउनलोड (CSV)</span>
            </button>
            <button
              onClick={() => handleAction('नई सूचना प्रसारित करने का फॉर्म खोला गया (Post Announcement - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <span>नई सूचना जारी करें (Post Announcement)</span>
            </button>
            <button
              onClick={() => handleAction('NCERT पाठ्यक्रम फाइल अपलोड विंडो केवल डेमो है (Upload Syllabus - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span>नया पाठ्यक्रम अपलोड (Upload)</span>
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-3 space-y-6">
          {/* Welcome & 4 School Overview Stats */}
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    प्रधानाचार्य नियंत्रण कक्ष (Admin Overview)
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    DEMO
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  ज्ञान निकेतन विद्यालय: 14 शिक्षक, 420 पंजीकृत ग्रामीण विद्यार्थी, 8 कक्षाएँ।
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleAction('सत्र 2026-27 का समग्र विद्यालय विश्लेषण रिफ्रेश हुआ (Refreshed)')}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-orange-600" />
                  <span>लाइव स्थिति रीफ्रेश</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">कुल पंजीकृत छात्र</span>
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">420</div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  92% सक्रिय विद्यार्थी
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">सक्रिय शिक्षक दल</span>
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">14 <span className="text-xs font-normal text-slate-500">शिक्षक</span></div>
                <div className="text-[11px] font-semibold text-slate-600">
                  8 अनुभागों में कार्यरत
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">विद्यालय औसत महारत</span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">74.2%</div>
                <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +6.4% पिछले माह से
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold">AI जनित प्रश्न समीक्षा</span>
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">186 <span className="text-xs font-normal text-slate-500">प्रश्न</span></div>
                <div className="text-[11px] font-semibold text-slate-600">
                  शिक्षकों द्वारा स्वीकृत
                </div>
              </div>
            </div>
          </div>

          {/* Section: School-Wide Performance Chart */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  कक्षा-वार प्रदर्शन और विषय तुलना (Class-wise Subject Mastery)
                </h3>
                <p className="text-[11px] text-slate-500">कक्षा 6 से 10 तक विज्ञान व गणित में औसत समझ स्तर (%)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto">
                DEMO METRICS
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformance} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#fed7aa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="science" name="विज्ञान (Science %)" fill="#ea580c" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="math" name="गणित (Maths %)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs flex items-center gap-2 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>विश्लेषण सुझाव:</strong> कक्षा 9 के गणित में औसत महारत 64% है। बीजगणित और ज्यामिति के अध्यायों पर शिक्षक समीक्षा प्रस्तावित है।
              </span>
            </div>
          </div>

          {/* Section: Teachers Activity Tracking & Syllabus Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teachers Activity Table */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    शिक्षक सक्रियता (Teacher Activity)
                  </h3>
                  <p className="text-[11px] text-slate-500">कक्षा निगरानी एवं प्रश्न निर्माण सक्रियता</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  DEMO DATA
                </span>
              </div>

              <div className="space-y-3">
                {teachers.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{t.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.status === 'active' ? 'ऑनलाइन' : 'ऑफ़लाइन'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>{t.subject} • {t.classes}</span>
                      <span className="font-semibold text-orange-700">{t.questionsGenerated} प्रश्न स्वीकृत</span>
                    </div>
                    <div className="text-[10px] text-slate-400">अंतिम सक्रियता: {t.lastActive}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus Coverage Progress */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    पाठ्यक्रम प्रगति (NCERT Syllabus Tracker)
                  </h3>
                  <p className="text-[11px] text-slate-500">कक्षा 6-10 पाठ्यक्रम पूर्णता स्थिति</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  NCERT 2026-27
                </span>
              </div>

              <div className="space-y-3">
                {syllabusData.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{s.subject}</span>
                      <span className="text-orange-600">{s.completed} / {s.totalChapters} अध्याय ({s.progress}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                        style={{ width: `${s.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>लक्ष्य: नवम्बर 2026 तक 75% पूर्णता</span>
                      <span className="text-emerald-700 font-semibold">प्रगति पर</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* School Announcements Panel */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    विद्यालय सूचना पट्ट (School Announcements)
                  </h3>
                  <p className="text-[11px] text-slate-500">सभी शिक्षकों, अभिभावकों एवं छात्रों के लिए सूचनाएं</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                DEMO BROADCAST
              </span>
            </div>

            {/* Post New Announcement Input */}
            <form onSubmit={handlePostAnnouncement} className="flex gap-2">
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="नई विद्यालय सूचना यहाँ लिखें (जैसे: विज्ञान प्रदर्शनी की तैयारी...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 btn-tactile shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>प्रसारित करें</span>
              </button>
            </form>

            {/* List of Announcements */}
            <div className="divide-y divide-slate-100 text-xs">
              {announcements.map((a) => (
                <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      {a.priority === 'high' && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      )}
                      <span>{a.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      लक्षित वर्ग: <span className="font-semibold text-slate-700">{a.target}</span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0">{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
