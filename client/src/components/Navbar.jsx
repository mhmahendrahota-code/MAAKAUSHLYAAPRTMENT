import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, ShieldCheck, LogOut, LogIn, Menu, User, Eye, EyeOff, Lock, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onMenuClick }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Settings states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError('');
    setSettingsSuccess('');

    // Validations
    if (newPassword) {
      if (newPassword.length < 6) {
        setSettingsError("नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!");
        setSettingsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setSettingsError("नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं!");
        setSettingsLoading(false);
        return;
      }
    }

    if (!currentPassword) {
      setSettingsError("सुरक्षा कारणों से वर्तमान पासवर्ड डालना अनिवार्य है!");
      setSettingsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword || undefined,
          currentPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSuccess("क्रेडेंशियल सफलतापूर्वक बदल दिए गए हैं! कृपया नए विवरणों के साथ दोबारा लॉगिन करें।");
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
          <motion.img
            src="/logo.jpg"
            alt="माँ कौशल्या अपार्टमेंट लोगो"
            animate={{
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 15px rgba(245,158,11,0.3)",
                "0 0 25px rgba(245,158,11,0.7)",
                "0 0 15px rgba(245,158,11,0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.15,
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/40 cursor-pointer"
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
          <Link
            to="/developer"
            className={`text-sm font-medium transition-all ${isActive('/developer') ? 'text-brand-300 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            डेवलपर विवरण
          </Link>
        </div>

        {/* Auth status or login button */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Profile Summary */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-white tracking-wide">{user.name}</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${user.role === 'Admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    user.role === 'Committee' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      user.role === 'Security' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                  {user.role === 'Admin' ? 'प्रशासक' : user.role === 'Committee' ? 'समिति सदस्य' : user.role === 'Security' ? 'सुरक्षा गार्ड' : 'निवासी'}
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
              to={user.role === 'Admin' || user.role === 'Committee' ? '/admin' : user.role === 'Security' ? '/visitor-logs' : '/dashboard'}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-white/10 hover:bg-brand-600 hover:border-brand-500 transition-all flex items-center gap-2"
            >
              <ShieldCheck size={14} />
              पोर्टल डेस्क
            </Link>

            {/* Change Credentials Trigger */}
            <button
              onClick={() => {
                setNewEmail(user.email || '');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
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

      {/* Upgraded Credentials Change Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-6 rounded-3xl border border-white/10 w-full max-w-md flex flex-col gap-4 text-left relative shadow-premium"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                  <Lock size={15} />
                </div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  लॉगिन क्रेडेंशियल अपग्रेड पैनल
                </h3>
              </div>

              <div className="flex gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-slate-300 animate-fadeIn">
                <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 text-[10px] leading-normal">
                  <span className="font-bold text-amber-300">महत्वपूर्ण सुरक्षा सूचना:</span>
                  <span>अपना पासवर्ड या ईमेल बदलने के लिए वर्तमान पासवर्ड की आवश्यकता है। लॉगिन आईडी बदलने पर आपको अगली बार नई आईडी का उपयोग करना होगा।</span>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">लॉगिन ईमेल (New UserID) *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">वर्तमान पासवर्ड (Current Password) *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      placeholder="सत्यापन के लिए पुराना पासवर्ड दर्ज करें"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-950 border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">नया पासवर्ड (New Password - Optional)</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="बदलाव न करने के लिए खाली छोड़ें"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {newPassword && newPassword.length < 6 && (
                      <span className="text-[9px] text-rose-400 ml-1 mt-0.5">⚠️ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए</span>
                    )}
                  </div>

                  {newPassword && (
                    <div className="flex flex-col gap-1 animate-fadeIn">
                      <label className="text-[10px] font-bold uppercase text-slate-400">नए पासवर्ड की पुष्टि करें (Confirm New Password) *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required={!!newPassword}
                          placeholder="पुष्टि करने के लिए पुनः दर्ज करें"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`bg-slate-950 border rounded-xl pl-3 pr-10 py-2.5 text-slate-200 text-xs focus:outline-none transition-colors w-full ${confirmPassword
                              ? newPassword === confirmPassword
                                ? 'border-emerald-500/50 focus:border-emerald-500'
                                : 'border-rose-500/50 focus:border-rose-500'
                              : 'border-white/10 focus:border-brand-500'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <span className={`text-[9px] ml-1 mt-0.5 font-semibold flex items-center gap-1 ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                          {newPassword === confirmPassword ? (
                            <><Check size={11} /> पासवर्ड बिल्कुल मेल खाते हैं</>
                          ) : (
                            <>⚠️ पासवर्ड मेल नहीं खा रहे हैं</>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {settingsError && <div className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-1">{settingsError}</div>}
                {settingsSuccess && <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1">{settingsSuccess}</div>}

                <div className="flex gap-2.5 justify-end mt-3 border-t border-white/5 pt-3.5">
                  <button
                    type="button"
                    onClick={() => { setShowSettingsModal(false); setSettingsError(''); setSettingsSuccess(''); }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white uppercase transition-all"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={settingsLoading || (newPassword && newPassword !== confirmPassword)}
                    className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 disabled:opacity-50 border border-brand-500/20 rounded-xl text-[10px] font-bold text-white uppercase transition-all shadow-premium"
                  >
                    {settingsLoading ? 'सहेज रहे हैं...' : 'सुरक्षित करें'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
