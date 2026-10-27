import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Users,
  ShieldCheck,
  ArrowLeft,
  Info,
  CheckCircle2
} from 'lucide-react';

/**
 * SampleDashboardHeader — shown on Parent and Super Admin dashboards.
 * Updated for 4-role system: Student, Teacher, Parent/Guardian, Super Admin.
 */
export const SampleDashboardHeader = ({ currentRole, title, subtitle }) => {
  const { t } = useLanguage();

  const roleLabel = currentRole === 'parent'
    ? t('roleParentTitle')
    : t('roleAdminTitle');

  const roleColor = {
    parent: 'from-teal-500 via-emerald-500 to-teal-600',
    'super-admin': 'from-amber-500 via-orange-500 to-amber-600',
  }[currentRole] || 'from-amber-500 via-orange-500 to-amber-600';

  return (
    <div className="mb-6 space-y-3">
      {/* Role Info Banner */}
      <div className={`bg-gradient-to-r ${roleColor} text-white rounded-2xl p-4 shadow-md shadow-orange-500/10 border border-white/20`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full text-white/90 border border-white/20">
                  {roleLabel}
                </span>
                <span className="text-xs font-medium text-white/80 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  {t('liveBackendData')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/95 mt-1">
                <strong>{title}</strong>
                {subtitle && <span className="font-normal"> — {subtitle}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('returnHome')}</span>
            </Link>
          </div>
        </div>

        {/* Active 4-Role System Indicator */}
        <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-white">{t('whoCanUseBadge')}:</span>
          {[
            { label: t('roleStudentTitle'), path: '/student' },
            { label: t('roleTeacherTitle'), path: '/teacher-dashboard' },
            { label: t('roleParentTitle'), path: '/parent-dashboard' },
            { label: t('roleAdminTitle'), path: '/super-admin-dashboard' },
          ].map((r) => (
            <span
              key={r.label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white font-semibold border border-white/30"
            >
              <CheckCircle2 className="w-3 h-3 text-white/80" />
              {r.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
