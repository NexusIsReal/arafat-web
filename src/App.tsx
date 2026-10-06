import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ClassPage from './pages/ClassPage';
import SubjectPage from './pages/SubjectPage';
import ChapterPage from './pages/ChapterPage';
import { QuizChapter, QuizWeekly } from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import { WeeklyExamList, Leaderboard } from './pages/WeeklyExamPage';
import ProgressPage from './pages/ProgressPage';
import ResultsPage from './pages/ResultsPage';
import NoticesPage from './pages/NoticesPage';
import TeacherPanel from './pages/TeacherPanel';
import AdminPanel from './pages/AdminPanel';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function StudentPages({ children }: { children: ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <>{children}</>;
  return <Navigate to={user.role === 'teacher' ? '/teacher' : '/admin'} replace />;
}

function DashboardGate() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <StudentDashboard />;
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/weekly" element={<WeeklyExamList />} />
            <Route path="/leaderboard/:examId" element={<Leaderboard />} />
            <Route path="/notices" element={<NoticesPage />} />

            <Route path="/dashboard" element={<DashboardGate />} />
            <Route path="/class/:classId" element={<RequireAuth><ClassPage /></RequireAuth>} />
            <Route path="/subject/:subjectId" element={<RequireAuth><SubjectPage /></RequireAuth>} />
            <Route path="/chapter/:chapterId" element={<RequireAuth><ChapterPage /></RequireAuth>} />
            <Route path="/quiz/chapter/:chapterId" element={<RequireAuth><QuizChapter /></RequireAuth>} />
            <Route path="/quiz/weekly/:examId" element={<RequireAuth><QuizWeekly /></RequireAuth>} />
            <Route path="/result/:resultId" element={<RequireAuth><ResultPage /></RequireAuth>} />
            <Route path="/results" element={<StudentPages><ResultsPage /></StudentPages>} />
            <Route path="/progress" element={<StudentPages><ProgressPage /></StudentPages>} />

            <Route path="/teacher" element={<RequireRole roles={['teacher', 'admin']}><TeacherPanel /></RequireRole>} />
            <Route path="/admin" element={<RequireRole roles={['admin']}><AdminPanel /></RequireRole>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
