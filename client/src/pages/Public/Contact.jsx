import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RulesPoster from './RulesPoster';
import {
  PhoneCall,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  PlusCircle,
  Trash2,
  Edit3,
  X,
  Save,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Contact = () => {
  const { token, user } = useAuth();
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('');

  // RWA Admin CMS states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // CMS form fields
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [note, setNote] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');

  // CMS feedback
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchHelplines = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/helplines', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHelplines(data.data);
      } else {
        throw new Error(data.message || 'विफल');
      }
    } catch (err) {
      console.error("Failed to fetch helplines:", err);
      setHelplines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelplines();
  }, [token]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquiryStatus("धन्यवाद! आपका संदेश Resident Welfare Association एडमिन डेस्क को भेज दिया गया है। हम 24 घंटे के भीतर संपर्क करेंगे।");
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMessage('');
    setTimeout(() => setInquiryStatus(''), 4000);
  };

  // CMS action helpers
  const openAddModal = () => {
    setModalMode('add');
    setTitle('');
    setNumber('');
    setNote('');
    setDisplayOrder('1');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setTitle(item.title);
    setNumber(item.number);
    setNote(item.note || '');
    setDisplayOrder(item.display_order?.toString() || '1');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      title,
      number,
      note: note || null,
      displayOrder: parseInt(displayOrder) || 1
    };

    try {
      const url = modalMode === 'add' ? '/api/helplines' : `/api/helplines/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(modalMode === 'add' ? 'नया आपातकालीन हेल्पलाइन नंबर जोड़ दिया गया है!' : 'नंबर विवरण सफलतापूर्वक अपडेट हो गया है!');
        setTimeout(() => {
          setShowModal(false);
          fetchHelplines();
        }, 1200);
      } else {
        throw new Error(data.message || 'प्रक्रिया विफल');
      }
    } catch (err) {
      console.error("Error saving helpline:", err);
      setError(err.message || 'प्रक्रिया विफल');
    }
  };

  const handleDeleteHelpline = async () => {
    try {
      const res = await fetch(`/api/helplines/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("हेल्पलाइन नंबर को सफलतापूर्वक हटा दिया गया है!");
        setDeleteId(null);
        fetchHelplines();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('विफल');
      }
    } catch (err) {
      console.error("Error deleting helpline:", err);
      alert('हेल्पलाइन हटाने में विफल: ' + err.message);
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 text-left max-w-5xl animate-fadeInUp w-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
          Resident Welfare Association <span className="gradient-text">संपर्क डेस्क</span>
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm md:text-base">
          सोसायटी प्रशासन से संपर्क करें, या सीधे रखरखाव गेट हाउस से संपर्क साधें।
        </p>
      </div>

      {success && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn mb-6">
          <Sparkles size={14} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info column */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <HelpCircle size={16} className="text-brand-400" />
                आपातकालीन एवं हेल्पलाइन
              </h3>

              {user?.role === 'Admin' && (
                <button
                  onClick={openAddModal}
                  className="px-2 py-1 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 text-brand-300 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <PlusCircle size={11} /> नया नंबर
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
              </div>
            ) : helplines.length > 0 ? (
              <div className="flex flex-col gap-3">
                {helplines.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-2 border-b border-white/5 pb-3 last:border-0 last:pb-0 group">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate pr-2">{item.title}</span>
                      <span className="text-[10px] text-slate-400 truncate pr-2">{item.note || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${item.number}`}
                        className="flex items-center gap-1 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-lg text-[10px] font-bold text-brand-300 hover:bg-brand-500/20 hover:text-brand-200 transition-all"
                      >
                        <PhoneCall size={10} /> कॉल करें
                      </a>

                      {user?.role === 'Admin' && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-md transition-colors"
                          >
                            <Edit3 size={10} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-md transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">कोई हेल्पलाइन नंबर सहेजा नहीं गया है।</p>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">माँ कौशल्या अपार्टमेंट, सेक्टर 1 पता</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin size={16} className="text-indigo-400 shrink-0" />
              <div className="flex flex-col gap-1.5">
                <span>कमल विहार, सेक्टर 1, पचपेड़ी नाका, बोरियाखुर्द, रायपुर, छत्तीसगढ़ - 492015 (Kamal Vihar, Sector 1, Pachpedi Naka, Boriyakhurd, Raipur, Chhattisgarh 492015)</span>
                <a
                  href="https://maps.app.goo.gl/dQR5gd3dgzAz59BTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  गूगल मैप्स पर देखें &rarr;
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1">
              <Mail size={16} className="text-indigo-400 shrink-0" />
              <span>rwa@maakaushalya.com</span>
            </div>
          </div>
        </div>

        {/* Message form column */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">सीधा संदेश भेजें</h3>
          <p className="text-xs text-slate-400 mb-6">कोई प्रतिक्रिया या पूछताछ है? हमारे Resident Welfare Association प्रशासनिक कर्मचारियों को संदेश भेजें।</p>

          <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">आपका नाम</label>
              <input
                type="text"
                required
                placeholder="पूरा नाम"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">ईमेल पता</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">पूछताछ संदेश</label>
              <textarea
                rows="4"
                required
                placeholder="अपनी पूछताछ या प्रतिक्रिया का विवरण लिखें..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {inquiryStatus && (
              <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl">
                {inquiryStatus}
              </div>
            )}

            <button
              type="submit"
              className="py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center gap-1.5"
            >
              <Send size={12} /> पूछताछ भेजें
            </button>
          </form>
        </div>
      </div>

      {/* ─── MODAL: ADD / EDIT HELPLINE ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <PhoneCall size={18} className="text-brand-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">हेल्पलाइन प्रबंधक (Helpline Manager)</h3>
                <h2 className="text-sm font-black text-white uppercase">
                  {modalMode === 'add' ? 'नया हेल्पलाइन नंबर जोड़ें' : 'नंबर विवरण संशोधित करें'}
                </h2>
              </div>
            </div>

            <form onSubmit={handleCmsSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">हेल्पलाइन का शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: मुख्य गार्ड गेट हाउस (Gate)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">संपर्क नंबर (Phone Number) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: +91 80 4910291"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">अतिरिक्त विवरण (Note)</label>
                  <input
                    type="text"
                    placeholder="जैसे: 24 घंटे आपातकालीन"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">प्रदर्शन क्रम *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors text-center font-bold"
                  />
                </div>
              </div>

              {error && (
                <div className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-1 shrink-0">
                  <ShieldAlert size={12} /> {error}
                </div>
              )}

              {success && (
                <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1 shrink-0 animate-fadeIn">
                  <Sparkles size={12} /> {success}
                </div>
              )}

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                >
                  <Save size={12} /> सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">नंबर को हटाएँ?</h3>
            <p className="text-xs text-slate-400 mb-6">उक्त नंबर को हेल्पलाइन निर्देशिका से स्थायी रूप से हटा दिया जाएगा।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteHelpline} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium">
                हाँ, हटाएँ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
