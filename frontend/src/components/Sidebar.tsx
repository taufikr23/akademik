import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuByRole } from '../config/menu';
import type { NavItem } from '../config/menu';
import { authService } from '../services/authService';
import {
  BookOpen, ChevronDown, ChevronRight, LogOut, Menu, X, UserCheck,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  GURU: 'Guru',
  SISWA: 'Siswa',
};

const roleColors: Record<string, string> = {
  ADMIN: 'bg-primary-600',
  GURU: 'bg-primary-700',
  SISWA: 'bg-primary-500',
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const navItems = useMemo(() => {
    if (!user?.role) return [];
    return getMenuByRole(user.role);
  }, [user?.role]);

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

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const fetchPending = async () => {
        try {
          const res = await authService.getPendingRegistrations();
          const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setPendingCount(list.length);
        } catch (e) {
          console.error(e);
        }
      };
      fetchPending();
      
      // Update setiap 30 detik
      const interval = setInterval(fetchPending, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.role, location.pathname]);

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
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 leading-tight">SIASEK</h1>
          <p className="text-[11px] text-slate-500 leading-tight">Sistem Informasi Akademik</p>
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
                    isGroupActive(item) ? 'bg-primary-900/50 text-primary-200' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className={isGroupActive(item) ? 'text-primary-300' : 'text-slate-500'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {openMenus.includes(item.path) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {openMenus.includes(item.path) && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-700 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(child.path)
                            ? 'bg-primary-900/50 text-primary-200 font-medium'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
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
                    ? 'bg-primary-900/50 text-primary-200'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <span className={isActive(item.path) ? 'text-primary-300' : 'text-slate-500'}>{item.icon}</span>
                  {item.path === '/admin/approvals' && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center border border-slate-900">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    </span>
                  )}
                </div>
                {item.label}
              </Link>
            )}
          </div>
        ))}
        
        {/* Logo Tut Wuri Handayani - Untuk Semua Role */}
        <div className="mt-8 mb-4 flex flex-col items-center justify-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
            alt="Tut Wuri Handayani" 
            className="w-[135px] h-[135px] drop-shadow-lg"
          />
        </div>
      </nav>

      <div className="border-t border-slate-700 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className={`w-8 h-8 ${roleColors[user?.role || '']} rounded-full flex items-center justify-center`}>
            <UserCheck size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-500 uppercase">{roleLabels[user?.role || ''] || user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 transition-colors"
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
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 shadow-md rounded-lg p-2 text-slate-200"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-slate-900 shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <aside className={`hidden lg:block fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700 z-40 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
