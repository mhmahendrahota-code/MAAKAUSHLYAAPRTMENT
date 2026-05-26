import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, FolderSync, DollarSign, ChevronRight, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    activeResidents: 0,
    openComplaints: 0,
    activeVisitors: 0,
    totalFunds: 0,
    unpaidAmount: 0,
    bachelorAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Fetch directory/users
        const dirRes = await fetch('/api/users/directory', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dirData = await dirRes.json();

        // Fetch tickets
        const ticketsRes = await fetch('/api/tickets/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ticketsData = await ticketsRes.json();

        // Fetch visitors
        const visitorsRes = await fetch('/api/visitors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const visitorsData = await visitorsRes.json();

        // Fetch bills
        const billsRes = await fetch('/api/bills/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const billsData = await billsRes.json();

        // Fetch bachelor alerts
        const bachelorsRes = await fetch('/api/users/bachelor-alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bachelorsData = await bachelorsRes.json();

        if (dirData.success && ticketsData.success && visitorsData.success && billsData.success) {
          const residents = dirData.data.filter(u => u.role === 'Resident').length;
          const openTk = ticketsData.data.filter(t => t.status !== 'resolved').length;
          const insideVisitors = visitorsData.data.filter(v => !v.check_out).length;
          const collected = billsData.data.filter(b => b.status === 'paid').reduce((s, b) => s + parseFloat(b.amount), 0);
          const unpaid = billsData.data.filter(b => b.status === 'unpaid').reduce((s, b) => s + parseFloat(b.amount), 0);
          const bachelorList = bachelorsData.success ? bachelorsData.data : [];

          setStats({
            activeResidents: residents,
            openComplaints: openTk,
            activeVisitors: insideVisitors,
            totalFunds: collected,
            unpaidAmount: unpaid,
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
          bachelorAlerts: [
            { id: 9, name: "सर्वेश मिश्रा", police_verification_status: "pending", is_expiring_soon: false }
          ]
        });
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
    </div>
  );
};
export default AdminDashboard;
