import { useAuthStore } from '../store/authStore';
import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Topbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
      <div className="flex items-center">
        {/* Breadcrumbs or Page Title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <button className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-full hover:bg-[var(--muted)] transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="h-6 w-px bg-[var(--border)] mx-1"></div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
