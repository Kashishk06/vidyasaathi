import React, { useState } from 'react';
import api from '../api/client';
import {
  Flag,
  X,
  AlertTriangle,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react';

export const ReportQuestionModal = ({
  isOpen,
  onClose,
  questionId,
  questionText,
  topicName
}) => {
  const [selectedReason, setSelectedReason] = useState('incorrect_options');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const reasons = [
    {
      id: 'incorrect_options',
      label: 'विकल्प या सही उत्तर गलत है (Incorrect option or answer key)',
    },
    {
      id: 'unclear_explanation',
      label: 'व्याख्या समझ नहीं आई या भ्रामक है (Explanation is unclear / confusing)',
    },
    {
      id: 'language_typo',
      label: 'भाषा, वर्तनी या अनुवाद में त्रुटि (Language typo or translation error)',
    },
    {
      id: 'out_of_syllabus',
      label: 'कक्षा के पाठ्यक्रम से बाहर का प्रश्न (Out of syllabus for my class)',
    },
    {
      id: 'other',
      label: 'अन्य समस्या (Other problem)',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionId) return;

    setSubmitting(true);
    setErrorMsg('');

    const reasonObj = reasons.find((r) => r.id === selectedReason);
    const fullReason = details.trim()
      ? `${reasonObj?.label || selectedReason}: ${details.trim()}`
      : reasonObj?.label || selectedReason;

    try {
      await api.post(`/questions/${questionId}/report`, {
        reason: fullReason,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDetails('');
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Failed to submit question report:', err);
      setErrorMsg(
        err.response?.data?.detail ||
          'रिपोर्ट दर्ज करने में समस्या हुई। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                गलत प्रश्न रिपोर्ट करें (Report a Problem)
              </h3>
              <p className="text-xs text-slate-500">
                विषय: {topicName || 'सामान्य'} • प्रश्न #{questionId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-black text-slate-900 text-lg">
              धन्यवाद! आपकी रिपोर्ट दर्ज हो गई है।
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              यह प्रश्न समीक्षा कतार में भेज दिया गया है। विषय विशेषज्ञ शिक्षक इसकी जांच करके सुधार करेंगे।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question Snippet */}
            {questionText && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">
                  प्रश्न समीक्षा हेतु:
                </span>
                <p className="line-clamp-2 italic font-medium">"{questionText}"</p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Reasons Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                समस्या का मुख्य कारण चुनें (Select Reason):
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedReason === r.id
                        ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                      className="mt-0.5 accent-orange-600"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                अतिरिक्त विवरण (वैकल्पिक / Optional details):
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="सही उत्तर क्या होना चाहिए या आपको क्या गलती लगी..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 btn-tactile flex items-center gap-1.5 transition-all"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>रिपोर्ट भेजें (Submit)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
