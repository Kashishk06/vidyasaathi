import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Settings,
  LogOut,
  LogIn,
  Zap,
  Globe,
  LayoutDashboard,
  CheckSquare,
  Menu,
  X,
  Users,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isTeacher, isStudent, isParent, isSuperAdmin, logout } = useAuth();
  const { language, setLanguage, lowBandwidth, toggleLowBandwidth, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#D4AF37]/30 sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & SDG 4 Badge matching Reference Image */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#C5832B] text-white flex items-center justify-center shadow-sm shadow-[#C5832B]/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#2A1810] tracking-tight flex items-center gap-2 leading-none">
                  {t('appName')}
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#EFE3CF] text-[#6E4F39] border border-[#DFCBB5]">
                    {t('sdgBadge')}
                  </span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#7B6252] mt-0.5">
                  {t('brandTagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">

            {isAuthenticated && isTeacher && (
              <>
                <Link
                  to="/teacher-dashboard"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    location.pathname.startsWith('/teacher')
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('navTeacher')}
                </Link>
                <Link
                  to="/teacher-dashboard/content-review"
                  className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    location.pathname.includes('/content-review')
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  {t('navReview')}
                </Link>
              </>
            )}

            {isAuthenticated && isParent && (
              <Link
                to="/parent-dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  location.pathname.startsWith('/parent')
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                {t('navParent')}
              </Link>
            )}

            {isAuthenticated && isSuperAdmin && (
              <Link
                to="/super-admin-dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  location.pathname.startsWith('/super-admin')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {t('navAdmin')}
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive('/settings')
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                {t('navSettings')}
              </Link>
            )}
          </nav>

          {/* Right Controls: Low Bandwidth, Language Switcher, Profile/Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Low Bandwidth Toggle */}
            <button
              onClick={toggleLowBandwidth}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                lowBandwidth
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Low Bandwidth Mode for 2G/3G connections"
            >
              <Zap className={`w-3.5 h-3.5 ${lowBandwidth ? 'text-amber-200' : 'text-slate-400'}`} />
              <span className="hidden lg:inline">{t('lowBandwidth')}</span>
              {lowBandwidth && <span className="text-[10px] font-bold">ON</span>}
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-7 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none transition-colors"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Profile / Auth Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[110px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-1.5 rounded-full border border-[#DFCBB5] bg-[#FFFBF3] hover:bg-[#F5ECD8] text-[#341B10] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5832B]" />
                <span>{t('login')}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-slate-100 flex flex-col gap-1 bg-white animate-fade-in">

            {isAuthenticated && isTeacher && (
              <>
                <Link
                  to="/teacher-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  {t('navTeacher')}
                </Link>
                <Link
                  to="/teacher-dashboard/content-review"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                >
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  {t('navReview')}
                </Link>
              </>
            )}

            {isAuthenticated && isParent && (
              <Link
                to="/parent-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-teal-50 hover:text-teal-700"
              >
                <Users className="w-4 h-4 text-teal-600" />
                {t('navParent')}
              </Link>
            )}

            {isAuthenticated && isSuperAdmin && (
              <Link
                to="/super-admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-orange-50 hover:text-orange-700"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                {t('navAdmin')}
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-700 hover:bg-orange-50 hover:text-orange-700"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                {t('navSettings')}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
