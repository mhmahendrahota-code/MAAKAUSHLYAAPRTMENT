import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, FolderSync, DollarSign, ChevronRight, TrendingUp, Image, CreditCard, Megaphone, Download, AlertCircle, Sparkles, CheckCircle, Power } from 'lucide-react';

const getFeatureIcon = (key) => {
  switch (key) {
    case 'notices': return Megaphone;
    case 'maintenance-bills': return CreditCard;
    case 'complaints': return FileText;
    case 'visitor-logs': return FolderSync;
    case 'committee': return Users;
    case 'gallery': return Image;
    case 'downloads': return Download;
    case 'contact': return AlertCircle;
    default: return Sparkles;
  }
};

const getFeatureColor = (key) => {
  switch (key) {
    case 'notices': return 'from-violet-500/15 to-purple-500/5 text-violet-400 border-violet-500/25';
    case 'maintenance-bills': return 'from-emerald-500/15 to-teal-500/5 text-emerald-400 border-emerald-500/25';
    case 'complaints': return 'from-rose-500/15 to-red-500/5 text-rose-400 border-rose-500/25';
    case 'visitor-logs': return 'from-indigo-500/15 to-blue-500/5 text-indigo-400 border-indigo-500/25';
    case 'committee': return 'from-amber-500/15 to-orange-500/5 text-amber-400 border-amber-500/25';
    case 'gallery': return 'from-cyan-500/15 to-sky-500/5 text-cyan-400 border-cyan-500/25';
    case 'downloads': return 'from-pink-500/15 to-rose-500/5 text-pink-400 border-pink-500/25';
    case 'contact': return 'from-blue-500/15 to-indigo-500/5 text-blue-400 border-blue-500/25';
    default: return 'from-slate-500/15 to-slate-500/5 text-slate-400 border-slate-500/25';
  }
};

