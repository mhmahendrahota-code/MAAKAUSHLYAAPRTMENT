import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, CheckCircle, Clock, AlertTriangle, ArrowUpRight, DollarSign, X } from 'lucide-react';

export const MaintenanceBills = () => {
  const { token, user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal States
  const [activePaymentBill, setActivePaymentBill] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bills/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBills(data.data);
      }
    } catch (err) {
      console.warn("⚠️ Server offline, loading offline mock invoices.");
      setBills([
        {
          id: 1,
          resident_id: 2,
          amount: 4500.00,
          status: "unpaid",
          billing_month: "मई 2026",
          due_date: new Date(2026, 4, 30),
          created_at: new Date(2026, 4, 1)
        },
        {
          id: 2,
          resident_id: 2,
          amount: 4200.00,
          status: "paid",
          billing_month: "अप्रैल 2026",
          due_date: new Date(2026, 3, 30),
          paid_at: new Date(2026, 3, 10),
          payment_reference: "TXN1029384756",
          created_at: new Date(2026, 3, 1)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [token]);

  const handleOpenPayment = (bill) => {
    setActivePaymentBill(bill);
    setPaymentRef(`TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setPaymentError('');
    setPaymentSuccess('');
  };

  const handleClosePayment = () => {
    setActivePaymentBill(null);
    setPaymentRef('');
    setPaymentError('');
    setPaymentSuccess('');
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentSuccess('');

    try {
      const res = await fetch('/api/bills/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          billId: activePaymentBill.id,
          paymentReference: paymentRef
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPaymentSuccess("भुगतान सफलतापूर्वक पूर्ण हो गया है!");
        setTimeout(() => {
          handleClosePayment();
          fetchBills();
        }, 1200);
      } else {
        throw new Error(data.message || 'भुगतान विफल');
      }
    } catch (err) {
      console.warn("⚠️ Server offline, executing local state pay simulation.");
      // Simulating pay in mock state
      const idx = bills.findIndex(b => b.id === activePaymentBill.id);
      if (idx !== -1) {
        const updated = [...bills];
        updated[idx] = {
          ...updated[idx],
          status: 'paid',
          paid_at: new Date(),
          payment_reference: paymentRef
        };
        setBills(updated);
      }
      setPaymentSuccess("भुगतान सफलतापूर्वक सिम्युलेट किया गया!");
      setTimeout(() => {
        handleClosePayment();
      }, 1200);
    }
  };

  const unpaidBills = (bills || []).filter(b => b && b.status === 'unpaid');
  const totalOutstanding = unpaidBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto relative">
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">रखरखाव शुल्क पोर्टल (Maintenance Bills)</h1>
            <p className="text-xs text-slate-400">सोसायटी मासिक रखरखाव शुल्क विवरण और डिजिटल भुगतान केंद्र</p>
          </div>
        </div>

        {/* Outstanding Dues Summary tag */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">कुल बकाया राशि (Outstanding):</span>
          <span className={`text-base font-black ${totalOutstanding > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{totalOutstanding.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main invoices view */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : bills.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">सोसायटी बिलिंग बहीखाता (Ledger)</h3>
          
          <div className="flex flex-col gap-3">
            {bills.map((bill) => (
              <div 
                key={bill.id} 
                className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-brand-500/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                    bill.status === 'paid' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                  }`}>
                    <DollarSign size={18} />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">₹{parseFloat(bill.amount).toFixed(2)}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                        bill.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {bill.status === 'paid' ? 'चुकाया गया (Paid)' : 'बकाया (Unpaid)'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">
                      बिलिंग चक्र (Billing Cycle): <span className="text-slate-200">{bill.billing_month}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      देय तिथि (Due Date): {new Date(bill.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Bill actions & receipts */}
                <div className="flex items-center gap-2 sm:self-center">
                  {bill.status === 'paid' ? (
                    <div className="flex flex-col items-end text-right gap-1.5">
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle size={12} /> भुगतान संपन्न (Cleared)
                      </span>
                      {bill.payment_reference && (
                        <span className="text-[9px] text-slate-500 font-mono">
                          Ref: {bill.payment_reference}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedReceipt(bill)}
                        className="px-3 py-1 bg-brand-600/20 hover:bg-brand-600/35 border border-brand-500/30 rounded-lg text-[9px] font-bold text-brand-300 hover:text-white uppercase tracking-wider transition-all"
                      >
                        रसीद देखें (Receipt)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenPayment(bill)}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/25 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
                    >
                      बकाया भुगतान करें <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <CheckCircle size={36} className="text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई बिल जनरेट नहीं हुआ</h3>
          <p className="text-xs text-slate-400 mt-1">उत्कृष्ट! आपके फ्लैट खाते में कोई भी बकाया रखरखाव शुल्क शेष नहीं है।</p>
        </div>
      )}

      {/* Payment Gateway Mock Modal */}
      {activePaymentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 shadow-premium relative">
            <button 
              onClick={handleClosePayment}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">सुरक्षित भुगतान डेस्क (Secure Gateway)</h3>
            </div>

            {/* Bill Summary */}
            <div className="glass-panel-light p-4 rounded-2xl border border-white/5 flex flex-col gap-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">फ्लैट रखरखाव चक्र (Cycle):</span>
                <span className="font-bold text-slate-200">{activePaymentBill.billing_month}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 mb-1 text-slate-400">
                <span>संबद्ध फ्लैट (Flat Account):</span>
                <span className="font-bold text-slate-200">{user?.name ? `${user?.name}` : 'निवासी फ्लैट धारक'}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider">कुल देय राशि (Payable):</span>
                <span className="text-lg font-black text-white">₹{parseFloat(activePaymentBill.amount).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">जनरेटेड UPI / कार्ड ट्रांजैक्शन आईडी</label>
                <input 
                  type="text" 
                  required
                  placeholder="TXN..."
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="flex items-start gap-2 bg-brand-500/10 border border-brand-500/20 p-3 rounded-2xl">
                <AlertTriangle size={16} className="text-brand-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-normal">
                  यह ट्रांजैक्शन केवल डेमो/सैंडबॉक्स परीक्षण के लिए है। "भुगतान करें" पर क्लिक करते ही रेसिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) लेजर में राशि जमा मान ली जाएगी।
                </p>
              </div>

              {paymentError && (
                <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl">
                  {paymentError}
                </div>
              )}

              {paymentSuccess && (
                <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <CheckCircle size={14} /> {paymentSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/20 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-premium hover:shadow-premium-hover transition-all"
              >
                बैलेंस भुगतान करें
              </button>
            </form>
          </div>
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
                <span className="font-bold text-white print:text-black">{user?.name || selectedReceipt.resident_name || 'निवासी सदस्य'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">फ्लैट नंबर (Flat No):</span>
                <span className="font-bold text-white print:text-black">{user?.flat_no || selectedReceipt.flat_no || 'N/A'}</span>
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
    </div>
  );
};
export default MaintenanceBills;
