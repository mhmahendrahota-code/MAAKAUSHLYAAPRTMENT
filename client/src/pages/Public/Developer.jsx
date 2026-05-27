import React from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Code, 
  Cpu, 
  Award, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Activity, 
  Heart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const Developer = () => {
  const developerInfo = {
    name: "महेन्द्र होता",
    englishName: "Mahendra Hota",
    role: "लीड सॉफ्टवेयर इंजीनियर और फुल-स्टैक डेवलपर",
    englishRole: "Lead Software Engineer & Full-Stack Developer",
    email: "getmahendrahota@gmail.com",
    github: "https://github.com/mhmahendrahota-code",
    linkedin: "https://www.linkedin.com/in/mhmahendrahota",
    bio: "माँ कौशल्या अपार्टमेंट सोसायटी प्रबंधन प्रणाली के मुख्य वास्तुकार (Lead Architect)। निवासियों की सुविधा, वित्तीय पारदर्शिता और द्वारपाल सुरक्षा को उन्नत बनाने के लिए इस उच्च स्तरीय डिजिटल पोर्टल का निर्माण किया गया है।",
    englishBio: "Lead Architect of the Maa Kaushalya Apartment Society Management System. Engineered this high-fidelity digital portal to elevate resident convenience, financial transparency, and secure gatekeeper operations."
  };

  const metrics = [
    { label: "कोडिंग कमिट्स (Code Commits)", value: "540+", color: "text-brand-400" },
    { label: "मॉड्यूल संपन्न (Modules)", value: "12+", color: "text-amber-400" },
    { label: "अप-टाइम (System Up-Time)", value: "99.9%", color: "text-emerald-400" },
  ];

  const techStack = [
    { category: "Frontend", skills: ["React.js (Vite)", "Tailwind CSS", "Lucide Icons", "HTML5 & Vanilla CSS3"] },
    { category: "Backend & DB", skills: ["Node.js", "Express.js", "PostgreSQL", "JWT Authorization"] },
    { category: "Tools & Cloud", skills: ["Git & GitHub", "RESTful APIs", "Render Cloud Deployment", "Bilingual Localization"] }
  ];

  const contributions = [
    {
      title: "सार्वभौमिक निवासी पंजीकरण प्रपत्र",
      engTitle: "Universal Resident Registration",
      desc: "डाउनलोड सेक्शन में पूर्ण डेटा-कैप्चर प्रपत्र जो खाली या डिजिटल भरे हुए दोनों रूप में A4 लेटरहेड फॉर्मेट में सीधे प्रिंट या PDF सहेजने में सहायक है।",
      engDesc: "A complete data-capture form inside Downloads rendering clean blank or prefilled A4 printouts for offline RWA hardcopies."
    },
    {
      title: "प्रशासनिक नियंत्रण एवं निवासी निर्देशिका",
      engTitle: "Admin Dashboard & Directory",
      desc: "किराया एग्रीमेंट और पुलिस सत्यापन स्थिति (हाँ/नहीं कॉलम) की लाइव ट्रैकिंग के साथ एक अत्यंत परिष्कृत आरडब्ल्यूए नियंत्रण कक्ष।",
      engDesc: "Sophisticated administration panel featuring Role-Based Access Control, tenant rent agreements, and police verification status tracking."
    },
    {
      title: "वित्तीय बहीखाता एवं बिलिंग प्रणाली",
      engTitle: "Finance & RWA Maintenance Billings",
      desc: "रखरखाव शुल्कों (Maintenance) और बहीखाता विवरणों का स्वचालित सृजन, रसीद रेंडरिंग और पूर्ण ऑडिट लेज़र।",
      engDesc: "Automated billing engine creating maintenance invoices, printable RWA ledger spreadsheets, and automated financial auditing."
    },
    {
      title: "सुरक्षा एवं द्वारपाल आगंतुक ऑडिट",
      engTitle: "Gatekeeper Visitor Logs",
      desc: "अपार्टमेंट की त्रि-स्तरीय सुरक्षा प्रणाली के तहत सुरक्षा गार्डों द्वारा आगंतुकों के प्रवेश और प्रस्थान का लाइव डिजिटल बहीखाता।",
      engDesc: "Real-time gatekeeper logbook tracking all visitors, delivery personnel, and vehicle entry/exit protocols."
    },
    {
      title: "सहायता केंद्र एवं शिकायत निवारण",
      engTitle: "Resident Complaints Helpdesk",
      desc: "निवासियों द्वारा फ़ोटो/विवरण के साथ शिकायतें दर्ज करने और आरडब्ल्यूए द्वारा उनके त्वरित निपटान की संपूर्ण ऑनलाइन टिकट सेवा।",
      engDesc: "Fully digital ticketing system enabling residents to log maintenance requests or feedback with automated status workflows."
    },
    {
      title: "सूचना पटल एवं प्रबंध समिति",
      engTitle: "Notice Board & Committee Roster",
      desc: "सोसायटी के निवासियों तक सूचनाएं तुरंत प्रसारित करने हेतु RWA का डिजिटल बुलेटिन बोर्ड और प्रबंध समिति का विस्तृत विवरण।",
      engDesc: "Official digital bulletin board for announcements and detailed interactive directory of elected management committee members."
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl text-left animate-fadeInUp">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase flex flex-col md:flex-row items-center justify-center gap-3">
          <Terminal className="text-brand-400 w-8 h-8 md:w-12 md:h-12 animate-pulse" />
          <span>डेवलपर <span className="gradient-text">विवरण</span></span>
        </h1>
        <p className="text-xs md:text-sm text-amber-300 mt-3 font-bold tracking-widest uppercase">
          Lead Developer & Software Architect Profile
        </p>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
          माँ कौशल्या अपार्टमेंट (RWA) प्रबंधन प्रणाली को अत्याधुनिक तकनीकों द्वारा सशक्त बनाने वाले डेवलपर का संक्षिप्त परिचय।
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile Card (SPAN 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center">
            
            {/* Background Light Glow Effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-500/10 blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-[80px]" />

            {/* Glowing Avatar */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-amber-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow" />
              <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-amber-500/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Code size={40} className="text-amber-400 group-hover:text-brand-400 transition-colors duration-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md" title="Active Developer">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Name & Title */}
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              {developerInfo.name}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              {developerInfo.englishName}
            </p>
            <div className="mt-3 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
              {developerInfo.role}
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1">
              {developerInfo.englishRole}
            </p>

            {/* Social & Contact Grid */}
            <div className="w-full grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/5">
              <a 
                href={developerInfo.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/20 text-slate-300 hover:text-white transition-all group"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold tracking-wider uppercase">GitHub</span>
              </a>
              <a 
                href={developerInfo.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 text-slate-300 hover:text-white transition-all group"
              >
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold tracking-wider uppercase">LinkedIn</span>
              </a>
              <a 
                href={`mailto:${developerInfo.email}`}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 text-slate-300 hover:text-white transition-all group"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Widget */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
              <Activity size={14} className="text-brand-400" />
              सिस्टम मेट्रिक्स (Developer Metrics)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {metrics.map((metric, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className={`text-xl md:text-2xl font-black ${metric.color} tracking-tight`}>
                    {metric.value}
                  </span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 leading-tight">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Showcase (SPAN 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Developer Biography */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              डेवलपर परिचय (Developer Bio)
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {developerInfo.bio}
            </p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed border-l-2 border-white/10 pl-3 italic">
              {developerInfo.englishBio}
            </p>
          </div>

          {/* Section 2: Core Tech Stack */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Cpu size={18} className="text-brand-400" />
              तकनीकी कौशल (Tech Stack Engine)
            </h3>
            <div className="flex flex-col gap-4">
              {techStack.map((stack, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {stack.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {stack.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-brand-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Architect Contributions */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" />
              पोर्टल में महत्वपूर्ण योगदान (Core Contributions)
            </h3>
            <div className="flex flex-col gap-6">
              {contributions.map((item, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-slate-900/40 hover:bg-slate-900/80 p-5 rounded-2xl border border-white/5 hover:border-brand-500/20 transition-all flex gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 group-hover:bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.engTitle}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed italic border-t border-white/5 pt-1">
                      {item.engDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Crafted with love footer note */}
      <div className="mt-12 text-center flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
        <span>Created with</span>
        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
        <span>for Maa Kaushalya Apartment RWA, Raipur</span>
      </div>
    </div>
  );
};

export default Developer;
