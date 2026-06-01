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
  ChevronUp,
  Plus,
  Save,
  Trash2,
  X,
  Code
} from 'lucide-react';

const tableFields = {
  users: [
    { name: 'name', label: 'नाम (Name)', type: 'text', required: true },
    { name: 'email', label: 'ईमेल (Email)', type: 'email', required: true },
    { name: 'role', label: 'भूमिका (Role)', type: 'select', options: ['Admin', 'Resident', 'Security', 'Committee'], required: true },
    { name: 'flat_no', label: 'फ्लैट नंबर (Flat No)', type: 'text' },
    { name: 'phone', label: 'फ़ोन नंबर (Phone)', type: 'text' },
    { name: 'occupancy_status', label: 'अधिभोग (Occupancy)', type: 'select', options: ['Self-Occupied', 'Rented', 'Vacant'] },
    { name: 'tenant_type', label: 'किरायेदार प्रकार (Tenant)', type: 'select', options: ['Family', 'Bachelor'] },
    { name: 'gender', label: 'लिंग (Gender)', type: 'select', options: ['Male', 'Female'] },
    { name: 'aadhaar_number', label: 'आधार नंबर (Aadhaar)', type: 'text' },
    { name: 'is_approved', label: 'स्वीकृत खाता (Approved)', type: 'checkbox' }
  ],
  bills: [
    { name: 'resident_id', label: 'निवासी आईडी (Resident ID)', type: 'number', required: true },
    { name: 'amount', label: 'राशि (Amount)', type: 'number', required: true },
    { name: 'status', label: 'स्थिति (Status)', type: 'select', options: ['unpaid', 'paid'], required: true },
    { name: 'billing_month', label: 'बिलिंग महीना (Month)', type: 'text', required: true },
    { name: 'due_date', label: 'नियत तिथि (Due Date)', type: 'date', required: true }
  ],
  tickets: [
    { name: 'title', label: 'शीर्षक (Title)', type: 'text', required: true },
    { name: 'description', label: 'विवरण (Description)', type: 'textarea', required: true },
    { name: 'category', label: 'श्रेणी (Category)', type: 'select', options: ['Plumbing', 'Electrical', 'Security', 'Other'], required: true },
    { name: 'status', label: 'स्थिति (Status)', type: 'select', options: ['open', 'in_progress', 'resolved'], required: true },
    { name: 'created_by', label: 'निर्माता आईडी (Creator ID)', type: 'number', required: true }
  ],
  notices: [
    { name: 'title', label: 'शीर्षक (Title)', type: 'text', required: true },
    { name: 'content', label: 'सामग्री (Content)', type: 'textarea', required: true },
    { name: 'created_by', label: 'प्रशासक आईडी (Admin ID)', type: 'number', required: true }
  ],
  visitor_logs: [
    { name: 'name', label: 'आगंतुक नाम (Name)', type: 'text', required: true },
    { name: 'phone', label: 'फ़ोन नंबर (Phone)', type: 'text', required: true },
    { name: 'purpose', label: 'उद्देश्य (Purpose)', type: 'text', required: true },
    { name: 'flat_no', label: 'फ्लैट नंबर (Flat No)', type: 'text', required: true },
    { name: 'gender', label: 'लिंग (Gender)', type: 'select', options: ['Male', 'Female'] },
    { name: 'logged_by', label: 'सुरक्षा गार्ड आईडी (Security ID)', type: 'number', required: true }
  ],
  committee_members: [
    { name: 'name', label: 'नाम (Name)', type: 'text', required: true },
    { name: 'designation', label: 'पदनाम (Designation)', type: 'text', required: true },
    { name: 'phone', label: 'फ़ोन नंबर (Phone)', type: 'text' },
    { name: 'email', label: 'ईमेल (Email)', type: 'email' },
    { name: 'flat_no', label: 'फ्लैट नंबर (Flat No)', type: 'text' },
    { name: 'display_order', label: 'प्रदर्शन क्रम (Order)', type: 'number' }
  ],
  helplines: [
    { name: 'title', label: 'हेल्पलाइन शीर्षक (Title)', type: 'text', required: true },
    { name: 'number', label: 'फ़ोन नंबर (Number)', type: 'text', required: true },
    { name: 'note', label: 'टिप्पणी (Note)', type: 'text' },
    { name: 'display_order', label: 'प्रदर्शन क्रम (Order)', type: 'number' }
  ],
  gallery_events: [
    { name: 'title', label: 'शीर्षक (Title)', type: 'text', required: true },
    { name: 'content', label: 'विवरण (Content)', type: 'textarea' },
    { name: 'image_url', label: 'छवि यूआरएल (Image URL)', type: 'text' },
    { name: 'event_date', label: 'घटना तिथि (Event Date)', type: 'date' }
  ]
};

