import React from 'react';
import { X, Sparkles, Tractor, CheckCircle2, BookOpen } from 'lucide-react';
import { VoiceButton } from './VoiceButton';

export const ExplanationModal = ({ isOpen, onClose, explanationData, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-orange-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {explanationData?.title || "सरल देसी समझ (AI Explanation)"}
              </h3>
              <p className="text-xs text-orange-100">ग्रामीण जीवन के उदाहरण से समझें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">
                विद्यासाथी AI आपके लिए सरल उदाहरण तैयार कर रहा है...
              </p>
            </div>
          ) : explanationData ? (
            <>
              {/* Audio Listen Bar */}
              {explanationData.audio_text && (
                <div className="flex items-center justify-between bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-100">
                  <span className="text-xs font-semibold text-orange-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    आवाज़ में सुनें (Voice Explanation):
                  </span>
                  <VoiceButton text={explanationData.audio_text} />
                </div>
              )}

              {/* Step 1: Conceptual Explanation */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  संकल्पना (Concept)
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {explanationData.explanation}
                </p>
              </div>

              {/* Step 2: Rural / Local Real Life Example */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Tractor className="w-4 h-4 text-amber-600" />
                  देसी / ग्रामीण उदाहरण (Village Example)
                </h4>
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/70 text-amber-950 text-sm sm:text-base leading-relaxed">
                  {explanationData.rural_example}
                </div>
              </div>

              {/* Step 3: Key Takeaway */}
              {explanationData.key_takeaway && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-800 uppercase">
                      मुख्य बात (Key Takeaway)
                    </h5>
                    <p className="text-xs sm:text-sm text-emerald-900 font-medium mt-0.5">
                      {explanationData.key_takeaway}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-500 py-6 text-sm">
              विवरण लोड नहीं हो सका। कृपया पुनः प्रयास करें।
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm transition-colors shadow-sm"
          >
            समझ गया (Understood)
          </button>
        </div>
      </div>
    </div>
  );
};
