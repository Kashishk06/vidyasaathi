import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  ShieldCheck,
  Cpu,
  Database,
  Users,
  DollarSign,
  Activity,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Download,
  RefreshCw,
  Terminal,
  FileSpreadsheet,
  Zap,
  Globe,
  Radio,
  Server,
  Layers,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { SampleDashboardHeader } from '../components/SampleDashboardHeader';
import { useLanguage } from '../context/LanguageContext';

export const SuperAdminDashboard = () => {
  const { t } = useLanguage();
  const [actionNotice, setActionNotice] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('health');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [roleEditMap, setRoleEditMap] = useState({});
  const [roleUpdateMsg, setRoleUpdateMsg] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await api.get('/auth/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/auth/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setRoleUpdateMsg(prev => ({ ...prev, [userId]: '✓ Updated' }));
      setTimeout(() => setRoleUpdateMsg(prev => { const n = { ...prev }; delete n[userId]; return n; }), 2500);
    } catch (err) {
      setRoleUpdateMsg(prev => ({ ...prev, [userId]: '✗ Failed' }));
      setTimeout(() => setRoleUpdateMsg(prev => { const n = { ...prev }; delete n[userId]; return n; }), 2500);
    }
  };

  // Mock Feature Flags State (Interactive Demo Toggles)
  const [flags, setFlags] = useState({
    spacedRepetition: true,
    vernacularTTS: true,
    lowBandwidthAutoDetect: true,
    vectorSearchBeta: false,
    parentSmsAlerts: false,
    offlineExamMode: true,
  });

  // Role Distribution — 4 approved roles only
  const roleDistribution = [
    { name: 'छात्र (Students)', count: 16800, fill: '#ea580c' },
    { name: 'शिक्षक (Teachers)', count: 720, fill: '#f59e0b' },
    { name: 'अभिभावक (Parents)', count: 680, fill: '#10b981' },
    { name: 'महा-प्रशासक (Super Admins)', count: 2, fill: '#0ea5e9' },
  ];

  // Mock AI Usage & Cost Data by Day
  const aiUsageData = [
    { day: 'सोम', tokens: 185000, cost: 3.7 },
    { day: 'मंगल', tokens: 210000, cost: 4.2 },
    { day: 'बुध', tokens: 195000, cost: 3.9 },
    { day: 'गुरु', tokens: 240000, cost: 4.8 },
    { day: 'शुक्र', tokens: 260000, cost: 5.2 },
    { day: 'शनि', tokens: 215000, cost: 4.3 },
    { day: 'रवि', tokens: 120000, cost: 2.4 },
  ];

  // Mock Audit Logs
  const auditLogs = [
    {
      id: 'LOG-9921',
      event: 'CONTENT_APPROVED',
      details: 'Question #VS-Q101 approved into production bank',
      user: 'reviewer@vidyasaathi.in',
      ip: '103.21.244.18 (Pune, IN)',
      status: 'SUCCESS',
      timestamp: '12 मिनट पहले'
    },
    {
      id: 'LOG-9920',
      event: 'AI_INFERENCE_FALLBACK',
      details: 'watsonx latency > 2.5s -> routed to MockProvider (Zero Downtime)',
      user: 'SYSTEM_ROUTER',
      ip: 'Internal Cluster',
      status: 'INFO',
      timestamp: '25 मिनट पहले'
    },
    {
      id: 'LOG-9919',
      event: 'AUTH_RATE_LIMIT_PREVENTED',
      details: 'Exceeded 5 failed login attempts on phone 9823019283',
      user: 'GATEWAY_GUARD',
      ip: '49.36.128.4 (Nashik, IN)',
      status: 'BLOCKED',
      timestamp: '1 घंटा पहले'
    },
    {
      id: 'LOG-9918',
      event: 'DATABASE_SNAPSHOT',
      details: 'Automated WAL checkpoint & backup verified (106 KB)',
      user: 'CRON_BACKUP',
      ip: '127.0.0.1:8000',
      status: 'SUCCESS',
      timestamp: '2 घंटे पहले'
    }
  ];

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const toggleFlag = (key, name) => {
    setFlags(prev => {
      const nextVal = !prev[key];
      handleAction(`फीचर फ्लैग '${name}' को ${nextVal ? 'सक्षम' : 'अक्षम'} किया गया`);
      return { ...prev, [key]: nextVal };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sample Header & Switcher */}
      <SampleDashboardHeader
        currentRole="super-admin"
        title={t('adminHeaderTitle')}
        subtitle={t('adminHeaderSub')}
      />

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionNotice}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-md">
            SAMPLE ACTION
          </span>
        </div>
      )}

      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-900">{t('roleAdminTitle')}</div>
            <div className="text-[10px] text-slate-500">99.98%</div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center gap-1.5 border border-orange-200 transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? t('close') : t('navAdmin')}</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className={`lg:col-span-1 space-y-4 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Admin Identity Card */}
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                {t('adminRootTitle')}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 99.98%
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {t('platformOwner')}
                </h3>
                <p className="text-[11px] text-slate-500">{t('rootAccessRoles')}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('totalRegisteredUsers')}:</span>
                <span className="font-bold text-slate-900">18,240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('systemLatency')}:</span>
                <span className="font-bold text-emerald-700">42ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('aiMonthlyTokens')}:</span>
                <span className="font-bold text-amber-800">1.42M</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
              {t('adminNavHeader')}
            </span>
            {[
              { id: 'health', label: t('adminTabHealth'), icon: Server, action: () => { document.getElementById('system-health-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('health'); } },
              { id: 'users', label: t('adminTabUsers'), icon: Users, action: () => { document.getElementById('user-management-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('users'); } },
              { id: 'roles', label: t('adminTabRoles'), icon: LayoutDashboard, action: () => { document.getElementById('role-distribution-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('roles'); } },
              { id: 'ai', label: t('adminTabAi'), icon: DollarSign, action: () => { document.getElementById('ai-usage-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('ai'); } },
              { id: 'flags', label: t('adminTabFlags'), icon: Sliders, action: () => { document.getElementById('feature-flags-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('flags'); } },
              { id: 'logs', label: t('adminTabLogs'), icon: Terminal, action: () => { document.getElementById('audit-logs-section')?.scrollIntoView({ behavior: 'smooth' }); setActiveNav('logs'); } },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 shrink-0 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Operations */}
          <div className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {t('quickOperations')}
            </span>
            <button
              onClick={() => handleAction('DB Snapshot Completed - Demo')}
              className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 btn-tactile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('createBackupSnapshot')}</span>
            </button>
            <button
              onClick={() => handleAction('Audit Log CSV - Demo')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('downloadAuditCsv')}</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="lg:col-span-3 space-y-6">

          {/* === LIVE USER MANAGEMENT SECTION === */}
          <div id="user-management-section" className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  उपयोगकर्ता एवं भूमिका प्रबंधन (User & Role Management)
                </h2>
                <p className="text-xs text-slate-500">केवल 4 अनुमोदित भूमिकाएँ असाइन की जा सकती हैं — Student, Teacher, Parent, Super Admin</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                LIVE DATA
              </span>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-7 h-7 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">कोई उपयोगकर्ता नहीं मिला।</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">नाम (Name)</th>
                      <th className="py-2.5 px-3">फ़ोन / ईमेल</th>
                      <th className="py-2.5 px-3">वर्तमान भूमिका</th>
                      <th className="py-2.5 px-3">भूमिका बदलें</th>
                      <th className="py-2.5 px-3 text-right">स्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">#{u.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900 max-w-[120px] truncate">{u.name || '—'}</td>
                        <td className="py-3 px-3 text-slate-600 text-[11px] font-mono max-w-[150px] truncate">{u.phone_or_email}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            u.role === 'super_admin' ? 'bg-orange-100 text-orange-800' :
                            u.role === 'teacher' ? 'bg-amber-100 text-amber-800' :
                            u.role === 'parent' ? 'bg-teal-100 text-teal-800' :
                            'bg-sky-100 text-sky-800'
                          }`}>{u.role}</span>
                        </td>
                        <td className="py-3 px-3">
                          {u.role !== 'super_admin' && (
                            <select
                              value={roleEditMap[u.id] || u.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setRoleEditMap(prev => ({ ...prev, [u.id]: newRole }));
                                handleRoleChange(u.id, newRole);
                              }}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-orange-400 focus:outline-none"
                            >
                              <option value="student">student</option>
                              <option value="teacher">teacher</option>
                              <option value="parent">parent</option>
                            </select>
                          )}
                          {u.role === 'super_admin' && (
                            <span className="text-[11px] text-slate-400 italic">protected</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {roleUpdateMsg[u.id] && (
                            <span className={`text-[11px] font-bold ${
                              roleUpdateMsg[u.id].startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'
                            }`}>{roleUpdateMsg[u.id]}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top 4 System Health KPI Cards */}
          <div id="system-health-section" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: System Health */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>सिस्टम स्थिति (Health)</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            99.98%
          </div>
          <div className="text-[11px] font-semibold text-slate-600">
            औसत लेटेंसी: 42ms • सभी नोड्स सक्रिय
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>कुल पंजीकृत उपयोगकर्ता</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{users.length > 0 ? users.length.toLocaleString() : '18,240+'}</div>
          <div className="text-[11px] font-semibold text-emerald-700">
            4 सक्रिय भूमिकाएँ (4 approved roles)
          </div>
        </div>

        {/* Card 3: AI Monthly Usage */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>AI अनुमानित मासिक लागत</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800">$34.50</div>
          <div className="text-[11px] font-semibold text-slate-600">
            1.42M टोकन • watsonx.ai Granite
          </div>
        </div>

        {/* Card 4: Security Status */}
        <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>सुरक्षा सतर्कता (Security)</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">0 अलर्ट</div>
          <div className="text-[11px] font-semibold text-emerald-700">
            JWT सुरक्षित • दर-सीमा सक्रिय
          </div>
        </div>
      </div>

      {/* Grid: Role Distribution & AI Cost Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Breakdown */}
        <div id="role-distribution-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                प्लेटफ़ॉर्म भूमिका वितरण (User Role Distribution)
              </h3>
              <p className="text-[11px] text-slate-500">4 सक्रिय भूमिकाओं का अनुपात (4 Active Roles)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              DEMO DATA
            </span>
          </div>

          <div className="space-y-3">
            {roleDistribution.map((role, idx) => {
              const total = 18240;
              const pct = ((role.count / total) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{role.name}</span>
                    <span className="text-slate-600">
                      {role.count.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: role.fill }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span>सक्रिय भूमिकाएँ: <strong>Student, Teacher, Parent, Super Admin</strong></span>
            <span className="text-[11px] text-emerald-700 font-bold">✓ 4 roles active</span>
          </div>
        </div>

        {/* AI Usage & Cost Analytics */}
        <div id="ai-usage-section" className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                AI टोकन उपयोग व लागत (watsonx.ai Token & Cost)
              </h3>
              <p className="text-[11px] text-slate-500">साप्ताहिक इनपुट/आउटपुट टोकन खपत</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              GRANITE-13B
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#fed7aa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val, name) => [
                    name === 'tokens' ? `${val.toLocaleString()} टोकन` : `$${val}`,
                    name === 'tokens' ? 'टोकन उपयोग' : 'लागत ($)'
                  ]}
                />
                <Bar dataKey="tokens" name="tokens" fill="#ea580c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 space-y-0.5">
              <span className="text-slate-500 text-[10px] font-bold">RAG संदेह समाधान</span>
              <div className="font-extrabold text-slate-900">54% उपयोग</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 space-y-0.5">
              <span className="text-slate-500 text-[10px] font-bold">देसी उदाहरण रचन</span>
              <div className="font-extrabold text-slate-900">32% उपयोग</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Flags Management (Interactive Demo Toggles) */}
      <div id="feature-flags-section" className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-orange-600" />
                प्लेटफ़ॉर्म फ़ीचर फ़्लैग्स (Feature Flags & Toggles)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                DEMO SWITCHES
              </span>
            </div>
            <p className="text-xs text-slate-500">
              सक्रिय सुविधाओं, एल्गॉरिदम संस्करणों और प्रयोगों का केंद्रीय नियंत्रण (डेमो नियंत्रण - वास्तविक सिस्टम प्रभावित नहीं होता)
            </p>
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            6 फ़्लैग्स कॉन्फ़िगर किए गए
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Flag 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">स्पैस्ड रिपीटीशन इंजन</div>
              <p className="text-[10px] text-slate-500">स्मार्ट पुनरावृत्ति अंतराल एल्गोरिदम</p>
            </div>
            <button
              onClick={() => toggleFlag('spacedRepetition', 'Spaced Repetition Engine')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.spacedRepetition ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.spacedRepetition ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Flag 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">मातृभाषा वॉइस TTS/STT</div>
              <p className="text-[10px] text-slate-500">Web Speech API बोलकर सुनाना</p>
            </div>
            <button
              onClick={() => toggleFlag('vernacularTTS', 'Vernacular Speech TTS')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.vernacularTTS ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.vernacularTTS ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Flag 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">2G कम डेटा ऑटो-डिटेक्ट</div>
              <p className="text-[10px] text-slate-500">नेटवर्क गति के आधार पर एनिमेशन बंद</p>
            </div>
            <button
              onClick={() => toggleFlag('lowBandwidthAutoDetect', 'Low Bandwidth Auto Detect')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.lowBandwidthAutoDetect ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.lowBandwidthAutoDetect ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Flag 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">वेक्टर एम्बेडिंग खोज (Beta)</div>
              <p className="text-[10px] text-slate-500">प्रयोगात्मक सिमेंटिक RAG रीट्राइवल</p>
            </div>
            <button
              onClick={() => toggleFlag('vectorSearchBeta', 'Vector Search Embeddings')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.vectorSearchBeta ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.vectorSearchBeta ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Flag 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">अभिभावक साप्ताहिक SMS</div>
              <p className="text-[10px] text-slate-500">फीचर फोन वाले माता-पिता को SMS</p>
            </div>
            <button
              onClick={() => toggleFlag('parentSmsAlerts', 'Parent Weekly SMS')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.parentSmsAlerts ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.parentSmsAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Flag 6 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">ऑफ़लाइन परीक्षा मोड</div>
              <p className="text-[10px] text-slate-500">PWA लोकल स्टोरेज में क्विज़ लॉक</p>
            </div>
            <button
              onClick={() => toggleFlag('offlineExamMode', 'Offline Exam Mode')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                flags.offlineExamMode ? 'bg-orange-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                flags.offlineExamMode ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* System Audit Logs Table */}
      <div id="audit-logs-section" className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-600" />
              सिस्टम ऑडिट लॉग (Security & System Audit Logs)
            </h3>
            <p className="text-[11px] text-slate-500">हाल के सुरक्षा, प्रमाणीकरण एवं सामग्री परिवर्तन इवेंट्स</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('ऑडिट लॉग CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई (Audit Log CSV - Demo)')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>ऑडिट लॉग CSV</span>
            </button>
            <button
              onClick={() => handleAction('डेटाबेस चेकपॉइंट एवं बैकअप स्नैपशॉट पूरा हुआ (DB Snapshot Completed - Demo)')}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 btn-tactile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>बैकअप स्नैपशॉट</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="py-2.5 px-3">लॉग आईडी</th>
                <th className="py-2.5 px-3">इवेंट नाम</th>
                <th className="py-2.5 px-3">विवरण</th>
                <th className="py-2.5 px-3">यूजर / सिस्टम</th>
                <th className="py-2.5 px-3">IP पता / स्थान</th>
                <th className="py-2.5 px-3">स्थिति</th>
                <th className="py-2.5 px-3 text-right">समय</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{log.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{log.event}</td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                  <td className="py-3 px-3 text-slate-700">{log.user}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">{log.ip}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'BLOCKED' ? 'bg-rose-100 text-rose-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
};

