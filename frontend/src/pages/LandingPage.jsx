import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen, ArrowRight, Play, Code2, Brain, Laptop, TrendingUp,
  Compass, Trophy, GraduationCap, Sparkles, Users, Star,
  CheckCircle2, Instagram, Linkedin, Youtube, Mail, ChevronDown,
  Shield, Lock, Eye, Database, BarChart3, Zap, Award, Clock,
  Globe, HeartHandshake, Lightbulb, Target, UserCheck, Settings2,
  MessageSquare, Phone, MapPin, Building2, Cpu, Activity, BookMarked
} from 'lucide-react';
import staircaseImg from '../assets/learning-staircase.png';
import magicBookImg from '../assets/magic-book.png';
import knowledgeTreeImg from '../assets/knowledge-tree.png';

export const LandingPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleDemoLogin = async (role) => {
    try {
      if (role === 'teacher') {
        await login('teacher@vidyasaathi.in', 'password123');
        navigate('/teacher-dashboard');
      } else if (role === 'parent') {
        await login('parent@vidyasaathi.in', 'password123');
        navigate('/parent-dashboard');
      } else if (role === 'super_admin') {
        await login('superadmin@vidyasaathi.in', 'password123');
        navigate('/super-admin-dashboard');
      } else {
        await login('aarav@vidyasaathi.in', 'password123');
        navigate('/student');
      }
    } catch (e) {
      navigate('/auth');
    }
  };

  const faqs = [
    { q: 'What is Vidyasathi?', a: 'Vidyasathi is an AI-powered personalized learning platform designed specifically for rural India students (Classes 6-10), using IBM watsonx.ai Granite models to deliver adaptive education in Hindi and English.' },
    { q: 'How does the AI tutor work?', a: 'Our AI tutor uses Retrieval-Augmented Generation (RAG) with NCERT curriculum data. It understands your learning gaps through diagnostic tests and generates personalized question sets, explanations, and study plans tailored to your pace.' },
    { q: 'Is registration required to try it?', a: 'You can explore our demo instantly using the demo login buttons on this page — no registration needed! Click Student Demo, Teacher Portal, Parent Demo, or Super Admin to explore each dashboard.' },
    { q: 'Is the platform free for students?', a: 'Yes! Vidyasathi is designed as an affordable and accessible platform for rural students. Our core features including AI tutoring, practice questions, and progress tracking are available at no cost.' },
    { q: 'Which subjects and classes are covered?', a: 'We cover NCERT curriculum for Classes 6-10, including Mathematics, Science, Social Studies, Hindi, and English. Content is contextualized with village farming and everyday rural life examples.' },
    { q: 'Does it work on slow internet (2G/3G)?', a: 'Absolutely! Vidyasathi is optimized for low-bandwidth connections. We have a Low-Bandwidth Mode that disables heavy animations, ensuring students with 2G/3G connections can still access all features smoothly.' },
    { q: "How can parents track their child's progress?", a: "Parents have a dedicated Parent Dashboard where they can view their child's daily learning activity, quiz scores, weak topics, XP badges earned, and get AI-generated recommendations for home support." },
  ];

  const statItems = [
    { number: '10,000+', label: 'Active Students', Icon: Users },
    { number: '500+', label: 'Villages Reached', Icon: MapPin },
    { number: '95%', label: 'Accuracy Rate', Icon: Target },
    { number: '200+', label: 'NCERT Modules', Icon: BookOpen },
    { number: '4.8 Star', label: 'Student Rating', Icon: Star },
    { number: '24/7', label: 'AI Availability', Icon: Clock },
  ];

  const featureItems = [
    { Icon: Brain, color: 'bg-purple-50 text-purple-600', title: 'AI-Powered Tutor', desc: 'IBM Granite LLM answers questions in Hindi and English with step-by-step explanations using relatable rural examples.' },
    { Icon: Activity, color: 'bg-blue-50 text-blue-600', title: 'Adaptive Diagnostics', desc: 'Smart diagnostic tests identify knowledge gaps and auto-generate personalized study plans for each student.' },
    { Icon: Zap, color: 'bg-amber-50 text-amber-600', title: 'Spaced Repetition', desc: 'Smart review queue resurfaces weak concepts at optimal intervals for maximum long-term retention.' },
    { Icon: BarChart3, color: 'bg-green-50 text-green-600', title: 'Progress Analytics', desc: 'Real-time dashboards for students, teachers, and parents with detailed performance insights and reports.' },
    { Icon: BookMarked, color: 'bg-red-50 text-red-500', title: 'NCERT-Aligned Content', desc: '200+ modules covering Class 6-10 Mathematics, Science, Social Studies, Hindi, and English.' },
    { Icon: Globe, color: 'bg-teal-50 text-teal-600', title: 'Low-Bandwidth Mode', desc: 'Optimized for 2G/3G connections with progressive content loading, offline caching, and data-saving mode.' },
  ];

  const howItWorksItems = [
    { step: '01', Icon: BookOpen, color: 'text-[#9C411D]', bg: 'bg-[#FCEFE3]', title: 'Take Diagnostic Test', desc: 'Answer a short adaptive quiz. Our AI maps your exact knowledge gaps across subjects.' },
    { step: '02', Icon: Compass, color: 'text-[#C5832B]', bg: 'bg-[#FDF1E2]', title: 'Get Personalized Plan', desc: 'A custom study plan is generated with daily goals, weak topic focus, and practice schedule.' },
    { step: '03', Icon: MessageSquare, color: 'text-[#2C4A5E]', bg: 'bg-[#E8F0F7]', title: 'Learn with AI Tutor', desc: 'Chat with your AI tutor in Hindi or English. Get explanations, examples, and instant doubt resolution.' },
    { step: '04', Icon: Trophy, color: 'text-[#D4AF37]', bg: 'bg-[#FEFCE8]', title: 'Practice and Grow', desc: 'Adaptive quizzes, XP badges, and spaced revision ensure you truly master every topic.' },
  ];

  const demoRoles = [
    { role: 'Student Dashboard', roleKey: 'student', desc: 'AI Tutor | Diagnostic Tests | Practice Arena | Study Plan | XP Badges | Progress Charts', Icon: GraduationCap, bg: 'bg-[#FCEFE3]', accent: 'text-[#9C411D]', border: 'border-[#E8DAC2]', badge: 'Student' },
    { role: 'Teacher Portal', roleKey: 'teacher', desc: 'Class Management | AI Question Generator | Analytics | Lesson Plans | At-Risk Alerts', Icon: BookOpen, bg: 'bg-[#EFF7ED]', accent: 'text-[#2E7D32]', border: 'border-[#CADACD]', badge: 'Teacher' },
    { role: 'Parent Dashboard', roleKey: 'parent', desc: 'Child Progress Tracking | Daily Activity | Weak Topics | Teacher Messages | Insights', Icon: HeartHandshake, bg: 'bg-[#F8EAE4]', accent: 'text-[#8C3A24]', border: 'border-[#DFCBB5]', badge: 'Parent' },
    { role: 'Super Admin', roleKey: 'super_admin', desc: 'Platform Analytics | User Management | AI Monitoring | Feature Flags | Security Audit', Icon: Settings2, bg: 'bg-[#FDF1E2]', accent: 'text-[#78350F]', border: 'border-[#DFCBB5]', badge: 'Admin' },
  ];

  const benefitItems = [
    { Icon: Clock, title: 'Saves Time', desc: 'AI instantly explains concepts — no waiting for a tutor appointment.', color: 'text-[#9C411D] bg-[#FCEFE3]' },
    { Icon: Award, title: 'Boosts Confidence', desc: 'Adaptive difficulty ensures students always feel challenged but never overwhelmed.', color: 'text-[#C5832B] bg-[#FDF1E2]' },
    { Icon: TrendingUp, title: 'Improves Results', desc: 'Personalized study plans target weak areas, leading to measurable score improvement.', color: 'text-[#2E7D32] bg-[#EFF7ED]' },
    { Icon: Globe, title: 'Accessible Anywhere', desc: 'Works on any device, any internet speed — from smartphones to feature phones.', color: 'text-[#2C4A5E] bg-[#E8F0F7]' },
    { Icon: HeartHandshake, title: 'Parent Peace of Mind', desc: "Parents get daily progress reports and can track their child's learning without tech expertise.", color: 'text-[#8C3A24] bg-[#F8EAE4]' },
    { Icon: Zap, title: 'Better Decisions', desc: 'Teachers get AI-powered insights to identify struggling students before they fall behind.', color: 'text-[#78350F] bg-[#FEF3C7]' },
  ];

  const userRoles = [
    {
      title: 'Student',
      hindi: 'Vidyarthi',
      motto: 'Small Steps... Big Dreams',
      Icon: GraduationCap,
      plaqueGradient: 'from-[#3A2215] via-[#2A1810] to-[#1E0F0A]',
      plaqueBorder: 'border-[#C5832B]/80',
      roleKey: 'student',
      features: [
        { title: 'AI Tutor Chat (Hindi/English)', desc: 'Get instant help, anytime.', Icon: Brain },
        { title: 'Diagnostic Tests', desc: 'Know your strengths & areas to improve.', Icon: Activity },
        { title: 'Adaptive Practice Arena', desc: 'Practice at your level, grow at your pace.', Icon: Target },
        { title: 'Personal Study Plan', desc: 'Your goals. Our guidance.', Icon: Compass },
        { title: 'XP Points and Badges', desc: 'Learn more. Earn more.', Icon: Trophy },
        { title: 'Doubt Submission', desc: 'Ask. Get clear. Move forward.', Icon: Sparkles },
      ],
    },
    {
      title: 'Teacher',
      hindi: 'Shikshak',
      motto: 'Inspiring Minds... Lighting Paths',
      Icon: BookOpen,
      plaqueGradient: 'from-[#2B2818] via-[#211A0E] to-[#171207]',
      plaqueBorder: 'border-[#C5832B]/80',
      roleKey: 'teacher',
      features: [
        { title: 'Class & Student Management', desc: 'Monitor individual student mastery.', Icon: Users },
        { title: 'AI Question Generator', desc: 'Create NCERT quizzes in seconds.', Icon: Sparkles },
        { title: 'Lesson Plan Assistant', desc: 'Contextualized bilingual teaching aids.', Icon: BookMarked },
        { title: 'At-Risk Student Alerts', desc: 'Early alerts to help struggling learners.', Icon: Activity },
        { title: 'Content Review Queue', desc: 'Review & approve AI generated lessons.', Icon: CheckCircle2 },
        { title: 'Performance Analytics', desc: 'Real-time classroom accuracy reports.', Icon: BarChart3 },
      ],
    },
    {
      title: 'Parent / Guardian',
      hindi: 'Abhibhavak',
      motto: 'Guiding Hands... Constant Support',
      Icon: HeartHandshake,
      plaqueGradient: 'from-[#3D211A] via-[#2B1611] to-[#1E0D09]',
      plaqueBorder: 'border-[#C5832B]/80',
      roleKey: 'parent',
      features: [
        { title: 'Child Progress Tracking', desc: 'View daily learning minutes & topics.', Icon: TrendingUp },
        { title: 'Daily Activity Reports', desc: 'Transparent view of practice & scores.', Icon: Clock },
        { title: 'Weak Topic Insights', desc: 'Know where your child needs extra care.', Icon: Target },
        { title: 'Teacher Communication', desc: 'Stay connected with school mentors.', Icon: MessageSquare },
        { title: 'Home Guidance Tips', desc: 'Simple ways to support learning at home.', Icon: Lightbulb },
        { title: 'Achievement Alerts', desc: 'Celebrate every milestone & badge.', Icon: Trophy },
      ],
    },
    {
      title: 'Super Admin',
      hindi: 'Maha-Prashashak',
      motto: 'Platform Trust... Scaled Impact',
      Icon: Shield,
      plaqueGradient: 'from-[#2C241E] via-[#201812] to-[#140F0A]',
      plaqueBorder: 'border-[#C5832B]/80',
      roleKey: 'super_admin',
      features: [
        { title: 'Platform-Wide Analytics', desc: 'Track adoption across 500+ villages.', Icon: BarChart3 },
        { title: 'User & NGO Governance', desc: 'Manage access for schools & partners.', Icon: Users },
        { title: 'AI & Token Telemetry', desc: 'Monitor IBM watsonx.ai usage & cost.', Icon: Cpu },
        { title: 'Feature Flag Control', desc: 'Toggle low-bandwidth & offline modes.', Icon: Settings2 },
        { title: 'Security Audit Logs', desc: 'Enterprise JWT & tamper-proof records.', Icon: Lock },
        { title: 'System Health Status', desc: '24/7 uptime & service reliability.', Icon: Zap },
      ],
    },
  ];

  const courseItems = [
    { Icon: Code2, bg: 'bg-[#FCEFE3]', color: 'text-[#B85728]', title: 'Mathematics and Logic', desc: 'Rational numbers, equations and geometry with local rural examples.', cta: 'Start Learning' },
    { Icon: Brain, bg: 'bg-[#EFF7ED]', color: 'text-[#2E7D32]', title: 'Science and Inquiry', desc: 'Crop production, light reflection and force mysteries explored.', cta: 'Explore Now' },
    { Icon: Laptop, bg: 'bg-[#F6EFE6]', color: 'text-[#6E4F39]', title: 'Adaptive Practice', desc: 'Difficulty auto-adjusts based on each student performance.', cta: 'Practice Now' },
    { Icon: TrendingUp, bg: 'bg-[#FDF1E2]', color: 'text-[#C5832B]', title: 'Smart Retention', desc: 'Spaced repetition queue for lasting understanding of weak topics.', cta: 'View Progress' },
  ];

  const securityItems = [
    { Icon: Shield, title: 'JWT Authentication', desc: 'Secure token-based authentication with refresh tokens and automatic session management for all users.' },
    { Icon: Lock, title: 'Role-Based Access Control', desc: 'Strict RBAC ensures students, teachers, parents, and admins only access features relevant to their role.' },
    { Icon: Eye, title: 'Privacy by Design', desc: "Student data is never sold or shared. All personal information is protected under strict privacy guidelines." },
    { Icon: Database, title: 'Encrypted Data Storage', desc: 'All sensitive data is encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3.' },
    { Icon: Activity, title: 'Security Audit Logs', desc: 'Every login, permission change, and admin action is logged for complete accountability and auditability.' },
    { Icon: UserCheck, title: 'Student Safety', desc: 'Content moderation and age-appropriate filtering ensures a safe learning environment for underage students.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#E8DCC8] text-[#2A1810]">

      {/* SECTION 1: HERO */}
      <section id="home" className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#EEE4CF] via-[#E8DCC8] to-[#E0D2B8]">
        <div className="absolute top-0 right-1/4 -z-10 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#6E4F39]">LEARN • GROW • ACHIEVE</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EFE3CF] text-[#6E4F39] border border-[#DFCBB5]">SDG 4</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] font-bold text-[#2A1810] tracking-tight leading-[1.12]">
              Every Great <br />Journey Begins With <br />
              <span className="text-[#C5832B] font-serif italic">Vidyasathi</span>
            </h1>
            <p className="text-base sm:text-lg text-[#554032] font-normal leading-relaxed max-w-xl">
              At Vidyasathi, we believe that every question leads to a bigger dream. Explore our AI-powered curriculum, build real skills, and take the next step towards a brighter future with rural India's personalized AI tutor.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button onClick={() => handleDemoLogin('student')} className="px-7 py-3 rounded-full bg-[#341B10] hover:bg-[#201008] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all btn-tactile cursor-pointer">
                <span>विद्यार्थी डेमो (Student Demo)</span><ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
              <button onClick={() => handleDemoLogin('teacher')} className="px-6 py-3 rounded-full bg-[#FFFBF3] hover:bg-[#F5ECD8] text-[#341B10] border border-[#DFCBB5] font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all btn-tactile cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-[#341B10] text-white flex items-center justify-center"><Play className="w-2.5 h-2.5 fill-white translate-x-0.5" /></div>
                <span>शिक्षक पोर्टल (Teacher Portal)</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6E4F39]">
              <span className="font-semibold text-[#8C6D15]">अन्य डेमो लॉगिन:</span>
              <button onClick={() => handleDemoLogin('parent')} className="px-3 py-1 rounded-full bg-[#F5ECE0] hover:bg-[#EADBCA] text-[#341B10] border border-[#DFCBB5] font-semibold transition-colors cursor-pointer">अभिभावक (Parent)</button>
              <button onClick={() => handleDemoLogin('super_admin')} className="px-3 py-1 rounded-full bg-[#F5ECE0] hover:bg-[#EADBCA] text-[#341B10] border border-[#DFCBB5] font-semibold transition-colors cursor-pointer">महा-प्रशासक (Super Admin)</button>
            </div>
            <div className="pt-4 flex items-center gap-6 sm:gap-10 border-t border-[#DFCBB5]/60 text-left">
              <div><div className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810]">10K+</div><div className="text-xs text-[#7B6252] font-medium mt-0.5">Active Learners</div></div>
              <div className="w-px h-10 bg-[#DFCBB5]/80" />
              <div><div className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810]">200+</div><div className="text-xs text-[#7B6252] font-medium mt-0.5">Expert Modules</div></div>
              <div className="w-px h-10 bg-[#DFCBB5]/80" />
              <div><div className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810]">4.8/5</div><div className="text-xs text-[#7B6252] font-medium mt-0.5">Student Rating</div></div>
            </div>
          </div>
          <div className="lg:col-span-5 relative flex items-center justify-center py-6 lg:py-0">
            <div className="absolute top-2 right-0 sm:right-4 z-20 pointer-events-none transform rotate-12" style={{ animation: 'heroNoteSway 4s ease-in-out infinite alternate' }}>
              <span className="font-serif italic text-base sm:text-xl text-[#6E4F39] drop-shadow-sm font-semibold tracking-wide">Small Steps... <br /><span className="text-[#B87333]">Big Dreams</span></span>
            </div>
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(197,131,43,0.18) 0%, rgba(239,215,163,0.10) 55%, transparent 80%)', animation: 'heroPulse 3.5s ease-in-out infinite alternate' }} />
            <div className="absolute top-10 left-6 w-2.5 h-2.5 rounded-full bg-amber-400/70 pointer-events-none" style={{ animation: 'sparkleFloat 2.8s ease-in-out infinite alternate' }} />
            <div className="absolute bottom-16 left-8 w-2 h-2 rounded-full bg-orange-300/60 pointer-events-none" style={{ animation: 'sparkleFloat 3.5s ease-in-out infinite alternate-reverse' }} />
            <div className="absolute top-1/3 right-2 w-3 h-3 rounded-full bg-yellow-300/50 pointer-events-none" style={{ animation: 'sparkleFloat 2.2s ease-in-out infinite alternate' }} />
            <div className="absolute bottom-8 right-10 w-1.5 h-1.5 rounded-full bg-amber-500/60 pointer-events-none" style={{ animation: 'sparkleFloat 4s ease-in-out infinite alternate-reverse' }} />
            <div className="relative w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px] flex flex-col items-center justify-center">
              <div className="hero-float-wrapper w-full flex items-center justify-center">
                <img
                  src={staircaseImg}
                  alt="Students ascending the staircase of books from curiosity to wisdom and success"
                  className="hero-image w-full h-auto object-contain keep-color select-none"
                  style={{ filter: 'drop-shadow(0 22px 42px rgba(90,50,20,0.28)) drop-shadow(0 4px 16px rgba(197,131,43,0.28))' }}
                  loading="eager"
                />
              </div>
              <div
                className="w-4/5 h-6 mt-1 rounded-[50%] pointer-events-none hero-ground-shadow"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(42,24,16,0.5) 0%, rgba(42,24,16,0.18) 50%, transparent 75%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS */}
      <section id="stats" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#341B10] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C5832B 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8B4513 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto relative">
          <p className="text-center text-xs font-bold tracking-[0.25em] uppercase text-amber-300 mb-8">Our Impact in Numbers</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {statItems.map(({ number, label, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-amber-400/20 flex items-center justify-center transition-colors"><Icon className="w-5 h-5 text-amber-300" /></div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">{number}</div>
                <div className="text-xs text-amber-200/80 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT / BRIDGING THE EDUCATION GAP */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          
          {/* Left Column: Heading and Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#6E4F39]">ABOUT THE PROJECT</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#EFE3CF] text-[#6E4F39] border border-[#DFCBB5]">
                UN SDG 4 • QUALITY EDUCATION
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1810] tracking-tight leading-[1.18]">
              Bridging the Education Gap <br />
              <span className="text-[#C5832B] font-serif italic">for Rural India</span>
            </h2>

            <div className="flex items-center gap-2 py-0.5">
              <span className="h-[2px] w-12 bg-gradient-to-r from-[#C5832B] to-transparent rounded-full" />
              <span className="text-[#C5832B] text-xs">✦</span>
              <span className="h-[2px] w-24 bg-gradient-to-r from-[#C5832B]/60 to-transparent rounded-full" />
            </div>

            <p className="text-sm sm:text-base text-[#554032] leading-relaxed">
              Vidyasathi is an AI-powered educational platform built under <strong>UN SDG 4 (Quality &amp; Inclusive Education)</strong>, designed to solve a critical problem: rural students in India lack access to personalized, affordable, and curriculum-aligned learning support.
            </p>

            <p className="text-sm sm:text-base text-[#554032] leading-relaxed">
              Powered by <strong>IBM watsonx.ai Granite models</strong> and a custom RAG pipeline on NCERT textbooks, Vidyasathi acts as a 24/7 AI tutor that speaks to students in their language, using farming, agriculture, and everyday village life examples they deeply relate to.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'NCERT-Aligned Curriculum (Class 6-10)',
                'Bilingual — Hindi & English',
                'Adaptive Learning & Spaced Review',
                'Works on 2G/3G Low-Bandwidth',
                'Parent & Teacher Live Portals',
                'IBM watsonx.ai Enterprise Granite',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#2A1810] font-medium bg-[#FFFDF8]/70 px-3 py-2 rounded-xl border border-[#EAE0D0]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5832B] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Glowing Magic Book Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-6 lg:py-0">
            
            {/* Ambient Golden Radial Aura */}
            <div
              className="absolute -inset-4 sm:-inset-8 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(212,175,55,0.32) 0%, rgba(197,131,43,0.18) 45%, rgba(245,230,195,0.08) 70%, transparent 80%)',
                animation: 'bookAuraPulse 4s ease-in-out infinite alternate',
              }}
            />

            {/* Floating Sparkle Embers */}
            <div className="absolute -top-4 right-8 text-amber-500 font-serif text-sm pointer-events-none" style={{ animation: 'bookSparkleDrift 3.2s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-1/4 -left-3 text-[#C5832B] font-serif text-xs pointer-events-none" style={{ animation: 'bookSparkleDrift 4s ease-in-out infinite alternate-reverse' }}>✦</div>
            <div className="absolute bottom-16 right-4 text-amber-400 font-serif text-base pointer-events-none" style={{ animation: 'bookSparkleDrift 2.8s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-2 left-10 text-orange-400 font-serif text-[10px] pointer-events-none" style={{ animation: 'bookSparkleDrift 3.6s ease-in-out infinite alternate-reverse' }}>✦</div>

            {/* Floating Book Container with Dynamic Movement */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] flex flex-col items-center">
              
              {/* Floating Levitation Wrapper */}
              <div className="magic-book-floating w-full flex items-center justify-center">
                <img
                  src={magicBookImg}
                  alt="Illuminated ancient open book radiating golden knowledge"
                  className="magic-book-img w-full h-auto object-contain cursor-pointer select-none"
                  style={{
                    filter: 'drop-shadow(0 20px 32px rgba(42, 24, 16, 0.42)) drop-shadow(0 8px 18px rgba(197, 131, 43, 0.48)) drop-shadow(0 0 28px rgba(230, 198, 135, 0.4))',
                  }}
                  loading="eager"
                />
              </div>

              {/* Dynamic Ground Contact Shadow (expands/contracts with float) */}
              <div
                className="w-3/4 h-5 mt-2 rounded-[50%] pointer-events-none magic-ground-shadow"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(42,24,16,0.5) 0%, rgba(42,24,16,0.18) 50%, transparent 75%)',
                }}
              />

              {/* Decorative Tagline Plaque below Book */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EB] border border-[#DFCBB5] shadow-xs">
                <span className="text-[#C5832B] text-xs">✦</span>
                <span className="font-serif italic text-xs font-semibold text-[#6E4F39] tracking-wide">
                  ज्ञानं परमं बलम् • Knowledge is the Ultimate Strength
                </span>
                <span className="text-[#C5832B] text-xs">✦</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3 Context Cards: Problem, Solution, Technology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              Icon: Target,
              bg: 'bg-[#FCEFE3]',
              color: 'text-[#9C411D]',
              badge: 'The Challenge',
              title: 'The Education Divide',
              desc: '65% of rural Indian students lack access to personalized tutoring. Existing platforms are urban-focused, English-only, and costly.',
            },
            {
              Icon: Lightbulb,
              bg: 'bg-[#EFF7ED]',
              color: 'text-[#2E7D32]',
              badge: 'The Innovation',
              title: 'Contextual AI Tutor',
              desc: 'Bilingual AI tutor trained on NCERT that speaks in Hindi and English, explaining complex ideas using relatable farming & village examples.',
            },
            {
              Icon: Cpu,
              bg: 'bg-[#FDF1E2]',
              color: 'text-[#C5832B]',
              badge: 'The Foundation',
              title: 'watsonx.ai Architecture',
              desc: 'IBM watsonx.ai Granite LLMs + FastAPI + PostgreSQL (Neon) with adaptive diagnostics and low-bandwidth progressive loading.',
            },
          ].map(({ Icon, bg, color, badge, title, desc }) => (
            <div
              key={title}
              className="brown-animated-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${bg} ${color}`}>
                    {badge}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1810] mb-2">{title}</h4>
                <p className="text-xs text-[#6B5749] leading-relaxed">{desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DFCBB5]/50 flex items-center justify-between text-[11px] font-semibold text-[#8B6E53]">
                <span>Learn how it works</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5832B] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#E0D2B8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E4F39]">PLATFORM FEATURES</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1810]">Everything You Need to Learn Better</h2>
            <p className="text-sm text-[#554032] max-w-xl mx-auto leading-relaxed">Six powerful features designed to transform how rural students experience education.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureItems.map(({ Icon, color, title, desc }) => (
              <div key={title} className="brown-animated-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}><Icon className="w-6 h-6" /></div>
                <h3 className="font-serif text-base font-bold text-[#2A1810] mb-2">{title}</h3>
                <p className="text-xs text-[#6B5749] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E4F39]">HOW IT WORKS</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1810]">From Curiosity to Confidence</h2>
          <p className="text-sm text-[#554032] max-w-lg mx-auto leading-relaxed">Four simple steps to start your personalized learning journey.</p>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#DFCBB5] via-[#C5832B] to-[#DFCBB5] z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {howItWorksItems.map(({ step, Icon, color, bg, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center space-y-3 group">
                <div className={`relative w-20 h-20 rounded-full border-2 border-[#DFCBB5] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 ${bg}`}>
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#341B10] text-white text-[10px] font-bold flex items-center justify-center">{step}</span>
                </div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#2A1810]">{title}</h4>
                <p className="text-[11px] sm:text-xs text-[#6B5749] max-w-[180px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: PRODUCT PREVIEW */}
      <section id="demo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#E8DCC8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E4F39]">PRODUCT PREVIEW</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1810]">See Vidyasathi in Action</h2>
            <p className="text-sm text-[#554032] max-w-lg mx-auto">Explore each role's dashboard with our interactive demo — no signup required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {demoRoles.map(({ role, roleKey, desc, Icon, bg, accent, border, badge }) => (
              <div key={role} className="brown-animated-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${bg} ${accent}`}><Icon className="w-6 h-6" /></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 ${accent}`}>{badge}</span>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2A1810] mb-1.5">{role}</h3>
                  <p className="text-[11px] text-[#6B5749] leading-relaxed">{desc}</p>
                </div>
                <button onClick={() => handleDemoLogin(roleKey)} className={`mt-auto flex items-center gap-1.5 text-xs font-semibold hover:gap-3 transition-all cursor-pointer ${accent}`}>Try Live Demo <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7: BENEFITS / MORE THAN JUST AN EDUCATION PLATFORM */}
      <section id="benefits" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute top-1/3 right-1/4 -z-10 w-[600px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Showcase: Narrative on Left, Tree of Knowledge on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
          
          {/* Left Column: Heading, Story & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#6E4F39]">WHY CHOOSE VIDYASATHI</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#EFE3CF] text-[#6E4F39] border border-[#DFCBB5]">
                HOLISTIC IMPACT
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1810] tracking-tight leading-[1.18]">
              More Than Just <br />
              <span className="text-[#C5832B] font-serif italic">an Education Platform</span>
            </h2>

            <div className="flex items-center gap-2 py-0.5">
              <span className="h-[2px] w-12 bg-gradient-to-r from-[#C5832B] to-transparent rounded-full" />
              <span className="text-[#C5832B] text-xs">✦</span>
              <span className="h-[2px] w-24 bg-gradient-to-r from-[#C5832B]/60 to-transparent rounded-full" />
            </div>

            <p className="text-base sm:text-lg text-[#554032] leading-relaxed max-w-xl">
              Features tell you what a product does. Benefits tell you what it unlocks for you. Vidyasathi is an ecosystem where rural curiosity blossoms into lifelong capability, bridging classroom learning with real-world empowerment.
            </p>

            <div className="p-4 rounded-2xl bg-[#FFFDF8]/80 border border-[#E8DAC2] space-y-2 max-w-xl shadow-xs">
              <div className="text-xs font-serif font-bold text-[#2A1810] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5832B]" />
                <span>The Tree of Continuous Knowledge</span>
              </div>
              <p className="text-xs text-[#6B5749] leading-relaxed">
                Like a tree rooted in strong foundations, every concept mastered on Vidyasathi branches into critical thinking, scientific inquiry, and independent problem-solving for rural India's youth.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#341B10] hover:bg-[#201008] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg btn-tactile cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </Link>
              <button
                onClick={() => handleDemoLogin('student')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF5EB] hover:bg-[#F3E7D3] text-[#341B10] border border-[#DFCBB5] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Explore Live Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Floating Tree of Knowledge Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-6 lg:py-0">
            
            {/* Ambient Golden Radial Aura */}
            <div
              className="absolute -inset-4 sm:-inset-8 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 60%, rgba(212,175,55,0.35) 0%, rgba(197,131,43,0.18) 45%, rgba(245,230,195,0.08) 70%, transparent 80%)',
                animation: 'treeAuraPulse 4.5s ease-in-out infinite alternate',
              }}
            />

            {/* Floating Sparkles around Canopy */}
            <div className="absolute top-2 right-12 text-amber-500 font-serif text-sm pointer-events-none" style={{ animation: 'bookSparkleDrift 3.5s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-1/4 -left-2 text-[#C5832B] font-serif text-xs pointer-events-none" style={{ animation: 'bookSparkleDrift 4.2s ease-in-out infinite alternate-reverse' }}>✦</div>
            <div className="absolute top-8 left-14 text-orange-400 font-serif text-[11px] pointer-events-none" style={{ animation: 'bookSparkleDrift 2.9s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-1/3 right-4 text-amber-400 font-serif text-base pointer-events-none" style={{ animation: 'bookSparkleDrift 3.8s ease-in-out infinite alternate-reverse' }}>✦</div>

            {/* Floating Tree Container with Dynamic Motion */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] flex flex-col items-center">
              
              {/* Floating Levitation Wrapper */}
              <div className="knowledge-tree-floating w-full flex items-center justify-center">
                <img
                  src={knowledgeTreeImg}
                  alt="Tree of Knowledge blooming from open book with symbols of science, math, and wisdom"
                  className="knowledge-tree-img w-full h-auto max-h-[460px] object-contain cursor-pointer select-none"
                  style={{
                    filter: 'drop-shadow(0 20px 35px rgba(42, 24, 16, 0.42)) drop-shadow(0 8px 20px rgba(197, 131, 43, 0.45)) drop-shadow(0 0 30px rgba(230, 198, 135, 0.35))',
                  }}
                  loading="eager"
                />
              </div>

              {/* Dynamic Ground Contact Shadow beneath Book Base */}
              <div
                className="w-4/5 h-5 mt-1 rounded-[50%] pointer-events-none tree-ground-shadow"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(42,24,16,0.5) 0%, rgba(42,24,16,0.2) 50%, transparent 75%)',
                }}
              />

              {/* Decorative Tagline Plaque below Tree */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EB] border border-[#DFCBB5] shadow-xs">
                <span className="text-[#C5832B] text-xs">✦</span>
                <span className="font-serif italic text-xs font-semibold text-[#6E4F39] tracking-wide">
                  विद्या ददाति विनयं • Knowledge Bestows Humility &amp; Growth
                </span>
                <span className="text-[#C5832B] text-xs">✦</span>
              </div>
            </div>

          </div>

        </div>

        {/* 6 Benefit Cards in a 3-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefitItems.map(({ Icon, title, desc, color }) => (
            <div
              key={title}
              className="brown-animated-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#2A1810] mb-1">
                  {title}
                </h4>
                <p className="text-xs text-[#6B5749] leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: TARGET AUDIENCE / WHO CAN USE THIS */}
      <section id="roles" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#E2D4BD] relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2A1810 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#6E4F39]">TARGET AUDIENCE &amp; ECOSYSTEM</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1810] tracking-tight">
              Who Can Use Vidyasathi?
            </h2>
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto py-1">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5832B]" />
              <span className="text-[#C5832B] text-xs">✦</span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5832B]" />
            </div>
            <p className="text-sm sm:text-base text-[#554032] max-w-2xl mx-auto leading-relaxed">
              Tailored learning and governance ecosystems for students, educators, parents, and administrators — crafted with care for rural empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {userRoles.map(({ title, hindi, motto, Icon, plaqueGradient, plaqueBorder, roleKey, features }) => (
              <div
                key={title}
                className="group relative bg-[#FAF5EB] rounded-3xl p-2 border-2 border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(42,24,16,0.12)] hover:shadow-[0_20px_45px_rgba(42,24,16,0.22)] transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                {/* Inner decorative frame with notched vintage corners */}
                <div className="border border-[#DFCBB5] rounded-[22px] bg-[#FAF5EB] p-4 sm:p-5 flex flex-col h-full relative overflow-hidden">
                  
                  {/* Subtle corner flourish accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5832B]/50 rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C5832B]/50 rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C5832B]/50 rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5832B]/50 rounded-br-sm pointer-events-none" />

                  {/* Brand Header */}
                  <div className="flex items-center justify-center gap-1.5 text-center mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5832B]" />
                    <span className="font-serif text-[11px] font-bold text-[#2A1810] tracking-wider uppercase">Vidyasathi</span>
                    <span className="text-[10px] text-[#A07855]">•</span>
                    <span className="text-[10px] text-[#7A624E] italic font-serif">Learn • Grow • Achieve</span>
                  </div>

                  {/* Leather Scroll Plaque */}
                  <div className={`relative rounded-2xl bg-gradient-to-br ${plaqueGradient} border-2 ${plaqueBorder} p-4 text-center shadow-md mb-2 overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-bl from-[#C5832B]/20 to-transparent rounded-full pointer-events-none" />
                    
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/10 border border-[#C5832B]/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#F3D28E]" />
                    </div>
                    
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF9EE] tracking-tight">{title}</h3>
                    <p className="font-serif text-xs sm:text-sm text-[#E6C687] font-medium tracking-wide mt-0.5">{hindi}</p>
                    
                    {/* Filigree ornamental divider */}
                    <div className="flex items-center justify-center gap-2 mt-2 opacity-80">
                      <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C5832B]" />
                      <span className="text-[#E6C687] text-[10px]">✦</span>
                      <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C5832B]" />
                    </div>
                  </div>

                  {/* Motto / Script Tagline */}
                  <div className="text-center py-1 mb-2">
                    <span className="font-serif italic text-xs font-semibold text-[#8B5A2B] tracking-wide">
                      "{motto}"
                    </span>
                  </div>

                  {/* Feature List on Parchment Panel */}
                  <div className="rounded-xl bg-[#FFFDF8]/90 border border-[#E8DAC2] p-3.5 space-y-2 flex-1 shadow-inner flex flex-col justify-between">
                    {features.map((item, idx) => {
                      const ItemIcon = item.Icon;
                      return (
                        <div key={item.title}>
                          <div className="flex items-start gap-2.5 text-left py-0.5">
                            {/* Ornate Circular Golden Medallion */}
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#E2B168] via-[#C5832B] to-[#7A431D] p-[1.5px] shadow-xs flex-shrink-0 flex items-center justify-center group-hover:rotate-6 transition-transform">
                              <div className="w-full h-full rounded-full bg-[#2A1810] flex items-center justify-center">
                                <ItemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F3D28E]" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-serif text-xs font-bold text-[#2A1810] leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[10px] sm:text-[11px] text-[#7A624E] leading-tight mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          {idx < features.length - 1 && (
                            <div className="flex items-center gap-1.5 py-1 opacity-50">
                              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#DFCBB5] to-transparent" />
                              <span className="text-[#C5832B] text-[7px]">✦</span>
                              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#DFCBB5] to-transparent" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Action Button with Filigree Ornaments */}
                  <div className="mt-4 pt-1 flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-[#C5832B] text-sm select-none opacity-80 font-serif">❧</span>
                    <button
                      onClick={() => handleDemoLogin(roleKey)}
                      className="flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#3D2314] via-[#2A1810] to-[#3D2314] hover:from-[#201008] hover:to-[#201008] border border-[#C5832B]/80 text-[#FFF9EE] font-serif text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer group"
                    >
                      <span>Try {title} Demo</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E6C687] group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[#C5832B] text-sm select-none opacity-80 font-serif">☙</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: POPULAR COURSES */}
      <section id="courses" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E4F39]">POPULAR COURSES</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1810] tracking-tight leading-snug">Learn Today, <br />Build Tomorrow</h2>
            <p className="text-sm text-[#554032] leading-relaxed">From foundational NCERT concepts to adaptive problem solving, our modules help rural students grow at their own pace.</p>
            <Link to="/student/practice" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#341B10] hover:bg-[#201008] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs">View All Modules <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {courseItems.map(({ Icon, bg, color, title, desc, cta }) => (
              <div key={title} className="brown-animated-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${bg} ${color}`}><Icon className="w-5 h-5" /></div>
                  <h3 className="font-serif text-base font-bold text-[#2A1810]">{title}</h3>
                  <p className="text-xs text-[#6B5749] mt-2 leading-relaxed">{desc}</p>
                </div>
                <div className="text-[#341B10] text-sm font-bold flex items-center gap-1 pt-2"><span>{cta}</span><ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: SECURITY & TRUST */}
      <section id="security" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#2A1810] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, #C5832B 0%, transparent 40%), radial-gradient(circle at 90% 50%, #8B4513 0%, transparent 40%)' }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400">SECURITY &amp; TRUST</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Your Data is Safe with Us</h2>
            <p className="text-sm text-amber-100/70 max-w-lg mx-auto">We implement enterprise-grade security measures to protect every student, teacher, and parent on our platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {securityItems.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 p-5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400/30 transition-colors"><Icon className="w-5 h-5" /></div>
                <div><h4 className="font-serif text-sm font-bold text-white mb-1">{title}</h4><p className="text-xs text-amber-100/60 leading-relaxed">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E4F39]">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1810]">Got Questions? We Have Answers.</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#FFFBF3] rounded-2xl border border-[#EFE5D5] overflow-hidden shadow-sm">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-serif text-sm sm:text-base font-bold text-[#2A1810] hover:bg-[#FAF3E8] transition-colors cursor-pointer">
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#C5832B] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-sm text-[#554032] leading-relaxed border-t border-[#EFE5D5] pt-4">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 12: FINAL CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#341B10] via-[#4A2410] to-[#341B10] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C5832B 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto space-y-5 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-px bg-[#C5832B]/50" /><Sparkles className="w-5 h-5 text-amber-400" /><div className="w-12 h-px bg-[#C5832B]/50" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">Ready to Start Your <br /><span className="text-amber-400">Learning Journey?</span></h2>
          <p className="text-sm sm:text-base text-amber-100/70 max-w-lg mx-auto">Join thousands of rural students already transforming their education with Vidyasathi's AI-powered platform.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link to="/auth" className="px-8 py-3.5 rounded-full bg-[#C5832B] hover:bg-[#D4921F] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"><span>Get Started Free</span><ArrowRight className="w-4 h-4" /></Link>
            <button onClick={() => handleDemoLogin('student')} className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"><Play className="w-4 h-4" /><span>Try Live Demo</span></button>
            <a href="mailto:hello@vidyasathi.in" className="px-8 py-3.5 rounded-full border border-amber-400/40 hover:border-amber-400/70 text-amber-300 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"><Mail className="w-4 h-4" /><span>Contact Us</span></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A0D06] text-[#EAE0D2] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#342419]">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C5832B] text-white flex items-center justify-center"><BookOpen className="w-5 h-5" /></div>
                <div><span className="font-serif text-lg font-bold text-white block">Vidyasathi</span><span className="text-[10px] text-[#A69382]">Learn • Grow • Achieve</span></div>
              </div>
              <p className="text-[#A69382] leading-relaxed text-[11px]">AI-powered personalized education for rural India. Powered by IBM watsonx.ai.</p>
              <div className="flex items-center gap-3 pt-1">
                {[Instagram, Linkedin, Youtube, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#C5832B]/30 text-[#D5C6B5] hover:text-white flex items-center justify-center transition-all"><Icon className="w-3.5 h-3.5" /></a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-serif font-bold text-white mb-3">Quick Links</h5>
              <ul className="space-y-2 text-[#A69382]">
                {[['Home', '#home'], ['About', '#about'], ['Features', '#features'], ['How It Works', '#how-it-works'], ['Live Demo', '#demo']].map(([label, href]) => (
                  <li key={label}><a href={href} className="hover:text-[#C5832B] transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-serif font-bold text-white mb-3">Platform</h5>
              <ul className="space-y-2 text-[#A69382]">
                {[['Student Portal', '/student'], ['Teacher Portal', '/teacher-dashboard'], ['Parent Dashboard', '/parent-dashboard'], ['Super Admin', '/super-admin-dashboard'], ['Privacy Policy', '#'], ['Terms & Conditions', '#']].map(([label, href]) => (
                  <li key={label}><Link to={href} className="hover:text-[#C5832B] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-serif font-bold text-white mb-3">Contact Us</h5>
              <ul className="space-y-3 text-[#A69382]">
                <li className="flex items-start gap-2"><Mail className="w-3.5 h-3.5 mt-0.5 text-[#C5832B] flex-shrink-0" /><span>hello@vidyasathi.in</span></li>
                <li className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 mt-0.5 text-[#C5832B] flex-shrink-0" /><span>+91 98765 43210</span></li>
                <li className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 text-[#C5832B] flex-shrink-0" /><span>IBM Innovation Hub, Bangalore, India</span></li>
                <li className="flex items-start gap-2"><Building2 className="w-3.5 h-3.5 mt-0.5 text-[#C5832B] flex-shrink-0" /><span>Powered by IBM watsonx.ai</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#6B5749] text-[11px]">
            <span>© 2025 Vidyasathi. All rights reserved.</span>
            <span className="text-center">United Nations SDG 4: Quality &amp; Inclusive Education</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#C5832B] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#C5832B] transition-colors">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
