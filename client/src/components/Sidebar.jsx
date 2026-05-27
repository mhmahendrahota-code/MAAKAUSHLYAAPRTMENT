import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Megaphone, 
  CreditCard, 
  FileText, 
  Users, 
  FolderSync, 
  DollarSign, 
  User, 
  AlertCircle,
  Download,
  Image,
  X,
  Terminal
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Define sidebar menus based on RBAC user role
  const getNavLinks = () => {
    switch (user.role) {
      case 'Admin':
        return [
          { to: '/admin', label: 'प्रशासन डेस्क (Admin)', icon: LayoutDashboard },
          { to: '/directory', label: 'निवासी निर्देशिका (Directory)', icon: Users },
          { to: '/visitor-logs', label: 'आगंतुक ऑडिट (Visitor Logs)', icon: FolderSync },
          { to: '/finance', label: 'वित्तीय बहीखाता (Finance)', icon: DollarSign },
          { to: '/notices', label: 'रेसिडेंट वेलफेयर एसोसिएशन सूचना पटल', icon: Megaphone },
          { to: '/committee', label: 'RWA प्रबंध समिति (Committee)', icon: Users },
          { to: '/gallery', label: 'सोसायटी गैलरी (Gallery)', icon: Image },
          { to: '/downloads', label: 'दस्तावेज़ डाउनलोड (Downloads)', icon: Download },
          { to: '/contact', label: 'RWA संपर्क डेस्क (Contact)', icon: AlertCircle },
          { to: '/developer', label: 'डेवलपर विवरण (Developer)', icon: Terminal },
        ];
      case 'Security':
        return [
          { to: '/visitor-logs', label: 'द्वारपाल लॉग (Security Logs)', icon: FolderSync },
          { to: '/notices', label: 'सोसायटी सूचनाएं', icon: Megaphone },
          { to: '/committee', label: 'RWA प्रबंध समिति (Committee)', icon: Users },
          { to: '/gallery', label: 'सोसायटी गैलरी (Gallery)', icon: Image },
          { to: '/downloads', label: 'दस्तावेज़ डाउनलोड (Downloads)', icon: Download },
          { to: '/contact', label: 'RWA संपर्क डेस्क (Contact)', icon: AlertCircle },
          { to: '/developer', label: 'डेवलपर विवरण (Developer)', icon: Terminal },
        ];
      case 'Resident':
      default:
        return [
          { to: '/dashboard', label: 'निवासी पोर्टल (Dashboard)', icon: LayoutDashboard },
          { to: '/notices', label: 'सूचना पटल (Notices)', icon: Megaphone },
          { to: '/maintenance-bills', label: 'रखरखाव बिल (Bills)', icon: CreditCard },
          { to: '/complaints', label: 'शिकायतें एवं सहायता', icon: FileText },
          { to: '/committee', label: 'RWA प्रबंध समिति (Committee)', icon: Users },
          { to: '/gallery', label: 'सोसायटी गैलरी (Gallery)', icon: Image },
          { to: '/downloads', label: 'दस्तावेज़ डाउनलोड (Downloads)', icon: Download },
          { to: '/contact', label: 'RWA संपर्क डेस्क (Contact)', icon: AlertCircle },
          { to: '/developer', label: 'डेवलपर विवरण (Developer)', icon: Terminal },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop blur overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Panel container */}
      <aside className={`
        fixed md:sticky top-[73px] left-0 z-30
        h-[calc(100vh-73px)] w-64 
        glass-panel border-r border-white/5 py-6 px-4
        flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>

        {/* Navigation list */}
        <div className="flex flex-col gap-6">
          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              नेविगेशन मेनू
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-brand-600 to-amber-600 text-white shadow-premium' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer details */}
        <div className="glass-panel-light p-4 rounded-2xl flex flex-col gap-2 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <User size={16} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-white truncate">{user.name}</span>
              <span className="text-[9px] text-slate-400 font-medium truncate">{user.email}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2 mt-1">
            <span className="text-slate-500 font-medium">लॉग इन रोल:</span>
            <span className="text-brand-400 font-bold uppercase tracking-wider">
              {user.role === 'Admin' ? 'प्रशासक' : user.role === 'Security' ? 'सुरक्षा गार्ड' : 'निवासी'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
