import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  BookOpen,
  Filter,
  Eye,
  Award,
  ChevronRight,
  ShieldCheck,
  Search,
  Check,
  X,
  FileText,
  RotateCcw,
  History,
  Tag,
  Menu,
  LayoutDashboard
} from 'lucide-react';
import { SampleDashboardHeader } from '../components/SampleDashboardHeader';

export const ContentReviewerDashboard = () => {
  const [activeQueueTab, setActiveQueueTab] = useState('all');
  const [actionNotice, setActionNotice] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('all');

  // Mock Review Queue Items (Simulated Demo Data)
  const [queueItems, setQueueItems] = useState([
    {
      id: 101,
      type: 'ai_generated',
      subject: 'विज्ञान (Science)',
      classLevel: 8,
      chapter: 'अध्याय 1: फसल उत्पादन एवं प्रबंध',
      ncertRef: 'NCERT Class 8 Science, Ch 1, पृष्ठ 8',
      text: 'फलीदार (दाल वाली) फसलों की जड़ों में कौन सा जीवाणु पाया जाता है जो वायुमंडलीय नाइट्रोजन का स्थिरीकरण करता है?',
      options: [
        'राइजोबियम (Rhizobium)',
        'लैक्टोबैसिलस (Lactobacillus)',
        'यीस्ट (Yeast)',
        'अमीबा (Amoeba)'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      ruralAnalogy: 'जैसे चना या मटर की फसल काटने के बाद खेत की मिट्टी अपने आप उपजाऊ हो जाती है, क्योंकि इनकी जड़ों की गांठों में राइजोबियम जीवाणु हवा से नाइट्रोजन लेकर खाद बनाता है।',
      aiModel: 'watsonx.ai (Granite-13b)',
      confidence: '96%',
      status: 'pending',
      createdDate: '15 मिनट पहले'
    },
    {
      id: 102,
      type: 'reported',
      subject: 'गणित (Maths)',
      classLevel: 8,
      chapter: 'अध्याय 1: परिमेय संख्याएँ',
      ncertRef: 'NCERT Class 8 Mathematics, Ch 1, पृष्ठ 14',
      text: 'यदि दो परिमेय संख्याओं का योग -5/8 है और उनमें से एक संख्या 3/4 है, तो दूसरी संख्या क्या होगी?',
      options: [
        '-11/8',
        '-1/8',
        '11/8',
        '-7/8'
      ],
      correctIndex: 0,
      difficulty: 'hard',
      ruralAnalogy: 'जैसे 8 भाइयों में कुल कर्ज 5 हिस्सों का है और एक भाई 6 हिस्से चुका चुका है, तो बाकी हिसाब घटाने पर ज्ञात होगा।',
      reportedReason: 'छात्र द्वारा रिपोर्ट: विकल्प में ऋणात्मक चिह्न (-) का स्पष्टीकरण और चरणबद्ध हल चाहिए।',
      reportedBy: 'आरव पटेल (कक्षा 8)',
      status: 'pending',
      createdDate: '1 घंटा पहले'
    },
    {
      id: 103,
      type: 'ai_generated',
      subject: 'विज्ञान (Science)',
      classLevel: 8,
      chapter: 'अध्याय 11: बल तथा दाब',
      ncertRef: 'NCERT Class 8 Science, Ch 11, पृष्ठ 132',
      text: 'ट्रैक्टर के पिछले पहिए आगे वाले पहियों की तुलना में बहुत चौड़े और बड़े क्यों बनाए जाते हैं?',
      options: [
        'दाब कम करने के लिए ताकि खेत के कीचड़ में न धंसे',
        'ट्रैक्टर की गति तेज करने के लिए',
        'डीजल की खपत कम करने के लिए',
        'पहियों का वजन बढ़ाने के लिए'
      ],
      correctIndex: 0,
      difficulty: 'easy',
      ruralAnalogy: 'क्षेत्रफल अधिक होने से खेत की गीली मिट्टी पर दाब (Pressure) कम लगता है, जिससे भारी ट्रैक्टर भी बिना धंसे आसानी से जुताई कर लेता है।',
      aiModel: 'watsonx.ai (Granite-13b)',
      confidence: '98%',
      status: 'pending',
      createdDate: '3 घंटे पहले'
    }
  ]);

  // Mock Version History Log
  const versionHistory = [
    {
      version: 'v2.1',
      questionId: 'Q-804',
      topic: 'प्रकाश: समतल दर्पण',
      action: 'देसी उदाहरण संशोधित',
      reviewer: 'डॉ. मीनाक्षी सेन (विषय विशेषज्ञ)',
      timestamp: '23 अक्टूबर 2026, 04:30 PM'
    },
    {
      version: 'v2.0',
      questionId: 'Q-792',
      topic: 'कोशिका संरचना',
      action: 'NCERT संदर्भ 2026-27 अद्यतन',
      reviewer: 'प्रो. के. शर्मा',
      timestamp: '22 अक्टूबर 2026, 11:15 AM'
    },
    {
      version: 'v1.9',
      questionId: 'Q-750',
      topic: 'घातांक और घात',
      action: 'त्रुटि निवारण व विकल्प सुधार',
      reviewer: 'डॉ. मीनाक्षी सेन',
      timestamp: '21 अक्टूबर 2026, 02:40 PM'
    }
  ];

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const handleApprove = (id) => {
    setQueueItems(prev => prev.filter(q => q.id !== id));
    handleAction(`प्रश्न #${id} स्वीकृत किया गया और प्रश्न बैंक में जोड़ा गया (Approved - Demo Action)`);
    if (selectedQuestion?.id === id) setSelectedQuestion(null);
  };

  const handleReject = (id) => {
    setQueueItems(prev => prev.filter(q => q.id !== id));
    handleAction(`प्रश्न #${id} अस्वीकृत व अभिलेखागार में भेजा गया (Rejected/Archived - Demo Action)`);
    if (selectedQuestion?.id === id) setSelectedQuestion(null);
  };

  const filteredItems = queueItems.filter(item => {
    if (activeQueueTab === 'all') return true;
    if (activeQueueTab === 'reported') return item.type === 'reported';
    if (activeQueueTab === 'ai_generated') return item.type === 'ai_generated';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sample Header & Switcher */}
      <SampleDashboardHeader
        currentRole="content-reviewer"
        title="Content Reviewer & Curriculum Moderator (सामग्री समीक्षक) Dashboard"
        subtitle="Review AI-generated vernacular questions, audit reported queries, evaluate NCERT curriculum alignment, and manage version history."
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
            <CheckSquare className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">सामग्री समीक्षक पोर्टल</div>
            <div className="text-[10px] text-slate-500">NCERT 2026-27 • {queueItems.length} लंबित प्रश्न</div>
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
          {/* Reviewer Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                REVIEWER PROFILE
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> प्रमाणित
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  डॉ. मीनाक्षी सेन
                </h3>
                <p className="text-[11px] text-slate-500">वरिष्ठ NCERT पाठ्यक्रम समीक्षक</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">कुल लंबित:</span>
                <span className="font-bold text-amber-800">{queueItems.length} प्रश्न</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">रिपोर्टेड प्रश्न:</span>
                <span className="font-bold text-rose-700">{queueItems.filter(q => q.type === 'reported').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NCERT संरेखण:</span>
                <span className="font-bold text-emerald-700">96.4%</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
              समीक्षा कतार व नेविगेशन
            </span>
            {[
              { id: 'all', label: `सभी प्रश्न (${queueItems.length})`, icon: LayoutDashboard, action: () => { setActiveQueueTab('all'); setActiveNav('all'); document.getElementById('queue-section')?.scrollIntoView({ behavior: 'smooth' }); } },
              { id: 'reported', label: `रिपोर्ट किए गए (${queueItems.filter(q => q.type === 'reported').length})`, icon: AlertTriangle, action: () => { setActiveQueueTab('reported'); setActiveNav('reported'); document.getElementById('queue-section')?.scrollIntoView({ behavior: 'smooth' }); } },
              { id: 'ai_generated', label: `AI जनित प्रश्न (${queueItems.filter(q => q.type === 'ai_generated').length})`, icon: Sparkles, action: () => { setActiveQueueTab('ai_generated'); setActiveNav('ai_generated'); document.getElementById('queue-section')?.scrollIntoView({ behavior: 'smooth' }); } },
              { id: 'rubric', label: 'समीक्षा मानक (Quality Rubric)', icon: ShieldCheck, action: () => { document.getElementById('rubric-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('rubric'); } },
              { id: 'history', label: 'संस्करण इतिहास (Version Log)', icon: History, action: () => { document.getElementById('version-history-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('history'); } },
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

          {/* Quick Moderator Action */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              त्वरित कार्य (Moderator Actions)
            </span>
            <button
              onClick={() => handleAction('सभी 95%+ NCERT संरेखित प्रश्नों को स्वीकृत किया गया (Batch Approved 95%+ - Demo)')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 btn-tactile"
            >
              <Check className="w-3.5 h-3.5" />
              <span>उच्च-सटीक प्रश्न स्वीकृत करें</span>
            </button>
            <button
              onClick={() => {
                document.getElementById('rubric-section')?.scrollIntoView({ behavior: 'smooth' });
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>गुणवत्ता दिशानिर्देश देखें</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* 4 Quality Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>लंबित समीक्षा कतार</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{queueItems.length} <span className="text-xs font-normal text-slate-500">प्रश्न</span></div>
          <div className="text-[11px] font-semibold text-amber-700">
            {queueItems.filter(q => q.type === 'reported').length} रिपोर्ट किए गए प्रश्न शामिल
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>NCERT पाठ्यक्रम संरेखण</span>
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">96.4%</div>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> उच्च सटीकता (High Alignment)
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>देसी उदाहरण प्रामाणिकता</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">94.2%</div>
          <div className="text-[11px] font-semibold text-slate-600">
            ग्रामीण जीवन संदर्भ स्कोर
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>मातृभाषा पठनीयता स्कोर</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">92.8%</div>
          <div className="text-[11px] font-semibold text-sky-700">
            सरल हिंदी, मराठी व बंगाली
          </div>
        </div>
      </div>

      {/* Main Review Workplace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Moderation Queue List */}
        <div className="lg:col-span-2 space-y-4">
          <div id="queue-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    समीक्षा कतार (Moderation Queue)
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    DEMO CONTROLS
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  AI द्वारा रचे गए प्रश्न एवं छात्रों द्वारा सूचित त्रुटियों की गहन समीक्षा
                </p>
              </div>

              {/* Queue Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={() => setActiveQueueTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeQueueTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  सभी ({queueItems.length})
                </button>
                <button
                  onClick={() => setActiveQueueTab('reported')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeQueueTab === 'reported' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  रिपोर्ट किए गए ({queueItems.filter(q => q.type === 'reported').length})
                </button>
                <button
                  onClick={() => setActiveQueueTab('ai_generated')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeQueueTab === 'ai_generated' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI रचित ({queueItems.filter(q => q.type === 'ai_generated').length})
                </button>
              </div>
            </div>

            {/* List of Queue Cards */}
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-sm">कतार में कोई प्रश्न लंबित नहीं है!</p>
                  <p className="text-xs text-slate-400">सभी सामग्री स्वीकृत व प्रमाणित की जा चुकी है।</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      selectedQuestion?.id === item.id
                        ? 'border-orange-500 bg-orange-50/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    {/* Item Top Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                          item.type === 'reported'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {item.type === 'reported' ? '⚠️ रिपोर्ट किया गया प्रश्न' : '✨ AI द्वारा जनित'}
                        </span>
                        <span className="font-semibold text-slate-600">
                          कक्षा {item.classLevel} • {item.subject}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.createdDate}</span>
                    </div>

                    {/* Question Text */}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-3">
                      {item.text}
                    </h3>

                    {/* Reported Callout if applicable */}
                    {item.type === 'reported' && (
                      <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-0.5">
                        <div className="font-black flex items-center gap-1.5 text-rose-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>रिपोर्ट कारण: {item.reportedReason}</span>
                        </div>
                        <div className="text-[10px] text-rose-700">प्रेषक: {item.reportedBy}</div>
                      </div>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {item.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                            oIdx === item.correctIndex
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-center leading-tight font-black text-slate-600 shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                          </span>
                          {oIdx === item.correctIndex && (
                            <span className="text-[10px] font-bold text-emerald-700 shrink-0">
                              (सही उत्तर ✓)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Rural Analogy Box */}
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1 mb-3">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>देसी व्याख्या (Rural Analogy):</span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        {item.ruralAnalogy}
                      </p>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-100 flex items-center justify-between">
                        <span>पाठ्यपुस्तक: <strong>{item.ncertRef}</strong></span>
                        {item.aiModel && <span>मॉडल: {item.aiModel} • {item.confidence}</span>}
                      </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 font-medium">
                        आईडी: <span className="font-mono text-slate-800">#VS-Q{item.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            handleAction(`प्रश्न #${item.id} का संपादन विंडो खोला गया (Edit Mode - Demo)`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>संपादित करें (Edit)</span>
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200 flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>अस्वीकार</span>
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 btn-tactile"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>मंजूरी दें (Approve)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quality Rubric & Version History */}
        <div className="space-y-6">
          {/* Quality Rubric Card */}
          <div id="rubric-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                समीक्षा मूल्यांकन मानक (Quality Rubric)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                मानक
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>1. NCERT पाठ्यक्रम संरेखण</span>
                  <span className="text-emerald-700">अनिवार्य 100%</span>
                </div>
                <p className="text-[10px] text-slate-500">कक्षा के निर्धारित पाठ्यपुस्तक अध्याय से सीधे संबद्ध होना चाहिए।</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>2. देसी एवं ग्रामीण संदर्भ</span>
                  <span className="text-orange-700">प्रामाणिक भाषा</span>
                </div>
                <p className="text-[10px] text-slate-500">खेत, मौसम, सिंचाई, रसोई या दैनिक जीवन के उदाहरण प्रयुक्त हों।</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>3. विकल्प स्पष्टता व भ्रामक निवारण</span>
                  <span className="text-emerald-700">4 विकल्प</span>
                </div>
                <p className="text-[10px] text-slate-500">एक ही विकल्प स्पष्टतः सही हो और अन्य 3 तार्किक रूप से वैध भ्रामक हों।</p>
              </div>
            </div>
          </div>

          {/* Version History Log */}
          <div id="version-history-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <History className="w-4 h-4 text-orange-600" />
                संस्करण इतिहास (Version History)
              </h3>
              <span className="text-[10px] text-slate-400">हाल के परिवर्तन</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {versionHistory.map((item, idx) => (
                <div key={idx} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-black">
                        {item.version}
                      </span>
                      <span>{item.topic}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{item.questionId}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>{item.action}</span>
                    <span className="text-slate-400 text-[10px]">{item.reviewer.split(' ')[0]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{item.timestamp}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAction('सामग्री संस्करण लॉग पूर्ण रूप से प्रदर्शित है (Version Log Exported - Demo)')}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            >
              संपूर्ण संस्करण इतिहास देखें (Full Log)
            </button>
          </div>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
};
