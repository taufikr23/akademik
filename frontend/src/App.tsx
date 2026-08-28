import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import RoleRoute, { getDashboardPath } from './components/RoleRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import AcademicYears from './pages/AcademicYears';
import Semesters from './pages/Semesters';
import Departments from './pages/Departments';
import Classes from './pages/Classes';
import TeacherList from './pages/teachers/TeacherList';
import Subjects from './pages/teachers/Subjects';
import TeacherAssignments from './pages/teachers/TeacherAssignments';
import HomeroomTeachers from './pages/teachers/HomeroomTeachers';
import Students from './pages/students/Students';
import Enrollments from './pages/students/Enrollments';
import Schedules from './pages/Schedules';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Events from './pages/Events';

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
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardRedirect />} />

            <Route path="dashboard/admin" element={
              <RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>
            } />
            <Route path="dashboard/guru" element={
              <RoleRoute roles={['GURU']}><TeacherDashboard /></RoleRoute>
            } />
            <Route path="dashboard/siswa" element={
              <RoleRoute roles={['SISWA']}><StudentDashboard /></RoleRoute>
            } />

            <Route path="academic/years" element={
              <RoleRoute roles={['ADMIN']}><AcademicYears /></RoleRoute>
            } />
            <Route path="academic/semesters" element={
              <RoleRoute roles={['ADMIN']}><Semesters /></RoleRoute>
            } />
            <Route path="academic/departments" element={
              <RoleRoute roles={['ADMIN']}><Departments /></RoleRoute>
            } />
            <Route path="academic/classes" element={
              <RoleRoute roles={['ADMIN']}><Classes /></RoleRoute>
            } />
            <Route path="teachers/list" element={
              <RoleRoute roles={['ADMIN']}><TeacherList /></RoleRoute>
            } />
            <Route path="teachers/subjects" element={
              <RoleRoute roles={['ADMIN']}><Subjects /></RoleRoute>
            } />
            <Route path="teachers/assignments" element={
              <RoleRoute roles={['ADMIN']}><TeacherAssignments /></RoleRoute>
            } />
            <Route path="teachers/homeroom" element={
              <RoleRoute roles={['ADMIN']}><HomeroomTeachers /></RoleRoute>
            } />
            <Route path="students/list" element={
              <RoleRoute roles={['ADMIN', 'GURU']}><Students /></RoleRoute>
            } />
            <Route path="students/enrollments" element={
              <RoleRoute roles={['ADMIN']}><Enrollments /></RoleRoute>
            } />
            <Route path="schedules" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Schedules /></RoleRoute>
            } />
            <Route path="attendance" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Attendance /></RoleRoute>
            } />
            <Route path="assignments" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Assignments /></RoleRoute>
            } />
            <Route path="grades" element={
              <RoleRoute roles={['ADMIN', 'GURU', 'SISWA']}><Grades /></RoleRoute>
            } />
            <Route path="events" element={
              <RoleRoute roles={['ADMIN', 'SISWA']}><Events /></RoleRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
