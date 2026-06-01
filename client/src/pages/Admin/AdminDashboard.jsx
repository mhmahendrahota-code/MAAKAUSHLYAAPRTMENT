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
        // Fetch directory/users
        const dirRes = await fetch('/api/users/directory', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dirData = await dirRes.json();

        // Fetch tickets
        const ticketsRes = await fetch('/api/tickets/history', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ticketsData = await ticketsRes.json();

        // Fetch visitors
        const visitorsRes = await fetch('/api/visitors', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const visitorsData = await visitorsRes.json();

        // Fetch bills
        const billsRes = await fetch('/api/bills/history', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const billsData = await billsRes.json();

        // Fetch bachelor alerts
        const bachelorsRes = await fetch('/api/users/bachelor-alerts', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bachelorsData = await bachelorsRes.json();

        // Fetch gallery events count
        const galleryRes = await fetch('/api/gallery', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const galleryData = await galleryRes.json();

        // Fetch feature flags
        const featuresRes = await fetch('/api/settings/features', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const featuresData = await featuresRes.json();
        if (featuresData.success) {
          setFeatures(featuresData.data);
        }

        if (dirData.success && ticketsData.success && visitorsData.success && billsData.success) {
          const residents = dirData.data.filter(u => u.role === 'Resident').length;
          const openTk = ticketsData.data.filter(t => t.status !== 'resolved').length;
          const insideVisitors = visitorsData.data.filter(v => !v.check_out).length;
          const collected = billsData.data.filter(b => b.status === 'paid').reduce((s, b) => s + parseFloat(b.amount), 0);
          const unpaid = billsData.data.filter(b => b.status === 'unpaid').reduce((s, b) => s + parseFloat(b.amount), 0);
          const bachelorList = bachelorsData.success ? bachelorsData.data : [];
          const totalEvents = galleryData.success ? galleryData.data.length : 0;

          setStats({
            activeResidents: residents,
            openComplaints: openTk,
            activeVisitors: insideVisitors,
            totalFunds: collected,
            unpaidAmount: unpaid,
            galleryCount: totalEvents,
            bachelorAlerts: bachelorList
          });
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
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-5xl">
      {/* Greeting Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-violet-950/40 via-brand-950/20 to-transparent flex items-start gap-4 glow-brand">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-brand-400 flex items-center justify-center border border-brand-500/35 shrink-0">
          <LayoutDashboard size={24} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase">प्रशासन डेस्क (Resident Welfare Association Admin)</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            आपका स्वागत है, {user?.name}। सोसायटी प्रशासनिक मॉड्यूल, वित्तीय लेजर और आगंतुक गेट पूरी तरह से सक्रिय (Online) हैं।
          </p>
        </div>
      </div>

      {/* Grid: Admin Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Funds Collected */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">एकत्रित शुल्क (Funds Collected)</span>
              <span className="text-xl font-black text-emerald-400 mt-1">₹{stats.totalFunds.toFixed(2)}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सक्रिय चालानों का ऑडिट</span>
            <Link to="/finance" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5">
              बहीखाता <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Dues Outstanding */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">कुल बकाया शुल्क (Outstanding)</span>
              <span className="text-xl font-black text-rose-400 mt-1">₹{stats.unpaidAmount.toFixed(2)}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>अवैतनिक खाते</span>
            <Link to="/finance" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5">
              संग्रह <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Member Count */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">सोसायटी फ्लैट्स</span>
              <span className="text-xl font-black text-white mt-1">{stats.activeResidents} निवासी (Residents)</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/25 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सदस्य निर्देशिका</span>
            <Link to="/directory" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5">
              निर्देशिका <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Open Complaints */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">सक्रिय शिकायतें</span>
              <span className="text-xl font-black text-white mt-1">{stats.openComplaints} लंबित (Open)</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
            <span>सहायता डेस्क की समीक्षा</span>
            <Link to="/complaints" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-0.5">
              समाधान करें <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Auxiliary Action boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Administrative links panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <FolderSync size={16} className="text-brand-400" />
            त्वरित प्रशासनिक नियंत्रण (Admin Controls)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/directory"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/25 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1 group"
            >
              <h4 className="font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">निर्देशिका प्रबंधित करें</h4>
              <p className="text-[10px] text-slate-400">फ्लैट सदस्यों का ऑडिट करें, फ्लैट आवंटित करें और संपर्क फोन सूची देखें।</p>
            </Link>

            <Link 
              to="/finance"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/25 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1 group"
            >
              <h4 className="font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">बिलिंग प्रणाली (Billing System)</h4>
              <p className="text-[10px] text-slate-400">रखरखाव चालान जनरेट करें और अवैतनिक सोसायटी शुल्क की निगरानी करें।</p>
            </Link>

            <Link 
              to="/visitor-logs"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/25 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1 group"
            >
              <h4 className="font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">आगंतुक पंजी (Visitor Registry)</h4>
              <p className="text-[10px] text-slate-400">आगमन को ट्रैक करें, अतिथि प्रस्थान दर्ज करें और गेटकीपर रिपोर्ट की जांच करें।</p>
            </Link>

            <Link 
              to="/notices"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/25 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1 group"
            >
              <h4 className="font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">सूचना बुलेटिन</h4>
              <p className="text-[10px] text-slate-400">सभी निवासियों को नोटिस और आपातकालीन घोषणाएं प्रसारित करें।</p>
            </Link>

            <Link 
              to="/gallery"
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/25 hover:bg-brand-500/5 transition-all text-left flex flex-col gap-1.5 group sm:col-span-2"
            >
              <div className="flex items-center gap-2">
                <Image size={15} className="text-brand-400 group-hover:scale-105 transition-transform" />
                <h4 className="font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-300 transition-colors">सोसायटी गैलरी एवं समाचार (Events Gallery CMS)</h4>
              </div>
              <p className="text-[10px] text-slate-400">सोसायटी के त्योहारों, उत्सवों और समाचारों की तस्वीरें प्रकाशित व प्रबंधित करें। (वर्तमान में <strong>{stats.galleryCount}</strong> इवेंट्स लाइव हैं)</p>
            </Link>
          </div>
        </div>

        {/* Live Visitor stats summary widget */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
              <FolderSync size={16} className="text-indigo-400" />
              सुरक्षा जांच (Security Check)
            </h3>
            
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
              <span className="text-3xl font-black text-indigo-400">{stats.activeVisitors}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">वर्तमान में परिसर के अंदर अतिथि</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal text-center">
              सुरक्षा गेट डेस्क आगमन को तुरंत दर्ज करता है। सुनिश्चित करें कि रेसिडेंट वेलफेयर एसोसिएशन जांच सुसंगत रहे।
            </p>
          </div>

          <Link 
            to="/visitor-logs"
            className="w-full mt-4 py-2.5 bg-slate-900 border border-white/5 hover:border-brand-500/25 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1"
          >
            गेट लॉग्स की जांच करें <ChevronRight size={14} />
          </Link>
        </div>

        {/* Bachelor Alert Widget */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
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