// Form Row Editor Subcomponent for visual CRUD
const FormRowEditor = ({ item, table, onSave, onDelete }) => {
  const fields = tableFields[table] || [];
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initial = {};
    fields.forEach(f => {
      // Format dates correctly to YYYY-MM-DD for date input elements
      if (f.type === 'date' && item[f.name]) {
        const rawDate = item[f.name];
        initial[f.name] = typeof rawDate === 'string' ? rawDate.substring(0, 10) : new Date(rawDate).toISOString().substring(0, 10);
      } else {
        initial[f.name] = item[f.name] !== undefined ? item[f.name] : '';
      }
    });
    setFormData(initial);
  }, [item, table, fields]);

  const handleChange = (name, value, type) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left p-4 bg-slate-900/50 rounded-2xl border border-white/5 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              {f.label} {f.required && <span className="text-rose-400">*</span>}
            </label>
            
            {f.type === 'select' ? (
              <select
                value={formData[f.name] || ''}
                onChange={e => handleChange(f.name, e.target.value)}
                required={f.required}
                className="bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all"
              >
                <option value="">चुनें (Select)...</option>
                {f.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                value={formData[f.name] || ''}
                onChange={e => handleChange(f.name, e.target.value)}
                required={f.required}
                rows={3}
                className="bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all sm:col-span-2"
              />
            ) : f.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={!!formData[f.name]}
                  onChange={e => handleChange(f.name, e.target.checked, 'checkbox')}
                  className="rounded bg-slate-950 border-white/5 text-brand-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                />
                <span className="text-xs text-slate-300">सक्रिय / स्वीकृत (Enabled)</span>
              </label>
            ) : (
              <input
                type={f.type}
                value={formData[f.name] || ''}
                onChange={e => handleChange(f.name, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                required={f.required}
                className="bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all"
              />
            )}
          </div>
        ))}
      </div>

      {/* Save / Delete Row buttons */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="px-4 py-2 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
        >
          <Trash2 size={13} /> रिकॉर्ड हटाएं (Delete)
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-premium transition-all"
        >
          <Save size={13} /> सहेजें (Save Changes)
        </button>
      </div>
    </form>
  );
};

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
  const [rowViews, setRowViews] = useState({}); // 'json' or 'form' per key `${table}-${id}`
  const [copiedId, setCopiedId] = useState('');

  // Add Record Modal Drawer States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecordFormData, setNewRecordFormData] = useState({});

  const fetchDatabase = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {};
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/users/db-inspect', {
        credentials: 'include',
        headers
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
    // Default to 'form' view on expand if not configured
    if (!rowViews[key]) {
      setRowViews(prev => ({
        ...prev,
        [key]: 'form'
      }));
    }
  };

  const handleCopyJson = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1500);
  };

  const handleSaveEdit = async (id, updatedBody) => {
    setLoading(true);
    setError('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/users/db-inspect/${activeTab}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedBody)
      });
      
      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess('रिकॉर्ड सफलतापूर्वक अपडेट किया गया!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Update local state without fetching to keep view expanded and fluid
        setDbData(prev => {
          const tableList = prev[activeTab].map(item => item.id === id ? result.data : item);
          return {
            ...prev,
            [activeTab]: tableList
          };
        });
      } else {
        throw new Error(result.message || 'Failed to save record updates');
      }
    } catch (err) {
      console.error(err);
      setError(`रिकॉर्ड अपडेट विफलता: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm(`क्या आप वाकई रिकॉर्ड ID: ${id} को हटाना चाहते हैं?`)) return;
    setLoading(true);
    setError('');
    try {
      const headers = {};
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/users/db-inspect/${activeTab}/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess('रिकॉर्ड को डेटाबेस से स्थायी रूप से हटा दिया गया!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Remove from local table state
        setDbData(prev => {
          const tableList = prev[activeTab].filter(item => item.id !== id);
          return {
            ...prev,
            [activeTab]: tableList
          };
        });
      } else {
        throw new Error(result.message || 'Deletion request failed');
      }
    } catch (err) {
      console.error(err);
      setError(`रिकॉर्ड हटाने में विफलता: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/users/db-inspect/${activeTab}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newRecordFormData)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess('डेटाबेस में नया रिकॉर्ड सफलतापूर्वक बनाया गया!');
        setTimeout(() => setSuccess(''), 3000);
        setShowAddModal(false);
        setNewRecordFormData({});
        
        // Insert into local state
        setDbData(prev => {
          const tableList = [result.data, ...(prev[activeTab] || [])];
          return {
            ...prev,
            [activeTab]: tableList
          };
        });
      } else {
        throw new Error(result.message || 'Creation request failed');
      }
    } catch (err) {
      console.error(err);
      setError(`नया रिकॉर्ड बनाने में विफलता: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecordChange = (fieldName, val, type) => {
    setNewRecordFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? val : val
    }));
  };

  const openAddModal = () => {
    const fields = tableFields[activeTab] || [];
    const defaultData = {};
    fields.forEach(f => {
      defaultData[f.name] = f.type === 'checkbox' ? false : f.type === 'number' ? 0 : '';
    });
    setNewRecordFormData(defaultData);
    setShowAddModal(true);
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
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-5xl w-full mx-auto animate-fadeIn relative">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25 shadow-premium shrink-0">
            <Database size={24} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">डेटाबेस कंट्रोल डेस्क (Database Inspector)</h1>
            <p className="text-xs text-slate-400">RWA PostgreSQL डेटाबेस स्कीमा और सारणियों का विजुअल फ़ॉर्म व्यू एवं CRUD संपादन पैनल।</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {success && (
            <div className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
              <CheckCircle size={12} /> {success}
            </div>
          )}
          
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-slate-900 border border-white/10 hover:border-brand-500/25 hover:bg-slate-800 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium transition-all"
          >
            <Plus size={14} className="text-brand-400" /> नया जोड़ें (Add Record)
          </button>

          <button
            onClick={fetchDatabase}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> रिफ्रेश (Refresh)
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
              <p className="text-[9px] text-slate-400 mt-1">कनेक्शन प्रकार: CRUD Interactive</p>
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
        {loading && !dbData ? (
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
                const key = `${activeTab}-${item.id}`;
                const viewMode = rowViews[key] || 'form';
                const jsonString = JSON.stringify(item, null, 2);
                
                return (
                  <div 
                    key={item.id || index}
                    className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-200 hover:border-white/10 text-left"
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

                    {/* Collapsible Row Panel */}
                    {isExpanded && (
                      <div className="border-t border-white/5 bg-slate-950/80 p-4 animate-fadeIn flex flex-col gap-4">
                        {/* Selector Tabs: JSON vs Form View */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                          <div className="flex gap-1 bg-slate-900 p-0.5 rounded-xl border border-white/5">
                            <button
                              onClick={(e) => { e.stopPropagation(); setRowViews(p => ({ ...p, [key]: 'form' })); }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                                viewMode === 'form' 
                                  ? 'bg-white/5 text-white' 
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <FileText size={10} /> फ़ॉर्म व्यू (Form Editor)
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setRowViews(p => ({ ...p, [key]: 'json' })); }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                                viewMode === 'json' 
                                  ? 'bg-white/5 text-white' 
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <Code size={10} /> JSON व्यू (Raw Dump)
                            </button>
                          </div>

                          {viewMode === 'json' && (
                            <button
                              onClick={() => handleCopyJson(jsonString, key)}
                              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-all"
                            >
                              {copiedId === key ? (
                                <>
                                  <Check size={10} className="text-emerald-400" /> कॉपी हो गया!
                                </>
                              ) : (
                                <>
                                  <Copy size={10} /> JSON कॉपी करें
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Rendering corresponding active tab panel */}
                        {viewMode === 'form' ? (
                          <FormRowEditor
                            item={item}
                            table={activeTab}
                            onSave={handleSaveEdit}
                            onDelete={handleDeleteRecord}
                          />
                        ) : (
                          <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto bg-slate-950 p-4 rounded-xl border border-white/5 leading-relaxed text-left">
                            {jsonString}
                          </pre>
                        )}
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

      {/* Slide-over / Popup Modal Drawer: Add New Database Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 w-full max-w-xl flex flex-col gap-4 text-left relative animate-scaleIn shadow-premium max-h-[85vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-brand-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  नया रिकॉर्ड जोड़ें (Add New to '{activeTab}')
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal insertion form */}
            <form onSubmit={handleCreateRecord} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tableFields[activeTab] || []).map(f => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {f.label} {f.required && <span className="text-rose-400">*</span>}
                    </label>

                    {f.type === 'select' ? (
                      <select
                        value={newRecordFormData[f.name] || ''}
                        onChange={e => handleNewRecordChange(f.name, e.target.value)}
                        required={f.required}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all"
                      >
                        <option value="">चुनें (Select)...</option>
                        {f.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        value={newRecordFormData[f.name] || ''}
                        onChange={e => handleNewRecordChange(f.name, e.target.value)}
                        required={f.required}
                        rows={3}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all sm:col-span-2"
                      />
                    ) : f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer py-2">
                        <input
                          type="checkbox"
                          checked={!!newRecordFormData[f.name]}
                          onChange={e => handleNewRecordChange(f.name, e.target.checked, 'checkbox')}
                          className="rounded bg-slate-900 border-white/10 text-brand-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                        />
                        <span className="text-xs text-slate-300">सक्रिय / स्वीकृत (Enabled)</span>
                      </label>
                    ) : (
                      <input
                        type={f.type}
                        value={newRecordFormData[f.name] || ''}
                        onChange={e => handleNewRecordChange(f.name, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                        required={f.required}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form buttons */}
              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white uppercase transition-all"
                >
                  रद्द करें (Cancel)
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white uppercase transition-all shadow-premium"
                >
                  रिकॉर्ड जोड़ें (Insert Record)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseInspector;
