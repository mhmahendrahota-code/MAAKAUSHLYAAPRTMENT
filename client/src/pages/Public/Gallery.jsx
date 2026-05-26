import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Image, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

export const Gallery = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox view state
  const [lightboxEvent, setLightboxEvent] = useState(null);

  // Admin CMS Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // CMS Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');

  // CMS Feedback
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  const fetchGalleryEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || 'विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, using fallback simulated society gallery events.");
      setEvents([
        { 
          id: 1, 
          title: "गणेश चतुर्थी उत्सव (Ganesh Chaturthi Utsav)", 
          content: "माँ कौशल्या अपार्टमेंट में गणेश चतुर्थी के पावन अवसर पर भव्य गणेश स्थापना और दैनिक संध्या आरती का आयोजन किया गया। अंतिम दिन सभी निवासियों की सहभागिता के साथ भंडारा और विसर्जन यात्रा निकाली गई।", 
          image_url: "https://images.unsplash.com/photo-1567591974584-f18551452228?w=800&auto=format&fit=crop&q=60", 
          event_date: "2025-09-15"
        },
        { 
          id: 2, 
          title: "स्वतंत्रता दिवस ध्वजारोहण (Independence Day Flag Hoisting)", 
          content: "15 अगस्त के शुभ अवसर पर सोसायटी परिसर में आरडब्ल्यूए समिति द्वारा ध्वजारोहण कार्यक्रम आयोजित किया गया। बच्चों के लिए देशभक्ति गीत व सांस्कृतिक प्रतियोगिताएं रखी गईं और अंत में मिठाई वितरित की गई।", 
          image_url: "https://images.unsplash.com/photo-1532375811409-905115e3b5a9?w=800&auto=format&fit=crop&q=60", 
          event_date: "2025-08-15"
        },
        { 
          id: 3, 
          title: "स्वच्छता एवं वृक्षारोपण अभियान (Green & Clean Drive)", 
          content: "माँ कौशल्या अपार्टमेंट को हरा-भरा और स्वच्छ बनाने के लिए आरडब्ल्यूए और युवा विंग द्वारा विशेष वृक्षारोपण अभियान चलाया गया। परिसर के विभिन्न कोनों में 50+ छायादार और औषधीय पौधे रोपे गए।", 
          image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60", 
          event_date: "2026-05-10"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryEvents();
  }, [token]);

  const openAddModal = () => {
    setModalMode('add');
    setTitle('');
    setContent('');
    setImageUrl('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content || '');
    setImageUrl(item.image_url || '');
    
    // Parse Date cleanly
    const parsedDate = item.event_date ? new Date(item.event_date).toISOString().split('T')[0] : '';
    setEventDate(parsedDate);
    
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
      content: content || null,
      imageUrl: imageUrl || null,
      eventDate: eventDate || new Date().toISOString().split('T')[0]
    };

    try {
      const url = modalMode === 'add' ? '/api/gallery' : `/api/gallery/${editingId}`;
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
        setSuccess(modalMode === 'add' ? 'नया इवेंट गैलरी में प्रकाशित कर दिया गया है!' : 'इवेंट विवरण सफलतापूर्वक अपडेट हो गया है!');
        setTimeout(() => {
          setShowModal(false);
          fetchGalleryEvents();
        }, 1200);
      } else {
        throw new Error(data.message || 'प्रक्रिया विफल');
      }
    } catch (err) {
      console.warn("⚠️ Fallback Mode: Simulating gallery event operation locally.");
      if (modalMode === 'add') {
        const mockNewEvent = {
          id: Date.now(),
          ...payload,
          image_url: payload.imageUrl,
          event_date: payload.eventDate
        };
        const updated = [mockNewEvent, ...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        setEvents(updated);
        setSuccess('इवेंट प्रकाशित हुआ (Simulated Offline Mode)!');
      } else {
        const updated = events.map(e => e.id === editingId ? {
          ...e,
          ...payload,
          image_url: payload.imageUrl,
          event_date: payload.eventDate
        } : e).sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        setEvents(updated);
        setSuccess('इवेंट विवरण अपडेट हुआ (Simulated Offline Mode)!');
      }

      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1200);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("इवेंट को गैलरी से सफलतापूर्वक हटा दिया गया है!");
        setDeleteId(null);
        fetchGalleryEvents();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('विफल');
      }
    } catch (err) {
      console.warn("⚠️ Fallback Mode: Deleting gallery event locally.");
      setEvents(events.filter(e => e.id !== deleteId));
      setSuccess("इवेंट को हटाया गया (Simulated Offline Mode)!");
      setDeleteId(null);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <Image size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">सोसायटी गैलरी एवं समाचार (Events Gallery)</h1>
            <p className="text-xs text-slate-400">माँ कौशल्या अपार्टमेंट के उत्सवों, गतिविधियों और समाचारों की तस्वीरें</p>
          </div>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <PlusCircle size={14} /> नया इवेंट अपलोड करें
          </button>
        )}
      </div>

      {success && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <Sparkles size={14} /> {success}
        </div>
      )}

      {/* Grid: Events list */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-brand-500/20 hover:shadow-premium transition-all duration-300 group"
            >
              {/* Event Image Container with overlay triggers */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setLightboxEvent(item)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                    <Image size={32} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">कोई छवि उपलब्ध नहीं</span>
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

                {/* Date Tag */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar size={11} className="text-brand-400" />
                  {item.event_date ? new Date(item.event_date).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </div>

                {/* Lightbox Preview Button */}
                {item.image_url && (
                  <button 
                    onClick={() => setLightboxEvent(item)}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider"
                  >
                    <Eye size={12} /> ज़ूम करें
                  </button>
                )}
              </div>

              {/* Event Content Details */}
              <div className="p-5 text-left flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-extrabold text-white text-base tracking-wide leading-snug group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal whitespace-pre-line line-clamp-3">
                    {item.content || 'कोई विवरण नहीं दिया गया है।'}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    अपार्टमेंट एक्टिविटी बुलेटिन
                  </span>

                  {user?.role === 'Admin' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-lg text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Edit3 size={9} /> संपादित करें
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <Image size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">गैलरी वर्तमान में रिक्त है</h3>
          <p className="text-xs text-slate-400 mt-1">आरडब्ल्यूए समिति द्वारा सोसायटी में आयोजित इवेंट्स की तस्वीरें एडमिन के रूप में अपलोड करें।</p>
        </div>
      )}

      {/* ─── MODAL: LIGHTBOX IMAGE PREVIEW ─── */}
      {lightboxEvent && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setLightboxEvent(null)}
        >
          <div 
            className="max-w-3xl w-full flex flex-col gap-4 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setLightboxEvent(null)}
              className="absolute top-[-40px] right-0 text-slate-400 hover:text-white p-2 bg-slate-900 border border-white/10 rounded-full"
            >
              <X size={20} />
            </button>
            <img 
              src={lightboxEvent.image_url} 
              alt={lightboxEvent.title} 
              className="w-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl bg-slate-950" 
            />
            <div className="text-left glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-brand-400 flex items-center gap-1.5">
                <Calendar size={11} /> {lightboxEvent.event_date ? new Date(lightboxEvent.event_date).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </span>
              <h2 className="text-base font-black text-white">{lightboxEvent.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line mt-1">{lightboxEvent.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT GALLERY EVENT ─── */}
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
              <Image size={18} className="text-amber-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">गैलरी संपादक (Gallery CMS Manager)</h3>
                <h2 className="text-sm font-black text-white uppercase">
                  {modalMode === 'add' ? 'नया इवेंट/समाचार प्रकाशित करें' : 'इवेंट विवरण संशोधित करें'}
                </h2>
              </div>
            </div>

            <form onSubmit={handleCmsSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">शीर्षक (Title) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="जैसे: स्वतंत्रता दिवस ध्वजारोहण" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" 
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">इवेंट तिथि (Event Date) *</label>
                  <input 
                    type="date" 
                    required 
                    value={eventDate} 
                    onChange={(e) => setEventDate(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors w-full" 
                  />
                </div>
              </div>

              {/* Premium Direct Base64 File Uploader */}
              <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                <label className="font-bold text-slate-400 uppercase text-[10px]">इवेंट फोटो अपलोड करें (Upload Event Photo)</label>
                <div className="flex items-center gap-3.5 bg-slate-950/40 border border-white/10 rounded-2xl p-3">
                  <div className="w-16 h-16 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-premium">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📸</span>
                    )}
                    {imageUrl && (
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')} 
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 text-[10px] font-bold transition-all"
                      >
                        हटाएं
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="gallery-file-upload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // Max 8MB raw file size guard
                        if (file.size > 8 * 1024 * 1024) {
                          setError('फ़ाइल बहुत बड़ी है। कृपया 8MB से छोटी छवि चुनें।');
                          setImageProcessing(false);
                          e.target.value = '';
                          return;
                        }

                        setError('');
                        setImageProcessing(true);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = new window.Image();
                          img.onload = () => {
                            // Compress: resize to max 1200px wide, quality 0.82
                            const MAX_W = 1200;
                            const scale = img.width > MAX_W ? MAX_W / img.width : 1;
                            const canvas = document.createElement('canvas');
                            canvas.width  = Math.round(img.width  * scale);
                            canvas.height = Math.round(img.height * scale);
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            const compressed = canvas.toDataURL('image/jpeg', 0.82);
                            setImageUrl(compressed);
                            setImageProcessing(false);
                          };
                          img.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery-file-upload"
                      className={`px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition-colors shadow-premium w-fit ${imageProcessing ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      {imageProcessing ? '⏳ संसाधित हो रही है...' : 'फ़ाइल चुनें (Choose Image)'}
                    </label>
                    <p className="text-[8px] text-slate-500 leading-normal">PNG, JPG, JPEG या GIF (अधिकतम 8MB)। फोटो स्वतः संकुचित होकर गैलरी में सहेजी जाएगी।</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-400 uppercase text-[10px]">विवरण / समाचार सामग्री (Content / Description)</label>
                <textarea 
                  rows="4" 
                  placeholder="इवेंट में शामिल गतिविधियां, निवासियों का योगदान और अन्य विवरण लिखें..." 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none" 
                />
              </div>

              {error && (
                <div className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-1 shrink-0">
                  <AlertCircle size={12} /> {error}
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
                  <Save size={12} /> प्रकाशित करें
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
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">इवेंट को हटाएँ?</h3>
            <p className="text-xs text-slate-400 mb-6">यह इवेंट और इसकी तस्वीरें आरडब्ल्यूए गैलरी पटल से स्थायी रूप से हटा दी जाएंगी।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteEvent} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium">
                हाँ, हटाएँ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
