import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, ShieldCheck, LogOut, LogIn, Menu, User, Crown } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 glow-brand">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        {user && onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden text-slate-300 hover:text-white p-1 hover:bg-white/5 rounded transition-all"
            aria-label="Toggle Menu"
          >
            <Menu size={22} />
          </button>
        )}
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-800 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-amber-400">
              <Crown size={18} className="animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent group-hover:from-yellow-100 group-hover:via-white group-hover:to-yellow-200 transition-all">
              माँ कौशल्या
            </span>
            <span className="text-[9px] text-amber-500/80 font-bold uppercase tracking-[0.18em] -mt-0.5">
              अपार्टमेंट (सेक्टर-1)
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {/* Public nav links, visible always or contextually */}
        <div className="hidden sm:flex items-center gap-6 animate-fadeIn">
          {!user && (
            <Link 
              to="/" 
              className={`text-sm font-medium transition-all ${isActive('/') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              मुख्य पृष्ठ
            </Link>
          )}
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-all ${isActive('/about') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            हमारे बारे में
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-all ${isActive('/contact') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            संपर्क करें
          </Link>
        </div>

        {/* Auth status or login button */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Profile Summary */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-white tracking-wide">{user.name}</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  user.role === 'Admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  user.role === 'Security' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {user.role === 'Admin' ? 'प्रशासक' : user.role === 'Security' ? 'सुरक्षा गार्ड' : 'निवासी'}
                </span>
                {user.flat_no && (
                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded border border-white/5">
                    फ्लैट {user.flat_no}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Portal Switcher */}
            <Link 
              to={user.role === 'Admin' ? '/admin' : user.role === 'Security' ? '/visitor-logs' : '/dashboard'} 
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-white/10 hover:bg-brand-600 hover:border-brand-500 transition-all flex items-center gap-2"
            >
              <ShieldCheck size={14} />
              पोर्टल डेस्क
            </Link>

            {/* Logout Trigger */}
            <button 
              onClick={handleLogoutClick}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all"
              title="लॉगआउट करें"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-premium hover:shadow-premium-hover transition-all flex items-center gap-2 border border-brand-500/25"
            >
              <LogIn size={14} />
              लॉगिन पोर्टल
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
