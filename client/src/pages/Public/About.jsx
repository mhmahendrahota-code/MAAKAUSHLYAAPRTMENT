import React from 'react';
import { ShieldCheck, Heart, Award, Crown, Zap, Users, Home, TreePine } from 'lucide-react';

export const About = () => {
  const secretary = {
    name: "आरडब्ल्यूए सचिव (RWA Secretary)",
    role: "सचिव (Secretary)",
    contact: "9876543210"
  };



  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl text-left animate-fadeInUp">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
          माँ कौशल्या <span className="gradient-text">अपार्टमेंट</span>
        </h1>
        <p className="text-lg text-amber-300 mt-3 font-semibold">सेक्टर 1, पचपेड़ी नाका, रायपुर</p>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          आधुनिक सुविधाओं, सुरक्षा और पारदर्शी प्रशासन के माध्यम से एक आदर्श आवासीय समुदाय का निर्माण
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">हमारा दृष्टिकोण (Vision)</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            एक सुरक्षित, पारदर्शी और सुविधाजनक आवासीय समुदाय का निर्माण जहाँ सभी निवासी गर्व और खुशहाली के साथ रहें।
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Heart size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">हमारा लक्ष्य (Mission)</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            निवासियों के कल्याण के लिए नैतिक प्रशासन, न्यायसंगत संसाधन प्रबंधन और पर्यावरणीय जिम्मेदारी सुनिश्चित करना।
          </p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">समाज की विशेषताएं (Key Highlights)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-3xl font-bold text-brand-400 mb-2">450+</div>
            <p className="text-xs text-slate-400 uppercase font-bold">निवासी</p>
            <p className="text-sm text-slate-300 mt-1">खुश परिवार</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
            <p className="text-xs text-slate-400 uppercase font-bold">सुरक्षा</p>
            <p className="text-sm text-slate-300 mt-1">गेट गार्ड सेवा</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <p className="text-xs text-slate-400 uppercase font-bold">आरडब्ल्यूए</p>
            <p className="text-sm text-slate-300 mt-1">प्रबंधित</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">18</div>
            <p className="text-xs text-slate-400 uppercase font-bold">साल</p>
            <p className="text-sm text-slate-300 mt-1">विश्वसनीय सेवा</p>
          </div>
        </div>
      </div>

      {/* Facilities & Amenities */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">प्रमुख सुविधाएं (Facilities)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Home, title: "आधुनिक आवास", desc: "अच्छी तरह से डिज़ाइन किए गए फ्लैट" },
            { icon: ShieldCheck, title: "उन्नत सुरक्षा", desc: "CCTV निगरानी और गेट गार्ड" },
            { icon: Users, title: "समुदाय केंद्र", desc: "सामुदायिक कार्यक्रमों के लिए हॉल" },
            { icon: TreePine, title: "हरी जगह", desc: "बागों और खेल के मैदान" },
            { icon: Award, title: "जल प्रणाली", desc: "24/7 शुद्ध जल आपूर्ति" },
            { icon: Zap, title: "विद्युत सुविधा", desc: "विश्वसनीय बिजली और जनरेटर" },
          ].map((facility, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <facility.icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{facility.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{facility.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Society Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">हमारे मूल्य (Our Values)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h4 className="font-bold text-white text-lg mb-3">पारदर्शिता</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              सभी वित्तीय लेनदेन और निर्णय निवासियों के सामने खुले और स्वच्छ होते हैं।
            </p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h4 className="font-bold text-white text-lg mb-3">समानता</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              सभी निवासियों के साथ समान व्यवहार और न्यायसंगत सेवा सुनिश्चित की जाती है।
            </p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h4 className="font-bold text-white text-lg mb-3">जिम्मेदारी</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              पर्यावरण, सुरक्षा और सामुदायिक कल्याण के प्रति हमारी प्रतिबद्धता अटूट है।
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              संपर्क जानकारी
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">सचिव</p>
                <p className="text-sm text-white font-semibold">{secretary.name}</p>
                <a href={`tel:${secretary.contact}`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                  📞 {secretary.contact}
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              पता (Address)
            </h3>
            <p className="text-sm text-slate-300 font-medium">माँ कौशल्या अपार्टमेंट, सेक्टर 1</p>
            <p className="text-xs text-slate-400 mt-2">
              कमल विहार, सेक्टर 1, पचपेड़ी नाका, बोरियाखुर्द, रायपुर, छत्तीसगढ़ - 492015
            </p>
            <p className="text-xs text-slate-500 mt-1 italic">
              (Kamal Vihar, Sector 1, Pachpedi Naka, Boriyakhurd, Raipur, CG - 492015)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
