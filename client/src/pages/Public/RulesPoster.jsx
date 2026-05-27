import React from 'react';

const rules = [
  {
    no: 1,
    text: 'सुरक्षा हेतु योगदान – सोसाइटी की सुरक्षा और सुंदरता बनाए रखने के लिए सभी सदस्य सहयोग करें, ताकि हमारे परिवार सुरक्षित और आनंदपूर्वक रह सकें।',
  },
  {
    no: 2,
    text: 'ऑनलाइन डिलीवरी – जोमैटो, स्विग्गी, ब्लिंकिट आदि के डिलीवरी कर्मचारियों को कॉलोनी परिसर में रात्रि 9 बजे से सुबह 8 बजे तक प्रवेश नहीं दिया जाएगा। संबंधित सदस्य अपना सामान गेट से प्राप्त करें। केवल दिव्यांगजन या गंभीर बीमारी की स्थिति में गार्ड की अनुमति से ही डिलीवरी व्यक्ति को फ्लैट तक जाने दिया जाएगा।',
  },
  {
    no: 3,
    text: 'कचरा निपटारन व सफाई – कॉलोनी परिसर में निधारित स्थान पर ही कचरा डालें। कहीं और कचरा फैलाने पर ₹500 का अर्थदंड लिया जाएगा, बाउंड्री व दीवार पर पोस्टर, बैनर नहीं लगा सकते है।',
  },
  {
    no: 4,
    text: 'गार्ड का सम्मान – गार्ड हमारी सुरक्षा के लिए है। उनसे विवाद या अभद्र व्यवहार न करें। किसी भी समस्या की स्थिति में समिति के सदस्यों से संपर्क करें।',
  },
  {
    no: 5,
    text: 'बाहरी व्यक्तियों की सूचना – यदि कोई संदिग्ध या बाहरी व्यक्ति कॉलोनी में घूमता दिखे तो तुरंत समिति को ग्रुप के माध्यम से सूचित करें।',
  },
  {
    no: 6,
    text: 'शोर-शराबा – घर के नवीनीकरण का कार्य सुबह 8 बजे से रात्रि 8 बजे तक ही अनुमित है। रात्रि में ऊँची आवाज़ में गाने सुनना या शोर करना वर्जित है ताकि पड़ोसियों को परेशानी न हो।',
  },
  {
    no: 7,
    text: 'नशा और विवाद – परिसर में शराब पीना, शराब पीकर घूमना, गुटका, सिगरेट, गांजा आदि का सेवन करना मना है। नियम का उल्लंघन करते हुए पकड़े जाने पर ₹500 का जुर्माना लगाया जायेगा।',
  },
  {
    no: 8,
    text: 'किरायेदार नियम – सभी किरायेदार अपने किरायानामे की कॉपी सोसाइटी कार्यालय में जमा करें।',
  },
  {
    no: 9,
    text: 'पालतू कुत्ते/बिल्ली आदि को कॉलोनी परिसर में खुला न छोड़ें, पालतू जानवरों को परिसर में शौच करना मना है। अपने जानवरों को परिसर से बाहर ले जाकर शौच कराये। यदि किसी जानवर द्वारा परिसर में गन्दगी की जाती है तो उसे साफ करना मालिक की जिम्मेदारी होगी। नियम का पालन न करने पर जुर्माना लगाया जा सकता है।',
  },
  {
    no: 10,
    text: 'कॉलोनी परिसर में लगे पेड़ों को नुकसान न पहुँचाएं।',
  },
  {
    no: 11,
    text: 'किसी भी प्रकार का कार्यक्रम करने से 48 घंटे पूर्व समिति को सूचित करना आवश्यक है।',
  },
  {
    no: 12,
    text: 'लिफ्ट में गंदगी फैलाना अथवा भारी सामान (जैसे पत्थर, बजरी, रेत आदि) ले जाना मना है।',
  },
  {
    no: 13,
    text: 'परिसर के अंदर किसी भी वाहन की गति 20 किमी/घंटा से अधिक नहीं होनी चाहिए। सुरक्षा कारणों से सभी निवासियों से अनुरोध है कि वे इन नियमों का पालन करें।',
  },
  {
    no: 14,
    text: 'बिल्डिंग की छत पर कमेटी की अनुमति के बिना प्रवेश वर्जित है। आवश्यक होने पर कमेटी को सूचित करके या गार्ड को बताने के पश्चात ही प्रवेश दिया जाएगा।',
  },
];

const RulesPoster = () => {
  return (
    <div style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" }}
      className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-500">

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-center px-4 py-3">
        <h1 className="text-xl font-extrabold text-red-700 leading-tight">
          माँ कौशल्या अपार्टमेंट नियमावली
        </h1>
      </div>

      {/* Sub-header */}
      <div className="bg-white px-4 pt-3 pb-1 flex items-center gap-3">
        <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-orange-400 overflow-hidden shadow-lg">
          <img src="/logo.jpg" alt="माँ कौशल्या अपार्टमेंट" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-blue-800 font-bold text-sm">सोसाइटी नियमावली 20.09.2025 से लागू</p>
          <h2 className="text-red-600 font-extrabold text-lg underline decoration-red-500">
            सुरक्षा एवं अनुशासन संबंधी नियम
          </h2>
        </div>
      </div>

      {/* Rules List */}
      <div className="px-4 pb-4 pt-2">
        <ol className="space-y-2">
          {rules.map((rule) => (
            <li key={rule.no} className="flex gap-2 text-sm text-gray-800 leading-snug">
              <span className="font-bold text-gray-900 flex-shrink-0 min-w-[1.25rem]">{rule.no}.</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ol>

        {/* Authority line */}
        <div className="mt-4 text-right text-xs text-gray-700">
          <p className="italic">आदेशानुसार</p>
          <p className="font-bold text-sm">माँ कौशल्या अपार्टमेंट कमेटी</p>
        </div>
      </div>

      {/* Footer contact */}
      <div className="bg-red-600 text-white text-center py-2 px-4">
        <p className="text-sm font-bold tracking-wide">
          — अधिक जानकारी के लिए संपर्क — <span className="ml-1">+91 9770779072</span>
        </p>
      </div>
    </div>
  );
};

export default RulesPoster;
