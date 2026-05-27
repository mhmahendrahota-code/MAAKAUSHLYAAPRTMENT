import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, ShieldCheck, LogOut, LogIn, Menu, User } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Settings states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError('');
    setSettingsSuccess('');
    try {
      const res = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail, password: newPassword || undefined })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSuccess("क्रेडेंशियल सफलतापूर्वक बदल दिए गए हैं! कृपया दोबारा लॉगिन करें।");
        setTimeout(() => {
          setShowSettingsModal(false);
          logout();
          navigate('/');
        }, 2000);
      } else {
        throw new Error(data.message || "अपडेट विफल");
      }
    } catch (err) {
      setSettingsError(err.message || "सर्वर कनेक्शन एरर");
    } finally {
      setSettingsLoading(false);
    }
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
          <img
            src="/logo.jpg"
            alt="माँ कौशल्या अपार्टमेंट लोगो"
            className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all duration-300 border-2 border-amber-500/40"
          />
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
            to="/gallery" 
            className={`text-sm font-medium transition-all ${isActive('/gallery') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            गैलरी एवं समाचार
          </Link>
          <Link 
            to="/downloads" 
            className={`text-sm font-medium transition-all ${isActive('/downloads') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            दस्तावेज़ डाउनलोड
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

            {/* Change Credentials Trigger */}
            <button 
              onClick={() => {
                setNewEmail(user.email || '');
                setNewPassword('');
                setSettingsError('');
                setSettingsSuccess('');
                setShowSettingsModal(true);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-brand-400 bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/20 transition-all"
              title="क्रेडेंशियल बदलें (Change UserID / Password)"
            >
              <User size={16} />
            </button>

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

      {/* Credentials Change Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 w-full max-w-sm flex flex-col gap-4 text-left relative animate-scaleIn">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              क्रेडेंशियल बदलें (Change Credentials)
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              यहाँ से आप अपना लॉगिन **ईमेल (UserID)** और **पासवर्ड** सुरक्षित रूप से बदल सकते हैं।
            </p>
            
            <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">लॉगिन ईमेल (New UserID)</label>
                <input 
                  type="email" 
                  required 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">नया पासवर्ड (New Password - Optional)</label>
                <input 
                  type="password" 
                  placeholder="बदलाव न करने के लिए खाली छोड़ें" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              {settingsError && <div className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1.5 rounded-xl">{settingsError}</div>}
              {settingsSuccess && <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl">{settingsSuccess}</div>}

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowSettingsModal(false); setSettingsError(''); setSettingsSuccess(''); }} 
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white uppercase transition-all"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  disabled={settingsLoading}
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-[10px] font-bold text-white uppercase transition-all shadow-premium"
                >
                  {settingsLoading ? 'सहेज रहे हैं...' : 'सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
