import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Check, PlusCircle, CheckCircle, Clock, Search, HelpCircle, Trash2, CheckSquare, X, Calendar, TrendingDown, Plus, FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const Finance = () => {
  const { token } = useAuth();
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Ledger Tab Toggle: 'bills' or 'expenses'
  const [activeLedgerTab, setActiveLedgerTab] = useState('bills');

  // Bill generation form states
  const [showForm, setShowForm] = useState(false);
  const [residentId, setResidentId] = useState('');
  const [amount, setAmount] = useState('');
  const [billingMonth, setBillingMonth] = useState('मई 2026');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Dynamic Auto-Billing Modal states
  const [showAutoBillingModal, setShowAutoBillingModal] = useState(false);
  const [autoAmount, setAutoAmount] = useState('2000');
  const [autoMonth, setAutoMonth] = useState('मई 2026');
  const [autoDueDate, setAutoDueDate] = useState('');

  // Expense tracker states
  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Generator Diesel');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseRef, setExpenseRef] = useState('');

  // Mark Offline Paid / Delete States
  const [offlinePayBill, setOfflinePayBill] = useState(null);
  const [offlineRef, setOfflineRef] = useState('');
  const [deleteBillId, setDeleteBillId] = useState(null);

  const fetchFinanceData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      // Fetch all bills
      const billsRes = await fetch('/api/bills/history', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!billsRes.ok) {
        throw new Error(`Bills API error: ${billsRes.status}`);
      }
      const billsData = await billsRes.json();
      if (!billsData.success) {
        throw new Error(billsData.message || 'Failed to fetch bills history');
      }

      // Fetch directory to get list of residents
      const dirRes = await fetch('/api/users/directory', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!dirRes.ok) {
        throw new Error(`Directory API error: ${dirRes.status}`);
      }
      const dirData = await dirRes.json();
      if (!dirData.success) {
        throw new Error(dirData.message || 'Failed to fetch directory');
      }

      // Fetch expenses
      const expensesRes = await fetch('/api/admin/expenses', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let expensesData = { success: false, data: [] };
      if (expensesRes.ok) {
        expensesData = await expensesRes.json();
      }

      setBills(billsData.data);
      if (expensesData.success) {
        setExpenses(expensesData.data);
      } else {
        setExpenses([]);
      }
      const filteredResidents = dirData.data.filter(u => u.role === 'Resident');
      setResidents(filteredResidents);
      if (filteredResidents.length > 0) {
        setResidentId(filteredResidents[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch finance data:", err);
      setError(err.message || "डेटा लोड करने में विफल");
      setBills([]);
      setExpenses([]);
      setResidents([]);
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

    if (!residentId) {
      setError('कृपया एक निवासी फ्लैट मालिक का चयन करें।');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('कृपया एक वैध रखरखाव राशि दर्ज करें।');
      return;
    }
    if (!dueDate) {
      setError('कृपया भुगतान की अंतिम तिथि का चयन करें।');
      return;
    }

    try {
      const res = await fetch('/api/bills/generate', {
        method: 'POST',
        credentials: 'include',
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
      console.error("Error generating bill:", err);
      setError(err.message || 'बिल जनरेट करने में असमर्थ');
    }
  };

  const handleAutoBillingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!autoAmount || parseFloat(autoAmount) <= 0) {
      setError('कृपया एक वैध रखरखाव राशि दर्ज करें।');
      return;
    }
    if (!autoDueDate) {
      setError('कृपया भुगतान की अंतिम तिथि का चयन करें।');
      return;
    }

    try {
      const res = await fetch('/api/bills/bulk-generate', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(autoAmount),
          billingMonth: autoMonth,
          dueDate: autoDueDate
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`स्वचालित मासिक मेंटेनेंस बिलिंग पूरी हुई! ${data.data?.length || residents.length} निवासियों के लिए ₹${autoAmount} का बिल उत्पन्न हुआ।`);
        setShowAutoBillingModal(false);
        setAutoDueDate('');
        setTimeout(() => setSuccess(''), 4000);
        fetchFinanceData();
      } else {
        throw new Error(data.message || 'स्वचालित बिलिंग विफल हो गई।');
      }
    } catch (err) {
      console.error("Error auto billing:", err);
      setError(err.message || 'स्वचालित बिलिंग विफल हो गई।');
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      setError('कृपया एक वैध खर्च राशि दर्ज करें।');
      return;
    }

    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(expenseAmount),
          category: expenseCategory,
          expenseDate: expenseDate || new Date().toISOString().substring(0, 10),
          vendor: expenseVendor,
          description: expenseDesc,
          referenceNo: expenseRef
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('खर्च सफलतापूर्वक बहीखाता में जोड़ा गया!');
        setExpenseAmount('');
        setExpenseVendor('');
        setExpenseDesc('');
        setExpenseRef('');
        setExpenseDate('');
        setTimeout(() => {
          setShowExpenseForm(false);
          setSuccess('');
          fetchFinanceData();
        }, 1200);
      } else {
        throw new Error(data.message || 'खर्च जोड़ने में विफल');
      }
    } catch (err) {
      console.error("Error logging expense:", err);
      setError(err.message || 'खर्च जोड़ने में विफल');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('क्या आप वाकई इस खर्च विवरण को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("खर्च विवरण हटा दिया गया!");
        fetchFinanceData();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error('खर्च विवरण हटाने में असमर्थ');
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert('खर्च विवरण हटाने में असमर्थ: ' + err.message);
    }
  };

  const handleOfflinePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bills/pay', {
        method: 'POST',
        credentials: 'include',
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
      console.error("Error recording offline payment:", err);
      alert('भुगतान दर्ज करने में विफल: ' + err.message);
      setOfflinePayBill(null);
      setOfflineRef('');
    }
  };

  const handleDeleteBill = async () => {
    try {
      // Mocked endpoint as backend might not have delete
      const res = await fetch(`/api/bills/delete/${deleteBillId}`, {
        method: 'DELETE',
        credentials: 'include',
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
      console.error("Error deleting bill:", err);
      alert('हटाने में विफल: ' + err.message);
      setDeleteBillId(null);
    }
  };

  const totalCollected = bills.filter(b => b.status === 'paid').reduce((s, b) => s + parseFloat(b.amount), 0);
  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + parseFloat(b.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const netReserves = totalCollected - totalExpenses;

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
            onClick={() => setShowAutoBillingModal(true)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            स्वचालित मासिक मेंटेनेंस (Auto-Billing)
          </button>

          {/* Log Expense button */}
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="px-3.5 py-2 bg-slate-900 border border-white/10 hover:border-brand-500/25 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Plus size={13} className="text-brand-400" /> खर्च दर्ज करें (Log Expense)
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

      {/* Finance metrics tags (4-column grid for income, expenses, outstanding, and reserves) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">एकत्रित शुल्क (Income)</span>
            <h4 className="text-base font-black text-emerald-400 mt-1">₹{totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">कुल खर्च (Expenses)</span>
            <h4 className="text-base font-black text-rose-400 mt-1">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center">
            <ArrowDownRight size={15} />
          </div>
        </div>

        {/* Receivables */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">बकाया (Outstanding)</span>
            <h4 className="text-base font-black text-amber-500 mt-1">₹{totalUnpaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center">
            <Clock size={15} />
          </div>
        </div>

        {/* Net reserves balance */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between bg-gradient-to-br from-slate-900/40 via-brand-950/15 to-transparent">
          <div>
            <span className="text-[9px] uppercase font-bold text-brand-300 tracking-wider">कोष शेष (Net Reserves)</span>
            <h4 className={`text-base font-black mt-1 ${netReserves >= 0 ? 'text-white' : 'text-rose-400'}`}>₹{netReserves.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/25 flex items-center justify-center">
            <DollarSign size={15} />
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

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">भुगतान की अंतिम तिथि (Due Date)</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full cursor-pointer [color-scheme:dark]"
                  />
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
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

      {/* Log Expense Form Panel */}
      {showExpenseForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">RWA खर्च दर्ज करें (Log Expenditure)</h3>
          
          <form onSubmit={handleSubmitExpense} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">खर्च श्रेणी (Category)</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full"
                >
                  <option value="Guard Salary">गार्ड वेतन (Guard Salary)</option>
                  <option value="Generator Diesel">जेनरेटर डीजल (Generator Diesel)</option>
                  <option value="Lift AMC">लिफ्ट रख-रखाव (Lift AMC/Maintenance)</option>
                  <option value="Gardening">बागवानी (Gardening/Landscaping)</option>
                  <option value="Plumbing Repairs">प्लंबिंग मरम्मत (Plumbing Repairs)</option>
                  <option value="Electricity Bills">बिजली बिल (Society Common Electricity)</option>
                  <option value="Miscellaneous">अन्य खर्च (Miscellaneous)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">खर्च राशि (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 1500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">व्यय प्राप्तकर्ता / वेंडर (Vendor / Payee)</label>
                <input
                  type="text"
                  placeholder="उदा. Bharat Petroleum"
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">खर्च की तिथि (Expense Date)</label>
                <div className="relative">
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full cursor-pointer [color-scheme:dark]"
                  />
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">विवरण (Description)</label>
                <input
                  type="text"
                  placeholder="खर्च का उद्देश्य स्पष्ट करें"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold uppercase text-slate-400">रसीद संख्या / संदर्भ संख्या (Invoice/Receipt Ref)</label>
                <input
                  type="text"
                  placeholder="उदा. BILL-1029"
                  value={expenseRef}
                  onChange={(e) => setExpenseRef(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full"
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
                onClick={() => setShowExpenseForm(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover"
              >
                खर्च सहेजें (Save Expense)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveLedgerTab('bills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            activeLedgerTab === 'bills' 
              ? 'bg-white/10 text-white border border-white/10 shadow' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <FileText size={14} /> मेंटेनेंस बिल चालान (Invoices)
        </button>

        <button
          onClick={() => setActiveLedgerTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            activeLedgerTab === 'expenses' 
              ? 'bg-white/10 text-white border border-white/10 shadow' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <TrendingDown size={14} /> सोसायटी खर्च बहीखाता (Expenditures)
        </button>
      </div>

      {/* Ledger Accounts Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : activeLedgerTab === 'bills' ? (
        bills.length > 0 ? (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">सोसायटी खाता बहीखाता (Invoices Ledger)</h3>
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
          <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center animate-fadeIn">
            <HelpCircle size={36} className="text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">चालान बहीखाता खाली है</h3>
            <p className="text-xs text-slate-400 mt-1">कोई भी उत्पन्न रखरखाव चालान नहीं पाया गया।</p>
          </div>
        )
      ) : (
        expenses.length > 0 ? (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">सोसायटी व्यय बहीखाता (Expenses Ledger)</h3>
            <div className="flex flex-col gap-3">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-rose-500/10 border-rose-500/20 text-rose-400">
                      <TrendingDown size={16} />
                    </div>

                    <div className="flex flex-col text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-sm">₹{parseFloat(exp.amount).toFixed(2)}</span>
                        <span className="text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20">
                          {exp.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        व्यय प्राप्तकर्ता / वेंडर: <span className="font-bold text-slate-200">{exp.vendor || 'N/A'}</span>
                      </span>
                      {exp.description && (
                        <span className="text-[10px] text-slate-400">
                          विवरण: <span className="text-slate-300">{exp.description}</span>
                        </span>
                      )}
                      <span className="text-[9px] text-slate-500">
                        व्यय तिथि: {new Date(exp.expense_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-left sm:text-right shrink-0 gap-2">
                    {exp.reference_no && (
                      <span className="text-[9px] text-slate-500 font-mono">Ref: {exp.reference_no}</span>
                    )}
                    <button 
                      onClick={() => handleDeleteExpense(exp.id)} 
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider"
                    >
                      <Trash2 size={11} /> व्यय हटाएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center animate-fadeIn">
            <HelpCircle size={36} className="text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">व्यय बहीखाता खाली है</h3>
            <p className="text-xs text-slate-400 mt-1">कोई भी दर्ज सोसायटी खर्च विवरण नहीं पाया गया।</p>
          </div>
        )
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

      {/* Dynamic Monthly Auto-Billing Configuration Modal */}
      {showAutoBillingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAutoBillingModal(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-3">स्वचालित मासिक बिलिंग कॉन्फ़िगर करें</h3>
            
            <form onSubmit={handleAutoBillingSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">बिलिंग चक्र महीना (Billing Month)</label>
                <select
                  value={autoMonth}
                  onChange={(e) => setAutoMonth(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-brand-500 outline-none w-full text-slate-200"
                >
                  <option value="मई 2026">मई 2026</option>
                  <option value="जून 2026">जून 2026</option>
                  <option value="जुलाई 2026">जुलाई 2026</option>
                  <option value="अगस्त 2026">अगस्त 2026</option>
                  <option value="सितंबर 2026">सितंबर 2026</option>
                  <option value="अक्टूबर 2026">अक्टूबर 2026</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">मेंटेनेंस शुल्क प्रति फ्लैट (Amount in ₹)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 2000"
                  value={autoAmount}
                  onChange={(e) => setAutoAmount(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-brand-500 outline-none w-full text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">भुगतान की नियत अंतिम तिथि (Due Date)</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={autoDueDate}
                    onChange={(e) => setAutoDueDate(e.target.value)}
                    onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                    className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs focus:border-brand-500 outline-none w-full cursor-pointer [color-scheme:dark] text-slate-200"
                  />
                  <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowAutoBillingModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase shadow-premium transition-all"
                >
                  बिल जनरेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Finance;
