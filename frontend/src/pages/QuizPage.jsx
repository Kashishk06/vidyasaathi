import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { VoiceButton } from '../components/VoiceButton';
import { ExplanationModal } from '../components/ExplanationModal';
import { ReportQuestionModal } from '../components/ReportQuestionModal';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Flag,
  Clock,
  RotateCcw,
  Trophy,
  Flame,
  Award,
  BookOpen,
  WifiOff,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const isDiagnostic = searchParams.get('mode') === 'diagnostic';
  const subjectParam = searchParams.get('subject') || 'Math';
  const topicParam = searchParams.get('topic');

  // Diagnostic Quiz State
  const [diagnosticQuestions, setDiagnosticQuestions] = useState([]);
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagnosticSummary, setDiagnosticSummary] = useState([]);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);

  // Single Question / Adaptive Practice State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  // Explanation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explanationData, setExplanationData] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);

  // Report Question Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Load question or diagnostic set
  useEffect(() => {
    loadQuiz();
  }, [searchParams]);

  // Offline status listener
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    setAnswerResult(null);
    setDiagnosticCompleted(false);

    try {
      if (isDiagnostic) {
        setDiagnosticSummary([]);
        const res = await api.post('/quiz/diagnostic', {
          subject: subjectParam,
          class_level: 8,
          language: language,
        });
        setDiagnosticQuestions(res.data);
        setDiagIndex(0);
        if (res.data.length > 0) {
          setCurrentQuestion(res.data[0]);
          // Cache diagnostic questions for offline availability
          try {
            localStorage.setItem('vidyasaathi_cached_diagnostic', JSON.stringify(res.data));
          } catch (e) {}
        }
      } else {
        const params = new URLSearchParams();
        if (subjectParam) params.append('subject', subjectParam);
        if (topicParam) params.append('topic_id', topicParam);

        const res = await api.get(`/quiz/next?${params.toString()}`);
        setCurrentQuestion(res.data);

        // Cache question in offline pool
        try {
          const cached = JSON.parse(localStorage.getItem('vidyasaathi_offline_quiz_cache') || '[]');
          const updated = [res.data, ...cached.filter((q) => q.id !== res.data.id)].slice(0, 20);
          localStorage.setItem('vidyasaathi_offline_quiz_cache', JSON.stringify(updated));
        } catch (e) {}
      }
      setStartTime(Date.now());
    } catch (err) {
      console.warn("Failed to load online quiz question, checking offline cache:", err);
      // Fallback to offline cache
      try {
        if (isDiagnostic) {
          const cachedDiag = JSON.parse(localStorage.getItem('vidyasaathi_cached_diagnostic') || '[]');
          if (cachedDiag.length > 0) {
            setDiagnosticQuestions(cachedDiag);
            setDiagIndex(0);
            setCurrentQuestion(cachedDiag[0]);
            setIsOfflineMode(true);
          }
        } else {
          const cachedQuestions = JSON.parse(localStorage.getItem('vidyasaathi_offline_quiz_cache') || '[]');
          if (cachedQuestions.length > 0) {
            const randomCached = cachedQuestions[Math.floor(Math.random() * cachedQuestions.length)];
            setCurrentQuestion(randomCached);
            setIsOfflineMode(true);
          }
        }
      } catch (cacheErr) {
        console.error("Cache fallback error:", cacheErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !currentQuestion || submitting) return;
    setSubmitting(true);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await api.post('/quiz/answer', {
        question_id: currentQuestion.id,
        selected_index: selectedOption,
        time_taken: timeTaken,
      });

      setAnswerResult(res.data);

      if (isDiagnostic) {
        setDiagnosticSummary((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selectedOption,
            result: res.data,
          },
        ]);
      }
    } catch (err) {
      console.warn("Answer submission failed or offline, recording local attempt:", err);
      // Simulate local feedback if offline
      const mockResult = {
        is_correct: selectedOption === (currentQuestion.correct_index ?? 0),
        selected_index: selectedOption,
        correct_index: currentQuestion.correct_index ?? 0,
        explanation: currentQuestion.explanation || "इस प्रश्न का उत्तर सुरक्षित रूप से जांचा गया।",
        topic_id: currentQuestion.topic_id,
        topic_name: currentQuestion.topic_name,
        new_mastery: 0.6,
        next_difficulty: "medium",
        streak: 1,
        badge_unlocked: null,
      };
      setAnswerResult(mockResult);

      if (isDiagnostic) {
        setDiagnosticSummary((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selectedOption,
            result: mockResult,
          },
        ]);
      }

      // Save offline attempt queue for syncing
      try {
        const queue = JSON.parse(localStorage.getItem('vidyasaathi_offline_attempts') || '[]');
        queue.push({
          question_id: currentQuestion.id,
          selected_index: selectedOption,
          time_taken: timeTaken,
          timestamp: Date.now(),
        });
        localStorage.setItem('vidyasaathi_offline_attempts', JSON.stringify(queue));
      } catch (e) {}
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (isDiagnostic) {
      const nextIdx = diagIndex + 1;
      if (nextIdx < diagnosticQuestions.length) {
        setDiagIndex(nextIdx);
        setCurrentQuestion(diagnosticQuestions[nextIdx]);
        setSelectedOption(null);
        setAnswerResult(null);
        setStartTime(Date.now());
      } else {
        // Diagnostic finished -> show comprehensive results view!
        setDiagnosticCompleted(true);
      }
    } else {
      loadQuiz();
    }
  };

  const handleOpenExplanation = async () => {
    if (!currentQuestion) return;
    setIsModalOpen(true);
    setExplanationLoading(true);
    try {
      const res = await api.post('/ai/explain', {
        question_id: currentQuestion.id,
        language: language,
      });
      setExplanationData(res.data);
    } catch (err) {
      console.error("Failed to fetch explanation:", err);
      // Fallback offline explanation
      setExplanationData({
        title: currentQuestion.text,
        explanation: currentQuestion.explanation || "इस प्रश्न का मुख्य सिद्धांत पाठ्यपुस्तक के आधार पर स्पष्ट है।",
        rural_example: "दैनिक जीवन में खेत, मौसम और बाजार के उदाहरणों से इस सिद्धांत को आसानी से समझा जा सकता है।",
        key_takeaway: "निरंतर अभ्यास और अवधारणा की समझ से महारत हासिल होती है।",
        language: language,
      });
    } finally {
      setExplanationLoading(false);
    }
  };

  // Diagnostic Results Screen Component
  if (diagnosticCompleted) {
    const totalQuestions = diagnosticSummary.length;
    const correctCount = diagnosticSummary.filter((item) => item.result.is_correct).length;
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Identify weak topics (where student answered wrong)
    const weakTopicsMap = {};
    const strongTopicsMap = {};
    diagnosticSummary.forEach((item) => {
      const tName = item.question.topic_name || item.result.topic_name || 'General';
      const tId = item.question.topic_id || item.result.topic_id;
      if (!item.result.is_correct) {
        weakTopicsMap[tId] = tName;
      } else {
        strongTopicsMap[tId] = tName;
      }
    });

    const weakTopics = Object.entries(weakTopicsMap).map(([id, name]) => ({ id, name }));
    const strongTopics = Object.entries(strongTopicsMap).map(([id, name]) => ({ id, name }));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
        {/* Diagnostic Results Hero */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-orange-50 border border-white/25">
              प्रारंभिक मूल्यांकन परिणाम (Diagnostic Result)
            </span>
            <span className="text-xs font-semibold text-orange-100">
              विषय: {subjectParam} • कक्षा 8 NCERT
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                आपका डायग्नोस्टिक स्कोर: {scorePct}%
              </h1>
              <p className="text-sm text-orange-100 max-w-lg">
                आपने <strong>{totalQuestions} में से {correctCount}</strong> प्रश्न सही हल किए। नीचे आपके मजबूत विषय और सुधार के क्षेत्रों का विश्लेषण दिया गया है।
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-center shrink-0 self-start sm:self-auto min-w-[130px]">
              <div className="text-3xl font-black">
                {scorePct >= 75 ? '🌟 उत्कृष्ट' : scorePct >= 50 ? '📈 मध्यम' : '🌱 प्रारंभिक'}
              </div>
              <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider mt-1">
                प्रारंभिक स्तर (Level)
              </div>
            </div>
          </div>
        </div>

        {/* Identified Learning Gaps & Strong Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Weak Topics / Learning Gaps */}
          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <TrendingDown className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                पहचाने गए अधिगम अंतर (Learning Gaps Identified)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              इन विषयों में अतिरिक्त अभ्यास की आवश्यकता है ताकि बुनियादी अवधारणाएं पक्की हो सकें।
            </p>

            {weakTopics.length > 0 ? (
              <div className="space-y-2.5">
                {weakTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-rose-950 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{topic.name}</span>
                    </span>
                    <button
                      onClick={() => navigate(`/quiz?topic=${topic.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs btn-tactile shrink-0"
                    >
                      अभ्यास करें
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                शानदार! आपने सभी विषयों में संतोषजनक प्रदर्शन किया।
              </div>
            )}
          </div>

          {/* Strong Topics */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                सशक्त विषय (Mastered Concepts)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              इन विषयों में आपकी समझ बहुत अच्छी है। इन्हें बनाए रखने के लिए समय-समय पर रिवीजन करें।
            </p>

            {strongTopics.length > 0 ? (
              <div className="space-y-2.5">
                {strongTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 text-xs font-bold text-emerald-950"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{topic.name}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                      मजबूत ✓
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                नियमित अभ्यास से आपके विषय सशक्त श्रेणी में आते जाएंगे।
              </div>
            )}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            प्रश्नोत्तरी समीक्षा एवं व्याख्या (Question Review & Explanations)
          </h3>

          <div className="space-y-3.5">
            {diagnosticSummary.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  item.result.is_correct
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    प्रश्न {idx + 1}: {item.question.text}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase shrink-0 ${
                      item.result.is_correct
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {item.result.is_correct ? 'सही (Correct)' : 'गलत (Incorrect)'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-700 space-y-1">
                  <div>
                    आपका उत्तर: <span className="font-bold">{item.question.options[item.selectedOption]}</span>
                  </div>
                  {!item.result.is_correct && (
                    <div className="text-emerald-800">
                      सही उत्तर:{' '}
                      <span className="font-bold">{item.question.options[item.result.correct_index]}</span>
                    </div>
                  )}
                  <p className="text-slate-600 pt-1 border-t border-slate-200/60 leading-relaxed italic">
                    व्याख्या: {item.result.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              setDiagnosticCompleted(false);
              loadQuiz();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>पुनः टेस्ट दें (Retake Quiz)</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/progress')}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs btn-tactile shadow-xs"
            >
              समग्र प्रगति देखें
            </button>
            <button
              onClick={() => {
                if (weakTopics.length > 0) {
                  navigate(`/quiz?topic=${weakTopics[0].id}`);
                } else {
                  navigate('/quiz?subject=Math');
                }
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs btn-tactile shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5"
            >
              <span>अनुशंसित अभ्यास शुरू करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">प्रश्न तैयार किया जा रहा है...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">कोई प्रश्न उपलब्ध नहीं है</h3>
        <p className="text-xs text-slate-500">इस विषय में नए प्रश्न जल्द जोड़े जा रहे हैं।</p>
        <button
          onClick={() => navigate('/student')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          मुख्यपृष्ठ पर लौटें
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>ऑफ़लाइन अभ्यास मोड सक्रिय है। कैश्ड प्रश्नों से अभ्यास जारी है।</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 px-2 py-0.5 rounded-md">
            OFFLINE CACHE
          </span>
        </div>
      )}

      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            {isDiagnostic
              ? `डायग्नोस्टिक टेस्ट (प्रश्न ${diagIndex + 1} / ${diagnosticQuestions.length})`
              : currentQuestion.topic_name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize border border-slate-200">
              कठिनाई: {currentQuestion.difficulty}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100">
              {currentQuestion.subject}
            </span>
          </div>
        </div>

        {/* Voice Read Button for Question (Feature 6) */}
        <VoiceButton text={currentQuestion.text} />
      </div>

      {/* Progress Bar for Diagnostic */}
      {isDiagnostic && (
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-orange-600 h-full transition-all duration-300"
            style={{ width: `${((diagIndex + 1) / diagnosticQuestions.length) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-6">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
          {currentQuestion.text}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnClass = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-orange-50/50 hover:border-orange-200";

            if (answerResult) {
              if (idx === answerResult.correct_index) {
                btnClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20";
              } else if (isSelected && !answerResult.is_correct) {
                btnClass = "bg-red-50 border-red-500 text-red-950 font-bold ring-2 ring-red-500/20";
              } else {
                btnClass = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
              }
            } else if (isSelected) {
              btnClass = "bg-orange-50 border-orange-600 text-orange-950 font-bold ring-2 ring-orange-500/20";
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={answerResult !== null}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base flex items-center justify-between transition-all btn-tactile ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {answerResult && idx === answerResult.correct_index && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {answerResult && isSelected && !answerResult.is_correct && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Button */}
        {!answerResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null || submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-orange-500/20 btn-tactile transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{t('submitAnswer')}</span>
            )}
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Feedback Alert */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                answerResult.is_correct
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              {answerResult.is_correct ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base">
                  {answerResult.is_correct ? t('correctAlert') : t('wrongAlert')}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  {answerResult.explanation}
                </p>
                {answerResult.badge_unlocked && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black mt-2">
                    <Award className="w-3.5 h-3.5" />
                    {answerResult.badge_unlocked}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Explain with Rural Example + Next Question */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleOpenExplanation}
                className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 btn-tactile border border-amber-200"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{t('explainRural')}</span>
              </button>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 btn-tactile shadow-md shadow-orange-500/20"
              >
                <span>{t('nextQuestion')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Report Question (Feature 12) */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>कक्षा 8 NCERT पाठ्यक्रम पर आधारित</span>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors font-medium"
        >
          <Flag className="w-3.5 h-3.5 text-rose-500" />
          <span>{t('reportQuestion') || 'गलत प्रश्न रिपोर्ट करें'}</span>
        </button>
      </div>

      {/* Explanation Modal (Feature 4) */}
      <ExplanationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        explanationData={explanationData}
        loading={explanationLoading}
      />

      {/* Report Question Modal (Feature 12) */}
      <ReportQuestionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        questionId={currentQuestion?.id}
        questionText={currentQuestion?.text}
        topicName={currentQuestion?.topic_name}
      />
    </div>
  );
};
