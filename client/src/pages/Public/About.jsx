import React from 'react';
import { ShieldCheck, Heart, User, Award, Crown } from 'lucide-react';

export const About = () => {
  const [sortBy, setSortBy] = React.useState('name');

  const secretary = {
    name: "आरडब्ल्यूए सचिव (RWA Secretary)",
    role: "सचिव (Secretary)",
    contact: "9876543210"
  };

  const members = [
    { name: "नौशाद अहमद (Naushad Ahmad)", role: "सदस्य (Member)", contact: "9770779072" },
    { name: "सूफी इलियास चिश्ती (Sufi Illias Chisti)", role: "सदस्य (Member)", contact: "7869551226" },
    { name: "स्वदेश कटियार (Swadesh Katiyar)", role: "सदस्य (Member)", contact: "8966996677" },
    { name: "अलोक जोशी (Alok Joshi)", role: "सदस्य (Member)", contact: "9109328032" },
    { name: "अयाज़ खान (Ayaz Khan)", role: "सदस्य (Member)", contact: "7879553997" },
    { name: "अमित वर्मा (Amit Verma)", role: "सदस्य (Member)", contact: "9926974248" },
    { name: "हेमलाल निषाद (Hemlal Nishad)", role: "सदस्य (Member)", contact: "9575836600" },
    { name: "सर्वेश त्रिपाठी (Sarvesh Tripathi)", role: "सदस्य (Member)", contact: "9907749456" },
    { name: "आकाश गुप्ता (Akash Gupta)", role: "सदस्य (Member)", contact: "8823006747" },
    { name: "लाल बहादुर यादव (Lal Bahadur Yadav)", role: "सदस्य (Member)", contact: "9329995551" },
    { name: "भारत लाल साहू (Bharat Lal Sahu)", role: "सदस्य (Member)", contact: "7758895539" },
    { name: "चंद्रकांत पटेल (Chandrakant Patel)", role: "सदस्य (Member)", contact: "8602451035" },
    { name: "नरेंद्र परमार (Narendra Parmar)", role: "सदस्य (Member)", contact: "9827920102" },
    { name: "हिमांशु (Himanshu)", role: "सदस्य (Member)", contact: "7240889708" },
    { name: "नरेश (Naresh)", role: "सदस्य (Member)", contact: "9826345678" },
    { name: "अशोक (Ashok)", role: "सदस्य (Member)", contact: "9754332211" },
    { name: "हेमंत (Hemant)", role: "सदस्य (Member)", contact: "8103456789" },
    { name: "केदार (Kedar)", role: "सदस्य (Member)", contact: "9111234567" },
    { name: "राजू (Raju)", role: "सदस्य (Member)", contact: "7489012345" },
  ];

  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name, 'hi-IN');
    } else {
      return a.contact.localeCompare(b.contact);
    }
  });

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl text-left animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
          विवरण | <span className="gradient-text">माँ कौशल्या अपार्टमेंट, सेक्टर 1</span>
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm md:text-base">
          पारदर्शी प्रशासन के माध्यम से एक सहयोगी और सुंदर पड़ोस का निर्माण करना।
        </p>
      </div>

      {/* Grid: Concept and overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/35">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">हमारा सामुदायिक आधार (Community Core)</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            कमल विहार, सेक्टर 1, पचपेड़ी नाका, रायपुर में स्थित एक प्रमुख आवासीय समुदाय है। हम उन्नत सुरक्षा, पर्यावरण-अनुकूल ऊर्जा के उपयोग और सक्रिय पड़ोस गतिविधियों पर गर्व करते हैं। हमारी प्रबंध समिति निवासियों के हित में सदैव समर्पित है।
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/35">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">उत्कृष्टता का मानक (Excellence)</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            कमल विहार, सेक्टर 1 की रेजिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) सामुदायिक प्रशासन के लिए हमेशा सक्रिय और तत्पर प्रतिक्रिया डेस्क बनाए रखती है। स्वचालित सुरक्षा लॉग से लेकर एकीकृत रखरखाव लेखांकन और त्वरित शिकायत सहायता तक, हम गृह जीवन को चिंता मुक्त बनाते हैं।
          </p>
        </div>
      </div>

      {/* RWA Committee & Members */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 mb-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            RWA प्रबंधन समिति एवं सदस्य (RWA Committee &amp; Members)
          </h3>
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 self-start md:self-auto shrink-0 animate-fadeIn">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">सॉर्ट करें (Sort):</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-brand-400 focus:outline-none cursor-pointer p-0"
            >
              <option value="name" className="bg-slate-900 text-slate-200">नाम के अनुसार (A-Z)</option>
              <option value="contact" className="bg-slate-900 text-slate-200">संपर्क (Contact)</option>
            </select>
          </div>
        </div>

        {/* Secretary Accent Card (Naushad Ahmad) */}
        <div className="flex justify-center mb-6">
          <div className="glass-panel-light p-6 rounded-2xl border-2 border-amber-500/30 glow-brand w-full max-w-md flex flex-col items-center text-center gap-3 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-white tracking-wide">{secretary.name}</p>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">{secretary.role} — Resident Welfare Association</p>
            </div>
            <a
              href={`tel:${secretary.contact}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-all"
            >
              📞 {secretary.contact}
            </a>
          </div>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member, index) => (
            <div
              key={index}
              className="glass-panel-light p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:border-brand-500/20 hover:scale-[1.02] transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-all">
                <User size={16} className="text-slate-400 group-hover:text-brand-400 transition-colors" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-white truncate">{member.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{member.role}</p>
                <a
                  href={`tel:${member.contact}`}
                  className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold mt-0.5 transition-colors"
                >
                  📞 {member.contact}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Society Location Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center">
        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">📍 सोसायटी पता (Address)</p>
        <p className="text-sm text-slate-300 font-medium">
          माँ कौशल्या अपार्टमेंट, सेक्टर 1 (Maa Kaushalya apartment, sector 1)
        </p>
        <p className="text-xs text-slate-400 mt-1">
          कमल विहार, सेक्टर 1, पचपेड़ी नाका, बोरियाखुर्द, रायपुर, छत्तीसगढ़ - 492015
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          (Kamal Vihar, Sector 1, Pachpedi Naka, Boriyakhurd, Raipur, Chhattisgarh - 492015)
        </p>
      </div>
    </div>
  );
};

export default About;
