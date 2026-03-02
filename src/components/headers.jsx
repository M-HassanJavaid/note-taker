import React from 'react';
import { Plus, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import cn from '../utils/cn';

const Header = ({ onLogout }) => {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between",
      "bg-(--bg-primary)/80 backdrop-blur-md border-b border-slate-800/50"
    )}>
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <div className="p-1.5 sm:p-2 rounded-lg bg-(--accent)/10 text-(--accent) group-hover:bg-(--accent) group-hover:text-(--bg-primary) transition-all">
          <ShieldCheck size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-(--text-primary)">
          Secret <span className="text-(--accent) hidden xs:inline">Notes</span>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/create-note">
          <Button 
            className="bg-(--btn-primary) hover:shadow-lg hover:shadow-blue-500/20 px-3 sm:px-5 py-2 text-sm sm:text-base h-10 sm:h-12"
          >
            <Plus size={18} className="sm:mr-2" />
            <span className="hidden md:inline">Create Note</span>
          </Button>
        </Link>

        <Button 
          onClick={onLogout}
          className={cn(
            "bg-transparent border border-slate-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400",
            "px-3 sm:px-4 py-2 text-(--text-secondary) h-10 sm:h-12"
          )}
        >
          <LogOut size={18} className="sm:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;