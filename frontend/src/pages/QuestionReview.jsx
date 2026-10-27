import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  CheckSquare,
  Sparkles,
  Check,
  X,
  Edit2,
  Filter,
  CheckCircle2,
  Clock,
  Flag,
  BookOpen
} from 'lucide-react';

export const QuestionReview = () => {
  const { t, language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  // Generate Questions Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTopicId, setGenTopicId] = useState('');
  const [genDifficulty, setGenDifficulty] = useState('medium');
  const [genCount, setGenCount] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');

  // Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editCorrectIdx, setEditCorrectIdx] = useState(0);
  const [editExplanation, setEditExplanation] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [statusFilter]);

  const loadTopics = async () => {
    try {
      const res = await api.get('/topics');
      setTopics(res.data);
      if (res.data.length > 0) {
        setGenTopicId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load topics:", err);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions?status=${statusFilter}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (qId) => {
    try {
      await api.patch(`/questions/${qId}`, { status: 'approved' });
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      console.error("Failed to approve question:", err);
    }
  };

  const handleReject = async (qId) => {
    try {
      await api.patch(`/questions/${qId}`, { status: 'flagged' });
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      console.error("Failed to reject question:", err);
    }
  };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!genTopicId) return;
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await api.post('/ai/generate-questions', {
        topic_id: Number(genTopicId),
        difficulty: genDifficulty,
        count: Number(genCount),
        language: language,
      });
      setGenMsg(`सफलता! ${res.data.count} नए प्रश्न समीक्षा सूची में जोड़े गए।`);
      setStatusFilter('pending');
      loadQuestions();
      setTimeout(() => {
        setShowGenModal(false);
        setGenMsg('');
      }, 1500);
    } catch (err) {
      setGenMsg(err.response?.data?.detail || "प्रश्न निर्माण में त्रुटि हुई।");
    } finally {
      setGenerating(false);
    }
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setEditText(q.text);
    setEditOptions(q.options || ['', '', '', '']);
    setEditCorrectIdx(q.correct_index || 0);
    setEditExplanation(q.explanation || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setSavingEdit(true);
    try {
      const res = await api.patch(`/questions/${editingQuestion.id}`, {
        text: editText.trim(),
        options: editOptions,
        correct_index: Number(editCorrectIdx),
        explanation: editExplanation.trim(),
        status: 'approved', // Auto approve on teacher edit
      });
      setQuestions((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
      setEditingQuestion(null);
    } catch (err) {
      console.error("Failed to update question:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            पाठ्यक्रम गुणवत्ता नियंत्रण (Quality & Safety)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            प्रश्न समीक्षा और संपादन (Question Bank Review)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AI-जनरेटेड और विद्यार्थियों द्वारा रिपोर्ट किए गए प्रश्नों की समीक्षा करें
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 btn-tactile flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{t('generateAiQuestions')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'pending'
              ? 'bg-amber-100 text-amber-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          लंबित समीक्षा (Pending Review)
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'approved'
              ? 'bg-emerald-100 text-emerald-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          स्वीकृत प्रश्न (Live Approved)
        </button>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-200 text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          सभी प्रश्न (All)
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">प्रश्न लोड हो रहे हैं...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">कोई लंबित प्रश्न नहीं है</h3>
          <p className="text-xs text-slate-400">सभी प्रश्न स्वीकृत और कक्षा में अभ्यास के लिए तैयार हैं।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-orange-200 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-100">
                    {q.topic_name}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    स्रोत: {q.source}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    q.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : q.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {q.status}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {q.text}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                      i === q.correct_index
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>
                      {String.fromCharCode(65 + i)}. {opt}
                    </span>
                    {i === q.correct_index && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        सही उत्तर
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">व्याख्या: </span>
                  {q.explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(q)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 btn-tactile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>संशोधन करें (Edit)</span>
                </button>

                {q.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReject(q.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 btn-tactile"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t('reject')}</span>
                    </button>
                    <button
                      onClick={() => handleApprove(q.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 btn-tactile shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('approve')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Generate Questions Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-orange-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                AI से नए प्रश्न तैयार करें
              </h3>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateQuestions} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विषय व अध्याय (Topic)</label>
                <select
                  value={genTopicId}
                  onChange={(e) => setGenTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.subject}: {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कठिनाई (Difficulty)</label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="easy">सरल (Easy)</option>
                    <option value="medium">मध्यम (Medium)</option>
                    <option value="hard">कठिन (Hard)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">संख्या (Count)</label>
                  <select
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value={1}>1 प्रश्न</option>
                    <option value={2}>2 प्रश्न</option>
                    <option value={3}>3 प्रश्न</option>
                    <option value={5}>5 प्रश्न</option>
                  </select>
                </div>
              </div>

              {genMsg && (
                <div className="p-3 rounded-xl bg-orange-50 text-orange-900 border border-orange-200 text-xs font-semibold">
                  {genMsg}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs btn-tactile"
                >
                  {generating ? 'AI बना रहा है...' : 'प्रश्न बनाएं'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-orange-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">प्रश्न में संशोधन (Edit Question)</h3>
              <button onClick={() => setEditingQuestion(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रश्न विवरण</label>
                <textarea
                  rows={3}
                  required
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">चारों विकल्प (Options)</label>
                {editOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIdx"
                      checked={editCorrectIdx === i}
                      onChange={() => setEditCorrectIdx(i)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-bold text-slate-500 w-4">{String.fromCharCode(65 + i)}</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const updated = [...editOptions];
                        updated[i] = e.target.value;
                        setEditOptions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ))}
                <p className="text-[11px] text-slate-400">रेडियो बटन चुनकर सही विकल्प चिह्नित करें।</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विस्तृत व्याख्या (Explanation)</label>
                <textarea
                  rows={2}
                  required
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs btn-tactile"
                >
                  {savingEdit ? 'सहेज रहे हैं...' : 'संशोधन सहेजें व स्वीकृत करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
