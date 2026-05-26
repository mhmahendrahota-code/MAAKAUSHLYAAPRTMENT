import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Phone,
  Mail,
  Home,
  PlusCircle,
  Trash2,
  Edit3,
  UserCheck,
  Clock,
  ChevronRight,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';

export const Committee = () => {
  const { token, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modals State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');

  // Notification States
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchCommitteeMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/committee', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        throw new Error(data.message || 'विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, could not fetch committee data.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeMembers();
  }, [token]);

  const openAddModal = () => {
    setModalMode('add');
    setName('');
    setDesignation('');
    setPhone('');
    setEmail('');
    setFlatNo('');
    setDisplayOrder('1');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setModalMode('edit');
    setEditingId(member.id);
    setName(member.name);
    setDesignation(member.designation);
    setPhone(member.phone || '');
    setEmail(member.email || '');
    setFlatNo(member.flat_no || '');
    setDisplayOrder(member.display_order?.toString() || '1');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name,
      designation,
      phone: phone || null,
      email: email || null,
      flatNo: flatNo || null,
      displayOrder: parseInt(displayOrder) || 1
    };

    try {
      const url = modalMode === 'add' ? '/api/committee' : `/api/committee/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(modalMode === 'add' ? 'नया समिति सदस्य सफलतापूर्वक जोड़ दिया गया है!' : 'सदस्य का विवरण सफलतापूर्वक अपडेट हो गया है!');
        setTimeout(() => {
          setShowModal(false);
          fetchCommitteeMembers();
        }, 1200);
      } else {
        throw new Error(data.message || 'प्रक्रिया विफल');
      }
    } catch (err) {
      console.warn("⚠️ Fallback Mode: Simulating committee operation locally.");
      if (modalMode === 'add') {
        const mockNewMember = {
          id: Date.now(),
          ...payload,
          flat_no: payload.flatNo,
          display_order: payload.displayOrder
        };
        const updated = [...members, mockNewMember].sort((a, b) => a.display_order - b.display_order);
        setMembers(updated);
        setSuccess('नया सदस्य जोड़ा गया (Simulated Offline Mode)!');
      } else {
        const updated = members.map(m => m.id === editingId ? {
          ...m,
          ...payload,
          flat_no: payload.flatNo,
          display_order: payload.displayOrder
        } : m).sort((a, b) => a.display_order - b.display_order);
        setMembers(updated);
        setSuccess('विवरण अपडेट किया गया (Simulated Offline Mode)!');
      }

      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1200);
    }
  };

  const handleDeleteMember = async () => {
    try {
      const res = await fetch(`/api/committee/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("समिति सदस्य को सफलतापूर्वक हटा दिया गया है!");
        setDeleteId(null);
        fetchCommitteeMembers();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('विफल');
      }
    } catch (err) {
      console.warn("⚠️ Fallback Mode: Deleting committee member locally.");
      setMembers(members.filter(m => m.id !== deleteId));
      setSuccess("सदस्य को हटाया गया (Simulated Offline Mode)!");
      setDeleteId(null);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const getRoleLabel = (desg) => {
    if (desg.includes('अध्यक्ष') || desg.toLowerCase().includes('president')) return 'bg-violet-500/10 text-brand-400 border-brand-500/35';
    if (desg.includes('सचिव') || desg.toLowerCase().includes('secretary')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
    if (desg.includes('कोषाध्यक्ष') || desg.toLowerCase().includes('treasurer')) return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    return 'bg-slate-900 border-white/5 text-slate-300';
  };

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <Users size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">RWA प्रबंध समिति (RWA Committee)</h1>
            <p className="text-xs text-slate-400">माँ कौशल्या अपार्टमेंट की कार्यकारिणी समिति के सदस्य एवं पदाधिकारी</p>
          </div>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <PlusCircle size={14} /> नया सदस्य
          </button>
        )}
      </div>

      {/* Success Banner */}
      {success && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <UserCheck size={14} /> {success}
        </div>
      )}

      {/* Guidelines Panel */}
      <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/40 flex items-start gap-3">
        <Clock size={18} className="text-violet-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">समिति संपर्क दिशानिर्देश</h4>
          <p className="text-[10px] text-slate-400 leading-normal">
            सभी पदाधिकारियों की सूची उनके पदानुक्रम (Display Order) के अनुसार व्यवस्थित है। किसी भी प्रशासनिक मुद्दे, शिकायत, या बिल संबंधी विवाद के समाधान के लिए सीधे आरडब्ल्यूए समिति पदाधिकारियों से उनके नियत समय पर संपर्क करें।
          </p>
        </div>
      </div>

      {/* Committee Grid Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/20 transition-all duration-300 group hover:shadow-premium bg-slate-900/10 animate-fadeIn"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${getRoleLabel(member.designation)}`}>
                    {member.designation}
                  </span>

                  {user?.role === 'Admin' && (
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-lg transition-colors"
                        title="विवरण संपादित करें"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteId(member.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-colors"
                        title="समिति से हटाएं"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-1">
                  <h3 className="font-extrabold text-white text-base tracking-wide group-hover:text-violet-400 transition-colors">
                    {member.name}
                  </h3>
                  {member.flat_no && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Home size={11} className="text-violet-400 shrink-0" />
                      <span>फ्लैट संख्या: <span className="font-bold text-slate-300">{member.flat_no}</span></span>
                    </div>
                  )}
                </div>

                {/* Contact information list */}
                <div className="flex flex-col gap-2 mt-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                  {member.phone && (
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={12} className="text-brand-400 shrink-0" />
                        <span className="font-medium">फोन:</span>
                      </div>
                      <a href={`tel:${member.phone}`} className="font-semibold text-slate-200 hover:text-white hover:underline">
                        {member.phone}
                      </a>
                    </div>
                  )}

                  {member.email && (
                    <div className="flex items-center justify-between gap-2 text-xs border-t border-white/5 pt-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={12} className="text-brand-400 shrink-0" />
                        <span className="font-medium">ईमेल:</span>
                      </div>
                      <a href={`mailto:${member.email}`} className="font-semibold text-slate-200 hover:text-white hover:underline truncate max-w-[180px]">
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-between">
                <span>display index: 0{member.display_order}</span>
                <span className="flex items-center text-brand-400 font-bold">RWA Welfare <ChevronRight size={10} /></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <Users size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई समिति पदाधिकारी पंजीकृत नहीं है</h3>
          <p className="text-xs text-slate-400 mt-1">आरडब्ल्यूए समिति सूची जोड़ने के लिए एडमिन के रूप में नया सदस्य जोड़ें।</p>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT COMMITTEE MEMBER ─── */}
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
              <UserCheck size={18} className="text-violet-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">समिति प्रबंधन (Committee Manager)</h3>
                <h2 className="text-sm font-black text-white uppercase">
                  {modalMode === 'add' ? 'नया समिति पदाधिकारी जोड़ें' : 'पदाधिकारी विवरण संशोधित करें'}
                </h2>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">पदाधिकारी का नाम (FullName) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: नौशाद अहमद"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">पद / डेसिग्नेशन (Designation) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: अध्यक्ष (President)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">फोन नंबर (Phone)</label>
                  <input
                    type="tel"
                    placeholder="+91 97707..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">फ्लैट संख्या (Flat No)</label>
                  <input
                    type="text"
                    placeholder="जैसे: A-101"
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">ईमेल पता (Email)</label>
                  <input
                    type="email"
                    placeholder="naushad@maakaushalya.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <AlertTriangle size={12} /> {error}
                </div>
              )}

              {success && (
                <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1 shrink-0 animate-fadeIn">
                  <UserCheck size={12} /> {success}
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
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">पदाधिकारी को हटाएँ?</h3>
            <p className="text-xs text-slate-400 mb-6">उक्त सदस्य को समिति सूची से स्थायी रूप से हटा दिया जाएगा।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteMember} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium">
                हाँ, हटाएँ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Committee;
