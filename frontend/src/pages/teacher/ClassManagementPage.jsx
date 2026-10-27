import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Copy,
  Check,
  Calendar,
  GraduationCap,
  BookOpen,
  ArrowRight,
  UserCheck,
  Clock,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

export const ClassManagementPage = () => {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    dashboardData,
    loadDashboard,
    setShowCreateModal,
    loading
  } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  const copyJoinCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter students
  const filteredStudents = (dashboardData?.students_mastery || []).filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone_or_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.weakest_topic.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTier === 'high') return s.average_mastery >= 0.7;
    if (filterTier === 'medium') return s.average_mastery >= 0.4 && s.average_mastery < 0.7;
    if (filterTier === 'low') return s.average_mastery < 0.4;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Class Selector Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
            सुविधा 1 • कक्षा प्रबंधन (Feature 1: Class Management)
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            कक्षा एवं विद्यार्थी प्रबंधन
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            अपनी कक्षाओं, विद्यार्थियों की नामांकन स्थिति एवं जॉइन कोड का प्रबंधन करें
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {classes.length > 0 && (
            <select
              value={selectedClassId || ''}
              onChange={(e) => {
                const cid = Number(e.target.value);
                setSelectedClassId(cid);
                loadDashboard(cid);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.student_count || 0} छात्र)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नई कक्षा बनाएं</span>
          </button>
        </div>
      </div>

      {/* Class Meta Cards */}
      {currentClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Name & Section */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">कक्षा एवं वर्ग</span>
            <div className="text-base font-black text-slate-900 truncate">{currentClass.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>बनाई गई: {new Date(currentClass.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Student Count */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">कुल विद्यार्थी</span>
            <div className="text-2xl font-black text-blue-700">{dashboardData?.total_students || 0}</div>
            <div className="text-xs text-slate-500">कक्षा में पंजीकृत छात्र</div>
          </div>

          {/* Average Mastery */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">कक्षा औसत प्रवीणता</span>
            <div className="text-2xl font-black text-emerald-600">
              {Math.round((dashboardData?.class_average_mastery || 0) * 100)}%
            </div>
            <div className="text-xs text-slate-500">NCERT अनुकूलित अभ्यास स्कोर</div>
          </div>

          {/* Join Code Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-orange-200 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-orange-800 uppercase">विद्यार्थी जॉइन कोड</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-orange-950 tracking-wider">
                {currentClass.join_code}
              </span>
              <button
                onClick={() => copyJoinCode(currentClass.join_code)}
                className="p-1.5 rounded-lg bg-white border border-amber-200 text-orange-800 hover:bg-orange-100 transition-colors shadow-2xs"
                title="Copy Join Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-orange-700">विद्यार्थी इस कोड से सीधे जुड़ सकते हैं।</div>
          </div>
        </div>
      ) : null}

      {/* Student Roster Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>नामांकित विद्यार्थी सूची (Enrolled Students Roster)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              प्रत्येक छात्र की व्यक्तिगत प्रवीणता, संपर्क विवरण एवं कमजोर विषय
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाम, ईमेल या विषय खोजें..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setFilterTier('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTier === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                सभी ({dashboardData?.students_mastery?.length || 0})
              </button>
              <button
                onClick={() => setFilterTier('high')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTier === 'high' ? 'bg-emerald-600 text-white shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                उत्कृष्ट (&gt;70%)
              </button>
              <button
                onClick={() => setFilterTier('medium')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTier === 'medium' ? 'bg-amber-500 text-white shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                मध्यम (40-70%)
              </button>
              <button
                onClick={() => setFilterTier('low')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterTier === 'low' ? 'bg-red-600 text-white shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                कमजोर (&lt;40%)
              </button>
            </div>
          </div>
        </div>

        {/* Student Table */}
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="pb-3">क्रमांक</th>
                  <th className="pb-3">विद्यार्थी का नाम</th>
                  <th className="pb-3">संपर्क विवरण</th>
                  <th className="pb-3">प्रवीणता स्तर</th>
                  <th className="pb-3">हल किए प्रश्न</th>
                  <th className="pb-3">कमजोर विषय (Weak Topic)</th>
                  <th className="pb-3">अंतिम सक्रियता</th>
                  <th className="pb-3 text-right">विवरण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((s, index) => (
                  <tr key={s.student_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 text-slate-400 text-xs">{index + 1}</td>
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 text-xs flex items-center justify-center font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-500">{s.phone_or_email}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          s.average_mastery >= 0.7
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.average_mastery >= 0.4
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {Math.round(s.average_mastery * 100)}%
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800">{s.questions_attempted} प्रश्न</td>
                    <td className="py-3.5 text-amber-900 font-semibold">{s.weakest_topic}</td>
                    <td className="py-3.5 text-slate-400 text-xs">
                      {s.last_active ? new Date(s.last_active).toLocaleDateString() : 'कभी नहीं'}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setViewingStudent(s)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>देखें</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">कोई विद्यार्थी नहीं मिला</p>
            <p className="text-xs text-slate-400">खोज या फ़िल्टर मानदंड बदलें</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 text-base font-bold flex items-center justify-center">
                  👨‍🎓
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500">{viewingStudent.phone_or_email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-bold">समग्र प्रवीणता (Overall Mastery):</span>
                <span className="font-black text-sm text-emerald-700">
                  {Math.round(viewingStudent.average_mastery * 100)}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-bold">कुल हल किए प्रश्न:</span>
                <span className="font-black text-sm text-slate-900">
                  {viewingStudent.questions_attempted} प्रश्न
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-amber-800 font-bold block">कमजोर विषय (Attention Needed):</span>
                <p className="text-amber-950 font-bold text-xs">{viewingStudent.weakest_topic}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-bold">अंतिम अभ्यास दिनांक:</span>
                <span className="font-bold text-slate-700">
                  {viewingStudent.last_active
                    ? new Date(viewingStudent.last_active).toLocaleString()
                    : 'कोई अभ्यास नहीं किया'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
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
