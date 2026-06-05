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
  Terminal,
  Database
} from 'lucide-react';
import { getRoleLabel } from '../utils/i18n';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [activeFlags, setActiveFlags] = React.useState({});

  React.useEffect(() => {
    const fetchFlags = async () => {
      if (user && user.role === 'Admin') return;
      try {
        const response = await fetch('/api/settings/features', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        let result;
        try { result = await response.json(); }
        catch (jsonErr) { console.warn('Failed to parse sidebar features JSON:', jsonErr); return; }
        if (response.ok && result.success) {
          const flagsMap = {};
          result.data.forEach(f => { flagsMap[f.feature_key] = f.is_active; });
          setActiveFlags(flagsMap);
        }
      } catch (err) {
        console.error('Failed to load features in sidebar:', err);
      }
    };
    if (user && token) fetchFlags();
  }, [user, token]);

  if (!user) return null;

  const pathToFeatureKey = {
    '/notices': 'notices',
    '/maintenance-bills': 'maintenance-bills',
    '/complaints': 'complaints',
    '/visitor-logs': 'visitor-logs',
    '/committee': 'committee',
    '/gallery': 'gallery',
    '/downloads': 'downloads',
    '/contact': 'contact',
    '/developer': 'developer'
  };

  // ── Uniform Nav Labels: हिंदी मुख्य (English) ────────────────────────────
  const SHARED_LINKS = [
    { to: '/notices',    label: 'सूचना पटल (Notices)',          icon: Megaphone   },
    { to: '/committee',  label: 'RWA प्रबंध समिति (Committee)', icon: Users       },
    { to: '/gallery',    label: 'सोसायटी गैलरी (Gallery)',      icon: Image       },
    { to: '/downloads',  label: 'दस्तावेज़ डाउनलोड (Downloads)', icon: Download    },
    { to: '/contact',    label: 'संपर्क केंद्र (Contact)',      icon: AlertCircle },
    { to: '/developer',  label: 'डेवलपर जानकारी (Developer)',    icon: Terminal    },
  ];

  const getNavLinks = () => {
    switch (user.role) {
      case 'Admin':
        return [
          { to: '/admin',             label: 'प्रशासन डेस्क (Admin)',        icon: LayoutDashboard },
          { to: '/admin/submissions', label: 'ऑनलाइन आवेदन (Forms)',         icon: FolderSync      },
          { to: '/directory',         label: 'सदस्य निर्देशिका (Directory)', icon: Users           },
          { to: '/visitor-logs',      label: 'आगंतुक लॉग (Visitor Log)',      icon: FolderSync      },
          { to: '/finance',           label: 'वित्तीय प्रबंधन (Finance)',     icon: DollarSign      },
          { to: '/admin/database',    label: 'डेटाबेस प्रबंधन (Database)',    icon: Database        },
          { to: '/admin/reports',     label: 'रिपोर्ट केंद्र (Reports)',      icon: FileText        },
          ...SHARED_LINKS,
        ];
      case 'Committee':
        return [
          { to: '/admin',             label: 'प्रशासन डेस्क (Admin)',        icon: LayoutDashboard },
          { to: '/admin/submissions', label: 'ऑनलाइन आवेदन (Forms)',         icon: FolderSync      },
          { to: '/directory',         label: 'सदस्य निर्देशिका (Directory)', icon: Users           },
          { to: '/visitor-logs',      label: 'आगंतुक लॉग (Visitor Log)',      icon: FolderSync      },
          { to: '/finance',           label: 'वित्तीय प्रबंधन (Finance)',     icon: DollarSign      },
          { to: '/admin/reports',     label: 'रिपोर्ट केंद्र (Reports)',      icon: FileText        },
          ...SHARED_LINKS,
        ];
      case 'Security':
        return [
          { to: '/visitor-logs', label: 'प्रवेश द्वार लॉग (Security Log)', icon: FolderSync },
          ...SHARED_LINKS,
        ];
      case 'Resident':
      default:
        return [
          { to: '/dashboard',         label: 'मेरा पोर्टल (Dashboard)',          icon: LayoutDashboard },
          { to: '/notices',           label: 'सूचना पटल (Notices)',              icon: Megaphone       },
          { to: '/maintenance-bills', label: 'रखरखाव शुल्क (Maintenance)',       icon: CreditCard      },
          { to: '/complaints',        label: 'शिकायत केंद्र (Complaints)',        icon: FileText        },
          { to: '/committee',         label: 'RWA प्रबंध समिति (Committee)',     icon: Users           },
          { to: '/gallery',           label: 'सोसायटी गैलरी (Gallery)',          icon: Image           },
          { to: '/downloads',         label: 'दस्तावेज़ डाउनलोड (Downloads)',     icon: Download        },
          { to: '/contact',           label: 'संपर्क केंद्र (Contact)',          icon: AlertCircle     },
          { to: '/developer',         label: 'डेवलपर जानकारी (Developer)',        icon: Terminal        },
        ];
    }
  };

  const navLinks = getNavLinks();

  const filteredNavLinks = navLinks.filter(link => {
    if (user.role === 'Admin') return true;
    const key = pathToFeatureKey[link.to];
    if (key && activeFlags[key] === false) return false;
    return true;
  });

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden transition-all duration-300"
        />
      )}

      <aside className={`
        fixed md:sticky top-[73px] left-0 z-30
        h-[calc(100vh-73px)] w-64 
        glass-panel border-r border-white/5 py-6 px-4
        flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white p-1"
          aria-label="मेनू बंद करें"
        >
          <X size={18} />
        </button>

        {/* Navigation list */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              नेविगेशन मेनू
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {filteredNavLinks.map((link) => {
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

        {/* Sidebar Footer — User Info */}
        <div className="glass-panel-light p-4 rounded-2xl flex flex-col gap-2 border border-white/5 mt-4 shrink-0">
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
            <span className="text-slate-500 font-medium">भूमिका (Role):</span>
            <span className="text-brand-400 font-bold uppercase tracking-wider">
              {getRoleLabel(user.role)}
            </span>
          </div>
          {user.flat_no && (
            <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2">
              <span className="text-slate-500 font-medium">आवंटित फ्लैट:</span>
              <span className="text-emerald-400 font-bold">{user.flat_no}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