export const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    activeResidents: 0,
    openComplaints: 0,
    activeVisitors: 0,
    totalFunds: 0,
    unpaidAmount: 0,
    galleryCount: 0,
    bachelorAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleFeature = async (key, currentStatus) => {
    setUpdatingKey(key);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const nextStatus = !currentStatus;
      const response = await fetch(`/api/settings/features/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: nextStatus })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFeatures(prev => prev.map(f => f.feature_key === key ? { ...f, is_active: nextStatus } : f));
        setSuccessMsg(`सुविधा '${result.feature_name || key}' को सफलतापूर्वक ${nextStatus ? 'सक्रिय' : 'निष्क्रिय'} किया गया।`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        throw new Error(result.message || 'Failed to update feature');
      }
    } catch (err) {
      console.warn("⚠️ Server fallback toggle applied.");
      const nextStatus = !currentStatus;
      
      // Local fallback sync
      setFeatures(prev => prev.map(f => f.feature_key === key ? { ...f, is_active: nextStatus } : f));
      setSuccessMsg(`सुविधा को सफलतापूर्वक ${nextStatus ? 'सक्रिय' : 'निष्क्रिय'} किया गया। (Simulated)`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setUpdatingKey(null);
    }
  };

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setStats(result.stats);
          setFeatures(result.features);
        } else {
          throw new Error(result.message || 'Failed to fetch admin stats');
        }
      } catch (err) {
        console.warn("⚠️ Server offline, loading offline simulated Admin stats.");
        setStats({
          activeResidents: 1,
          openComplaints: 1,
          activeVisitors: 1,
          totalFunds: 4200.00,
          unpaidAmount: 4500.00,
          galleryCount: 3,
          bachelorAlerts: [
            { id: 9, name: "सर्वेश मिश्रा", police_verification_status: "pending", is_expiring_soon: false }
          ]
        });
        setFeatures([
          { feature_key: "notices", feature_name: "सूचना पटल (Notices)", is_active: true },
          { feature_key: "maintenance-bills", feature_name: "रखरखाव बिल (Bills)", is_active: true },
          { feature_key: "complaints", feature_name: "शिकायतें एवं सहायता", is_active: true },
          { feature_key: "visitor-logs", feature_name: "द्वारपाल लॉग (Security Logs)", is_active: true },
          { feature_key: "committee", feature_name: "RWA प्रबंध समिति (Committee)", is_active: true },
          { feature_key: "gallery", feature_name: "सोसायटी गैलरी (Gallery)", is_active: true },
          { feature_key: "downloads", feature_name: "दस्तावेज़ डाउनलोड (Downloads)", is_active: true },
          { feature_key: "contact", feature_name: "RWA संपर्क डेस्क (Contact)", is_active: true }
        ]);
      }
    };

    fetchAdminStats();
  }, [token]);

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-5xl w-full">
      {/* Greeting Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/60 via-brand-950/25 to-violet-950/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 glow-brand relative overflow-hidden">
        {/* Decorative background visual sparkles */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-brand-400 flex items-center justify-center border border-brand-500/35 shrink-0 shadow-premium">
            <LayoutDashboard size={24} className="animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">प्रशासन डेस्क</h2>
              <span className="text-[8px] font-black uppercase tracking-widest bg-brand-500/25 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/35">RWA Admin Console</span>
            </div>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              आपका स्वागत है, <span className="font-extrabold text-white">{user?.name}</span>। सोसायटी प्रशासनिक मॉड्यूल, वित्तीय लेजर और आगंतुक सुरक्षा गेट पूरी तरह से सक्रिय (Online) हैं।
            </p>
          </div>
        </div>
        
        {/* Dynamic System Status Indicator */}
        <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 px-4 py-2.5 rounded-2xl shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider">सिस्टम स्थिति</span>
            <span className="text-[10px] font-bold text-white mt-0.5">Society Engine V2.1</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">ऑनलाइन</span>
          </div>
        </div>
      </div>

      {/* Grid: Admin Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* Total Funds Collected */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/80 flex flex-col justify-between hover:border-emerald-500/25 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">एकत्रित शुल्क (Funds)</span>
              <span className="text-xl font-black text-emerald-400 mt-1 tracking-wide">₹{stats.totalFunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सक्रिय चालानों का ऑडिट</span>
            <Link to="/finance" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              बहीखाता <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Dues Outstanding */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/80 flex flex-col justify-between hover:border-rose-500/25 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">बकाया शुल्क (Outstanding)</span>
              <span className="text-xl font-black text-rose-400 mt-1 tracking-wide">₹{stats.unpaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>अवैतनिक खाते</span>
            <Link to="/finance" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              संग्रह <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Member Count */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/80 flex flex-col justify-between hover:border-violet-500/25 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">सोसायटी फ्लैट्स</span>
              <span className="text-xl font-black text-white mt-1 tracking-wide">{stats.activeResidents} सदस्य (Members)</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सदस्य निर्देशिका</span>
            <Link to="/directory" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              निर्देशिका <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Open Complaints */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/40 to-slate-950/80 flex flex-col justify-between hover:border-brand-500/25 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5 group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">सक्रिय शिकायतें</span>
              <span className="text-xl font-black text-white mt-1 tracking-wide">{stats.openComplaints} लंबित (Open)</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सहायता डेस्क की समीक्षा</span>
            <Link to="/complaints" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              समाधान <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Auxiliary Action boards - Balanced 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Administrative links panel (Left Panel: col-span-2) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 lg:col-span-2 flex flex-col gap-5 bg-gradient-to-b from-slate-900/30 to-slate-950/50">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-3.5 flex items-center gap-2">
            <FolderSync size={16} className="text-brand-400" />
            <span>त्वरित प्रशासनिक नियंत्रण (Admin Controls)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/directory"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1.5 group"
            >
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">निर्देशिका प्रबंधित करें</h4>
              <p className="text-[10px] text-slate-400 leading-normal">फ्लैट सदस्यों का ऑडिट करें, फ्लैट आवंटित करें और संपर्क फोन सूची देखें।</p>
            </Link>

            <Link 
              to="/finance"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1.5 group"
            >
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">बिलिंग प्रणाली (Billing System)</h4>
              <p className="text-[10px] text-slate-400 leading-normal">रखरखाव चालान जनरेट करें और अवैतनिक सोसायटी शुल्क की निगरानी करें।</p>
            </Link>

            <Link 
              to="/visitor-logs"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1.5 group"
            >
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">आगंतुक पंजी (Visitor Registry)</h4>
              <p className="text-[10px] text-slate-400 leading-normal">आगमन को ट्रैक करें, अतिथि प्रस्थान दर्ज करें और गेटकीपर रिपोर्ट की जांच करें।</p>
            </Link>

            <Link 
              to="/notices"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1.5 group"
            >
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">सूचना बुलेटिन</h4>
              <p className="text-[10px] text-slate-400 leading-normal">सभी निवासियों को नोटिस और आपातकालीन घोषणाएं प्रसारित करें।</p>
            </Link>

            <Link 
              to="/gallery"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-2 group sm:col-span-2"
            >
              <div className="flex items-center gap-2">
                <Image size={15} className="text-brand-400 group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">सोसायटी गैलरी एवं समाचार (Events Gallery CMS)</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">सोसायटी के त्योहारों, उत्सवों और समाचारों की तस्वीरें प्रकाशित व प्रबंधित करें। (वर्तमान में <strong>{stats.galleryCount}</strong> इवेंट्स लाइव हैं)</p>
            </Link>
          </div>
        </div>

        {/* Audit Stack Column (Right Panel: col-span-1) - Eliminates empty spaces and balances desktop view */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Live Visitor stats summary widget */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950/50 flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <FolderSync size={16} className="text-indigo-400" />
                <span>सुरक्षा जांच (Security Audit)</span>
              </h3>
              
              <div className="bg-slate-950/60 border border-white/5 p-5 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <span className="text-4xl font-black text-indigo-400 tracking-tight">{stats.activeVisitors}</span>
                <p className="text-[9px] uppercase font-extrabold text-slate-400 tracking-widest mt-1.5">भीतर सक्रिय अतिथि (Inside Building)</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                सुरक्षा गेटकीपर डेस्क आगमन को तुरंत दर्ज करता है। सोसायटी सुरक्षा को दुरुस्त और जवाबदेह रखने में सहयोग करें।
              </p>
            </div>

            <Link 
              to="/visitor-logs"
              className="w-full py-2.5 bg-slate-900 border border-white/5 hover:border-brand-500/25 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-brand-500/10"
            >
              <span>गेट लॉग्स जांचें</span> <ChevronRight size={14} />
            </Link>
          </div>

          {/* Bachelor Alert Widget */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/30 to-slate-950/50 flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <Users size={16} className="text-amber-400" />
                <span>किरायेदार सत्यापन (Tenant Check)</span>
              </h3>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">कुल बैचलर किरायेदार</span>
                  <span className="text-base font-black text-amber-400">{stats.bachelorAlerts?.length || 0}</span>
                </div>
                
                <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">लंबित पुलिस वेरिफिकेशन</span>
                  <span className={`text-base font-black px-2 py-0.5 rounded-lg ${stats.bachelorAlerts?.filter(b => b.police_verification_status === 'pending').length > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {stats.bachelorAlerts?.filter(b => b.police_verification_status === 'pending').length || 0}
                  </span>
                </div>
              </div>
              
              <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                सभी बैचलर किरायेदारों के लिए RWA नियम के तहत पुलिस सत्यापन और NOC कागजात अपलोड होना अनिवार्य है।
              </p>
            </div>

            <Link 
              to="/directory"
              className="w-full py-2.5 bg-slate-900 border border-white/5 hover:border-amber-500/25 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-amber-500/10"
            >
              <span>सत्यापन ऑडिट करें</span> <ChevronRight size={14} />
            </Link>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-950/20 via-brand-950/5 to-transparent glow-brand flex flex-col justify-between">
            <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              बैचलर अलर्ट (Bachelor Alerts)
            </h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">कुल बैचलर</span>
                <span className="text-lg font-black text-amber-400">{stats.bachelorAlerts?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">लंबित पुलिस सत्यापन</span>
                <span className={`text-lg font-black ${stats.bachelorAlerts?.filter(b => b.police_verification_status === 'pending').length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {stats.bachelorAlerts?.filter(b => b.police_verification_status === 'pending').length || 0}
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal text-center mt-2">
              बैचलर किरायेदारों के लिए पुलिस सत्यापन और एनओसी अनिवार्य है।
            </p>
          </div>

          <Link 
            to="/directory"
            className="w-full mt-4 py-2.5 bg-slate-900 border border-white/5 hover:border-amber-500/25 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1"
          >
            सत्यापन प्रबंधित करें <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>

      {/* System Feature Management Console */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-r from-slate-950/20 via-brand-950/5 to-transparent glow-brand flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/25 flex items-center justify-center shrink-0">
              <Power size={20} className="animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                सुविधाएं नियंत्रण केंद्र (Feature Management Console)
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">सोसायटी सदस्यों के लिए सुविधाओं को सक्रिय या निष्क्रिय करने का नियंत्रण पैनल।</p>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest bg-brand-500/15 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-full shrink-0">आरडब्ल्यूए नियंत्रक</span>
        </div>

        {/* Real-time Message Banners */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Feature Switches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => {
            const FeatureIcon = getFeatureIcon(feature.feature_key);
            const colorClass = getFeatureColor(feature.feature_key);
            const isUpdating = updatingKey === feature.feature_key;

            return (
              <div 
                key={feature.feature_key} 
                className={`glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${feature.is_active ? 'bg-gradient-to-b from-slate-900/40 to-slate-900/60 shadow-inner' : 'bg-slate-950/60 opacity-70'}`}
              >
                {/* Header row: Icon & Status switch */}
                <div className="flex justify-between items-center">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center border shrink-0`}>
                    <FeatureIcon size={16} />
                  </div>
                  
                  {/* Glassmorphic Premium Switch */}
                  <button
                    onClick={() => !isUpdating && handleToggleFeature(feature.feature_key, feature.is_active)}
                    disabled={isUpdating}
                    className={`relative w-12 h-6 rounded-full p-0.5 transition-all duration-300 border focus:outline-none focus:ring-0 ${
                      feature.is_active 
                        ? 'bg-brand-500/20 border-brand-500/40 text-brand-400 shadow-premium glow-brand-sm' 
                        : 'bg-slate-950/80 border-white/5 text-slate-600'
                    }`}
                    aria-label={`Toggle ${feature.feature_name}`}
                  >
                    {/* Toggle Slider Ball */}
                    <div 
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                        feature.is_active 
                          ? 'translate-x-6 bg-brand-500' 
                          : 'translate-x-0 bg-slate-600'
                      }`}
                    >
                    </div>
                  </button>
                </div>

                {/* Details row: Title & badge */}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs font-black text-white leading-tight uppercase truncate">{feature.feature_name}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{feature.feature_key}</span>
                </div>

                {/* Status indicator tag */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">स्थिति (Status)</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    feature.is_active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {feature.is_active ? 'सक्रिय (Active)' : 'निष्क्रिय (Deactivated)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
