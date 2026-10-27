import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, User, Lock, Phone, GraduationCap, Languages, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classLevel, setClassLevel] = useState(8);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(phoneOrEmail.trim(), password);
        setLanguage(user.language || 'hi');
        if (user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (user.role === 'parent') {
          navigate('/parent-dashboard');
        } else if (user.role === 'super_admin' || user.role === 'admin') {
          navigate('/super-admin-dashboard');
        } else {
          navigate('/student');
        }
      } else {
        const user = await register({
          name: name.trim(),
          phone_or_email: phoneOrEmail.trim(),
          password,
          role,
          class_level: role === 'student' ? Number(classLevel) : 8,
          language: selectedLang,
        });
        setLanguage(user.language || 'hi');
        if (user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (user.role === 'parent') {
          navigate('/parent-dashboard');
        } else {
          navigate('/student');
        }
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || 'लॉग इन या पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoRole) => {
    setIsLogin(true);
    if (demoRole === 'teacher') {
      setPhoneOrEmail('teacher@vidyasaathi.in');
      setPassword('password123');
    } else if (demoRole === 'parent') {
      setPhoneOrEmail('parent@vidyasaathi.in');
      setPassword('password123');
    } else if (demoRole === 'super_admin') {
      setPhoneOrEmail('superadmin@vidyasaathi.in');
      setPassword('password123');
    } else {
      setPhoneOrEmail('aarav@vidyasaathi.in');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6EF]">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-[#DFCBB5] space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C5832B] text-white flex items-center justify-center mx-auto shadow-md shadow-[#C5832B]/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2A1810] tracking-tight">
            {isLogin ? 'विद्यासाथी में आपका स्वागत है' : 'नया खाता बनाएं'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5749]">
            {isLogin ? 'अपने फोन नंबर या ईमेल से प्रवेश करें' : 'सरल और व्यक्तिगत पढ़ाई के लिए जुड़ें'}
          </p>
        </div>

        {/* Demo Shortcut Buttons for all 4 Approved Roles */}
        <div className="bg-[#FAF3E4] p-3 rounded-2xl border border-[#DFCBB5] space-y-2">
          <span className="text-[11px] font-bold text-[#341B10] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5832B]" />
            डेमो 1-क्लिक लॉगिन (4 Approved Roles):
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickDemo('student')}
              className="text-[11px] px-2 py-1.5 rounded-lg bg-white hover:bg-[#F5ECD8] text-[#341B10] font-bold border border-[#DFCBB5] transition-colors truncate cursor-pointer"
            >
              1. छात्र (Student)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('teacher')}
              className="text-[11px] px-2 py-1.5 rounded-lg bg-white hover:bg-[#F5ECD8] text-[#341B10] font-bold border border-[#DFCBB5] transition-colors truncate cursor-pointer"
            >
              2. शिक्षक (Teacher)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('parent')}
              className="text-[11px] px-2 py-1.5 rounded-lg bg-white hover:bg-[#F5ECD8] text-[#341B10] font-bold border border-[#DFCBB5] transition-colors truncate cursor-pointer"
            >
              3. अभिभावक (Parent)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('super_admin')}
              className="text-[11px] px-2 py-1.5 rounded-lg bg-white hover:bg-[#F5ECD8] text-[#341B10] font-bold border border-[#DFCBB5] transition-colors truncate cursor-pointer"
            >
              4. एडमिन (Super Admin)
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#F5ECD8] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isLogin ? 'bg-[#341B10] text-white shadow-sm' : 'text-[#6B5749] hover:text-[#2A1810]'
            }`}
          >
            लॉग इन (Login)
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isLogin ? 'bg-[#341B10] text-white shadow-sm' : 'text-[#6B5749] hover:text-[#2A1810]'
            }`}
          >
            पंजीकरण (Register)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Role Toggle (3 Publicly Registerable Roles) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आपकी भूमिका (Your Role)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      role === 'student'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    विद्यार्थी (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      role === 'teacher'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    शिक्षक (Teacher)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      role === 'parent'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    अभिभावक (Parent)
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * सुपर एडमिन (Super Admin) खाते सार्वजनिक रूप से पंजीकृत नहीं किए जा सकते।
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम (Full Name)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="जैसे: आरव पटेल"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Class & Language */}
              <div className="grid grid-cols-2 gap-3">
                {role === 'student' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा (Class)</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      {[6, 7, 8, 9, 10].map((c) => (
                        <option key={c} value={c}>कक्षा {c}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={role === 'teacher' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">भाषा (Language)</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Phone or Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              फ़ोन नंबर या ईमेल (Phone or Email)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="phone@example.com या 9876543210"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="कम से कम 6 अक्षर"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#341B10] hover:bg-[#201008] text-white font-bold text-sm shadow-md btn-tactile transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{isLogin ? 'लॉग इन करें' : 'खाता बनाएँ'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
