import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/client';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Check,
  X,
  BookOpen,
  Send,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const AIQuestionGeneratorPage = () => {
  const { classes, selectedClassId } = useOutletContext();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Topics & AI Status
  const [topics, setTopics] = useState([]);
  const [aiEngineStatus, setAiEngineStatus] = useState('जांच हो रही है...');
  const [loadingTopics, setLoadingTopics] = useState(true);

  // Form selections
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('mcq');
  const [questionCount, setQuestionCount] = useState(3);
  const [targetLanguage, setTargetLanguage] = useState(language || 'hi');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generationMsg, setGenerationMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state for inline question modifications
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [savedSuccessIds, setSavedSuccessIds] = useState(new Set());

  useEffect(() => {
    loadHealthAndTopics();
  }, []);

  const loadHealthAndTopics = async () => {
    setLoadingTopics(true);
    try {
      // 1. Health check for AI Engine info
      const healthRes = await api.get('/');
      setAiEngineStatus(healthRes.data?.ai_engine || 'MockProvider (Offline Resilient Mode)');

      // 2. Load Topics
      const topicRes = await api.get('/topics');
      setTopics(topicRes.data);
      if (topicRes.data.length > 0) {
        setSelectedTopicId(topicRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setErrorMsg('विषय या AI सेवा लोड करने में समस्या हुई।');
    } finally {
      setLoadingTopics(false);
    }
  };

  // Filter topics by selected subject
  const subjectTopics = topics.filter(
    (t) => t.subject?.toLowerCase() === selectedSubject.toLowerCase()
  );

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedTopicId) {
      setErrorMsg('कृपया एक विषय चुनें।');
      return;
    }

    setGenerating(true);
    setErrorMsg('');
    setGenerationMsg('');
    setGeneratedQuestions([]);
    setSavedSuccessIds(new Set());

    try {
      const res = await api.post('/ai/generate-questions', {
        topic_id: Number(selectedTopicId),
        difficulty: difficulty,
        count: Number(questionCount),
        language: targetLanguage,
      });

      const returnedList = res.data?.questions || [];
      setGeneratedQuestions(returnedList);
      setGenerationMsg(
        `सफलता! ${returnedList.length} नए NCERT अभ्यास प्रश्न तैयार किए गए हैं।`
      );
    } catch (err) {
      console.error('Question generation failed:', err);
      setErrorMsg(
        err.response?.data?.detail || 'प्रश्न निर्माण में त्रुटि हुई। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setGenerating(false);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditDraft({ ...generatedQuestions[index] });
  };

  const saveEdit = (index) => {
    const updated = [...generatedQuestions];
    updated[index] = editDraft;
    setGeneratedQuestions(updated);
    setEditingIndex(null);
    setEditDraft(null);
  };

  const handleApproveAndSave = async (question, index) => {
    try {
      // Update question status to approved in backend
      await api.patch(`/questions/${question.id}`, {
        text: question.text,
        options: question.options,
        correct_index: question.correct_index,
        explanation: question.explanation,
        status: 'approved',
      });

      setSavedSuccessIds((prev) => new Set([...prev, question.id]));
    } catch (err) {
      console.error('Failed to approve question:', err);
      alert('प्रश्न सहेजने में त्रुटि हुई।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-600">
            सुविधा 3 • AI प्रश्न निर्माण (Feature 3: AI Question Generator)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            NCERT AI प्रश्न बैंक सहायक
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            कक्षा और विषय के अनुसार नए अभ्यास प्रश्न तैयार करें, समीक्षा करें और प्रश्न बैंक में जोड़ें
          </p>
        </div>

        {/* AI Integration Transparency Badge */}
        <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">AI इंजन स्थिति</div>
            <div className="font-extrabold text-orange-900 text-xs">{aiEngineStatus}</div>
          </div>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-600" />
          <span>प्रश्न निर्माण मानदंड (Question Parameters)</span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                विषय (Subject)
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const firstMatch = topics.find(
                    (t) => t.subject?.toLowerCase() === e.target.value.toLowerCase()
                  );
                  if (firstMatch) setSelectedTopicId(firstMatch.id);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Math">गणित (Mathematics)</option>
                <option value="Science">विज्ञान (Science)</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                अध्याय / टॉपिक (NCERT Topic)
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {subjectTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                कठिनाई स्तर (Difficulty)
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="easy">सरल (Easy - 0.20-0.40 Mastery)</option>
                <option value="medium">मध्यम (Medium - 0.40-0.70 Mastery)</option>
                <option value="hard">कठिन (Hard - 0.70+ Mastery)</option>
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रश्न प्रकार (Question Type)
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="mcq">बहुविकल्पीय (4-Option MCQ)</option>
                <option value="true_false">सत्य / असत्य (True / False)</option>
                <option value="conceptual">अवधारणात्मक प्रश्न (Conceptual)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रश्नों की संख्या (Count)
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={1}>1 प्रश्न</option>
                <option value={2}>2 प्रश्न</option>
                <option value={3}>3 प्रश्न</option>
                <option value={5}>5 प्रश्न</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                भाषा (Language)
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English (अंग्रेजी)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="sm:col-span-2 flex items-end gap-2.5">
              <button
                type="submit"
                disabled={generating || !selectedTopicId}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 btn-tactile flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'AI प्रश्न तैयार कर रहा है...' : 'AI से प्रश्न जनरेट करें'}</span>
              </button>

              {generatedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="पुनः जनरेट करें"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>पुनः जनरेट</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {generationMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{generationMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Questions List */}
      {generatedQuestions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              तैयार किए गए प्रश्न ({generatedQuestions.length})
            </h3>
            <span className="text-xs text-slate-500">
              प्रत्येक प्रश्न की समीक्षा करें और आवश्यकतानुसार संशोधन करके स्वीकृत करें
            </span>
          </div>

          {generatedQuestions.map((q, idx) => {
            const isEditing = editingIndex === idx;
            const isSaved = savedSuccessIds.has(q.id);

            return (
              <div
                key={q.id || idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-orange-200 transition-all"
              >
                {/* Meta Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900">
                      प्रश्न #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      कठिनाई: {q.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      स्रोत: AI Generated
                    </span>
                  </div>

                  {isSaved ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>स्वीकृत व सहेजा गया</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      समीक्षा हेतु लंबित
                    </span>
                  )}
                </div>

                {/* Question Text */}
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">प्रश्न विवरण:</label>
                    <textarea
                      rows={2}
                      value={editDraft.text}
                      onChange={(e) => setEditDraft({ ...editDraft, text: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ) : (
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {q.text}
                  </h4>
                )}

                {/* Options */}
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">विकल्प (Options) एवं सही उत्तर:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {editDraft.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${idx}`}
                            checked={editDraft.correct_index === oIdx}
                            onChange={() => setEditDraft({ ...editDraft, correct_index: oIdx })}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span className="font-bold text-slate-400 w-4">{String.fromCharCode(65 + oIdx)}</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...editDraft.options];
                              newOpts[oIdx] = e.target.value;
                              setEditDraft({ ...editDraft, options: newOpts });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                          oIdx === q.correct_index
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </span>
                        {oIdx === q.correct_index && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            सही उत्तर
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation */}
                {isEditing ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">व्याख्या (Explanation):</label>
                    <textarea
                      rows={2}
                      value={editDraft.explanation || ''}
                      onChange={(e) => setEditDraft({ ...editDraft, explanation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ) : q.explanation ? (
                  <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs text-slate-700">
                    <span className="font-bold text-orange-900">व्याख्या एवं ग्रामीण उदाहरण: </span>
                    {q.explanation}
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setEditDraft(null);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                      >
                        रद्द करें
                      </button>
                      <button
                        onClick={() => saveEdit(idx)}
                        className="px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs"
                      >
                        संशोधन लागू करें
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(idx)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>संशोधन करें (Edit)</span>
                      </button>

                      {!isSaved && (
                        <button
                          onClick={() => handleApproveAndSave(q, idx)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>स्वीकृत करें व प्रश्न बैंक में जोड़ें</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-orange-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">नए प्रश्न तैयार करने के लिए तैयार</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ऊपर दिए गए फॉर्म में विषय और कठिनाई चुनकर "AI से प्रश्न जनरेट करें" बटन दबाएं।
          </p>
        </div>
      )}
    </div>
  );
};
