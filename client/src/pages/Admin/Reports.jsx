import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Printer, Download, Calendar, Activity, AlertTriangle, Users, Home } from 'lucide-react';

export const Reports = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('financial');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReportData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    
    try {
      let queryUrl = `/api/admin/reports?type=${activeTab}`;
      if (startDate) queryUrl += `&startDate=${startDate}`;
      if (endDate) queryUrl += `&endDate=${endDate}`;

      const res = await fetch(queryUrl, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Report API error: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch report data');
      }

      setReportData(data.data);
    } catch (err) {
      console.error(err);
      setError('रिपोर्ट डेटा लाने में विफल। कृपया पुनः प्रयास करें।');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab, startDate, endDate, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!reportData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'financial' && reportData.collections && reportData.expenses) {
      csvContent += "Type,Amount,Date/Status\n";
      csvContent += "--- Collections ---\n";
      reportData.collections.forEach(c => {
        csvContent += `Collection,${c.amount},${c.paid_date || c.due_date}\n`;
      });
      csvContent += "--- Expenses ---\n";
      reportData.expenses.forEach(e => {
        csvContent += `Expense,${e.amount},${e.expense_date}\n`;
      });
    } else if (activeTab === 'defaulters' && Array.isArray(reportData)) {
      csvContent += "Resident Name,Flat No,Amount,Due Date\n";
      reportData.forEach(d => {
        csvContent += `${d.user_name},${d.flat_no},${d.amount},${d.due_date}\n`;
      });
    } else if (activeTab === 'visitor_logs' && Array.isArray(reportData)) {
      csvContent += "Visitor Name,Phone,Host Flat,Check In,Check Out\n";
      reportData.forEach(v => {
        csvContent += `${v.visitor_name || v.name},${v.visitor_phone || v.phone},${v.host_flat_no || v.flat_no},${v.check_in},${v.check_out || 'N/A'}\n`;
      });
    } else if (activeTab === 'occupancy' && reportData.users) {
      csvContent += "Name,Flat No,Phone,Occupancy Status,Tenant Type\n";
      reportData.users.forEach(u => {
        csvContent += `${u.name},${u.flat_no},${u.phone || 'N/A'},${u.occupancy_status},${u.tenant_type}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rwa_report_${activeTab}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFinancialReport = () => {
    if (!reportData || !reportData.collections) return null;
    const totalColl = reportData.collections.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExp = reportData.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    return (
      <div className="flex flex-col gap-6 w-full print:text-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 print:border-black print:bg-white print:text-black text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">कुल संग्रह (Total Collections)</div>
            <div className="text-2xl font-black text-emerald-400 mt-2 print:text-black">₹{totalColl.toLocaleString('en-IN')}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 print:border-black print:bg-white print:text-black text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">कुल व्यय (Total Expenses)</div>
            <div className="text-2xl font-black text-rose-400 mt-2 print:text-black">₹{totalExp.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block">
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase mb-3 print:text-black print:mt-4">आय (Income)</h4>
            <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden print:bg-transparent print:border-none print:shadow-none">
              <table className="w-full text-left border-collapse print:w-full print:border">
                <thead className="bg-white/5 print:bg-gray-100">
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">तारीख (Date)</th>
                    <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border text-right">राशि (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reportData.collections.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                      <td className="p-3 text-sm text-slate-300 print:text-black print:border">
                        {new Date(item.paid_date || item.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-emerald-400 font-bold print:text-black print:border text-right">
                        +₹{parseFloat(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {reportData.collections.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-slate-500 print:text-black print:border">कोई आय रिकॉर्ड नहीं मिला।</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="print:mt-6">
            <h4 className="text-sm font-bold text-slate-300 uppercase mb-3 print:text-black print:mt-6">व्यय (Expenses)</h4>
            <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden print:bg-transparent print:border-none print:shadow-none">
              <table className="w-full text-left border-collapse print:w-full print:border">
                <thead className="bg-white/5 print:bg-gray-100">
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">विवरण (Description)</th>
                    <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">तारीख (Date)</th>
                    <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border text-right">राशि (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reportData.expenses.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                      <td className="p-3 text-sm text-slate-300 print:text-black print:border">{item.description || item.category}</td>
                      <td className="p-3 text-sm text-slate-400 print:text-black print:border">
                        {new Date(item.expense_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-rose-400 font-bold print:text-black print:border text-right">
                        -₹{parseFloat(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {reportData.expenses.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-slate-500 print:text-black print:border">कोई व्यय रिकॉर्ड नहीं मिला।</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultersReport = () => {
    if (!reportData || !Array.isArray(reportData)) return null;
    const totalDues = reportData.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
      <div className="flex flex-col gap-6 w-full print:text-black">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 print:border-black print:bg-white print:text-black text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">कुल बकाया (Total Outstanding Dues)</div>
          <div className="text-2xl font-black text-amber-500 mt-2 print:text-black">₹{totalDues.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden print:bg-transparent print:border-none print:shadow-none print:mt-6">
          <table className="w-full text-left border-collapse print:w-full print:border">
            <thead className="bg-white/5 print:bg-gray-100">
              <tr>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">फ्लैट नं. (Flat No)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">निवासी का नाम (Name)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">नियत तारीख (Due Date)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border text-right">बकाया राशि (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reportData.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                  <td className="p-3 text-sm font-bold text-white print:text-black print:border">{item.flat_no}</td>
                  <td className="p-3 text-sm text-slate-300 print:text-black print:border">{item.user_name}</td>
                  <td className="p-3 text-sm text-rose-400 font-bold print:text-black print:border">
                    {new Date(item.due_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-amber-400 font-bold print:text-black print:border text-right">
                    ₹{parseFloat(item.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500 print:text-black print:border">कोई बकाया रिकॉर्ड नहीं मिला।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVisitorReport = () => {
    if (!reportData || !Array.isArray(reportData)) return null;

    return (
      <div className="flex flex-col gap-6 w-full print:text-black">
        <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden print:bg-transparent print:border-none print:shadow-none print:mt-6">
          <table className="w-full text-left border-collapse print:w-full print:border">
            <thead className="bg-white/5 print:bg-gray-100">
              <tr>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">आगंतुक का नाम (Visitor)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">संपर्क (Phone)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">फ्लैट नं. (Flat No)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">चेक-इन (Check In)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">चेक-आउट (Check Out)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reportData.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                  <td className="p-3 text-sm text-slate-300 print:text-black print:border">{item.visitor_name || item.name}</td>
                  <td className="p-3 text-sm text-slate-400 print:text-black print:border">{item.visitor_phone || item.phone}</td>
                  <td className="p-3 text-sm font-bold text-white print:text-black print:border">{item.host_flat_no || item.flat_no}</td>
                  <td className="p-3 text-sm text-slate-400 print:text-black print:border">
                    {new Date(item.check_in).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-slate-400 print:text-black print:border">
                    {item.check_out ? new Date(item.check_out).toLocaleString() : <span className="text-rose-400 font-bold">अभी तक नहीं</span>}
                  </td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500 print:text-black print:border">कोई आगंतुक रिकॉर्ड नहीं मिला।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderOccupancyReport = () => {
    if (!reportData || !reportData.users) return null;
    
    return (
      <div className="flex flex-col gap-6 w-full print:text-black">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center print:border-black print:bg-white print:text-black">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">कुल निवासी (Total)</div>
            <div className="text-2xl font-black text-brand-400 mt-2 print:text-black">{reportData.users.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center print:border-black print:bg-white print:text-black">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">बैचलर किरायेदार (Bachelors)</div>
            <div className="text-2xl font-black text-rose-400 mt-2 print:text-black">{reportData.users.filter(u => u.tenant_type === 'Bachelor').length}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center print:border-black print:bg-white print:text-black">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">परिवार (Families)</div>
            <div className="text-2xl font-black text-emerald-400 mt-2 print:text-black">{reportData.users.filter(u => u.tenant_type === 'Family').length}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden print:bg-transparent print:border-none print:shadow-none print:mt-6">
          <table className="w-full text-left border-collapse print:w-full print:border">
            <thead className="bg-white/5 print:bg-gray-100">
              <tr>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">फ्लैट नं. (Flat No)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">नाम (Name)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">अधिभोग स्थिति (Status)</th>
                <th className="p-3 text-xs font-bold text-slate-300 uppercase print:text-black print:border">किरायेदार प्रकार (Tenant Type)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reportData.users.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 print:hover:bg-transparent">
                  <td className="p-3 text-sm font-bold text-white print:text-black print:border">{item.flat_no}</td>
                  <td className="p-3 text-sm text-slate-300 print:text-black print:border">{item.name}</td>
                  <td className="p-3 text-sm text-slate-400 print:text-black print:border">{item.occupancy_status}</td>
                  <td className="p-3 text-sm text-slate-400 print:text-black print:border">{item.tenant_type}</td>
                </tr>
              ))}
              {reportData.users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500 print:text-black print:border">कोई निवासी रिकॉर्ड नहीं मिला।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header section (hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">रिपोर्ट्स डेस्क (Reports)</h1>
            <p className="text-xs text-slate-400">RWA समिति के लिए आधिकारिक रिपोर्ट जनरेशन पैनल</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            disabled={loading || !reportData}
            className="px-4 py-2 bg-slate-900 border border-white/10 hover:border-brand-500/30 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} /> CSV डाउनलोड
          </button>
          <button
            onClick={handlePrint}
            disabled={loading || !reportData}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-premium hover:shadow-premium-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={14} /> प्रिंट पीडीएफ (Print)
          </button>
        </div>
      </div>

      {/* Filters (hidden when printing) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center print:hidden overflow-x-auto pb-2">
        {/* Tabs */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 whitespace-nowrap">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'financial' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity size={14} /> वित्तीय लेखा-जोखा
          </button>
          <button
            onClick={() => setActiveTab('defaulters')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'defaulters' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle size={14} /> बकाया सूची
          </button>
          <button
            onClick={() => setActiveTab('visitor_logs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'visitor_logs' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={14} /> आगंतुक सुरक्षा
          </button>
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'occupancy' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home size={14} /> अधिभोग ऑडिट
          </button>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-36 [color-scheme:dark]"
            />
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          <span className="text-slate-500 font-bold text-xs">-</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-36 [color-scheme:dark]"
            />
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold flex items-center gap-2 print:hidden">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Print Header (Visible only when printing) */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-black text-black uppercase tracking-wider">Maa Kaushalya Apartment</h1>
        <h2 className="text-xl font-bold text-gray-700 mt-2 uppercase tracking-wide">
          {activeTab === 'financial' && 'वित्तीय लेखा-जोखा (Financial Report)'}
          {activeTab === 'defaulters' && 'बकाया सूची (Defaulters Report)'}
          {activeTab === 'visitor_logs' && 'आगंतुक सुरक्षा (Visitor Logs)'}
          {activeTab === 'occupancy' && 'अधिभोग ऑडिट (Occupancy Report)'}
        </h2>
        <div className="text-sm text-gray-500 mt-2 font-bold">
          Period: {startDate ? new Date(startDate).toLocaleDateString('en-IN') : 'All Time'} 
          {endDate ? ` - ${new Date(endDate).toLocaleDateString('en-IN')}` : ' - Present'}
        </div>
      </div>

      {/* Report Content */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-brand-400 print:hidden">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500 mr-3"></div>
            <span className="text-sm font-bold tracking-wider">डेटा लोड हो रहा है (Loading)...</span>
          </div>
        ) : (
          <>
            {activeTab === 'financial' && renderFinancialReport()}
            {activeTab === 'defaulters' && renderDefaultersReport()}
            {activeTab === 'visitor_logs' && renderVisitorReport()}
            {activeTab === 'occupancy' && renderOccupancyReport()}
          </>
        )}
      </div>

      {/* Print Footer (Visible only when printing) */}
      <div className="hidden print:flex justify-between mt-16 pt-16">
        <div className="text-center w-48">
          <div className="border-b-2 border-black mb-2"></div>
          <p className="font-bold text-sm text-black">Secretary (RWA)</p>
        </div>
        <div className="text-center w-48">
          <div className="border-b-2 border-black mb-2"></div>
          <p className="font-bold text-sm text-black">President (RWA)</p>
        </div>
      </div>

    </div>
  );
};
