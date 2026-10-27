import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingDown,
  Award,
  Filter,
  Check
} from 'lucide-react';

export const ReportsExportsPage = () => {
  const { classes, selectedClassId, setSelectedClassId, dashboardData, loadDashboard } = useOutletContext();

  const [period, setPeriod] = useState('30days'); // '7days', '30days', 'term'
  const [reportType, setReportType] = useState('comprehensive'); // 'comprehensive', 'remedial', 'roster'
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const students = dashboardData?.students_mastery || [];
  const weakestTopics = dashboardData?.weakest_topics || [];

  // Generate and Download Real CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (!students || students.length === 0) {
      setErrorMsg('निर्यात करने के लिए कोई छात्र डेटा उपलब्ध नहीं है।');
      return;
    }
    setErrorMsg('');

    // UTF-8 BOM so Excel displays Hindi & English characters cleanly
    const BOM = '\uFEFF';
    const headers = [
      'क्रमांक (Rank)',
      'विद्यार्थी का नाम (Student Name)',
      'संपर्क विवरण (Contact)',
      'औसत प्रवीणता % (Mastery %)',
      'हल किए प्रश्न (Questions Solved)',
      'कमजोर विषय (Weakest Topic)',
      'अंतिम सक्रियता (Last Active)',
      'स्थिति (Status)'
    ];

    const rows = students.map((s, idx) => {
      const statusText =
        s.average_mastery >= 0.7
          ? 'उत्कृष्ट (High Performer)'
          : s.average_mastery >= 0.4
          ? 'मध्यम (Moderate)'
          : 'ध्यान आवश्यक (At-Risk)';

      const lastActiveDate = s.last_active
        ? new Date(s.last_active).toLocaleDateString()
        : 'कभी नहीं';

      return [
        idx + 1,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.phone_or_email.replace(/"/g, '""')}"`,
        `${Math.round(s.average_mastery * 100)}%`,
        s.questions_attempted,
        `"${(s.weakest_topic || '').replace(/"/g, '""')}"`,
        lastActiveDate,
        `"${statusText}"`
      ].join(',');
    });

    const csvContent = BOM + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const classNameClean = (currentClass?.name || 'Class').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `VidyaSaathi_Report_${classNameClean}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const periodLabels = {
    '7days': 'पिछले 7 दिन (Weekly Review)',
    '30days': 'पिछले 30 दिन (Monthly Progress)',
    'term': 'संपूर्ण सत्र (Full Term - NCERT)',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-600">
            सुविधा 8 • रिपोर्ट व निर्यात (Feature 8: Reports & Exports)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            कक्षा रिपोर्ट एवं डेटा निर्यात केंद्र
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            वास्तविक छात्र प्रवीणता डेटा से CSV एवं PDF रिपोर्ट तैयार करें व डाउनलोड करें
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 btn-tactile flex items-center gap-2 transition-colors"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? 'CSV डाउनलोड हुआ!' : 'CSV निर्यात (Download CSV)'}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट / PDF सहेजें</span>
          </button>
        </div>
      </div>

      {/* Filter and Configuration Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>रिपोर्ट पैरामीटर (Report Parameters)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Class Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">कक्षा चुनें (Classroom)</label>
            <select
              value={selectedClassId || ''}
              onChange={(e) => {
                const cid = Number(e.target.value);
                setSelectedClassId(cid);
                loadDashboard(cid);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reporting Period */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">रिपोर्टिंग अवधि (Period)</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="7days">पिछले 7 दिन (Weekly Review)</option>
              <option value="30days">पिछले 30 दिन (Monthly Progress)</option>
              <option value="term">संपूर्ण सत्र (Full Term - NCERT)</option>
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">रिपोर्ट प्रकार (Report Type)</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="comprehensive">समग्र कक्षा प्रगति रिपोर्ट (Comprehensive)</option>
              <option value="remedial">कमजोर विषय व उपचारात्मक रिपोर्ट (Remedial Focus)</option>
              <option value="roster">विद्यार्थी नामावली एवं उपस्थिति (Roster Only)</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-900 border border-red-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
              विद्यासाथी (VidyaSaathi) • संयुक्त राष्ट्र सतत विकास लक्ष्य 4 (SDG 4: Quality Education)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              कक्षा शैक्षणिक प्रगति एवं नैदानिक रिपोर्ट
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              विद्यालय / कक्षा: <strong>{currentClass?.name || 'ज्ञान निकेतन'}</strong> • जॉइन कोड:{' '}
              <strong className="font-mono">{currentClass?.join_code}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <div>
              दिनांक: <strong>{new Date().toLocaleDateString()}</strong>
            </div>
            <div>
              अवधि: <strong>{periodLabels[period]}</strong>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              डेटा स्रोत: वास्तविक NCERT अभ्यास रिकॉर्ड
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">कुल नामांकित छात्र</span>
            <span className="text-xl font-black text-slate-900">{students.length} छात्र</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">कक्षा औसत प्रवीणता</span>
            <span className="text-xl font-black text-emerald-700">
              {Math.round((dashboardData?.class_average_mastery || 0) * 100)}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">सक्रिय विद्यार्थी दर</span>
            <span className="text-xl font-black text-indigo-700">
              {students.length > 0
                ? `${Math.round(
                    ((students.length - (dashboardData?.inactive_students?.length || 0)) / students.length) * 100
                  )}%`
                : '0%'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">कमजोर विषय संख्या</span>
            <span className="text-xl font-black text-red-600">
              {weakestTopics.filter((t) => t.average_mastery < 0.4).length} विषय
            </span>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">
            1. विद्यार्थीवार प्रवीणता विवरण (Student Performance Breakdown)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-3">रैंक</th>
                  <th className="p-3">विद्यार्थी का नाम</th>
                  <th className="p-3">संपर्क</th>
                  <th className="p-3">प्रवीणता %</th>
                  <th className="p-3">हल किए प्रश्न</th>
                  <th className="p-3">कमजोर विषय</th>
                  <th className="p-3">स्थिति (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.map((s, idx) => (
                  <tr key={s.student_id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-500">{s.phone_or_email}</td>
                    <td className="p-3 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] ${
                          s.average_mastery >= 0.7
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.average_mastery >= 0.4
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {Math.round(s.average_mastery * 100)}%
                      </span>
                    </td>
                    <td className="p-3 font-bold">{s.questions_attempted} प्रश्न</td>
                    <td className="p-3 text-amber-900 font-semibold">{s.weakest_topic}</td>
                    <td className="p-3">
                      {s.average_mastery >= 0.7 ? (
                        <span className="text-emerald-700 font-bold text-[10px]">उत्कृष्ट</span>
                      ) : s.average_mastery >= 0.4 ? (
                        <span className="text-amber-700 font-bold text-[10px]">मध्यम</span>
                      ) : (
                        <span className="text-red-600 font-bold text-[10px]">उपचार आवश्यक</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weak Topics & Recommendations Section */}
        {weakestTopics.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-slate-900 text-sm">
              2. कमजोर विषय विश्लेषण एवं उपचारात्मक सुझाव (Remedial Action Points)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {weakestTopics.map((wt) => (
                <div key={wt.topic_id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{wt.topic_name}</span>
                    <span
                      className={`text-xs ${
                        wt.average_mastery < 0.4 ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      औसत: {Math.round(wt.average_mastery * 100)}%
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>सिफारिश:</strong>{' '}
                    {wt.average_mastery < 0.4
                      ? 'ग्रामीण जीवन के उदाहरणों सहित 15 मिनट की विशेष उपचारात्मक कक्षा आयोजित करें।'
                      : 'मध्यम स्तर के प्रश्नों का अतिरिक्त अभ्यास कार्य असाइन करें।'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Signature */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span>विद्यासाथी स्वचालित शिक्षा विश्लेषण प्रणाली • प्रतिहस्ताक्षर: _________________</span>
          </div>
          <div>
            <span>पृष्ठ 1 / 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
