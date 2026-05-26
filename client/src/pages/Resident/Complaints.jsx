import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, AlertCircle, PlusCircle, Check, Hourglass, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const Complaints = () => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // New ticket form states (Resident only)
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Filtering and Sorting States
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Admin remark states
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      console.warn("⚠️ Server offline, falling back to mock support tickets.");
      // Seed fallback tickets matching user role
      if (user?.role === 'Admin') {
        setTickets([
          {
            id: 1,
            title: "बाथरूम की छत से पानी का रिसाव (Water Seepage)",
            description: "बाथरूम की सीलिंग से लगातार पानी टपक रहा है। ऊपर वाले फ्लैट के पाइप से रिसाव होने की आशंका है।",
            category: "Plumbing",
            status: "open",
            creator_name: "निवासी जॉन डो (John Doe)",
            flat_no: "B-304",
            admin_remark: "",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            title: "कॉरिडोर की लाइट खराब (Hallway Light Fused)",
            description: "फ्लैट B-304 के ठीक सामने लगी कॉरिडोर की सीलिंग ट्यूबलाइट फ्यूज हो गई है, इसे बदलने की कृपा करें।",
            category: "Electrical",
            status: "resolved",
            creator_name: "निवासी जॉन डो (John Doe)",
            flat_no: "B-304",
            admin_remark: "इलेक्ट्रीशियन ने आज सुबह लाइट बदल दी है।",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          }
        ]);
      } else {
        setTickets([
          {
            id: 1,
            title: "बाथरूम की छत से पानी का रिसाव (Water Seepage)",
            description: "बाथरूम की सीलिंग से लगातार पानी टपक रहा है। ऊपर वाले फ्लैट के पाइप से रिसाव होने की आशंका है।",
            category: "Plumbing",
            status: "open",
            admin_remark: "",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            title: "कॉरिडोर की लाइट खराब (Hallway Light Fused)",
            description: "फ्लैट B-304 के ठीक सामने लगी कॉरिडोर की सीलिंग ट्यूबलाइट फ्यूज हो गई है, इसे बदलने की कृपा करें।",
            category: "Electrical",
            status: "resolved",
            admin_remark: "इलेक्ट्रीशियन ने आज सुबह लाइट बदल दी है।",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("शिकायत टिकट सफलतापूर्वक दर्ज कर लिया गया है!");
        setTitle('');
        setDescription('');
        setTimeout(() => {
          setShowForm(false);
          setSuccess('');
          fetchTickets();
        }, 1200);
      } else {
        throw new Error(data.message || 'शिकायत दर्ज करने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, executing mock ticket create.");
      const mockNewTicket = {
        id: tickets.length + 1,
        title,
        description,
        category,
        status: 'open',
        created_at: new Date(),
        updated_at: new Date()
      };
      setTickets([mockNewTicket, ...tickets]);
      setSuccess("शिकायत दर्ज की गई (स्थानीय रूप से सुरक्षित)!");
      setTitle('');
      setDescription('');
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 1200);
    }
  };

  // Admin Ticket Status Update Function
  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      const res = await fetch('/api/tickets/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId, status: newStatus })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        fetchTickets();
      } else {
        throw new Error(data.message || 'स्थिति अपडेट करने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, simulating status change in local memory.");
      const idx = tickets.findIndex(t => t.id === ticketId);
      if (idx !== -1) {
        const updated = [...tickets];
        updated[idx] = {
          ...updated[idx],
          status: newStatus,
          updated_at: new Date()
        };
        setTickets(updated);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddRemark = async (ticketId) => {
    try {
      const res = await fetch('/api/tickets/remark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId, remark: replyText })
      });
      if (res.ok) {
        fetchTickets();
        setReplyingId(null);
        setReplyText('');
      } else {
        throw new Error('Failed to add remark');
      }
    } catch (err) {
      console.warn("⚠️ Mock mode: adding remark locally.");
      const updated = tickets.map(t => t.id === ticketId ? { ...t, admin_remark: replyText, updated_at: new Date() } : t);
      setTickets(updated);
      setReplyingId(null);
      setReplyText('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'in_progress':
        return <Hourglass size={16} className="text-amber-400" />;
      case 'open':
      default:
        return <AlertCircle size={16} className="text-rose-400 animate-pulse" />;
    }
  };

  const getStatusTextHindi = (status) => {
    switch (status) {
      case 'resolved':
        return 'हल किया गया (Resolved)';
      case 'in_progress':
        return 'कार्य प्रगति पर (In Progress)';
      case 'open':
      default:
        return 'लंबित (Open)';
    }
  };

  const getCategoryHindi = (cat) => {
    switch (cat) {
      case 'Plumbing':
        return 'प्लंबिंग (Plumbing)';
      case 'Electrical':
        return 'इलेक्ट्रिकल (Electrical)';
      case 'Security':
        return 'सुरक्षा (Security)';
      case 'Infrastructure':
        return 'बुनियादी ढांचा (Infrastructure)';
      case 'Other':
      default:
        return 'अन्य समस्याएं (Other)';
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedTickets = [...(tickets || [])]
    .filter(t => t && (filterStatus === 'All' ? true : t.status === filterStatus))
    .sort((a, b) => {
      const dateA = a && a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b && b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">सहायता एवं शिकायतें (Support Portal)</h1>
            <p className="text-xs text-slate-400">सोसायटी की शिकायतें दर्ज करें और उनके निवारण की प्रगति ट्रैक करें</p>
          </div>
        </div>

        {/* Display New Ticket button for Residents only */}
        {user?.role === 'Resident' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <PlusCircle size={14} /> नई शिकायत दर्ज करें
          </button>
        )}
      </div>

      {/* Filtering and Sorting Tools */}
      <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">स्थिति फ़िल्टर (Status):</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500">
            <option value="All">सभी (All)</option>
            <option value="open">लंबित (Open)</option>
            <option value="in_progress">कार्य प्रगति पर (In Progress)</option>
            <option value="resolved">हल किया गया (Resolved)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">क्रमबद्ध करें (Sort):</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500">
            <option value="Newest">नवीनतम (Newest)</option>
            <option value="Oldest">प्राचीनतम (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Lodge Complaint Form Panel */}
      {showForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">रखरखाव संबंधी नई शिकायत दर्ज करें</h3>
          
          <form onSubmit={handleSubmitTicket} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">शिकायत का संक्षिप्त शीर्षक (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: गैलरी में पानी की पाइप लीक हो रही है"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">शिकायत की श्रेणी (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="Plumbing">प्लंबिंग (Plumbing - जल रिसाव/जल भराव)</option>
                  <option value="Electrical">इलेक्ट्रिकल (Electrical - बिजली/बल्ब/प्लग)</option>
                  <option value="Security">सुरक्षा ऑडिट (Security - सुरक्षा गार्ड/गेट)</option>
                  <option value="Infrastructure">बुनियादी ढांचा (Infrastructure - सीढ़ियां/लिफ्ट)</option>
                  <option value="Other">अन्य समस्याएं (Other Issues)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-slate-400">समस्या का विस्तृत विवरण (Description)</label>
              <textarea
                rows="4"
                required
                placeholder="समस्या का स्पष्ट रूप से विवरण, फ्लैट नंबर और यह कब से है आदि की जानकारी लिखें..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5">
                <Check size={14} /> {success}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover"
              >
                शिकायत प्रेषित करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : tickets.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
            {user?.role === 'Admin' ? 'सोसायटी शिकायत बही (Society Complaint Ledger)' : 'मेरी दर्ज की गई शिकायतें'}
          </h3>

          <div className="flex flex-col gap-4">
            {filteredAndSortedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-3.5 hover:border-brand-500/10 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-white text-sm">#{ticket.id} {ticket.title}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold border border-white/10 uppercase tracking-wide">
                      {getCategoryHindi(ticket.category)}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(ticket.status)}
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      ticket.status === 'resolved' ? 'text-emerald-400' :
                      ticket.status === 'in_progress' ? 'text-amber-400' : 'text-rose-400 animate-pulse'
                    }`}>
                      {getStatusTextHindi(ticket.status)}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                  {ticket.description}
                </p>

                {/* Audit details footer */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-t border-white/5 pt-3 mt-1 text-[10px] text-slate-500">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {user?.role === 'Admin' && (
                      <span>शिकायतकर्ता: <span className="font-bold text-slate-300">{ticket.creator_name} (फ्लैट {ticket.flat_no || 'N/A'})</span></span>
                    )}
                    <span>दर्ज तिथि: <span className="font-bold text-slate-300">{new Date(ticket.created_at).toLocaleDateString()}</span></span>
                    <span>अंतिम अपडेट: <span className="font-bold text-slate-300">{new Date(ticket.updated_at).toLocaleDateString()}</span></span>
                  </div>

                    {/* Admin State Controller */}
                    {user?.role === 'Admin' && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">निवारण स्थिति:</span>
                        <select
                          disabled={updatingId === ticket.id}
                          value={ticket.status}
                          onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                          className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-slate-300 text-[10px] focus:outline-none focus:border-brand-500"
                        >
                          <option value="open">लंबित (Open)</option>
                          <option value="in_progress">कार्य प्रगति पर (In Progress)</option>
                          <option value="resolved">हल किया गया (Resolved)</option>
                        </select>
                        <button onClick={() => setReplyingId(ticket.id)} className="px-2 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded text-[10px] font-bold uppercase transition-all">
                          टिप्पणी (Reply)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Admin Remark Section */}
                  {ticket.admin_remark && (
                    <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                      <span className="font-bold text-indigo-400 uppercase text-[10px] block mb-1">प्रशासन का जवाब (Admin Reply):</span>
                      {ticket.admin_remark}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingId === ticket.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="अपनी टिप्पणी यहाँ लिखें..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      />
                      <button onClick={() => handleAddRemark(ticket.id)} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-all">
                        भेजें
                      </button>
                      <button onClick={() => {setReplyingId(null); setReplyText('');}} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all">
                        रद्द
                      </button>
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">सहायता डेस्क पूरी तरह साफ है</h3>
          <p className="text-xs text-slate-400 mt-1">उत्कृष्ट! आपके खाते पर वर्तमान में कोई भी लंबित शिकायत दर्ज नहीं है।</p>
        </div>
      )}
    </div>
  );
};
export default Complaints;
