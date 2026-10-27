import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  User,
  X,
  Check,
  GraduationCap,
  Languages,
  Building2,
  Phone,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export const StudentProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [classLevel, setClassLevel] = useState(user?.class_level || 8);
  const [selectedLang, setSelectedLang] = useState(user?.language || language || 'hi');
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('vidyasaathi_student_avatar') || '👨‍🎓';
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const avatars = ['👨‍🎓', '👩‍🎓', '🧑‍🔬', '🚀', '🌟', '📚', '🎯', '🦁'];

  const languagesList = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.patch('/auth/me', {
        name: name.trim(),
        class_level: Number(classLevel),
        language: selectedLang,
      });

      // Update avatar locally
      localStorage.setItem('vidyasaathi_student_avatar', selectedAvatar);

      // Update AuthContext and LanguageContext
      updateUser({
        ...res.data,
        avatar: selectedAvatar,
      });
      setLanguage(selectedLang);

      setSuccessMsg('प्रोफ़ाइल सफलतापूर्वक अद्यतन की गई! (Profile updated!)');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to update student profile:', err);
      setErrorMsg(
        err.response?.data?.detail ||
          'प्रोफ़ाइल अपडेट करने में समस्या हुई। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-orange-100 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                विद्यार्थी प्रोफ़ाइल (Student Profile)
              </h3>
              <p className="text-xs text-slate-500">
                अपनी कक्षा, नाम, अवतार और पसंदीदा भाषा अपडेट करें
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

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold animate-fade-in flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              अपना अवतार चुनें (Choose Avatar):
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 text-2xl rounded-2xl border-2 flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'border-orange-600 bg-orange-50 scale-105 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              पूरा नाम (Full Name):
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Class Level & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                <span>कक्षा (Class Level):</span>
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
              >
                {[6, 7, 8, 9, 10].map((c) => (
                  <option key={c} value={c}>
                    कक्षा {c} (Class {c})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-sky-600" />
                <span>प्राथमिक भाषा (Language):</span>
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
              >
                {languagesList.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Read-Only Account Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">संपर्क (Phone/Email):</span>
              <span className="font-bold text-slate-800">{user?.phone_or_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">भूमिका (Account Role):</span>
              <span className="font-bold text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-md">
                विद्यार्थी (Student)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">विद्यालय (School):</span>
              <span className="font-bold text-slate-800">ज्ञान निकेतन उच्च प्राथमिक विद्यालय</span>
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 btn-tactile flex items-center gap-1.5 transition-all"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>परिवर्तन सहेजें (Save Changes)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
