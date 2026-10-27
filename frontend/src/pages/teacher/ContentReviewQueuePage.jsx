import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Check,
  Edit2,
  Filter,
  Search,
  MessageSquare,
  Flag,
  BookOpen
} from 'lucide-react';

export const ContentReviewQueuePage = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editCorrectIdx, setEditCorrectIdx] = useState(0);
  const [editExplanation, setEditExplanation] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Review comment state
  const [reviewNote, setReviewNote] = useState('');

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
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions?status=${statusFilter}`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (qId) => {
    try {
      await api.patch(`/questions/${qId}`, { status: 'approved' });
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      console.error('Failed to approve question:', err);
      alert('प्रश्न स्वीकृत करने में त्रुटि हुई।');
    }
  };

  const handleReject = async (qId) => {
    try {
      await api.patch(`/questions/${qId}`, { status: 'flagged' });
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      console.error('Failed to reject question:', err);
      alert('प्रश्न अस्वीकृत करने में त्रुटि हुई।');
    }
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setEditText(q.text);
    setEditOptions(q.options || ['', '', '', '']);
    setEditCorrectIdx(q.correct_index || 0);
    setEditExplanation(q.explanation || '');
    setReviewNote('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setSavingEdit(true);
    try {
      const fullExplanation = reviewNote.trim()
        ? `${editExplanation.trim()} [शिक्षक नोट: ${reviewNote.trim()}]`
        : editExplanation.trim();

      const res = await api.patch(`/questions/${editingQuestion.id}`, {
        text: editText.trim(),
        options: editOptions,
        correct_index: Number(editCorrectIdx),
        explanation: fullExplanation,
        status: 'approved',
      });
      setQuestions((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
      setEditingQuestion(null);
    } catch (err) {
      console.error('Failed to update question:', err);
      alert('संशोधन सहेजने में समस्या हुई।');
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter questions by search and topic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.topic_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (topicFilter !== 'all' && String(q.topic_id) !== String(topicFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
            सुविधा 4 • सामग्री समीक्षा कतार (Feature 4: Content Review Queue)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            पाठ्यक्रम सामग्री एवं प्रश्न सत्यापन कतार
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AI द्वारा जनरेट किए गए एवं विद्यार्थियों द्वारा रिपोर्ट किए गए प्रश्नों की सटीकता जांचें
          </p>
        </div>

        {/* Status Counts Pill */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>लंबित समीक्षा</span>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>स्वीकृत प्रश्न</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            सभी प्रश्न
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="प्रश्न विवरण या कीवर्ड खोजें..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">सभी अध्याय (All Topics)</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.subject}: {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Review Cards */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">समीक्षा सामग्री लोड हो रही है...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">कोई प्रश्न समीक्षा के लिए लंबित नहीं है</h3>
          <p className="text-xs text-slate-400">
            सभी प्रश्न स्वीकृत हैं और कक्षा में अभ्यास के लिए तैयार हैं।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-amber-300 transition-all"
            >
              {/* Badge Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {q.topic_name || 'पाठ्यक्रम प्रश्न'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    स्रोत: {q.source}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
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
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {q.text}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options?.map((opt, i) => (
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
                  <span className="font-bold text-slate-800">व्याख्या: </span>
                  {q.explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(q)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>संशोधन करें (Edit)</span>
                </button>

                {q.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReject(q.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>अस्वीकृत (Reject)</span>
                    </button>
                    <button
                      onClick={() => handleApprove(q.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>स्वीकृत करें (Approve)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-amber-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                प्रश्न में संशोधन एवं समीक्षा टिप्पणी
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रश्न विवरण (Question Text)</label>
                <textarea
                  rows={3}
                  required
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
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
                      className="text-amber-600 focus:ring-amber-500"
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
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                ))}
                <p className="text-[11px] text-slate-400">रेडियो बटन चुनकर सही उत्तर चिह्नित करें।</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विस्तृत व्याख्या (Explanation)</label>
                <textarea
                  rows={2}
                  required
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  शिक्षक समीक्षा टिप्पणी (Review Notes - Optional)
                </label>
                <input
                  type="text"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="जैसे: गाँव के उदाहरण को स्पष्ट किया गया"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
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
