import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Megaphone, Calendar, User, PlusCircle, Check, Trash2, X } from 'lucide-react';

export const Notices = () => {
  const { token, user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // New notice form states (Admin only)
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Delete State
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotices(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notices:", err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [token]);

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("सूचना बुलेटिन सफलतापूर्वक प्रकाशित कर दिया गया है!");
        setTitle('');
        setContent('');
        setTimeout(() => {
          setShowForm(false);
          setSuccess('');
          fetchNotices();
        }, 1200);
      } else {
        throw new Error(data.message || 'सूचना प्रेषित करने में विफल');
      }
    } catch (err) {
      console.error("Error creating notice:", err);
      setError(err.message || 'सूचना प्रेषित करने में विफल');
    }
  };

  const handleDeleteNotice = async () => {
    try {
      // Mock endpoint or actual
      const res = await fetch(`/api/notices/delete/${deleteNoticeId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("सूचना सफलतापूर्वक हटा दी गई!");
        setDeleteNoticeId(null);
        fetchNotices();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('विफल');
      }
    } catch (err) {
      console.error("Error deleting notice:", err);
      alert('सूचना हटाने में विफल: ' + err.message);
      setDeleteNoticeId(null);
    }
  };

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <Megaphone size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">सूचना पटल (Notice Board)</h1>
            <p className="text-xs text-slate-400">सोसायटी की महत्वपूर्ण घोषणाएं और आधिकारिक सूचनाएं</p>
          </div>
        </div>

        {/* Display New Notice button only for RWA Admin */}
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <PlusCircle size={14} /> नई घोषणा
          </button>
        )}
      </div>

      {/* Admin New Bulletin Form Panel */}
      {showForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">आधिकारिक सूचना जारी करें</h3>
          <form onSubmit={handleSubmitNotice} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-slate-400">सूचना का शीर्षक (Title)</label>
              <input
                type="text"
                required
                placeholder="जैसे: पेस्ट कंट्रोल छिड़काव कार्यक्रम"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-slate-400">सूचना का विवरण (Content)</label>
              <textarea
                rows="4"
                required
                placeholder="विवरण, तिथियां, समय और प्रभावित ब्लॉक आदि की जानकारी स्पष्ट रूप से लिखें..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
                सूचना जारी करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List loader */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : notices.length > 0 ? (
        <div className="flex flex-col gap-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-3.5 hover:border-brand-500/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-bold text-white tracking-wide leading-snug">{notice.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    घोषणा #{notice.id}
                  </span>
                  {user?.role === 'Admin' && (
                    <button onClick={() => setDeleteNoticeId(notice.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 whitespace-pre-line">
                {notice.content}
              </p>

              <div className="flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-slate-500 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1">
                  <User size={12} className="text-brand-400" />
                  <span>द्वारा जारी: <span className="font-bold text-slate-300">{notice.creator_name}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-brand-400" />
                  <span>प्रकाशन तिथि: <span className="font-bold text-slate-300">{new Date(notice.created_at).toLocaleDateString()} को {new Date(notice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <Megaphone size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">सूचना पटल वर्तमान में रिक्त है</h3>
          <p className="text-xs text-slate-400 mt-1">रेसिडेंट वेलफेयर एसोसिएशन द्वारा जारी किए जाने वाले नवीन अपडेट्स के लिए कृपया बाद में देखें।</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteNoticeId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">सूचना हटाएँ?</h3>
            <p className="text-xs text-slate-400 mb-6">यह आधिकारिक सूचना सभी निवासियों के पोर्टल से स्थायी रूप से हटा दी जाएगी।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteNoticeId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteNotice} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium hover:shadow-premium-hover">
                हाँ, हटाएँ (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Notices;
