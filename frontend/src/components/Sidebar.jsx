import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  FileText, 
  GraduationCap,
  Sparkles,
  User
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Programs', path: '/dashboard/programs', icon: BookOpen },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: Sparkles },
    { name: 'Applications', path: '/dashboard/applications', icon: FileText },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="w-64 bg-[var(--card)] border-r border-[var(--border)] h-screen fixed left-0 top-0 flex flex-col transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">StepAbroad</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' 
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--muted-foreground)]'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--muted-foreground)] truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
