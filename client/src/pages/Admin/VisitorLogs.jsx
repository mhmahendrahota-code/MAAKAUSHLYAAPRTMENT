import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FolderSync, PlusCircle, CheckCircle2, UserCheck, ShieldAlert, LogOut, Search } from 'lucide-react';
import { SOCIETY_FLATS } from '../../utils/flats';

export const VisitorLogs = () => {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Check-In visitor Form States (Security guard only)
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [purpose, setPurpose] = useState('Delivery');
  const [flatNo, setFlatNo] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Sign out loader indicator
  const [checkingOutId, setCheckingOutId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visitors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.warn("⚠️ Server offline, falling back to mock visitor logs.");
      // Seed mock visitor logs depending on role
      const mockHistorical = [
        {
          id: 1,
          name: "रमेश शर्मा (Ramesh Sharma)",
          phone: "+919876543210",
          purpose: "Amazon Delivery",
          flat_no: "B-304",
          check_in: new Date(Date.now() - 2 * 60 * 60 * 1000),
          check_out: new Date(Date.now() - 110 * 60 * 1000),
          logged_by_name: "सुरक्षा गार्ड शिंदे (Gatekeeper)"
        },
        {
          id: 2,
          name: "डॉ. विनय मेहता (Dr. Vinay Mehta)",
          phone: "+918887776665",
          purpose: "Guest",
          flat_no: "A-101",
          check_in: new Date(Date.now() - 1 * 60 * 60 * 1000),
          check_out: null,
          logged_by_name: "सुरक्षा गार्ड शिंदे (Gatekeeper)"
        }
      ];

      if (user?.role === 'Resident') {
        const flat = user.flat_no;
        setLogs(mockHistorical.filter(l => (l.flat_no || '').toLowerCase() === (flat || '').toLowerCase()));
      } else {
        setLogs(mockHistorical);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = { name, phone, gender, purpose, flatNo };

    try {
      const res = await fetch('/api/visitors/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`आगंतुक ${name} का आगमन सफलतापूर्वक दर्ज किया गया!`);
        setName('');
        setPhone('');
        setGender('Male');
        setFlatNo('');
        setTimeout(() => {
          setShowCheckinForm(false);
          setSuccess('');
          fetchLogs();
        }, 1200);
      } else {
        throw new Error(data.message || 'आगमन दर्ज करने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, simulating visitor check-in.");
      const mockNewLog = {
        id: logs.length + 1,
        name,
        phone,
        gender,
        purpose,
        flat_no: flatNo,
        check_in: new Date(),
        check_out: null,
        logged_by_name: user?.name || "सुरक्षा गार्ड (Security)"
      };
      setLogs([mockNewLog, ...logs]);
      setSuccess(`आगंतुक ${name} का आगमन दर्ज हुआ (मॉक Mode)!`);
      setName('');
      setPhone('');
      setGender('Male');
      setFlatNo('');
      setTimeout(() => {
        setShowCheckinForm(false);
        setSuccess('');
      }, 1200);
    }
  };

  const handleCheckout = async (logId) => {
    setCheckingOutId(logId);
    try {
      const res = await fetch(`/api/visitors/checkout/${logId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchLogs();
      } else {
        throw new Error(data.message || 'प्रस्थान दर्ज करने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, checking out visitor in mock memory state.");
      const idx = logs.findIndex(l => l.id === logId);
      if (idx !== -1) {
        const updated = [...logs];
        updated[idx] = {
          ...updated[idx],
          check_out: new Date()
        };
        setLogs(updated);
      }
    } finally {
      setCheckingOutId(null);
    }
  };

  // Searching filter
  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase();
    return (
      (log.name || '').toLowerCase().includes(q) ||
      (log.phone || '').toLowerCase().includes(q) ||
      (log.purpose || '').toLowerCase().includes(q) ||
      (log.flat_no || '').toLowerCase().includes(q) ||
      (log.logged_by_name || '').toLowerCase().includes(q)
    );
  });

  const getPurposeHindi = (purpose) => {
    switch (purpose) {
      case 'Delivery':
        return 'डिलीवरी (Delivery)';
      case 'Guest':
        return 'अतिथि (Guest)';
      case 'Maintenance':
        return 'रखरखाव (Maintenance)';
      case 'Other':
      default:
        return 'अन्य/आधिकारिक (Other)';
    }
  };

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <FolderSync size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">आगंतुक पंजी (Visitor Registry)</h1>
            <p className="text-xs text-slate-400">
              {user?.role === 'Resident' 
                ? `फ्लैट ${user?.flat_no} के लिए आगंतुक आगमन ऑडिट लॉग` 
                : 'गेट लॉग बुक रिकॉर्ड और सक्रिय प्रस्थान विवरण'
              }
            </p>
          </div>
        </div>

        {/* Display gate entry creation ONLY for Security role */}
        {user?.role === 'Security' && (
          <button
            onClick={() => setShowCheckinForm(!showCheckinForm)}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <PlusCircle size={14} /> आगमन दर्ज करें (Check-In)
          </button>
        )}
      </div>

      {/* Security Gate Checkin Entry Panel */}
      {showCheckinForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">गेट आगंतुक आगमन (Check-In) दर्ज करें</h3>
          
          <form onSubmit={handleCheckinSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आगंतुक का नाम (Visitor Name)</label>
                <input
                  type="text"
                  required
                  placeholder="आगंतुक का नाम दर्ज करें"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">जेंडर (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आगंतुक का फोन नंबर (Phone)</label>
                <input
                  type="tel"
                  required
                  placeholder="जैसे: +91 9988776655"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आगमन का उद्देश्य (Purpose of Visit)</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="Delivery">डिलीवरी (Delivery - अमेज़न/जोमैटो/कूरियर)</option>
                  <option value="Guest">अतिथि (Guest - निवासी अतिथि/पारिवारिक सदस्य)</option>
                  <option value="Maintenance">रखरखाव कर्मचारी (Maintenance - प्लंबिंग/एसी/ब्रॉडबैंड)</option>
                  <option value="Other">अन्य / आधिकारिक सोसायटी आगंतुक (Other)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">गंतव्य फ्लैट नंबर (Target Flat)</label>
                <select
                  required
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="">फ्लैट नंबर चुनें</option>
                  {SOCIETY_FLATS.map(flat => (
                    <option key={flat} value={flat}>{flat}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5">
                <UserCheck size={14} /> {success}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowCheckinForm(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover"
              >
                आगमन दर्ज करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registry Search filter panel */}
      {user?.role !== 'Resident' && (
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="अतिथि के नाम, फोन, फ्लैट नंबर या उद्देश्य द्वारा आगंतुक लॉग खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>
      )}

      {/* Logs View */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-brand-500/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                  log.check_out 
                    ? 'bg-slate-900 border-white/5 text-slate-500' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse'
                }`}>
                  <UserCheck size={16} />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{log.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-white/5 rounded border border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                      {getPurposeHindi(log.purpose)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    जेंडर: <span className="text-slate-300 font-bold">{log.gender === 'Female' ? 'महिला (Female)' : log.gender === 'Other' ? 'अन्य (Other)' : 'पुरुष (Male)'}</span> | मुलाकात का फ्लैट: <span className="text-brand-300 font-bold">फ्लैट {log.flat_no}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    संपर्क फोन: {log.phone}
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500 mt-2 border-t border-white/5 pt-1.5">
                    <span>आगमन: <span className="font-bold text-slate-300">{new Date(log.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(log.check_in).toLocaleDateString()})</span></span>
                    {log.check_out && (
                      <span>प्रस्थान: <span className="font-bold text-slate-300">{new Date(log.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkout controls */}
              {!log.check_out && (user?.role === 'Security' || user?.role === 'Admin') && (
                <button
                  disabled={checkingOutId === log.id}
                  onClick={() => handleCheckout(log.id)}
                  className="px-3.5 py-2 bg-rose-950/20 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shrink-0"
                >
                  <LogOut size={12} /> प्रस्थान दर्ज करें (Sign Out)
                </button>
              )}

              {log.check_out && (
                <span className="text-[9px] uppercase font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5 shrink-0 self-start sm:self-center">
                  प्रस्थान संपन्न (Signed Out)
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <ShieldAlert size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">आगंतुक पंजी खाली है</h3>
          <p className="text-xs text-slate-400 mt-1">कोई भी दर्ज गेट लेनदेन रिकॉर्ड नहीं मिला।</p>
        </div>
      )}
    </div>
  );
};
export default VisitorLogs;
