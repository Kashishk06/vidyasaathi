import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  UserX,
  TrendingDown,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  BookOpen,
  Sparkles,
  HelpCircle,
  Check,
  X,
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AtRiskStudentsPage = () => {
  const { classes, selectedClassId, setSelectedClassId, dashboardData, loadDashboard } = useOutletContext();
  const navigate = useNavigate();

  const [resolvedAlerts, setResolvedAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vidyasaathi_resolved_alerts') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [actionNotes, setActionNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vidyasaathi_alert_actions') || '{}');
    } catch (e) {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'mastery_gap', 'inactive'
  const [selectedStudentForAction, setSelectedStudentForAction] = useState(null);
  const [selectedActionType, setSelectedActionType] = useState('foundational_practice');
  const [actionComment, setActionComment] = useState('');

  // Persist resolved alerts
  useEffect(() => {
    try {
      localStorage.setItem('vidyasaathi_resolved_alerts', JSON.stringify(resolvedAlerts));
    } catch (e) {}
  }, [resolvedAlerts]);

  // Persist action notes
  useEffect(() => {
    try {
      localStorage.setItem('vidyasaathi_alert_actions', JSON.stringify(actionNotes));
    } catch (e) {}
  }, [actionNotes]);

  const students = dashboardData?.students_mastery || [];

  // Generate transparent, explainable alerts based on real student data
  const generatedAlerts = students
    .map((s) => {
      const isMasteryLow = s.average_mastery < 0.4;
      const isCriticalMastery = s.average_mastery < 0.3;
      const isInactive = !s.last_active || new Date(s.last_active) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const isLowAttempts = (s.questions_attempted || 0) < 5;

      const reasons = [];
      let severity = 'low'; // 'high', 'medium', 'low'

      if (isCriticalMastery) {
        reasons.push(`गंभीर प्रवीणता अंतर (प्रवीणता मात्र ${Math.round(s.average_mastery * 100)}%)`);
        severity = 'high';
      } else if (isMasteryLow) {
        reasons.push(`कमजोर विषय स्तर (प्रवीणता ${Math.round(s.average_mastery * 100)}%)`);
        severity = 'medium';
      }

      if (isInactive) {
        reasons.push('पिछले 3 या अधिक दिनों से कोई अभ्यास नहीं किया गया (Inactive)');
        if (severity !== 'high') severity = 'medium';
      }

      if (isLowAttempts && s.questions_attempted > 0) {
        reasons.push(`कक्षा औसत से कम अभ्यास मात्रा (मात्र ${s.questions_attempted} प्रश्न हल किए)`);
      }

      const isResolved = resolvedAlerts.includes(s.student_id);

      return {
        student_id: s.student_id,
        name: s.name,
        contact: s.phone_or_email,
        average_mastery: s.average_mastery,
        questions_attempted: s.questions_attempted,
        weakest_topic: s.weakest_topic,
        last_active: s.last_active,
        severity: isMasteryLow || isInactive ? severity : 'low',
        isAtRisk: isMasteryLow || isInactive,
        reasons: reasons,
        isResolved: isResolved,
        actionTaken: actionNotes[s.student_id] || null,
      };
    })
    .filter((a) => a.isAtRisk);

  const filteredAlerts = generatedAlerts.filter((a) => {
    if (activeTab === 'high') return a.severity === 'high';
    if (activeTab === 'unresolved') return !a.isResolved;
    if (activeTab === 'resolved') return a.isResolved;
    return true;
  });

  const handleResolveAlert = (studentId) => {
    if (resolvedAlerts.includes(studentId)) {
      setResolvedAlerts((prev) => prev.filter((id) => id !== studentId));
    } else {
      setResolvedAlerts((prev) => [...prev, studentId]);
    }
  };

  const submitAction = (e) => {
    e.preventDefault();
    if (!selectedStudentForAction) return;

    const actionText =
      selectedActionType === 'foundational_practice'
        ? `बुनियादी अभ्यास प्रश्न असाइन किए गए (${actionComment || 'सरल स्तर'})`
        : selectedActionType === 'doubt_solver'
        ? `संदेह निवारण AI चैट लिंक साझा किया गया`
        : selectedActionType === 'one_on_one'
        ? `1-ऑन-1 व्यक्तिगत मार्गदर्शन सत्र निर्धारित (${actionComment || 'कक्षा पश्चात'})`
        : `अभिभावक से फोन पर चर्चा की गई (${actionComment || 'नियमितता हेतु'})`;

    setActionNotes((prev) => ({
      ...prev,
      [selectedStudentForAction.student_id]: {
        type: selectedActionType,
        text: actionText,
        date: new Date().toLocaleDateString(),
      },
    }));

    if (!resolvedAlerts.includes(selectedStudentForAction.student_id)) {
      setResolvedAlerts((prev) => [...prev, selectedStudentForAction.student_id]);
    }

    setSelectedStudentForAction(null);
    setActionComment('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-rose-600">
            सुविधा 6 • जोखिम छात्र अलर्ट (Feature 6: At-Risk Student Alerts)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            अकादमिक सहायता एवं हस्तक्षेप प्रणाली
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            कमजोर प्रवीणता (&lt;40%) और निष्क्रियता के आधार पर पारदर्शी अलर्ट एवं उपचारात्मक सुझाव
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            सभी अलर्ट ({generatedAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('high')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'high' ? 'bg-red-600 text-white shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            उच्च जोखिम (High)
          </button>
          <button
            onClick={() => setActiveTab('unresolved')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'unresolved' ? 'bg-amber-500 text-white shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            लंबित कार्रवाई
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'resolved' ? 'bg-emerald-600 text-white shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            समाधानित
          </button>
        </div>
      </div>

      {/* Transparent Rules Explainer Banner */}
      <div className="bg-rose-50/70 p-4 rounded-3xl border border-rose-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-rose-950 block">
            पारदर्शी अलर्ट मानदंड (Transparent Detection Criteria):
          </span>
          <p className="text-rose-800 leading-relaxed text-[11px]">
            यह प्रणाली किसी भी काल्पनिक स्कोर का उपयोग नहीं करती। अलर्ट केवल 2 वास्तविक संकेतकों पर ट्रिगर होते हैं:
            (1) NCERT पाठ्यक्रम में 40% से कम औसत प्रवीणता, और (2) 3 से अधिक दिनों तक लगातार निष्क्रियता।
          </p>
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">इस श्रेणी में कोई छात्र जोखिम में नहीं है</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            सभी नामांकित विद्यार्थी संतोषजनक प्रगति कर रहे हैं या सभी अलर्ट का समाधान किया जा चुका है।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.student_id}
              className={`bg-white p-6 rounded-3xl border shadow-xs space-y-4 transition-all ${
                alert.isResolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : alert.severity === 'high'
                  ? 'border-red-300 ring-1 ring-red-100'
                  : 'border-amber-200'
              }`}
            >
              {/* Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {alert.severity === 'high' ? '🔴' : '🟡'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{alert.name}</h3>
                    <p className="text-xs text-slate-500">{alert.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {alert.severity === 'high' ? 'गंभीर जोखिम (High Risk)' : 'मध्यम जोखिम (Attention Needed)'}
                  </span>

                  {alert.isResolved && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>कार्रवाई दर्ज</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Alert Reasons List */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block">अलर्ट का स्पष्ट कारण (Trigger Reason):</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {alert.reasons.map((r, rIdx) => (
                    <li key={rIdx} className="font-medium">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">औसत प्रवीणता</span>
                  <span
                    className={`font-black text-sm ${
                      alert.average_mastery < 0.4 ? 'text-red-600' : 'text-amber-700'
                    }`}
                  >
                    {Math.round(alert.average_mastery * 100)}%
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">हल किए प्रश्न</span>
                  <span className="font-black text-sm text-slate-800">
                    {alert.questions_attempted} प्रश्न
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">मुख्य कमजोर विषय</span>
                  <span className="font-bold text-xs text-amber-950 truncate block">
                    {alert.weakest_topic}
                  </span>
                </div>
              </div>

              {/* Action Record If Taken */}
              {alert.actionTaken && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
                  <div className="flex items-center justify-between font-bold">
                    <span>शिक्षक द्वारा की गई उपचारात्मक कार्रवाई:</span>
                    <span className="text-[11px] text-emerald-700">{alert.actionTaken.date}</span>
                  </div>
                  <p className="font-semibold text-emerald-900">{alert.actionTaken.text}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    अंतिम सक्रियता:{' '}
                    {alert.last_active ? new Date(alert.last_active).toLocaleDateString() : 'कभी नहीं'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStudentForAction(alert)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>उपचारात्मक कार्रवाई लें (Take Action)</span>
                  </button>

                  <button
                    onClick={() => handleResolveAlert(alert.student_id)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      alert.isResolved
                        ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{alert.isResolved ? 'पुनः सक्रिय करें' : 'समाधानित चिह्नित करें'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support Action Modal */}
      {selectedStudentForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <span>उपचारात्मक सहायता दर्ज करें</span>
              </h3>
              <button
                onClick={() => setSelectedStudentForAction(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitAction} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-1">विद्यार्थी:</span>
                <div className="p-3 rounded-2xl bg-slate-50 font-extrabold text-slate-900">
                  {selectedStudentForAction.name} ({selectedStudentForAction.contact})
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  सुझावित उपचारात्मक कार्रवाई (Remedial Action):
                </label>
                <select
                  value={selectedActionType}
                  onChange={(e) => setSelectedActionType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="foundational_practice">
                    1. सरल स्तर के बुनियादी अभ्यास प्रश्न असाइन करें
                  </option>
                  <option value="doubt_solver">
                    2. vernacular संदेह निवारण AI चैट लिंक भेजें
                  </option>
                  <option value="one_on_one">
                    3. 1-ऑन-1 व्यक्तिगत मार्गदर्शन कक्षा निर्धारित करें
                  </option>
                  <option value="parent_call">
                    4. अभिभावक से फोन पर चर्चा करें
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  टिप्पणी या विवरण (Optional Notes):
                </label>
                <textarea
                  rows={2}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder="जैसे: सोमवार को कक्षा 8 के बाद भिन्न का बुनियादी अभ्यास कराया जाएगा।"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForAction(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold shadow-xs btn-tactile"
                >
                  कार्रवाई सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
