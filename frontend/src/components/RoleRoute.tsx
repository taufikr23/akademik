import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleRouteProps {
  roles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({ roles, children }: RoleRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return <>{children}</>;
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'ADMIN': return '/dashboard/admin';
    case 'GURU': return '/dashboard/guru';
    case 'SISWA': return '/dashboard/siswa';
    default: return '/login';
  }
}
