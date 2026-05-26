import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Building, KeyRound, ChevronRight, UserCheck, Home as HomeIcon, Users, ShieldAlert } from 'lucide-react';
import { SOCIETY_FLATS } from '../../utils/flats';

export const Home = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Resident');
  const [regFlatNo, setRegFlatNo] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [residentType, setResidentType] = useState('Owner');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  
  // New Resident Fields
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyMemberNames, setFamilyMemberNames] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // Stores Base64 photo string
  const [hasPet, setHasPet] = useState(false);
  const [petDetails, setPetDetails] = useState('');
  const [tenantCategory, setTenantCategory] = useState('Family'); // 'Family' or 'Bachelor'

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleFamilyMembersChange = (e) => {
    const val = e.target.value;
    setFamilyMembers(val);
    const count = parseInt(val) || 0;
    // Limit to a reasonable max like 15 to prevent UI breaking
    const safeCount = Math.min(count, 15);
    setFamilyMemberNames(prev => {
      const newArr = [...prev];
      if (safeCount > newArr.length) {
        for (let i = newArr.length; i < safeCount; i++) newArr.push({ name: '', phone: '', gender: 'Male' });
      } else if (safeCount < newArr.length) {
        newArr.splice(safeCount);
      }
      return newArr;
    });
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFamilyMemberNames(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { type: 'Car', number: '', sticker: false }]);
  };

  const handleRemoveVehicle = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleVehicleChange = (index, field, value) => {
    setVehicles(prev => {
      const newArr = [...prev];
      newArr[index][field] = value;
      return newArr;
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Security') navigate('/visitor-logs');
      else navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (regRole === 'Resident' && residentType === 'Renter') {
      if (tenantCategory === 'Bachelor') {
        setFormError('माँ कौशल्या अपार्टमेंट नियमों के अनुसार बैचलर्स/अविवाहित समूहों का नया पंजीकरण वर्जित है। यदि आप पूर्व से यहाँ रह रहे अधिकृत किरायेदार हैं, तो कृपया आरडब्ल्यूए कार्यालय से संपर्क करें।');
        return;
      }
      if (!ownerName.trim()) { setFormError('Flat Owner name is required for renters.'); return; }
      if (!ownerPhone.trim()) { setFormError('Flat Owner phone is required for renters.'); return; }
    }
    try {
      const user = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        flatNo: regRole === 'Resident' ? regFlatNo : null,
        phone: regPhone,
        occupancyStatus: regRole === 'Resident' ? (residentType === 'Owner' ? 'Self-Occupied' : 'Rented') : null,
        ownerName: (regRole === 'Resident' && residentType === 'Renter') ? ownerName : null,
        ownerPhone: (regRole === 'Resident' && residentType === 'Renter') ? ownerPhone : null,
        aadhaarNumber: aadhaarNumber || null,
        familyMembers: familyMembers ? parseInt(familyMembers) : null,
        familyMemberNames: familyMemberNames.length > 0 ? JSON.stringify(familyMemberNames) : null,
        vehicles: vehicles.length > 0 ? JSON.stringify(vehicles) : null,
        moveInDate: moveInDate || null,
        leaseDuration: (regRole === 'Resident' && residentType === 'Renter') ? leaseDuration : null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        profilePicture: profilePicture || null,
        hasPet: regRole === 'Resident' ? hasPet : false,
        petDetails: (regRole === 'Resident' && hasPet) ? petDetails : null,
      });
      setFormSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        if (user.role === 'Admin') navigate('/admin');
        else if (user.role === 'Security') navigate('/visitor-logs');
        else navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Try a different email.');
    }
  };

  const fillDemoCredentials = (demoRole) => {
    if (demoRole === 'Admin') { setEmail('admin@maakaushalya.com'); setPassword('password123'); }
    else if (demoRole === 'Resident') { setEmail('resident@maakaushalya.com'); setPassword('password123'); }
    else if (demoRole === 'Security') { setEmail('guard@maakaushalya.com'); setPassword('password123'); }
    setActiveTab('login');
  };

  const inputCls = "bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 text-xs focus:border-brand-500 focus:outline-none transition-colors w-full";

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-140px)]">

      {/* === LEFT: Hero Section === */}
      <div className="flex-1 text-left flex flex-col gap-6 animate-fadeInUp">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold w-fit tracking-wide uppercase">
          <ShieldCheck size={14} />
          Certified Premium Gated Society
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          {'\u092e\u093e\u0901 \u0915\u094c\u0936\u0932\u094d\u092f\u093e'} <br />
          <span className="gradient-text">{'\u0905\u092a\u093e\u0930\u094d\u091f\u092e\u0947\u0902\u091f'}</span> {'\u0938\u0947\u0915\u094d\u091f\u0930 1'}
        </h1>

        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
          {'\u092e\u093e\u0901 \u0915\u094c\u0936\u0932\u094d\u092f\u093e \u0905\u092a\u093e\u0930\u094d\u091f\u092e\u0947\u0902\u091f, \u0938\u0947\u0915\u094d\u091f\u0930 1 \u0915\u0947 \u0921\u093f\u091c\u093f\u091f\u0932 \u092a\u094b\u0930\u094d\u091f\u0932 \u092a\u0930 \u0906\u092a\u0915\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948\u0964 \u0939\u092e\u093e\u0930\u093e \u092a\u094d\u0930\u092c\u0902\u0927\u0928 \u092a\u094d\u0932\u0947\u091f\u092b\u0949\u0930\u094d\u092e \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924, \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0940 \u0914\u0930 \u0916\u0941\u0936\u0939\u093e\u0932 \u091c\u0940\u0935\u0928 \u0938\u0941\u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948\u0964'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="glass-panel-light p-4 rounded-2xl flex items-start gap-3 border border-white/5 hover:border-brand-500/25 transition-all hover:scale-[1.02] duration-300">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
              <Building size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resident Portal</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay bills, file complaints, view notice board.</p>
            </div>
          </div>
          <div className="glass-panel-light p-4 rounded-2xl flex items-start gap-3 border border-white/5 hover:border-emerald-500/25 transition-all hover:scale-[1.02] duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <KeyRound size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Secure Gateway</h4>
              <p className="text-xs text-slate-400 mt-0.5">Security desk visitor entry and gate management.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 mt-4 border-t border-white/5 pt-5">
          <div>
            <span className="text-3xl font-extrabold text-white">450+</span>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Residents</p>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <span className="text-3xl font-extrabold text-white">24/7</span>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Gate Guards</p>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <span className="text-3xl font-extrabold text-white">100%</span>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">RWA Managed</p>
          </div>
        </div>
      </div>

      {/* === RIGHT: Form Section === */}
      <div className="w-full max-w-md flex flex-col gap-4 animate-scaleIn">

        {/* Demo logins */}
        <div className="glass-panel p-4 rounded-3xl border border-white/5 glow-brand">
          <span className="text-xs font-bold text-brand-300 uppercase tracking-widest block mb-2 text-center">
            Quick Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => fillDemoCredentials('Admin')}
              className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-[10px] font-bold text-rose-400 transition-all uppercase">
              Admin
            </button>
            <button onClick={() => fillDemoCredentials('Resident')}
              className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-[10px] font-bold text-emerald-400 transition-all uppercase">
              Resident
            </button>
            <button onClick={() => fillDemoCredentials('Security')}
              className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-[10px] font-bold text-amber-400 transition-all uppercase">
              Guard
            </button>
          </div>
        </div>

        {/* Main form card */}
        <div className="glass-panel p-7 rounded-3xl border border-white/5">

          {/* Tabs */}
          <div className="flex border-b border-white/5 pb-4 mb-5">
            <button onClick={() => { setActiveTab('login'); setFormError(''); }}
              className={`flex-1 text-center pb-2 text-sm font-bold tracking-wider uppercase transition-all ${activeTab === 'login' ? 'border-b-2 border-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              Sign In
            </button>
            <button onClick={() => { setActiveTab('register'); setFormError(''); }}
              className={`flex-1 text-center pb-2 text-sm font-bold tracking-wider uppercase transition-all ${activeTab === 'register' ? 'border-b-2 border-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              Join Portal
            </button>
          </div>

          {/* ─── LOGIN ─── */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Email Address</label>
                <input type="email" required placeholder="resident@maakaushalya.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm focus:border-brand-500 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Password</label>
                <input type="password" required placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm focus:border-brand-500 focus:outline-none transition-colors" />
              </div>
              {formError && <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2.5 rounded-xl">{formError}</div>}
              <button type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 border border-brand-500/20 rounded-xl font-bold tracking-wide uppercase text-sm shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center gap-2 text-white">
                Enter Portal <ChevronRight size={16} />
              </button>
            </form>
          ) : (
              /* ─── REGISTRATION ─── */
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              {/* RWA Bachelor Prohibited Policy Warning Banner */}
              <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-2xl flex items-start gap-2.5 text-left mb-1 animate-fadeIn">
                <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[9px] font-black uppercase tracking-wider text-rose-400">आरडब्ल्यूए नीति (RWA Policy Alert)</h4>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    माँ कौशल्या अपार्टमेंट नियमों के अनुसार **बैचलर्स/अविवाहित किरायेदारों** को फ्लैट किराए पर देना सख्त वर्जित (Prohibited) है। केवल पारिवारिक पंजीकरण ही मान्य हैं।
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">पूरा नाम (Full Name)</label>
                <input type="text" required placeholder="पूरा नाम दर्ज करें"
                  value={regName} onChange={(e) => setRegName(e.target.value)} className={inputCls} />
              </div>

              {/* Email + Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">ईमेल पता (Email Address)</label>
                  <input type="email" required placeholder="email@domain.com"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">पासवर्ड (Password)</label>
                  <input type="password" required placeholder="Min. 6 chars"
                    value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Role + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">भूमिका आवंटित करें (Role)</label>
                  <select value={regRole} onChange={(e) => { setRegRole(e.target.value); setResidentType('Owner'); }}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors">
                    <option value="Resident">निवासी (Resident)</option>
                    <option value="Admin">प्रशासक (Admin - Resident Welfare Association)</option>
                    <option value="Security">सुरक्षा गार्ड (Security)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">संपर्क फोन नंबर (Phone)</label>
                  <input type="tel" placeholder="+9198765432" required
                    value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Common Metadata Fields: Aadhaar, Emergency Contact, Profile Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">आधार नंबर / ID (Aadhaar No.)</label>
                  <input type="text" placeholder="1234 5678 9012"
                    value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} className={inputCls} />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">फ्लैट नंबर (Flat No.)</label>
                  <select disabled={regRole !== 'Resident'} required={regRole === 'Resident'} value={regFlatNo} onChange={(e) => setRegFlatNo(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-40">
                    <option value="">फ्लैट नंबर चुनें</option>
                    {SOCIETY_FLATS.map(flat => (
                      <option key={flat} value={flat}>{flat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-3">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">आपातकालीन संपर्क नाम (Emergency Name)</label>
                  <input type="text" placeholder="संपर्क व्यक्ति का नाम"
                    value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-bold uppercase text-slate-400">आपातकालीन फ़ोन (Emergency Phone)</label>
                  <input type="tel" placeholder="+9198765432"
                    value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Profile Photo Uploader (Base64 conversion matching Admin Directory) */}
              <div className="flex flex-col gap-1 text-left border-t border-white/5 pt-3">
                <label className="text-xs font-bold uppercase text-slate-400">निवासी फोटो (Resident Profile Photo)</label>
                <div className="flex items-center gap-3.5 bg-slate-950/40 border border-white/10 rounded-2xl p-3">
                  <div className="w-14 h-14 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-brand-400">👤</span>
                    )}
                    {profilePicture && (
                      <button 
                        type="button" 
                        onClick={() => setProfilePicture('')} 
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
                      id="profile-upload-reg"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfilePicture(reader.result); // Stores base64 string
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload-reg"
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider text-center cursor-pointer transition-colors shadow-premium w-fit"
                    >
                      फोटो चुनें / अपलोड करें
                    </label>
                    <p className="text-[8px] text-slate-500 leading-normal">PNG, JPG या GIF। फोटो सीधे डेटाबेस में सहेजी जाएगी।</p>
                  </div>
                </div>
              </div>

              {/* Resident-specific section */}
              {regRole === 'Resident' && (
                <>
                  {/* Owner / Renter Toggle */}
                  <div className="flex flex-col gap-1.5 text-left border-t border-white/5 pt-3">
                    <label className="text-xs font-bold uppercase text-slate-400">कब्जा स्थिति (Occupancy Status)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setResidentType('Owner')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          residentType === 'Owner'
                            ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-[0_0_14px_rgba(212,175,55,0.2)]'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}>
                        <HomeIcon size={12} />
                        स्व-कब्जा (Flat Owner)
                      </button>
                      <button type="button" onClick={() => setResidentType('Renter')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          residentType === 'Renter'
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_14px_rgba(99,102,241,0.2)]'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}>
                        <Users size={12} />
                        किराये पर (Renter / Tenant)
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 pl-1">
                      {residentType === 'Owner'
                        ? 'आप इस फ्लैट के स्थायी मालिक हैं (Self-Occupied).'
                        : 'आप किरायेदार हैं। मकान मालिक का विवरण नीचे देना आवश्यक है।'}
                    </p>
                  </div>

                  {/* New Resident fields: Family, Move-in */}
                  <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-xs font-bold uppercase text-slate-400">परिवार का आकार (Family Size)</label>
                      <input type="number" placeholder="उदा: 4" min="1" max="15"
                        value={familyMembers} onChange={handleFamilyMembersChange} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-xs font-bold uppercase text-slate-400">प्रवेश तिथि (Move-in Date)</label>
                      <input type="date"
                        value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  {/* Dynamic Pet owned section */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl animate-fadeIn text-left mt-3">
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xl">🐾</span>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-xs font-bold uppercase text-slate-200">पालतू जानवर (Pet Owned?)</label>
                        <p className="text-[10px] text-slate-400">क्या परिवार के पास पालतू पशु है?</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200 w-fit">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="add-has-pet"
                            checked={hasPet === true}
                            onChange={() => setHasPet(true)}
                            className="accent-brand-500 w-4 h-4 cursor-pointer"
                          />
                          <span>हाँ (Yes)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                          <input
                            type="radio"
                            name="add-has-pet"
                            checked={hasPet === false}
                            onChange={() => {
                              setHasPet(false);
                              setPetDetails('');
                            }}
                            className="accent-brand-500 w-4 h-4 cursor-pointer"
                          />
                          <span>नहीं (No)</span>
                        </label>
                      </div>

                      {hasPet && (
                        <div className="flex-1 flex flex-col gap-1 w-full animate-fadeIn">
                          <input
                            type="text"
                            required
                            placeholder="पालतू पशु का प्रकार व संख्या (जैसे: 1 कुत्ता, 2 बिल्लियां)"
                            value={petDetails}
                            onChange={(e) => setPetDetails(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none w-full transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {familyMemberNames.length > 0 && (
                    <div className="flex flex-col gap-2.5 p-3 bg-brand-500/5 border border-brand-500/20 rounded-2xl animate-fadeIn mt-3">
                      <p className="text-[10px] font-extrabold uppercase text-brand-300 tracking-wider text-left">👨‍👩‍👧‍👦 परिवार के सदस्य विवरण (Family Details)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {familyMemberNames.map((member, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-1.5">
                            <p className="text-[8px] font-extrabold uppercase text-brand-400 tracking-wider text-left">सदस्य {idx + 1}</p>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[8px] font-bold uppercase text-slate-400">नाम (Name)</label>
                                <input type="text" placeholder="नाम दर्ज करें" required
                                  value={member.name || ''} onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-brand-500 focus:outline-none transition-colors w-full" />
                              </div>
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[8px] font-bold uppercase text-slate-400">फ़ोन (Phone)</label>
                                <input type="tel" placeholder="मोबाइल नंबर" required
                                  value={member.phone || ''} onChange={(e) => handleFamilyMemberChange(idx, 'phone', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-brand-500 focus:outline-none transition-colors w-full" />
                              </div>
                              <div className="flex flex-col gap-1 text-left">
                                <label className="text-[8px] font-bold uppercase text-slate-400">जेंडर (Gender)</label>
                                <select
                                  value={member.gender || 'Male'}
                                  onChange={(e) => handleFamilyMemberChange(idx, 'gender', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-2 text-slate-200 text-[10px] focus:border-brand-500 focus:outline-none w-full appearance-none transition-colors"
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vehicles Section */}
                  <div className="flex flex-col gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-extrabold uppercase text-emerald-300 tracking-wider">🚗 पंजीकृत वाहन विवरण (Registered Vehicles)</p>
                      <button type="button" onClick={handleAddVehicle} className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/40 transition-colors">
                        + वाहन जोड़ें (Add Vehicle)
                      </button>
                    </div>
                    {vehicles.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {vehicles.map((vehicle, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-white/5 text-left">
                            <div className="flex items-center gap-2">
                              <select value={vehicle.type} onChange={(e) => handleVehicleChange(idx, 'type', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-emerald-500 focus:outline-none w-1/3">
                                <option value="Car">Car</option>
                                <option value="Bike">Bike / Scooty</option>
                              </select>
                              <input type="text" placeholder="उदा: CG04 AB 1234" required
                                value={vehicle.number} onChange={(e) => handleVehicleChange(idx, 'number', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-emerald-500 focus:outline-none flex-1 font-mono uppercase" />
                              <button type="button" onClick={() => handleRemoveVehicle(idx)} className="text-rose-400 hover:text-rose-300 px-1">
                                ✕
                              </button>
                            </div>
                            {/* Sticker option */}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-slate-300 hover:text-white transition-colors w-fit self-end">
                              <input
                                type="checkbox"
                                checked={vehicle.sticker === true}
                                onChange={(e) => handleVehicleChange(idx, 'sticker', e.target.checked)}
                                className="accent-emerald-500 w-3 h-3 cursor-pointer"
                              />
                              <span>🎫 Society Sticker Issued? (सोसायटी स्टीकर जारी?)</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">कोई पंजीकृत वाहन नहीं है।</p>
                    )}
                  </div>

                  {/* Owner details — only for renters */}
                  {residentType === 'Renter' && (
                    <>
                      {/* Tenant Category Selector */}
                      <div className="flex flex-col gap-1.5 text-left border border-white/5 bg-slate-900/30 p-3.5 rounded-2xl mt-3 animate-fadeIn">
                        <label className="text-xs font-bold uppercase text-slate-400">किरायेदार श्रेणी (Tenant Category)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => setTenantCategory('Family')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                              tenantCategory === 'Family'
                                ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-[0_0_14px_rgba(212,175,55,0.2)]'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                            }`}>
                            👪 पारिवारिक (Family)
                          </button>
                          <button type="button" onClick={() => setTenantCategory('Bachelor')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                              tenantCategory === 'Bachelor'
                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_14px_rgba(239,68,68,0.2)]'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                            }`}>
                            🚶 अविवाहित (Bachelor)
                          </button>
                        </div>

                        {tenantCategory === 'Bachelor' && (
                          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl mt-2 flex items-start gap-2.5 text-rose-400 animate-fadeIn">
                            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[10px] leading-normal font-bold">
                                * आरडब्ल्यूए सुरक्षा नीति सूचना: माँ कौशल्या अपार्टमेंट नियमों के अनुसार बैचलर्स/अविवाहित समूहों का स्वयं ऑनलाइन पंजीकरण वर्जित है।
                              </p>
                              <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                                यदि आप पूर्व समय से ही आरडब्ल्यूए बोर्ड की विशेष अनुमति (Signed Undertaking) के साथ यहाँ रह रहे पूर्व किरायेदार हैं, तो कृपया अपने डेटा के सत्यापन और मैन्युअल पंजीकरण के लिए आरडब्ल्यूए (RWA) कार्यालय से संपर्क करें।
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {tenantCategory === 'Family' && (
                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 flex flex-col gap-2.5 mt-3 text-left">
                          <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            Owner Details — Required for Renter (फ्लैट मालिक का विवरण)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">फ्लैट मालिक का नाम (Owner Name)</label>
                              <input type="text" required placeholder="फ्लैट मालिक का पूरा नाम"
                                value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 text-xs focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">मालिक का फोन नंबर (Owner Phone)</label>
                              <input type="tel" required placeholder="+9198765432"
                                value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 text-xs focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 mt-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">पट्टा अवधि (Lease Period)</label>
                            <input type="text" placeholder="उदा: 11 months"
                              value={leaseDuration} onChange={(e) => setLeaseDuration(e.target.value)}
                              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 text-xs focus:border-indigo-500 focus:outline-none transition-colors" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {formError && <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl text-left">{formError}</div>}
              {formSuccess && <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl text-left">{formSuccess}</div>}

              <button type="submit"
                disabled={regRole === 'Resident' && residentType === 'Renter' && tenantCategory === 'Bachelor'}
                className={`w-full mt-2 py-3 bg-gradient-to-r rounded-xl font-bold tracking-wide uppercase text-xs shadow-premium transition-all flex items-center justify-center gap-2 text-white ${
                  (regRole === 'Resident' && residentType === 'Renter' && tenantCategory === 'Bachelor')
                    ? 'from-slate-800 to-slate-900 border border-white/5 opacity-50 cursor-not-allowed text-slate-500'
                    : 'from-violet-600 to-brand-600 hover:from-violet-500 hover:to-brand-500 border border-brand-500/20 hover:shadow-premium-hover'
                }`}>
                {(regRole === 'Resident' && residentType === 'Renter' && tenantCategory === 'Bachelor')
                  ? 'पंजीकरण प्रतिबंधित (Registration Prohibited)'
                  : 'पंजीकरण पूर्ण करें / REGISTER'} <UserCheck size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
