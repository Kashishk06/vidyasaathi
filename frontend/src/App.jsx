import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { TeacherLayout } from './layouts/TeacherLayout';

// Teacher Feature Pages
import { TeacherOverviewPage } from './pages/teacher/TeacherOverviewPage';
import { ClassManagementPage } from './pages/teacher/ClassManagementPage';
import { ClassAnalyticsPage } from './pages/teacher/ClassAnalyticsPage';
import { AIQuestionGeneratorPage } from './pages/teacher/AIQuestionGeneratorPage';
import { ContentReviewQueuePage } from './pages/teacher/ContentReviewQueuePage';
import { AssignmentsTestsPage } from './pages/teacher/AssignmentsTestsPage';
import { AtRiskStudentsPage } from './pages/teacher/AtRiskStudentsPage';
import { LessonPlanAssistantPage } from './pages/teacher/LessonPlanAssistantPage';
import { ReportsExportsPage } from './pages/teacher/ReportsExportsPage';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { StudentHome } from './pages/StudentHome';
import { StudentStudyPlanPage } from './pages/StudentStudyPlanPage';
import { StudentDiagnosticPage } from './pages/StudentDiagnosticPage';
import { StudentRevisionPage } from './pages/StudentRevisionPage';
import { StudentClassroomPage } from './pages/StudentClassroomPage';
import { StudentAchievementsPage } from './pages/StudentAchievementsPage';
import { QuizPage } from './pages/QuizPage';
import { DoubtChat } from './pages/DoubtChat';
import { ProgressPage } from './pages/ProgressPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { QuestionReview } from './pages/QuestionReview';
import { SettingsPage } from './pages/SettingsPage';

// Approved Dashboards (4 Active Roles System)
import { ParentDashboard } from './pages/ParentDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { SchoolAdminDashboard } from './pages/SchoolAdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, getRoleHomeRoute } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const isSuperAdminAuthorized =
      requiredRole === 'super_admin' && (user?.role === 'super_admin' || user?.role === 'admin');
    const isRoleMatched = user?.role === requiredRole || isSuperAdminAuthorized;

    if (!isRoleMatched) {
      const redirectPath = getRoleHomeRoute ? getRoleHomeRoute(user?.role) : '/student';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

// Route helper for settings
const SettingsRoute = () => {
  const { user } = useAuth();
  if (user?.role === 'student') {
    return <Navigate to="/student/settings" replace />;
  }
  return <SettingsPage />;
};

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#E8DCC8] text-[#2A1E17]">
      <OfflineBanner />
      <Navbar />
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Student Dedicated Routes with Persistent Shared Sidebar */}
          <Route
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentHome />} />
            <Route path="/student/study-plan" element={<StudentStudyPlanPage />} />
            <Route path="/student/diagnostic" element={<StudentDiagnosticPage />} />
            <Route path="/student/revision" element={<StudentRevisionPage />} />
            <Route path="/student/classroom" element={<StudentClassroomPage />} />
            <Route path="/student/achievements" element={<StudentAchievementsPage />} />
            <Route path="/student/practice" element={<QuizPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/student/doubt" element={<DoubtChat />} />
            <Route path="/doubt" element={<DoubtChat />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/student/settings" element={<SettingsPage />} />
          </Route>

          {/* Teacher Dedicated Routes with Persistent Shared Sidebar (All 8 Features) */}
          <Route
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/teacher-dashboard" element={<TeacherOverviewPage />} />
            <Route path="/teacher-dashboard/classes" element={<ClassManagementPage />} />
            <Route path="/teacher-dashboard/analytics" element={<ClassAnalyticsPage />} />
            <Route path="/teacher-dashboard/question-generator" element={<AIQuestionGeneratorPage />} />
            <Route path="/teacher-dashboard/lesson-planner" element={<LessonPlanAssistantPage />} />
            <Route path="/teacher-dashboard/assignments" element={<AssignmentsTestsPage />} />
            <Route path="/teacher-dashboard/content-review" element={<ContentReviewQueuePage />} />
            <Route path="/teacher-dashboard/at-risk-students" element={<AtRiskStudentsPage />} />
            <Route path="/teacher-dashboard/reports" element={<ReportsExportsPage />} />
          </Route>

          {/* Teacher Backward Compatibility & Direct Aliases */}
          <Route path="/teacher" element={<Navigate to="/teacher-dashboard" replace />} />
          <Route path="/teacher/review" element={<Navigate to="/teacher-dashboard/content-review" replace />} />

          {/* Shared Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsRoute />
              </ProtectedRoute>
            }
          />

          {/* Parent / Guardian Dedicated Route (Protected) */}
          <Route
            path="/parent-dashboard"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/parent" element={<Navigate to="/parent-dashboard" replace />} />

          {/* Super Admin Dedicated Route (Protected) */}
          <Route
            path="/super-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/super-admin" element={<Navigate to="/super-admin-dashboard" replace />} />

          {/* School Admin / Principal Dashboard (accessible via super_admin) */}
          <Route
            path="/school-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/school-admin" element={<Navigate to="/school-admin-dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
