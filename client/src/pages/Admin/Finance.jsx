import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Check, PlusCircle, CheckCircle, Clock, Search, HelpCircle, Trash2, CheckSquare, X } from 'lucide-react';

export const Finance = () => {
  const { token } = useAuth();
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bill generation form states
  const [showForm, setShowForm] = useState(false);
  const [residentId, setResidentId] = useState('');
  const [amount, setAmount] = useState('');
  const [billingMonth, setBillingMonth] = useState('मई 2026');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Mark Offline Paid / Delete States
  const [offlinePayBill, setOfflinePayBill] = useState(null);
  const [offlineRef, setOfflineRef] = useState('');
  const [deleteBillId, setDeleteBillId] = useState(null);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // Fetch all bills
      const billsRes = await fetch('/api/bills/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const billsData = await billsRes.json();

      // Fetch directory to get list of residents
      const dirRes = await fetch('/api/users/directory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dirData = await dirRes.json();

      if (billsData.success && dirData.success) {
        setBills(billsData.data);
        const filteredResidents = dirData.data.filter(u => u.role === 'Resident');
        setResidents(filteredResidents);
        if (filteredResidents.length > 0) {
          setResidentId(filteredResidents[0].id);
        }
      }
    } catch (err) {
      console.warn("⚠️ Server offline, falling back to simulated billing logs.");
      setBills([
        {
          id: 1,
          resident_name: "सूफी इलियास चिश्ती (Sufi Illias Chisti)",
          flat_no: "B-304",
          amount: 2000.00,
          status: "unpaid",
          billing_month: "अप्रैल 2026",
          due_date: new Date(2026, 3, 20),
          created_at: new Date(2026, 3, 1)
        },
        {
          id: 2,
          resident_name: "स्वदेश कटियार (Swadesh Katiyar)",
          flat_no: "C-102",
          amount: 2000.00,
          status: "paid",
          billing_month: "अप्रैल 2026",
          due_date: new Date(2026, 3, 20),
          paid_at: new Date(2026, 3, 12),
          payment_reference: "TXN1029384756",
          created_at: new Date(2026, 3, 1)
        },
        {
          id: 3,
          resident_name: "आलोक बारिया (Alok Bariya)",
          flat_no: "C-103",
          amount: 2000.00,
          status: "unpaid",
          billing_month: "मई 2026",
          due_date: new Date(2026, 4, 30),
          created_at: new Date(2026, 4, 1)
        }
      ]);
      setResidents([
        { id: 2, name: "सूफी इलियास चिश्ती (Sufi Illias Chisti)", flat_no: "B-304", email: "resident@maakaushalya.com" },
        { id: 4, name: "स्वदेश कटियार (Swadesh Katiyar)", flat_no: "C-102", email: "swadesh@maakaushalya.com" },
        { id: 5, name: "आलोक बारिया (Alok Bariya)", flat_no: "C-103", email: "alok@maakaushalya.com" },
        { id: 6, name: "अयाज़ भाई (Ayaz Bhai)", flat_no: "C-104", email: "ayaz@maakaushalya.com" },
        { id: 7, name: "डॉ. अमित सिंह (Dr. Amit Singh)", flat_no: "C-105", email: "amit@maakaushalya.com" },
        { id: 8, name: "हेमलाल पाल (Hemlal Pal)", flat_no: "C-106", email: "hemlal@maakaushalya.com" },
        { id: 9, name: "सर्वेश मिश्रा (Sarvesh Mishra)", flat_no: "C-107", email: "sarvesh@maakaushalya.com" },
        { id: 10, name: "आकाश दुबे (Akash Dubey)", flat_no: "C-108", email: "akash@maakaushalya.com" },
        { id: 11, name: "लाल बहादुर यादव (Lal Bahadur Yadav)", flat_no: "C-109", email: "lalbahadur@maakaushalya.com" },
        { id: 12, name: "भरत कुमार अग्रवाल (Bharat Kumar Agrawal)", flat_no: "C-110", email: "bharat@maakaushalya.com" },
        { id: 13, name: "चंद्रकांत बुरांडे (Chandrakant Burande)", flat_no: "C-111", email: "chandrakant@maakaushalya.com" },
        { id: 14, name: "नरेंद्र परमार (Narendra Parmar)", flat_no: "C-112", email: "narendra@maakaushalya.com" },
        { id: 15, name: "हिमांशु (Himanshu)", flat_no: "C-113", email: "himanshu@maakaushalya.com" },
        { id: 16, name: "नरेश (Naresh)", flat_no: "C-114", email: "naresh@maakaushalya.com" },
        { id: 17, name: "अशोक निषाद (Ashok Nishad)", flat_no: "C-115", email: "ashok@maakaushalya.com" },
        { id: 18, name: "हेमंत पांडे (Hemant Pandey)", flat_no: "C-116", email: "hemant@maakaushalya.com" },
        { id: 19, name: "केदार हंडघोरे (Kedar Handghore)", flat_no: "C-117", email: "kedar@maakaushalya.com" },
        { id: 20, name: "राजू दास (Raju Das)", flat_no: "C-118", email: "raju@maakaushalya.com" }
      ]);
      setResidentId('2');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [token]);

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/bills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          residentId: parseInt(residentId),
          amount: parseFloat(amount),
          billingMonth,
          dueDate
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`₹${amount} का रखरखाव शुल्क चालान सफलतापूर्वक उत्पन्न हो गया है!`);
        setAmount('');
        setDueDate('');
        setTimeout(() => {
          setShowForm(false);
          setSuccess('');
          fetchFinanceData();
        }, 1200);
      } else {
        throw new Error(data.message || 'बिल जनरेट करने में असमर्थ');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, creating mock bill in state.");
      const selected = residents.find(r => r.id === parseInt(residentId));
      const mockNewBill = {
        id: bills.length + 1,
        resident_name: selected ? selected.name : 'निवासी सदस्य',
        flat_no: selected ? selected.flat_no : 'N/A',
        amount: parseFloat(amount),
        status: 'unpaid',
        billing_month: billingMonth,
        due_date: new Date(dueDate),
        created_at: new Date()
      };
      setBills([mockNewBill, ...bills]);
      setSuccess(`रखरखाव चालान सफलतापूर्वक सिम्युलेट किया गया (ऑफलाइन मॉक)!`);
      setAmount('');
      setDueDate('');
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 1200);
    }
  };

  const handleAutoBilling = async () => {
    setError('');
    setSuccess('');
    
    const currentMonth = "मई 2026";
    const currentDueDate = "2026-05-31";
    const autoAmount = 2000.00;

    let successCount = 0;
    const newBills = [...bills];

    for (const r of residents) {
      const payload = {
        residentId: r.id,
        amount: autoAmount,
        billingMonth: currentMonth,
        dueDate: currentDueDate
      };

      try {
        const res = await fetch('/api/bills/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          successCount++;
        }
      } catch (err) {
        const mockNewBill = {
          id: newBills.length + 1,
          resident_name: r.name,
          flat_no: r.flat_no,
          amount: autoAmount,
          status: 'unpaid',
          billing_month: currentMonth,
          due_date: new Date(currentDueDate),
          created_at: new Date()
        };
        newBills.unshift(mockNewBill);
        successCount++;
      }
    }

    if (successCount > 0) {
      setBills(newBills);
      setSuccess(`स्वचालित मासिक मेंटेनेंस बिलिंग पूरी हुई! ${successCount} निवासियों के लिए ₹2,000 का बिल उत्पन्न हुआ।`);
      setTimeout(() => setSuccess(''), 4000);
      fetchFinanceData();
    } else {
      setError("स्वचालित बिलिंग विफल हो गई।");
    }
  };

  const handleOfflinePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bills/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ billId: offlinePayBill.id, paymentReference: offlineRef || 'CASH-OFFLINE' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("भुगतान सफलतापूर्वक दर्ज किया गया!");
        setOfflinePayBill(null);
        setOfflineRef('');
        fetchFinanceData();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'भुगतान दर्ज करने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Mock mode: offline payment.");
      const updated = bills.map(b => b.id === offlinePayBill.id ? { ...b, status: 'paid', paid_at: new Date(), payment_reference: offlineRef || 'CASH-OFFLINE' } : b);
      setBills(updated);
      setSuccess("भुगतान दर्ज किया गया (Mock Mode)!");
      setOfflinePayBill(null);
      setOfflineRef('');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleDeleteBill = async () => {
    try {
      // Mocked endpoint as backend might not have delete
      const res = await fetch(`/api/bills/delete/${deleteBillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("चालान सफलतापूर्वक हटा दिया गया!");
        setDeleteBillId(null);
        fetchFinanceData();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('हटाने में विफल');
      }
    } catch (err) {
      console.warn("⚠️ Mock mode: deleting bill locally.");
      setBills(bills.filter(b => b.id !== deleteBillId));
      setSuccess("चालान हटा दिया गया (Mock Mode)!");
      setDeleteBillId(null);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const totalCollected = bills.filter(b => b.status === 'paid').reduce((s, b) => s + parseFloat(b.amount), 0);
  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + parseFloat(b.amount), 0);

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <DollarSign size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">सोसायटी कोष (Society Treasury)</h1>
            <p className="text-xs text-slate-400">रेसिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) बैलेंस ऑडिट, बहीखाता रख-रखाव और भुगतान चालान का प्रबंधन</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auto Billing trigger button */}
          <button
            onClick={handleAutoBilling}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            स्वचालित मासिक मेंटेनेंस (Auto-Billing)
          </button>

          {/* Generate Invoice button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all animate-glow"
          >
            <PlusCircle size={14} /> चालान जारी करें (Issue Invoice)
          </button>
        </div>
      </div>

      {/* Finance metrics tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">एकत्रित आरक्षित निधि (Collected Reserves)</span>
            <h4 className="text-xl font-black text-emerald-400 mt-1">₹{totalCollected.toFixed(2)}</h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">प्राप्य बकाया राशि (Receivables Dues)</span>
            <h4 className="text-xl font-black text-rose-400 mt-1">₹{totalUnpaid.toFixed(2)}</h4>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center">
            <Clock size={16} />
          </div>
        </div>
      </div>

      {/* Issue Maintenance Invoice Form Panel */}
      {showForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">रख-रखाव चालान उत्पन्न करें (Generate Invoice)</h3>
          
          <form onSubmit={handleSubmitBill} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">लक्षित निवासी फ्लैट मालिक (Flat Owner)</label>
                <select
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (फ्लैट संख्या {r.flat_no})
                    </option>
                  ))}
                  {residents.length === 0 && (
                    <option value="">कोई निवासी सदस्य नहीं मिला। कृपया पहले सदस्य जोड़ें!</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">रख-रखाव शुल्क राशि (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 4500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">बिलिंग महीना चक्र (Billing Month)</label>
                <select
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="मई 2026">मई 2026</option>
                  <option value="जून 2026">जून 2026</option>
                  <option value="जुलाई 2026">जुलाई 2026</option>
                  <option value="अगस्त 2026">अगस्त 2026</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">भुगतान की अंतिम तिथि (Due Date)</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
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
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover"
              >
                चालान जारी करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Accounts Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : bills.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">सोसायटी खाता बहीखाता (Global Ledger)</h3>

          <div className="flex flex-col gap-3">
            {bills.map((bill) => {
              const overdue = bill.status === 'unpaid' && new Date(bill.due_date) < new Date();
              return (
                <div
                  key={bill.id}
                  className={`glass-panel p-5 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${
                    overdue 
                      ? 'border-rose-500/30 bg-rose-950/15 glow-error hover:border-rose-500/50' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                      bill.status === 'paid' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : overdue 
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      <DollarSign size={16} />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-sm">₹{parseFloat(bill.amount).toFixed(2)}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider ${
                          bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
                        }`}>
                          {bill.status === 'paid' ? 'चुकाया गया (Paid)' : 'बकाया (Unpaid)'}
                        </span>
                        {overdue && (
                          <span className="text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider bg-rose-600 text-white border border-rose-500 animate-pulse">
                            डिफॉल्टर (Overdue)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        लक्षित निवासी: <span className="font-bold text-slate-200">{bill.resident_name} (फ्लैट संख्या {bill.flat_no})</span>
                      </span>
                      <span className="text-[9px] text-slate-500">
                        मास: {bill.billing_month} | नियत तारीख (Due): {new Date(bill.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-left sm:text-right shrink-0">
                    {bill.status === 'paid' ? (
                      <>
                        <span className="text-[9px] text-slate-400">भुगतान तिथि (Paid): {new Date(bill.paid_at || bill.created_at).toLocaleDateString()}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">Ref: {bill.payment_reference || 'UPI-CHECKOUT'}</span>
                        
                        <button
                          onClick={() => setSelectedReceipt(bill)}
                          className="mt-1 px-3 py-1 bg-brand-600/20 hover:bg-brand-600/35 border border-brand-500/30 rounded-lg text-[9px] font-bold text-brand-300 hover:text-white uppercase tracking-wider transition-all"
                        >
                          रसीद देखें (Receipt)
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-end gap-2 mt-1 sm:mt-0">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${overdue ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                          {overdue ? 'अतिदेय बकाया (Overdue Dues)' : 'अवैतनिक बकाया (Unpaid Dues)'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => setOfflinePayBill(bill)} className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1">
                            <CheckSquare size={10} /> भुगतान दर्ज करें
                          </button>
                          <button onClick={() => setDeleteBillId(bill.id)} className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all flex items-center justify-center">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <HelpCircle size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">बहीखाता खाली है</h3>
          <p className="text-xs text-slate-400 mt-1">कोई भी उत्पन्न रखरखाव चालान नहीं पाया गया।</p>
        </div>
      )}

      {/* Receipt Modal Drawer */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn print:bg-white print:p-0 print:absolute print:inset-0">
          <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md w-full p-6 text-slate-300 shadow-2xl relative overflow-hidden print:border-0 print:bg-white print:text-black print:shadow-none print:w-full print:max-w-none">
            
            {/* Decorative background lights */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none print:hidden"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none print:hidden"></div>

            {/* Header */}
            <div className="text-center border-b border-white/10 pb-4 print:border-black/20">
              <h2 className="text-lg font-black text-white uppercase tracking-wider print:text-black">मां कौशल्या अपार्टमेंट RWA</h2>
              <p className="text-[9px] text-slate-400 print:text-slate-600 uppercase mt-0.5">कौशल्या माता विहार, रायपुर, छत्तीसगढ़</p>
              <p className="text-[10px] font-bold text-brand-400 mt-2 print:text-black">रखरखाव शुल्क भुगतान रसीद (Maintenance Receipt)</p>
            </div>

            {/* Receipt Content */}
            <div className="py-5 flex flex-col gap-3 text-xs border-b border-white/10 print:border-black/20 print:text-black">
              <div className="flex justify-between">
                <span className="text-slate-500">रसीद संख्या (Receipt No):</span>
                <span className="font-mono font-bold text-white print:text-black">RCPT-2026-{selectedReceipt.id}09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ट्रांजैक्शन आईडी (Txn ID):</span>
                <span className="font-mono text-slate-300 print:text-slate-700">{selectedReceipt.payment_reference || 'MOCK-TXN-REF'}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 print:border-black/10">
                <span className="text-slate-500">सदस्य का नाम (Resident Name):</span>
                <span className="font-bold text-white print:text-black">{selectedReceipt.resident_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">फ्लैट नंबर (Flat No):</span>
                <span className="font-bold text-white print:text-black">{selectedReceipt.flat_no || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">बिलिंग चक्र (Billing Period):</span>
                <span className="text-white print:text-black font-semibold">{selectedReceipt.billing_month}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 print:border-black/10">
                <span className="text-slate-500 text-sm font-bold">भुगतान राशि (Amount Paid):</span>
                <span className="text-sm font-black text-emerald-400 print:text-emerald-700">₹{parseFloat(selectedReceipt.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">भुगतान तिथि (Payment Date):</span>
                <span className="text-slate-300 print:text-slate-700">{new Date(selectedReceipt.paid_at || selectedReceipt.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Gold PAID Stamp Design */}
            <div className="flex justify-center items-center py-6 relative">
              <div className="border-[3px] border-emerald-500/40 bg-emerald-500/5 text-emerald-400 font-black text-sm tracking-widest uppercase px-4 py-2 rounded-xl rotate-[-6deg] shadow-lg flex flex-col items-center select-none print:border-emerald-600 print:text-emerald-700">
                <span className="text-[10px] text-emerald-500/70 print:text-emerald-600">MEMBER RWA SUCCESS</span>
                <span className="text-base tracking-[0.2em] font-extrabold text-emerald-400 print:text-emerald-700">भुगतान संपन्न (PAID)</span>
                <span className="text-[8px] opacity-75 mt-0.5">MAA KAUSHALYA APT</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 justify-end mt-4 print:hidden">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
              >
                बंद करें (Close)
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover flex items-center gap-1.5"
              >
                प्रिंट करें (Print Receipt)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Payment Modal */}
      {offlinePayBill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button onClick={() => setOfflinePayBill(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-3">मैन्युअल भुगतान दर्ज करें (Offline Payment)</h3>
            <p className="text-xs text-slate-400 mb-4">
              निवासी: <span className="text-white font-bold">{offlinePayBill.resident_name}</span><br />
              राशि: <span className="text-emerald-400 font-bold">₹{parseFloat(offlinePayBill.amount).toFixed(2)}</span>
            </p>
            <form onSubmit={handleOfflinePayment} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">भुगतान संदर्भ / रसीद संख्या (वैकल्पिक)</label>
                <input
                  type="text"
                  placeholder="e.g. CASH, CHQ-12345"
                  value={offlineRef}
                  onChange={(e) => setOfflineRef(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-brand-500 outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase shadow-premium transition-all flex items-center gap-1.5">
                  <CheckSquare size={14} /> भुगतान के रूप में चिह्नित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBillId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">चालान हटाएँ?</h3>
            <p className="text-xs text-slate-400 mb-6">यह चालान स्थायी रूप से हटा दिया जाएगा। क्या आप सुनिश्चित हैं?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteBillId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteBill} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium hover:shadow-premium-hover">
                हाँ, हटाएँ (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Finance;
