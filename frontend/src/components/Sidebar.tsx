import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuByRole } from '../config/menu';
import type { NavItem } from '../config/menu';
import {
  BookOpen, ChevronDown, ChevronRight, LogOut, Menu, X, UserCheck,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  GURU: 'Guru',
  SISWA: 'Siswa',
};

const roleColors: Record<string, string> = {
  ADMIN: 'bg-blue-600',
  GURU: 'bg-emerald-600',
  SISWA: 'bg-violet-600',
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const navItems = useMemo(() => {
    if (!user?.role) return [];
    return getMenuByRole(user.role);
  }, [user?.role]);

  // Auto-expand parent menus based on current path
  useEffect(() => {
    const expanded: string[] = [];
    navItems.forEach((item) => {
      if (item.children && item.children.some((child) => location.pathname === child.path)) {
        expanded.push(item.path);
      }
    });
    if (expanded.length > 0) {
      setOpenMenus((prev) => [...new Set([...prev, ...expanded])]);
    }
  }, [location.pathname, navItems]);

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname + location.search === path;
  const isGroupActive = (item: NavItem) => {
    if (item.children) return item.children.some(c => isActive(c.path));
    return isActive(item.path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">SIASEK</h1>
          <p className="text-[11px] text-gray-400 leading-tight">Sistem Informasi Akademik</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map((item) => (
          <div key={item.path} className="mb-1">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isGroupActive(item) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={isGroupActive(item) ? 'text-primary-600' : 'text-gray-400'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {openMenus.includes(item.path) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {openMenus.includes(item.path) && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(child.path)
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive(item.path) ? 'text-primary-600' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className={`w-8 h-8 ${roleColors[user?.role || '']} rounded-full flex items-center justify-center`}>
            <UserCheck size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-400 uppercase">{roleLabels[user?.role || ''] || user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg p-2"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-white shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className={`hidden lg:block fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
