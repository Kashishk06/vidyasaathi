import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../api/client';
import {
  ClipboardList,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  Users,
  Eye,
  Trash2,
  BookOpen,
  X,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';

export const AssignmentsTestsPage = () => {
  const { classes, selectedClassId } = useOutletContext();

  const [assignments, setAssignments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetClassId, setTargetClassId] = useState(selectedClassId || '');
  const [subject, setSubject] = useState('Math');
  const [topicId, setTopicId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // View Submission Detail Modal
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [assignmentDetail, setAssignmentDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadTopics();
    loadApprovedQuestions();
  }, [selectedClassId]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const url = selectedClassId ? `/assignments?classroom_id=${selectedClassId}` : '/assignments';
      const res = await api.get(url);
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      const res = await api.get('/topics');
      setTopics(res.data);
      if (res.data.length > 0) {
        setTopicId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const loadApprovedQuestions = async () => {
    try {
      const res = await api.get('/questions?status=approved');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to load approved questions:', err);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetClassId) {
      setCreateMsg('कृपया शीर्षक और कक्षा भरें।');
      return;
    }
    setCreating(true);
    setCreateMsg('');
    try {
      await api.post('/assignments', {
        title: title.trim(),
        classroom_id: Number(targetClassId),
        subject: subject,
        topic_id: topicId ? Number(topicId) : null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        instructions: instructions.trim() || null,
        question_ids: selectedQuestionIds,
      });

      setShowCreateModal(false);
      setTitle('');
      setInstructions('');
      setSelectedQuestionIds([]);
      await loadAssignments();
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setCreateMsg('असाइनमेंट बनाने में त्रुटि हुई।');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('क्या आप वाकई इस असाइनमेंट को हटाना चाहते हैं?')) return;
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      if (viewingAssignment?.id === id) {
        setViewingAssignment(null);
        setAssignmentDetail(null);
      }
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      alert('हटाने में त्रुटि हुई।');
    }
  };

  const openDetail = async (a) => {
    setViewingAssignment(a);
    setLoadingDetail(true);
    try {
      const res = await api.get(`/assignments/${a.id}`);
      setAssignmentDetail(res.data);
    } catch (err) {
      console.error('Failed to load assignment detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const toggleQuestionSelection = (qid) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-600">
            सुविधा 5 • असाइनमेंट व टेस्ट (Feature 5: Assignments & Tests)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            कक्षा अभ्यास कार्य एवं गृहकार्य प्रबंधन
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            विद्यार्थियों के लिए गृहकार्य तैयार करें, प्रश्न जोड़ें और सबमिशन स्कोर ट्रैक करें
          </p>
        </div>

        <button
          onClick={() => {
            setTargetClassId(selectedClassId || (classes[0]?.id || ''));
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 btn-tactile flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ नया असाइनमेंट बनाएं</span>
        </button>
      </div>

      {/* Assignment List Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">असाइनमेंट लोड हो रहे हैं...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <ClipboardList className="w-12 h-12 text-purple-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">अभी तक कोई असाइनमेंट नहीं बनाया गया</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            विद्यार्थियों के लिए गृहकार्य एवं साप्ताहिक टेस्ट असाइन करने के लिए ऊपर "+ नया असाइनमेंट बनाएं" बटन दबाएं।
          </p>
          <button
            onClick={() => {
              setTargetClassId(selectedClassId || (classes[0]?.id || ''));
              setShowCreateModal(true);
            }}
            className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs btn-tactile"
          >
            पहला असाइनमेंट बनाएं
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => {
            const completionPercent = a.total_students > 0
              ? Math.round((a.submissions_count / a.total_students) * 100)
              : 0;

            return (
              <div
                key={a.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {a.subject} • {a.classroom_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        a.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {a.status === 'active' ? 'सक्रिय (Active)' : a.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {a.title}
                  </h3>

                  {a.instructions && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {a.instructions}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">कुल प्रश्न</span>
                      <span className="font-black text-slate-800">{a.question_count} प्रश्न</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">सबमिशन दर</span>
                      <span className="font-black text-purple-700">
                        {a.submissions_count} / {a.total_students} ({completionPercent}%)
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">औसत स्कोर</span>
                      <span className="font-black text-emerald-700">
                        {a.average_score !== null ? `${a.average_score}%` : 'लंबित'}
                      </span>
                    </div>
                  </div>

                  {/* Due Date & Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        अंतिम तिथि:{' '}
                        {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'कोई समय सीमा नहीं'}
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeleteAssignment(a.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDetail(a)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>छात्र परिणाम देखें</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                <span>नया अभ्यास कार्य / टेस्ट बनाएं</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">असाइनमेंट शीर्षक (Title)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="जैसे: परिमेय संख्याएं साप्ताहिक अभ्यास टेस्ट 1"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कक्षा चुनें (Classroom)</label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">विषय (Subject)</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="Math">गणित (Math)</option>
                    <option value="Science">विज्ञान (Science)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">संबंधित अध्याय (Topic)</label>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">अंतिम तिथि (Due Date)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  विद्यार्थियों हेतु निर्देश (Instructions)
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="जैसे: सभी छात्र ध्यानपूर्वक 15 मिनट में प्रश्नों को हल करें।"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Select Questions from Approved Bank */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  स्वीकृत प्रश्न बैंक से प्रश्न चुनें ({selectedQuestionIds.length} चयनित)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 p-3 rounded-2xl bg-slate-50">
                  {questions.length === 0 ? (
                    <p className="text-slate-400 text-center py-3">कोई स्वीकृत प्रश्न उपलब्ध नहीं है</p>
                  ) : (
                    questions.map((q) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestionSelection(q.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-purple-50 border-purple-300 text-purple-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-0.5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="line-clamp-2 text-xs">{q.text}</p>
                            <span className="text-[10px] text-slate-400">
                              {q.topic_name} • {q.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {createMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-900 border border-red-200 font-bold">
                  {createMsg}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-xs btn-tactile"
                >
                  {creating ? 'बना रहे हैं...' : 'असाइनमेंट प्रकाशित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Detail & Student Submissions Modal */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{viewingAssignment.title}</h3>
                <p className="text-xs text-slate-500">
                  {viewingAssignment.classroom_name} • {viewingAssignment.subject}
                </p>
              </div>
              <button
                onClick={() => {
                  setViewingAssignment(null);
                  setAssignmentDetail(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-7 h-7 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500">विद्यार्थी परिणाम लोड हो रहे हैं...</p>
              </div>
            ) : assignmentDetail ? (
              <div className="space-y-4 text-xs">
                {/* Instructions */}
                {assignmentDetail.instructions && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">निर्देश:</span>
                    {assignmentDetail.instructions}
                  </div>
                )}

                {/* Questions Preview Strip */}
                <div>
                  <h4 className="font-extrabold text-slate-900 mb-2">
                    शामिल प्रश्न ({assignmentDetail.questions?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                    {assignmentDetail.questions?.map((q, idx) => (
                      <div key={q.id} className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-slate-900">प्र. {idx + 1}: </span>
                        <span>{q.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Submission Roster Table */}
                <div>
                  <h4 className="font-extrabold text-slate-900 mb-2">
                    विद्यार्थियों के सबमिशन एवं स्कोर
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[10px]">
                          <th className="p-3">विद्यार्थी का नाम</th>
                          <th className="p-3">स्थिति (Status)</th>
                          <th className="p-3">स्कोर %</th>
                          <th className="p-3">सबमिशन दिनांक</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assignmentDetail.students?.map((s) => (
                          <tr key={s.student_id} className="hover:bg-slate-50/70">
                            <td className="p-3 font-bold text-slate-900">{s.name}</td>
                            <td className="p-3">
                              {s.submitted ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  जमा किया (Submitted)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                                  लंबित (Pending)
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {s.score_percent !== null ? `${s.score_percent}%` : '-'}
                            </td>
                            <td className="p-3 text-slate-500">
                              {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setViewingAssignment(null);
                  setAssignmentDetail(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
