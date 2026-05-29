import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Users, 
  DollarSign, 
  Calendar, 
  LifeBuoy, 
  Bell, 
  Image as ImageIcon, 
  Phone, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DatabaseInspector = () => {
  const { token } = useAuth();
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Tab Management
  const [activeTab, setActiveTab] = useState('users');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Row Expand/Collapse JSON details state
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedId, setCopiedId] = useState('');

  const fetchDatabase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/db-inspect', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(`Inspect failed: status ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setDbData(data);
        setSuccess('डेटाबेस लाइव सिंक पूरा हुआ!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'Failed to sync database');
      }
    } catch (err) {
      console.error(err);
      setError(`डेटाबेस लोड करने में विफल: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, [token]);

  const toggleRow = (table, id) => {
    const key = `${table}-${id}`;
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopyJson = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1500);
  };

  const getTableIcon = (tabName) => {
    switch (tabName) {
      case 'users': return <Users size={16} />;
      case 'bills': return <DollarSign size={16} />;
      case 'tickets': return <LifeBuoy size={16} />;
      case 'notices': return <Bell size={16} />;
      case 'visitor_logs': return <Calendar size={16} />;
      case 'committee_members': return <Users size={16} />;
      case 'helplines': return <Phone size={16} />;
      case 'gallery_events': return <ImageIcon size={16} />;
      default: return <Database size={16} />;
    }
  };

  // Filter lists in real-time based on query
  const getFilteredData = () => {
    if (!dbData || !dbData[activeTab]) return [];
    const list = dbData[activeTab];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(item => {
      const searchString = Object.values(item)
        .map(val => (val === null || val === undefined ? '' : String(val).toLowerCase()))
        .join(' ');
      return searchString.includes(q);
    });
  };

  const filteredItems = getFilteredData();

  // Metrics Calculations
  const getUserCount = (role) => dbData?.users?.filter(u => u.role === role).length || 0;
  const getBillSum = (status) => dbData?.bills?.filter(b => b.status === status).reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0;
  const getOpenTicketCount = () => dbData?.tickets?.filter(t => t.status === 'open').length || 0;

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-5xl w-full mx-auto animate-fadeIn">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25 shadow-premium animate-pulse">
            <Database size={24} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">लाइव डेटाबेस व्यूअर (Database Inspector)</h1>
            <p className="text-xs text-slate-400">RWA PostgreSQL डेटाबेस स्कीमा, सारणियों का लाइव मॉनिटर और बहीखाता ऑडिट हब।</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {success && (
            <div className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
              <CheckCircle size={12} /> {success}
            </div>
          )}
          
          <button
            onClick={fetchDatabase}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> डेटा रिफ्रेश (Refresh)
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-panel p-4 border border-rose-500/30 bg-rose-950/15 text-rose-400 text-xs rounded-2xl flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Database Quick Stats Cards */}
      {dbData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">कुल पंजीकृत सदस्य</span>
              <h4 className="text-lg font-black text-white mt-1">{dbData.users?.length || 0}</h4>
              <p className="text-[9px] text-slate-400 mt-1">प्रशासक: {getUserCount('Admin')} | निवासी: {getUserCount('Resident')}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/25 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">एकत्रित कोष (Reserves)</span>
              <h4 className="text-lg font-black text-emerald-400 mt-1">₹{getBillSum('paid').toFixed(2)}</h4>
              <p className="text-[9px] text-slate-400 mt-1">बकाया (Dues): ₹{getBillSum('unpaid').toFixed(2)}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">ओपन शिकायत टिकट</span>
              <h4 className="text-lg font-black text-rose-400 mt-1">{getOpenTicketCount()}</h4>
              <p className="text-[9px] text-slate-400 mt-1">कुल शिकायतें: {dbData.tickets?.length || 0}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center">
              <LifeBuoy size={16} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">डेटाबेस मोड</span>
              <h4 className="text-lg font-black text-indigo-400 mt-1 uppercase">{dbData.mode || 'PostgreSQL'}</h4>
              <p className="text-[9px] text-slate-400 mt-1">कनेक्शन प्रकार: SQL Persistent</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center">
              <Database size={16} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Selector Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-white/5 pb-1">
        {dbData && Object.keys(dbData)
          .filter(k => !['success', 'mode', 'directoryError', 'directoryDataCount', 'directoryDataSample'].includes(k))
          .map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
                setExpandedRows({});
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all
                ${activeTab === tab 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              {getTableIcon(tab)} {tab.replace('_', ' ')}
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {dbData[tab]?.length || 0}
              </span>
            </button>
          ))}
      </div>

      {/* Database Query Console with Live Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder={`लाइव '${activeTab}' सारणी में खोजें (उदा. नाम, आईडी, फ्लैट)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Data list view */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-1">
              सारणी के सदस्य (Showing {filteredItems.length} records)
            </div>

            <div className="flex flex-col gap-3">
              {filteredItems.map((item, index) => {
                const isExpanded = !!expandedRows[`${activeTab}-${item.id}`];
                const jsonString = JSON.stringify(item, null, 2);
                
                return (
                  <div 
                    key={item.id || index}
                    className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-200 hover:border-white/10"
                  >
                    {/* Header Row Summary */}
                    <div 
                      onClick={() => toggleRow(activeTab, item.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-white/2"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                          ID: {item.id}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-bold text-white truncate">
                            {item.name || item.title || item.purpose || `Record #${item.id}`}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {item.email || item.content || item.note || `Flat: ${item.flat_no || 'N/A'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.role && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase">
                            {item.role}
                          </span>
                        )}
                        {item.status && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                            ['paid', 'resolved'].includes(item.status)
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                          }`}>
                            {item.status}
                          </span>
                        )}
                        
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </div>

                    {/* Collapsible raw JSON editor/viewer */}
                    {isExpanded && (
                      <div className="border-t border-white/5 bg-slate-950/80 p-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Raw Database PostgreSQL JSON record dump</span>
                          
                          <button
                            onClick={() => handleCopyJson(jsonString, `${activeTab}-${item.id}`)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-all"
                          >
                            {copiedId === `${activeTab}-${item.id}` ? (
                              <>
                                <Check size={10} className="text-emerald-400" /> कॉपी हो गया!
                              </>
                            ) : (
                              <>
                                <Copy size={10} /> JSON कॉपी करें
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto bg-slate-950 p-4 rounded-xl border border-white/5 leading-relaxed text-left">
                          {jsonString}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center">
            <AlertCircle size={36} className="text-slate-600 mx-auto mb-3 animate-bounce" />
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई डेटा नहीं मिला</h3>
            <p className="text-xs text-slate-400 mt-1">खोजे गए कीवर्ड से मेल खाती हुई कोई सारणी पंक्तियाँ उपलब्ध नहीं हैं।</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default DatabaseInspector;
