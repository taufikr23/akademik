import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import RoleRoute, { getDashboardPath } from './components/RoleRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Activate from './pages/Activate';
import PendingRegistrations from './pages/PendingRegistrations';

// Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Master Data
import AcademicYears from './pages/master/AcademicYears';
import Departments from './pages/master/Departments';
import Classes from './pages/master/Classes';
import Subjects from './pages/master/Subjects';

// User Management
import TeacherList from './pages/users/TeacherList';
import Students from './pages/users/Students';

// Assignments (Penugasan)
import TeacherAssignments from './pages/assignments/TeacherAssignments';

// Operational
import Schedules from './pages/operational/Schedules';
import Attendance from './pages/operational/Attendance';
import AssignmentPage from './pages/operational/Assignments';
import Grades from './pages/operational/Grades';

// Profile
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) return <Navigate to={getDashboardPath(user.role)} replace />;
  return <>{children}</>;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getDashboardPath(user.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardRedirect />} />

            {/* ==================== DASHBOARD ==================== */}
            <Route path="dashboard/admin" element={
              <RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>
            } />
            <Route path="dashboard/guru" element={
              <RoleRoute roles={['GURU']}><TeacherDashboard /></RoleRoute>
            } />
            <Route path="dashboard/siswa" element={
              <RoleRoute roles={['SISWA']}><StudentDashboard /></RoleRoute>
            } />
            
            {/* ==================== PROFIL ==================== */}
            <Route path="profile" element={
              <RoleRoute roles={['GURU', 'SISWA']}><Profile /></RoleRoute>
            } />

            {/* ==================== MASTER DATA ==================== */}
            <Route path="master/academic-years" element={
              <RoleRoute roles={['ADMIN']}><AcademicYears /></RoleRoute>
            } />
<Route path="master/departments" element={
              <RoleRoute roles={['ADMIN']}><Departments /></RoleRoute>
            } />
            <Route path="master/classes" element={
              <RoleRoute roles={['ADMIN']}><Classes /></RoleRoute>
            } />
            <Route path="master/subjects" element={
              <RoleRoute roles={['ADMIN']}><Subjects /></RoleRoute>
            } />

            {/* ==================== USER MANAGEMENT ==================== */}
            <Route path="users/teachers" element={
              <RoleRoute roles={['ADMIN']}><TeacherList /></RoleRoute>
            } />
            <Route path="users/students" element={
              <RoleRoute roles={['ADMIN', 'GURU']}><Students /></RoleRoute>
            } />

            {/* ==================== PENUGASAN ==================== */}
            <Route path="assignments/teacher-subjects" element={
              <RoleRoute roles={['ADMIN']}><TeacherAssignments /></RoleRoute>
            } />

            {/* ==================== APPROVALS ==================== */}
            <Route path="admin/approvals" element={
              <RoleRoute roles={["ADMIN"]}><PendingRegistrations /></RoleRoute>
            } />

            {/* ==================== OPERASIONAL ==================== */}
            <Route path="operational/schedules" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Schedules /></RoleRoute>
            } />
            <Route path="operational/attendance" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Attendance /></RoleRoute>
            } />
            <Route path="operational/assignments" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><AssignmentPage /></RoleRoute>
            } />
            <Route path="operational/grades" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Grades /></RoleRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
