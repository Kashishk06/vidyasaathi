import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../api/client';
import {
  BookOpen,
  Sparkles,
  Clock,
  Printer,
  Copy,
  Check,
  Edit3,
  BookmarkPlus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  Lightbulb,
  HelpCircle,
  FileText
} from 'lucide-react';

export const LessonPlanAssistantPage = () => {
  const { classes } = useOutletContext();

  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [duration, setDuration] = useState(45);
  const [customObjectives, setCustomObjectives] = useState('');
  const [ruralTheme, setRuralTheme] = useState('कृषि एवं फसल (Farming & Agriculture)');
  const [language, setLanguage] = useState('hi');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vidyasaathi_saved_lesson_plans') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [planSaved, setPlanSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editable mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedHook, setEditedHook] = useState('');
  const [editedHomework, setEditedHomework] = useState('');

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vidyasaathi_saved_lesson_plans', JSON.stringify(savedPlans));
    } catch (e) {}
  }, [savedPlans]);

  const loadTopics = async () => {
    try {
      const res = await api.get('/topics');
      setTopics(res.data);
      if (res.data.length > 0) {
        setSelectedTopicId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const subjectTopics = topics.filter(
    (t) => t.subject?.toLowerCase() === selectedSubject.toLowerCase()
  );

  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    if (!selectedTopicId) return;

    setGenerating(true);
    setErrorMsg('');
    setPlanSaved(false);

    try {
      const res = await api.post('/ai/lesson-plan', {
        topic_id: Number(selectedTopicId),
        subject: selectedSubject,
        class_level: 8,
        duration_minutes: Number(duration),
        objectives: customObjectives.trim() || undefined,
        rural_context: ruralTheme,
        language: language,
      });

      setGeneratedPlan(res.data);
      setEditedHook(res.data.rural_hook || '');
      setEditedHomework(res.data.homework || '');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to generate lesson plan:', err);
      setErrorMsg('पाठ योजना निर्माण में समस्या आई। पुनः प्रयास करें।');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const planText = `
📚 विद्यासाथी NCERT पाठ योजना (Lesson Plan)
विषय: ${generatedPlan.subject} | अध्याय: ${generatedPlan.topic_name}
कक्षा: ${generatedPlan.class_level} | अवधि: ${generatedPlan.duration_minutes} मिनट
AI इंजन: ${generatedPlan.ai_engine}

🎯 अधिगम उद्देश्य:
${generatedPlan.objectives?.map((o, i) => `${i + 1}. ${o}`).join('\n')}

🌾 दैनिक जीवन व ग्रामीण संदर्भ (Hook):
${editedHook || generatedPlan.rural_hook}

⏱️ शिक्षण चरण:
${generatedPlan.teaching_steps
  ?.map((s) => `[चरण ${s.step_number}: ${s.title} (${s.duration})]\n- शिक्षक: ${s.teacher_action}\n- छात्र: ${s.student_activity}`)
  .join('\n\n')}

🧪 कक्षा गतिविधि:
शीर्षक: ${generatedPlan.classroom_activity?.title}
सामग्री: ${generatedPlan.classroom_activity?.materials}
निर्देश: ${generatedPlan.classroom_activity?.instructions}
अपेक्षित परिणाम: ${generatedPlan.classroom_activity?.expected_outcome}

❓ सामान्य भ्रांतियां:
${generatedPlan.common_misconceptions
  ?.map((m) => `भ्रांति: ${m.misconception}\nस्पष्टीकरण: ${m.clarification}`)
  .join('\n\n')}

📝 त्वरित मूल्यांकन प्रश्न:
${generatedPlan.quick_assessments
  ?.map((q, i) => `प्र. ${i + 1}: ${q.question} (उत्तर: ${q.expected_answer})`)
  .join('\n')}

🏠 गृहकार्य:
${editedHomework || generatedPlan.homework}
    `.trim();

    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const handleSaveToMyPlans = () => {
    if (!generatedPlan) return;
    const newEntry = {
      id: Date.now(),
      topic_name: generatedPlan.topic_name,
      subject: generatedPlan.subject,
      created_at: new Date().toLocaleDateString(),
      plan: {
        ...generatedPlan,
        rural_hook: editedHook,
        homework: editedHomework,
      },
    };
    setSavedPlans((prev) => [newEntry, ...prev]);
    setPlanSaved(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
            सुविधा 7 • पाठ योजना सहायक (Feature 7: Lesson Plan Assistant)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            NCERT संरचित पाठ योजना निर्माता
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ग्रामीण भारतीय जीवन के जीवंत उदाहरणों एवं चरणबद्ध शिक्षण विधि सहित पाठ योजना तैयार करें
          </p>
        </div>

        {savedPlans.length > 0 && (
          <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
            💾 {savedPlans.length} पाठ योजनाएं सहेजी गईं
          </div>
        )}
      </div>

      {/* Plan Generator Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>पाठ योजना विनिर्देश (Lesson Plan Parameters)</span>
        </h3>

        <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">विषय (Subject)</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const firstMatch = topics.find(
                    (t) => t.subject?.toLowerCase() === e.target.value.toLowerCase()
                  );
                  if (firstMatch) setSelectedTopicId(firstMatch.id);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Math">गणित (Mathematics)</option>
                <option value="Science">विज्ञान (Science)</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">अध्याय / टॉपिक (NCERT Topic)</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {subjectTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">कक्षा अवधि (Duration)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={30}>30 मिनट (लघु कालांश)</option>
                <option value={45}>45 मिनट (मानक कालांश)</option>
                <option value={60}>60 मिनट (विस्तृत कार्यशाला)</option>
              </select>
            </div>

            {/* Rural Theme */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">ग्रामीण परिवेश थीम (Analogy Theme)</label>
              <select
                value={ruralTheme}
                onChange={(e) => setRuralTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="कृषि एवं फसल (Farming & Crops)">कृषि एवं फसल (Farming)</option>
                <option value="गाँव की मंडी व व्यापार (Village Market)">गाँव की मंडी (Market)</option>
                <option value="सौर ऊर्जा व ट्यूबवेल (Solar & Irrigation)">सौर ऊर्जा व ट्यूबवेल (Irrigation)</option>
                <option value="ट्रैक्टर व हस्तशिल्प (Tractor & Crafts)">ट्रैक्टर व हस्तशिल्प (Crafts)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">
                विशिष्ट अधिगम उद्देश्य (Custom Objectives - Optional)
              </label>
              <input
                type="text"
                value={customObjectives}
                onChange={(e) => setCustomObjectives(e.target.value)}
                placeholder="जैसे: छात्र दैनिक जीवन में भिन्न के उपयोग को स्पष्ट समझा सकें"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={generating || !selectedTopicId}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 btn-tactile flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'योजना तैयार हो रही है...' : 'पाठ योजना जनरेट करें'}</span>
              </button>
            </div>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-900 border border-red-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Lesson Plan Display */}
      {generatedPlan ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NCERT पाठ योजना • कक्षा {generatedPlan.class_level}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {generatedPlan.topic_name} ({generatedPlan.subject})
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>अवधि: {generatedPlan.duration_minutes} मिनट</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{generatedPlan.ai_engine}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'संपादन पूर्ण' : 'संपादित करें'}</span>
              </button>

              <button
                onClick={handleCopyPlan}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="योजना कॉपी करें"
              >
                {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPlan ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="प्रिंट करें या PDF सहेजें"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट / PDF</span>
              </button>

              <button
                onClick={handleSaveToMyPlans}
                disabled={planSaved}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile disabled:opacity-60"
              >
                {planSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{planSaved ? 'सहेजा गया' : 'सहेजें'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Learning Objectives */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. अधिगम उद्देश्य (Learning Objectives)</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {generatedPlan.objectives?.map((obj, i) => (
                <li key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-slate-700 flex items-start gap-2">
                  <span className="font-bold text-emerald-700 shrink-0">{i + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Real-World Rural Hook */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>2. दैनिक जीवन व ग्रामीण परिवेश से जुड़ाव (Hook - 5 मिनट)</span>
            </h3>
            {isEditing ? (
              <textarea
                rows={3}
                value={editedHook}
                onChange={(e) => setEditedHook(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs leading-relaxed text-amber-950 font-medium">
                {editedHook || generatedPlan.rural_hook}
              </div>
            )}
          </div>

          {/* Section 3: Step-by-Step Teaching Methodology */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-blue-600" />
              <span>3. चरणबद्ध शिक्षण विधि (Step-by-Step Teaching Steps)</span>
            </h3>
            <div className="space-y-2.5">
              {generatedPlan.teaching_steps?.map((step) => (
                <div key={step.step_number} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-extrabold text-slate-900">
                    <span>
                      चरण {step.step_number}: {step.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-500">
                      {step.duration}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-600">
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">शिक्षक गतिविधि:</span>
                      <p>{step.teacher_action}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">छात्र सहभागिता:</span>
                      <p>{step.student_activity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Hands-on Classroom Activity */}
          {generatedPlan.classroom_activity && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>4. कक्षा गतिविधि व समूह कार्य (Classroom Activity)</span>
              </h3>
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 text-xs">
                <div className="font-extrabold text-purple-950 text-sm">
                  {generatedPlan.classroom_activity.title}
                </div>
                <p className="text-purple-900">
                  <strong>सामग्री:</strong> {generatedPlan.classroom_activity.materials}
                </p>
                <p className="text-purple-900 leading-relaxed">
                  <strong>निर्देश:</strong> {generatedPlan.classroom_activity.instructions}
                </p>
                <p className="text-purple-800 text-[11px] font-semibold">
                  <strong>अपेक्षित परिणाम:</strong> {generatedPlan.classroom_activity.expected_outcome}
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Common Misconceptions */}
          {generatedPlan.common_misconceptions?.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-500" />
                <span>5. सामान्य भ्रांतियां एवं निवारण (Misconceptions & Clarifications)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {generatedPlan.common_misconceptions.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 space-y-1.5">
                    <span className="font-bold text-red-950 block">भ्रांति: {m.misconception}</span>
                    <p className="text-red-900 leading-relaxed text-[11px]">
                      <strong>स्पष्टीकरण:</strong> {m.clarification}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Quick Assessments & Homework */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Assessment */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                6. त्वरित मूल्यांकन प्रश्न (Quick Assessment)
              </h3>
              <div className="space-y-2">
                {generatedPlan.quick_assessments?.map((qa, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-900 block">प्र. {i + 1}: {qa.question}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      अपेक्षित उत्तर: {qa.expected_answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Homework */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                7. गृहकार्य व अन्वेषण (Homework)
              </h3>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={editedHomework}
                  onChange={(e) => setEditedHomework(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                  {editedHomework || generatedPlan.homework}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <BookOpen className="w-12 h-12 text-emerald-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">पाठ योजना तैयार करने हेतु पैरामीटर चुनें</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            कक्षा 8 NCERT के किसी भी गणित या विज्ञान अध्याय के लिए ग्रामीण उदाहरणों सहित संरचित शिक्षण योजना बनाएं।
          </p>
        </div>
      )}
    </div>
  );
};
