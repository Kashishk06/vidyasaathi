import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import {
  Settings,
  Languages,
  Zap,
  GraduationCap,
  Check,
  ShieldCheck,
  Smartphone,
  Save
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, lowBandwidth, toggleLowBandwidth, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [classLevel, setClassLevel] = useState(user?.class_level || 8);
  const [savedMsg, setSavedMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  const languages = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/auth/me', {
        name: name.trim(),
        class_level: Number(classLevel),
        language: language,
      });
      updateUser(res.data);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          सेटिंग्स और प्राथमिकताएं (Settings)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          अपनी भाषा, कक्षा और इंटरनेट उपयोग प्राथमिकताओं को बदलें
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Language Selection */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-base">पसंदीदा भाषा (App Language)</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                  language === l.code
                    ? 'bg-orange-50 border-orange-600 text-orange-900 ring-2 ring-orange-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Low Bandwidth Toggle */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">कम इंटरनेट मोड (Low Data Mode)</h3>
                <p className="text-xs text-slate-500">
                  एनीमेशन बंद करता है ताकि 2G/3G नेटवर्क पर भी पेज तुरंत खुले
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleLowBandwidth}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                lowBandwidth ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
            </button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-base">विद्यार्थी प्रोफ़ाइल विवरण</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">नाम</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा (Class Level)</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {[6, 7, 8, 9, 10].map((c) => (
                  <option key={c} value={c}>
                    कक्षा {c} (Class {c})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {savedMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>परिवर्तन सफलतापूर्वक सहेज लिए गए!</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs btn-tactile flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सहेज रहे हैं...' : 'बदलाव सहेजें'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* About & SDG 4 Notice */}
      <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>VidyaSaathi v1.0.0 — संयुक्त राष्ट्र SDG 4 मिशन</span>
        </div>
        <p className="leading-relaxed">
          विद्यासाथी ग्रामीण और अर्ध-शहरी विद्यार्थियों को मातृभाषा में व्यक्तिगत AI ट्यूटरिंग उपलब्ध कराता है।
          यह ओपन सोर्स NCERT पाठ्यक्रम और IBM watsonx Granite मॉडल पर आधारित है।
        </p>
      </div>
    </div>
  );
};
