import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Download, 
  FileText, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  FileSpreadsheet, 
  Eye, 
  Plus, 
  Trash2, 
  X, 
  FileSignature, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Users,
  Car,
  Phone,
  Home as HomeIcon
} from 'lucide-react';
import { SOCIETY_FLATS } from '../../utils/flats';

export const Downloads = () => {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  
  // Interactive Modals State
  const [activeFormDoc, setActiveFormDoc] = useState(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // Pre-filled form inputs state
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [tenantOccupation, setTenantOccupation] = useState('');
  const [tenantFlat, setTenantFlat] = useState('');
  
  const [parkingName, setParkingName] = useState('');
  const [parkingFlat, setParkingFlat] = useState('');
  const [parkingVehicleType, setParkingVehicleType] = useState('Car');
  const [parkingVehicleNo, setParkingVehicleNo] = useState('');
  const [parkingVehicleModel, setParkingVehicleModel] = useState('');

  const [nocName, setNocName] = useState('');
  const [nocFlat, setNocFlat] = useState('');
  const [nocPurpose, setNocPurpose] = useState('Renovation');
  const [nocDetails, setNocDetails] = useState('');

  // Bachelor Tenant Form States
  const [bachelorName, setBachelorName] = useState('');
  const [bachelorFlat, setBachelorFlat] = useState('');
  const [bachelorOrg, setBachelorOrg] = useState('');
  const [bachelorGuardian, setBachelorGuardian] = useState('');
  const [bachelorGuardianPhone, setBachelorGuardianPhone] = useState('');
  const [bachelorOwner, setBachelorOwner] = useState('');
  const [bachelorAgreeRules, setBachelorAgreeRules] = useState(false);

  // Universal Resident Form States
  const [univIsBlankMode, setUnivIsBlankMode] = useState(false);
  const [univName, setUnivName] = useState('');
  const [univEmail, setUnivEmail] = useState('');
  const [univPhone, setUnivPhone] = useState('');
  const [univFlatNo, setUnivFlatNo] = useState('');
  const [univAadhaar, setUnivAadhaar] = useState('');
  const [univMoveInDate, setUnivMoveInDate] = useState('');
  const [univEmergencyName, setUnivEmergencyName] = useState('');
  const [univEmergencyPhone, setUnivEmergencyPhone] = useState('');
  const [univOccupancyStatus, setUnivOccupancyStatus] = useState('Self-Occupied'); // 'Self-Occupied' or 'Rented'
  const [univTenantCategory, setUnivTenantCategory] = useState('Family'); // 'Family' or 'Bachelor'
  const [univOwnerName, setUnivOwnerName] = useState('');
  const [univOwnerPhone, setUnivOwnerPhone] = useState('');
  const [univLeaseDuration, setUnivLeaseDuration] = useState('');
  const [univHasPet, setUnivHasPet] = useState(false);
  const [univPetDetails, setUnivPetDetails] = useState('');
  const [univProfilePic, setUnivProfilePic] = useState('');

  // Family details list
  const [univFamilyMembersCount, setUnivFamilyMembersCount] = useState('');
  const [univFamilyMembersList, setUnivFamilyMembersList] = useState([]);

  // Vehicles list
  const [univVehiclesList, setUnivVehiclesList] = useState([]);

  const handleUnivFamilyMembersChange = (e) => {
    const val = e.target.value;
    setUnivFamilyMembersCount(val);
    const count = parseInt(val) || 0;
    const safeCount = Math.min(count, 15);
    setUnivFamilyMembersList(prev => {
      const newArr = [...prev];
      if (safeCount > newArr.length) {
        for (let i = newArr.length; i < safeCount; i++) {
          newArr.push({ name: '', phone: '', gender: 'Male' });
        }
      } else if (safeCount < newArr.length) {
        newArr.splice(safeCount);
      }
      return newArr;
    });
  };

  const handleUnivFamilyMemberChange = (index, field, value) => {
    setUnivFamilyMembersList(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const handleUnivAddVehicle = () => {
    setUnivVehiclesList([...univVehiclesList, { type: 'Car', number: '', sticker: false }]);
  };

  const handleUnivRemoveVehicle = (index) => {
    setUnivVehiclesList(univVehiclesList.filter((_, i) => i !== index));
  };

  const handleUnivVehicleChange = (index, field, value) => {
    setUnivVehiclesList(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  // Admin Add Document Form State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocEnglishTitle, setNewDocEnglishTitle] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Forms');
  const [newDocType, setNewDocType] = useState('PDF');
  const [newDocSize, setNewDocSize] = useState('250 KB');
  const [newDocFileName, setNewDocFileName] = useState('');

  // Notification States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Default Society Documents
  const defaultDocuments = [
    {
      id: 1,
      title: "सोसायटी उप-नियम (Society Bye-Laws)",
      englishTitle: "Society Constitution & Bye-Laws",
      description: "सोसायटी के सुचारू संचालन के लिए आरडब्ल्यूए (Resident Welfare Association) के आधिकारिक नियम और निवासियों के कर्तव्य व अधिकार पत्र।",
      category: "Rules",
      type: "PDF",
      size: "1.2 MB",
      fileName: "makaushalya_society_bye_laws",
      color: "from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-400"
    },
    {
      id: 2,
      title: "किरायेदार पुलिस सत्यापन फॉर्म",
      englishTitle: "Tenant Police Verification Form",
      description: "स्थानीय रायपुर पुलिस थाने में किरायेदार सत्यापन आवेदन हेतु आवश्यक आधिकारिक कानूनी दिशानिर्देश एवं प्रपत्र फॉर्म।",
      category: "Forms",
      type: "PDF",
      size: "240 KB",
      fileName: "tenant_verification_form_raipur",
      color: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
      isInteractiveForm: true
    },
    {
      id: 3,
      title: "अनापत्ति प्रमाण पत्र (NOC) आवेदन पत्र",
      englishTitle: "NOC Renovation & Sale Request Form",
      description: "फ्लैट के आंतरिक निर्माण/नवीनीकरण (Renovation), बैंक लोन या फ्लैट बिक्री के लिए एनओसी आवेदन प्रस्तुत करने का प्रारूप।",
      category: "Forms",
      type: "DOCX",
      size: "150 KB",
      fileName: "rwa_noc_application_form",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      isInteractiveForm: true
    },
    {
      id: 4,
      title: "वाहन पार्किंग स्टिकर फॉर्म",
      englishTitle: "RWA Vehicle Parking Sticker Request",
      description: "सोसायटी परिसर के भीतर नए निवासियों के चार पहिया एवं दो पहिया वाहनों के आधिकारिक गेट पास पार्किंग स्टिकर हेतु फॉर्म।",
      category: "Forms",
      type: "PDF",
      size: "180 KB",
      fileName: "vehicle_parking_sticker_form",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
      isInteractiveForm: true
    },
    {
      id: 7,
      title: "बैचलर किरायेदार सहमति एवं घोषणा-पत्र",
      englishTitle: "Bachelor Tenant Undertaking Agreement",
      description: "बैचलर/सहोदर किरायेदारों के लिए आरडब्ल्यूए सुरक्षा नियमों के अनुपालन, अभिभावक सहमति और मकान मालिक की संयुक्त जिम्मेदारी का आधिकारिक घोषणा-पत्र।",
      category: "Forms",
      type: "PDF",
      size: "190 KB",
      fileName: "bachelor_tenant_undertaking",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      isInteractiveForm: true
    },
    {
      id: 5,
      title: "मासिक वित्तीय ऑडिट रिपोर्ट - अप्रैल 2026",
      englishTitle: "RWA Treasury Balance Sheets - April 2026",
      description: "रेसिडेंट वेलफेयर एसोसिएशन रायपुर द्वारा जारी किया गया मासिक आय, व्यय और एकत्रित रखरखाव निधि (Reserves) का विस्तृत लेखा विवरण।",
      category: "Audits",
      type: "PDF",
      size: "850 KB",
      fileName: "society_financial_audit_april_2026",
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400"
    },
    {
      id: 6,
      title: "आपातकालीन सुरक्षा एवं आपात नंबर गाइड",
      englishTitle: "RWA Emergency & Safety Action Plan",
      description: "आग, प्राकृतिक आपदा या आपातकालीन चिकित्सा के दौरान बरती जाने वाली सावधानियां और रायपुर स्थानीय प्रशासन के आवश्यक फोन नंबर्स।",
      category: "Safety",
      type: "PDF",
      size: "400 KB",
      fileName: "emergency_safety_action_guide",
      color: "from-red-500/20 to-rose-600/20 border-red-500/30 text-rose-500"
    },
    {
      id: 8,
      title: "सार्वभौमिक निवासी विवरण प्रपत्र (Universal Form)",
      englishTitle: "Universal Resident Registration Sheets",
      description: "नये निवासियों से हार्ड कॉपी (Hard Copy) में जानकारी प्राप्त करने या प्रिंट कर भौतिक विवरण सहेजने हेतु आरडब्ल्यूए का सार्वभौमिक विवरण प्रपत्र।",
      category: "Forms",
      type: "PDF",
      size: "320 KB",
      fileName: "universal_resident_registration_form",
      color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400",
      isInteractiveForm: true,
      isUniversalForm: true
    }
  ];

  // Load from localStorage or use default
  const [documentsList, setDocumentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('rwa_downloads_list');
      if (saved && saved !== 'undefined') {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("⚠️ Failed to parse saved downloads list:", e);
    }
    return defaultDocuments;
  });

  useEffect(() => {
    localStorage.setItem('rwa_downloads_list', JSON.stringify(documentsList));
  }, [documentsList]);

  // Seed default templates helper if someone wipes out
  const resetToDefaults = () => {
    setDocumentsList(defaultDocuments);
    setSuccessMsg("दस्तावेज़ों की सूची सफलतापूर्वक रीसेट हो गई है!");
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Helper colors for new custom documents
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Rules': return 'from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-400';
      case 'Forms': return 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400';
      case 'Audits': return 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400';
      case 'Safety': return 'from-red-500/20 to-rose-600/20 border-red-500/30 text-rose-500';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400';
    }
  };

  // Admin: Delete Document
  const handleDeleteDoc = (id) => {
    const updated = documentsList.filter(doc => doc.id !== id);
    setDocumentsList(updated);
    setSuccessMsg("दस्तावेज़ सूची से हटा दिया गया है!");
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Admin: Add New Document
  const handleAddDocSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newDocTitle.trim() || !newDocEnglishTitle.trim() || !newDocDescription.trim() || !newDocFileName.trim()) {
      setErrorMsg("कृपया सभी आवश्यक फ़ील्ड भरें!");
      return;
    }

    const cleanFileName = newDocFileName.trim().toLowerCase().replace(/\s+/g, '_');
    const newDoc = {
      id: Date.now(),
      title: newDocTitle,
      englishTitle: newDocEnglishTitle,
      description: newDocDescription,
      category: newDocCategory,
      type: newDocType,
      size: newDocSize,
      fileName: cleanFileName,
      color: getCategoryColor(newDocCategory),
      isInteractiveForm: false // Custom uploads are general attachments
    };

    setDocumentsList([...documentsList, newDoc]);
    setSuccessMsg("नया दस्तावेज़ बुलेटिन में जोड़ दिया गया है!");
    
    // Clear state
    setNewDocTitle('');
    setNewDocEnglishTitle('');
    setNewDocDescription('');
    setNewDocFileName('');
    setShowAddDocModal(false);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Standard Certified Download Generator
  const handleStandardDownload = (doc) => {
    const content = `========================================================================
     रेसिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) रायपुर
                  माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
        कौशल्या माता विहार, सेक्टर 1, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015
========================================================================

प्रमाणित दस्तावेज़ डाउनलोड रिपोर्ट (CERTIFIED RWA DIGITAL DOCUMENT)
------------------------------------------------------------------------
• दस्तावेज़ आईडी (Doc ID): RWA-DOC-0${doc.id}
• नाम (Name): ${doc.title}
• अंग्रेजी नाम (English): ${doc.englishTitle}
• वर्ग (Category): ${doc.category}
• फाइल प्रकार (Format): ${doc.type}
• फाइल आकार (File Size): ${doc.size}
• प्रमाणीकरण कोड: CERT-${Math.floor(100000 + Math.random() * 900000)}
• डाउनलोड तिथि (Timestamp): ${new Date().toLocaleString('hi-IN')}
------------------------------------------------------------------------

महत्वपूर्ण निर्देश:
1. यह दस्तावेज़ माँ कौशल्या अपार्टमेंट के निवासियों के आधिकारिक उपयोग के लिए आरडब्ल्यूए प्रशासन द्वारा प्रमाणित है।
2. इस फ़ाइल की सुरक्षा व नियमों का पालन अनिवार्य है।
3. किसी भी प्रकार के संशोधन या शिकायत के लिए Resident Welfare Association हेल्पडेस्क से संपर्क करें।

------------------------------------------------------------------------
(C) 2026 MAA KAUSHALYA APARTMENT RESIDENT WELFARE ASSOCIATION.
========================================================================`;

    triggerTextDownload(content, `${doc.fileName}_certified.${doc.type.toLowerCase() === 'pdf' ? 'pdf' : 'docx'}.txt`);
    setDownloadSuccess(doc.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Trigger File Download
  const triggerTextDownload = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Interactive Prefilled PDF/Form Generator
  const handlePrefilledFormSubmit = (e) => {
    e.preventDefault();
    if (!activeFormDoc) return;

    let formContent = "";
    let downloadName = "";

    const timestamp = new Date().toLocaleString('hi-IN');
    const authCode = `AUTH-RWA-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    if (activeFormDoc.id === 2) {
      // Tenant Police Verification
      formContent = `========================================================================
             माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
                       किरायेदार पुलिस सत्यापन प्रमाण पत्र
========================================================================
दिनांक: ${new Date().toLocaleDateString('hi-IN')}          सत्यापन संदर्भ: ${authCode}
------------------------------------------------------------------------

यह प्रमाणित किया जाता है कि माँ कौशल्या अपार्टमेंट (रायपुर, छत्तीसगढ़) के 
फ्लैट संख्या ${tenantFlat || '_____'} में निम्नलिखित किरायेदार के प्रवेश को 
आरडब्ल्यूए (Resident Welfare Association) द्वारा पंजीकृत कर लिया गया है:

[किरायेदार का विवरण]
• किरायेदार का पूरा नाम: ${tenantName || 'N/A'}
• संपर्क फोन नंबर: ${tenantPhone || 'N/A'}
• स्थायी गृह पता: ${tenantAddress || 'N/A'}
• नियोजक/नौकरी का विवरण: ${tenantOccupation || 'N/A'}

[आवास एवं सुरक्षा अनुपालन]
1. किरायेदार ने यह घोषणा की है कि उनका कोई आपराधिक रिकॉर्ड नहीं है।
2. रायपुर पुलिस थाने में सत्यापन हेतु यह प्रपत्र प्रमाणित किया जाता है।
3. नियमों के अनुसार गेट-पास जारी कर दिया गया है।

प्रशासक हस्ताक्षर: नौशाद अहमद (RWA अध्यक्ष)
सत्यापन कोड: ${authCode}
सत्यापित समय: ${timestamp}
------------------------------------------------------------------------
(C) 2026 माँ कौशल्या अपार्टमेंट वेलफेयर एसोसिएशन, रायपुर।
========================================================================`;
      downloadName = `police_verification_flat_${tenantFlat || 'unknown'}.txt`;

    } else if (activeFormDoc.id === 3) {
      // NOC Application
      formContent = `========================================================================
             माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
                   अनापत्ति प्रमाण पत्र (NOC) - आधिकारिक आवेदन
========================================================================
आवेदन संख्या: NOC-2026-${Math.floor(10000 + Math.random() * 90000)}
दिनांक: ${new Date().toLocaleDateString('hi-IN')}
------------------------------------------------------------------------

सेवा में,
रेसिडेंट वेलफेयर एसोसिएशन (RWA),
माँ कौशल्या अपार्टमेंट, रायपुर।

आवेदक का विवरण:
• आवेदक का पूरा नाम: ${nocName || 'N/A'}
• आवंटित फ्लैट संख्या: ${nocFlat || 'N/A'}
• आवेदन का उद्देश्य: ${nocPurpose === 'Renovation' ? 'आंतरिक नवीनीकरण (Renovation)' : nocPurpose === 'BankLoan' ? 'बैंक ऋण अनापत्ति (Bank Loan)' : 'फ्लैट हस्तांतरण/बिक्री (Flat Sale)'}

आवेदन विवरण एवं अनुरोध:
"${nocDetails || 'N/A'}"

उपरोक्त विवरण के आधार पर RWA माँ कौशल्या अपार्टमेंट रायपुर द्वारा यह पुष्टि की जाती है कि आवेदक का सोसायटी रखरखाव शुल्क (Maintenance dues) पूरी तरह शून्य है और उक्त गतिविधियों हेतु अनापत्ति दी जाती है।

समिति प्राधिकारी:
माँ कौशल्या अपार्टमेंट RWA प्रशासनिक डेस्क
ऑफ़लाइन प्रमाणीकरण कोड: ${authCode}
आवेदन समय: ${timestamp}
========================================================================`;
      downloadName = `noc_application_flat_${nocFlat || 'unknown'}.txt`;

    } else if (activeFormDoc.id === 4) {
      // Parking Sticker Form
      formContent = `========================================================================
             माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
                       वाहन गेट-पास एवं पार्किंग स्टिकर प्रपत्र
========================================================================
स्टिकर क्रमांक: RWA-PARK-0${Math.floor(100 + Math.random() * 900)}
दिनांक: ${new Date().toLocaleDateString('hi-IN')}
------------------------------------------------------------------------

यह गेट-पास माँ कौशल्या अपार्टमेंट परिसर के अंदर सुरक्षित पार्किंग एवं प्रवेश 
के लिए आरडब्ल्यूए सुरक्षा विंग द्वारा निम्नलिखित वाहन हेतु जारी किया गया है:

[वाहन एवं आवंटन विवरण]
• वाहन स्वामी का नाम: ${parkingName || 'N/A'}
• संबंधित फ्लैट नंबर: ${parkingFlat || 'N/A'}
• वाहन का प्रकार: ${parkingVehicleType === 'Car' ? 'चार पहिया वाहन (Car)' : 'दो पहिया वाहन (Bike/Scooty)'}
• वाहन का नंबर प्लेट: ${parkingVehicleNo || 'N/A'}
• ब्रांड एवं मॉडल: ${parkingVehicleModel || 'N/A'}

[सुरक्षा नियम]
1. स्टिकर को वाहन की बाईं विंडस्क्रीन/मडगार्ड पर चिपकाना अनिवार्य है।
2. निर्धारित पार्किंग स्थल (Reserved slot) पर ही पार्क करें।
3. गेट पर सुरक्षा गार्ड को स्टिकर स्पष्ट दिखना चाहिए।

जारीकर्ता: सुरक्षा गार्ड डेस्क (माँ कौशल्या अपार्टमेंट रायपुर)
 अधिकृत ट्रांजिट संदर्भ: ${authCode}
प्रविष्टि समय: ${timestamp}
========================================================================`;
      downloadName = `parking_sticker_flat_${parkingFlat || 'unknown'}.txt`;

    } else if (activeFormDoc.id === 7) {
      // Bachelor Tenant Undertaking
      formContent = `========================================================================
                 माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
             बैचलर किरायेदार सहमति एवं सुरक्षा घोषणा-पत्र (UNDERTAKING)
========================================================================
घोषणा क्रमांक: RWA-BACH-${Math.floor(10000 + Math.random() * 90000)}
दिनांक: ${new Date().toLocaleDateString('hi-IN')}     सत्यापन आईडी: ${authCode}
------------------------------------------------------------------------

हम, अधोहस्ताक्षरी किरायेदार और मकान मालिक, माँ कौशल्या अपार्टमेंट, रायपुर 
की प्रशासनिक समिति (RWA) के समक्ष संयुक्त रूप से यह वचन देते हैं और नियमों 
का पूर्णतः पालन करने के लिए बाध्यकारी घोषणा करते हैं:

[आवंटित फ्लैट विवरण]
• फ्लैट संख्या: ${bachelorFlat || 'N/A'}
• फ्लैट मालिक का नाम: ${bachelorOwner || 'N/A'}

[बैचलर किरायेदार विवरण]
• किरायेदार का पूरा नाम: ${bachelorName || 'N/A'}
• संबंधित कॉलेज / संस्थान / कंपनी: ${bachelorOrg || 'N/A'}
• माता-पिता/अभिभावक का नाम: ${bachelorGuardian || 'N/A'}
• अभिभावक का मोबाइल नंबर: ${bachelorGuardianPhone || 'N/A'}

[आरडब्ल्यूए सुरक्षा एवं नैतिक दिशानिर्देश अनुपालन]
1. हम यह घोषणा करते हैं कि आवंटित फ्लैट में शांत समय (Silent Hours) रात 10:00 बजे से सुबह 06:00 बजे तक रहेगा, इस दौरान किसी भी प्रकार का शोरगुल या हुड़दंग प्रतिबंधित रहेगा।
2. फ्लैट के अंदर किसी भी अनधिकृत बाहरी मेहमान या रात में ठहरने वाले आगंतुक की जानकारी सुरक्षा गेट तथा गार्ड रजिस्टर में लिखित रूप में दर्ज कराना अनिवार्य होगा।
3. किसी भी प्रकार की असामाजिक, अवैध या अनैतिक गतिविधियों के पाए जाने पर RWA को बिना किसी पूर्व सूचना के 24 घंटे के भीतर फ्लैट खाली कराने का पूर्ण अधिकार होगा।
4. मकान मालिक (Owner) किरायेदार के किसी भी प्रकार के दुर्व्यवहार या अनुशासनहीनता की स्थिति में समिति के समक्ष अंतिम रूप से उत्तरदायी रहेंगे।

हस्ताक्षर किरायेदार: _____________________      हस्ताक्षर मकान मालिक: _____________________

समिति प्राधिकारी:
नौशाद अहमद (RWA अध्यक्ष, माँ कौशल्या अपार्टमेंट)
सत्यापन समय: ${timestamp}
========================================================================`;
      downloadName = `bachelor_undertaking_flat_${bachelorFlat || 'unknown'}.txt`;
    } else if (activeFormDoc.id === 8) {
      // Universal Form Text Data
      formContent = `========================================================================
             माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
                 सार्वभौमिक निवासी पंजीकरण डेटा (Resident Profile)
========================================================================
पंजीकरण संदर्भ ID: ${authCode}
दिनांक: ${new Date().toLocaleDateString('hi-IN')}          समय: ${timestamp}
------------------------------------------------------------------------

[1. निवासी व्यक्तिगत विवरण]
• नाम (Name): ${univName || 'N/A'}
• ईमेल पता (Email): ${univEmail || 'N/A'}
• मोबाइल नंबर (Phone): ${univPhone || 'N/A'}
• आधार कार्ड नंबर (Aadhaar): ${univAadhaar || 'N/A'}
• आवंटित फ्लैट संख्या (Flat No): ${univFlatNo || 'N/A'}
• प्रवेश तिथि (Move-in Date): ${univMoveInDate || 'N/A'}
• पालतू जानवर (Pet Owned?): ${univHasPet ? 'हाँ (Yes) - ' + univPetDetails : 'नहीं (No)'}

[2. फ्लैट कब्ज़ा विवरण]
• कब्ज़ा स्थिति (Status): ${univOccupancyStatus === 'Self-Occupied' ? 'स्व-कब्जा (Owner)' : 'किराये पर (Renter)'}
${univOccupancyStatus === 'Rented' ? `• किरायेदार श्रेणी: ${univTenantCategory === 'Family' ? 'पारिवारिक (Family)' : 'बैचलर (Bachelor)'}
• मकान मालिक का नाम: ${univOwnerName || 'N/A'}
• मालिक का फोन नंबर: ${univOwnerPhone || 'N/A'}
• पट्टा अनुबंध अवधि: ${univLeaseDuration || 'N/A'}` : '• फ्लैट स्वामी स्वयं रह रहे हैं (Self-Occupied)'}

[3. आपातकालीन संपर्क विवरण]
• आपातकालीन संपर्क नाम: ${univEmergencyName || 'N/A'}
• आपातकालीन मोबाइल नंबर: ${univEmergencyPhone || 'N/A'}

[4. परिवार के सदस्यों का विवरण]
${univFamilyMembersList.length > 0 ? univFamilyMembersList.map((m, i) => `  ${i+1}. नाम: ${m.name || 'N/A'} | फ़ोन: ${m.phone || 'N/A'} | जेंडर: ${m.gender || 'N/A'}`).join('\n') : '  कोई परिवार सदस्य पंजीकृत नहीं है।'}

[5. पंजीकृत वाहनों का विवरण]
${univVehiclesList.length > 0 ? univVehiclesList.map((v, i) => `  ${i+1}. प्रकार: ${v.type || 'N/A'} | वाहन नंबर: ${v.number || 'N/A'} | RWA स्टीकर जारी: ${v.sticker ? 'हाँ' : 'नहीं'}`).join('\n') : '  कोई पंजीकृत वाहन नहीं है।'}

------------------------------------------------------------------------
घोषणा: निवासी द्वारा यह प्रमाणित किया गया है कि दी गई सभी जानकारियां सत्य हैं।
(C) 2026 माँ कौशल्या अपार्टमेंट वेलफेयर एसोसिएशन, रायपुर।
========================================================================`;
      downloadName = `universal_resident_profile_flat_${univFlatNo || 'unknown'}.txt`;
    }

    triggerTextDownload(formContent, downloadName);
    
    // Clear states
    setTenantName('');
    setTenantPhone('');
    setTenantAddress('');
    setTenantOccupation('');
    setTenantFlat('');
    setParkingName('');
    setParkingFlat('');
    setParkingVehicleNo('');
    setParkingVehicleModel('');
    setNocName('');
    setNocFlat('');
    setNocDetails('');
    setBachelorName('');
    setBachelorFlat('');
    setBachelorOrg('');
    setBachelorGuardian('');
    setBachelorGuardianPhone('');
    setBachelorOwner('');

    // Clear Universal States
    setUnivName('');
    setUnivEmail('');
    setUnivPhone('');
    setUnivFlatNo('');
    setUnivAadhaar('');
    setUnivMoveInDate('');
    setUnivEmergencyName('');
    setUnivEmergencyPhone('');
    setUnivOccupancyStatus('Self-Occupied');
    setUnivTenantCategory('Family');
    setUnivOwnerName('');
    setUnivOwnerPhone('');
    setUnivLeaseDuration('');
    setUnivHasPet(false);
    setUnivPetDetails('');
    setUnivProfilePic('');
    setUnivFamilyMembersCount('');
    setUnivFamilyMembersList([]);
    setUnivVehiclesList([]);

    setSuccessMsg("डिजिटल घोषणा-पत्र सफलतापूर्वक उत्पन्न और डाउनलोड हो गया है!");
    setActiveFormDoc(null);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // High-fidelity A4 Printable Form Generator
  const handlePrintUniversalForm = (isBlank) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक (Popup Blocker) सक्रिय है! कृपया इसे इस वेबसाइट के लिए सक्षम करें ताकि प्रिंट प्रपत्र खुल सके।");
      return;
    }
    
    const dateStr = new Date().toLocaleDateString('hi-IN');
    const authCode = `RWA-REG-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare family rows
    let familyRowsHtml = '';
    const safeFamilyList = isBlank ? Array(4).fill({ name: '', phone: '', gender: '' }) : univFamilyMembersList;
    if (safeFamilyList.length > 0) {
      safeFamilyList.forEach((member, index) => {
        familyRowsHtml += `
          <tr>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
            <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10.5px;">${member.name || ''}</td>
            <td style="border: 1px solid #111; padding: 6px; font-size: 10px;">${member.phone || ''}</td>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${member.gender || ''}</td>
          </tr>
        `;
      });
    } else {
      familyRowsHtml = `
        <tr>
          <td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">
            कोई पारिवारिक सदस्य पंजीकृत नहीं है (No family members registered)
          </td>
        </tr>
      `;
    }

    // Prepare vehicle rows
    let vehicleRowsHtml = '';
    const safeVehiclesList = isBlank ? Array(3).fill({ type: '', number: '', sticker: false }) : univVehiclesList;
    if (safeVehiclesList.length > 0) {
      safeVehiclesList.forEach((vehicle, index) => {
        vehicleRowsHtml += `
          <tr>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
            <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10px;">${vehicle.type || ''}</td>
            <td style="border: 1px solid #111; padding: 6px; font-family: monospace; font-size: 10.5px;">${(vehicle.number || '').toUpperCase()}</td>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${isBlank ? '' : (vehicle.sticker ? 'हाँ (Yes)' : 'नहीं (No)')}</td>
          </tr>
        `;
      });
    } else {
      vehicleRowsHtml = `
        <tr>
          <td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">
            कोई वाहन पंजीकृत नहीं है (No vehicles registered)
          </td>
        </tr>
      `;
    }

    // Build HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Universal Resident Form - Maa Kaushalya Apartment</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.4;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border-bottom: 2px double #000;
          }
          .header-logo-cell {
            width: 70px;
            vertical-align: middle;
            text-align: center;
          }
          .header-text-cell {
            vertical-align: middle;
            text-align: center;
            padding-right: 70px;
          }
          .rwa-title-hi {
            font-size: 20px;
            font-weight: 900;
            margin: 0;
            color: #111;
            letter-spacing: 0.5px;
          }
          .rwa-title-en {
            font-size: 13px;
            font-weight: bold;
            margin: 2px 0 0 0;
            color: #333;
            letter-spacing: 1px;
          }
          .rwa-address {
            font-size: 9px;
            color: #555;
            margin: 4px 0 0 0;
          }
          .form-title-container {
            text-align: center;
            margin: 10px 0 15px 0;
          }
          .form-title-hi {
            font-size: 13px;
            font-weight: bold;
            background-color: #eee;
            padding: 4px 12px;
            border: 1px solid #222;
            display: inline-block;
            text-transform: uppercase;
          }
          .form-title-en {
            font-size: 10px;
            margin-top: 3px;
            color: #444;
            font-weight: bold;
          }
          .meta-table {
            width: 100%;
            margin-bottom: 5px;
            font-size: 10px;
          }
          .photo-box {
            width: 110px;
            height: 130px;
            border: 2px dashed #333;
            text-align: center;
            vertical-align: middle;
            font-size: 9px;
            color: #555;
            background-color: #fafafa;
          }
          .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .section-heading {
            font-size: 10px;
            font-weight: bold;
            background-color: #f2f2f2;
            padding: 4px 8px;
            border: 1px solid #111;
            margin-top: 12px;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .data-table th, .data-table td {
            border: 1px solid #111;
            padding: 5px 8px;
            text-align: left;
            vertical-align: middle;
          }
          .data-table th {
            background-color: #fafafa;
            font-weight: bold;
            width: 25%;
            font-size: 9.5px;
          }
          .data-table td {
            width: 25%;
          }
          .full-width-cell {
            width: 75% !important;
          }
          .declaration-box {
            border: 1px solid #111;
            padding: 8px;
            font-size: 9px;
            background-color: #fafafa;
            margin-top: 15px;
            text-align: justify;
          }
          .declaration-title {
            font-weight: bold;
            margin-bottom: 4px;
            text-decoration: underline;
          }
          .signatures-table {
            width: 100%;
            margin-top: 40px;
            border-collapse: collapse;
          }
          .signatures-table td {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
            padding-bottom: 5px;
          }
          .sig-line {
            width: 200px;
            border-bottom: 1px solid #000;
            margin: 0 auto 5px auto;
          }
          .sig-label {
            font-weight: bold;
            font-size: 10px;
          }
          .sig-sub-label {
            font-size: 8.5px;
            color: #555;
            margin-top: 2px;
          }
          .print-button-container {
            margin: 20px 0;
            text-align: center;
          }
          .print-btn {
            background-color: #d4af37;
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            text-transform: uppercase;
          }
          .print-btn:hover {
            background-color: #bfa030;
          }
          @media print {
            .print-button-container {
              display: none;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .photo-box {
              background-color: transparent !important;
            }
            .section-heading {
              background-color: #e5e5e5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .data-table th {
              background-color: #f5f5f5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-button-container">
          <button class="print-btn" onclick="window.print()">प्रिंट करें / PDF सहेजें (Print / Save PDF)</button>
        </div>

        <div class="container">
          <!-- Header -->
          <table class="header-table">
            <tr>
              <td class="header-logo-cell">
                <span style="font-size: 32px;">🏢</span>
              </td>
              <td class="header-text-cell">
                <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</h2>
                <p class="rwa-address">
                  पंजीकरण संख्या: 4832/2024 | सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015
                </p>
              </td>
            </tr>
          </table>

          <!-- Form Title -->
          <div class="form-title-container">
            <div class="form-title-hi">सार्वभौमिक निवासी विवरण प्रपत्र</div>
            <div class="form-title-en">UNIVERSAL RESIDENT REGISTRATION FORM</div>
          </div>

          <!-- Meta & Photo Box -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <td style="vertical-align: top; padding-right: 15px;">
                <table class="meta-table">
                  <tr>
                    <td style="font-weight: bold; width: 140px; padding: 4px 0;">प्रविष्टि संदर्भ (Ref ID):</td>
                    <td style="font-family: monospace; font-size: 11px; padding: 4px 0;">${authCode}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 0;">जारी तिथि (Date of Issue):</td>
                    <td style="padding: 4px 0;">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 0;">आवेदन श्रेणी (Category):</td>
                    <td style="padding: 4px 0; font-weight: bold; text-transform: uppercase;">
                      ${isBlank ? 'नया निवासी पंजीकरण (Blank/Manual)' : 'सत्यापित ऑनलाइन विवरण (Pre-filled)'}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 4px 0;">निवासी स्थिति (Occupancy):</td>
                    <td style="padding: 4px 0; font-weight: bold; text-transform: uppercase;">
                      ${isBlank ? '.............................' : (univOccupancyStatus === 'Self-Occupied' ? 'फ्लैट मालिक (Owner)' : 'किरायेदार (Tenant)')}
                    </td>
                  </tr>
                </table>
              </td>
              <td style="width: 110px; text-align: right; vertical-align: top;">
                <div class="photo-box">
                  ${(!isBlank && univProfilePic) 
                    ? `<img src="${univProfilePic}" class="photo-img" />` 
                    : `<div style="padding-top: 45px; font-weight: bold; line-height: 1.2;">पासपोर्ट फोटो चिपकाएं<br/><span style="font-size: 7px; font-weight: normal; color: #777;">Affix Photo</span></div>`
                  }
                </div>
              </td>
            </tr>
          </table>

          <!-- 1. PERSONAL INFORMATION -->
          <div class="section-heading">1. निवासी विवरण (Resident Personal Information)</div>
          <table class="data-table">
            <tr>
              <th>पूरा नाम (Full Name)</th>
              <td class="full-width-cell" colspan="3" style="font-weight: bold; font-size: 11.5px;">
                ${isBlank ? '' : univName}
              </td>
            </tr>
            <tr>
              <th>मोबाइल नंबर (Mobile No)</th>
              <td>${isBlank ? '' : univPhone}</td>
              <th>ईमेल पता (Email Address)</th>
              <td>${isBlank ? '' : univEmail}</td>
            </tr>
            <tr>
              <th>आधार संख्या / ID Number</th>
              <td>${isBlank ? '' : univAadhaar}</td>
              <th>फ्लैट नंबर (Flat Number)</th>
              <td style="font-weight: bold; font-size: 11.5px;">${isBlank ? '' : univFlatNo}</td>
            </tr>
            <tr>
              <th>प्रवेश तिथि (Move-in Date)</th>
              <td>${isBlank ? '' : univMoveInDate}</td>
              <th>पालतू जानवर (Pet Owned)</th>
              <td>
                ${isBlank ? 'हाँ (Yes) / नहीं (No)' : (univHasPet ? `हाँ: ${univPetDetails}` : 'नहीं (No)')}
              </td>
            </tr>
            <tr>
              <th>आपातकालीन संपर्क नाम</th>
              <td>${isBlank ? '' : univEmergencyName}</td>
              <th>आपातकालीन संपर्क नंबर</th>
              <td>${isBlank ? '' : univEmergencyPhone}</td>
            </tr>
          </table>

          <!-- 2. OCCUPANCY TYPE DETAILS (OWNER OR RENTER) -->
          <div class="section-heading">2. फ्लैट कब्ज़ा स्थिति (Flat Occupancy & Owner Details)</div>
          <table class="data-table">
            <tr>
              <th>कब्जे की श्रेणी (Status)</th>
              <td colspan="3" style="font-weight: bold;">
                ${isBlank ? 'स्वामित्व (Owner-Occupied) / किरायेदार (Rented)' : (univOccupancyStatus === 'Self-Occupied' ? 'स्व-स्वामित्व (Flat Owner - Self Occupied)' : 'किराये पर (Rented / Tenant)')}
              </td>
            </tr>
            ${(isBlank || univOccupancyStatus === 'Rented') ? `
            <tr>
              <th>किरायेदार श्रेणी (Category)</th>
              <td colspan="3">
                ${isBlank ? 'पारिवारिक (Family) / बैचलर (Bachelor)' : (univTenantCategory === 'Family' ? 'पारिवारिक किरायेदार (Family Tenant)' : 'बैचलर किरायेदार (Bachelor Tenant - RWA Approved)')}
              </td>
            </tr>
            <tr>
              <th>फ्लैट मालिक का नाम</th>
              <td>${isBlank ? '' : univOwnerName}</td>
              <th>मालिक का फोन नंबर</th>
              <td>${isBlank ? '' : univOwnerPhone}</td>
            </tr>
            <tr>
              <th>पट्टा अवधि (Lease Period)</th>
              <td colspan="3">${isBlank ? '.............................' : univLeaseDuration}</td>
            </tr>
            ` : `
            <tr>
              <td colspan="4" style="text-align: center; color: #555; font-style: italic; font-size: 9.5px; padding: 8px;">
                स्व-स्वामित्व (Self-Occupied) फ्लैट होने के कारण मकान मालिक विवरण लागू नहीं होता।
              </td>
            </tr>
            `}
          </table>

          <!-- 3. FAMILY MEMBERS DETAILS -->
          <div class="section-heading">3. परिवार के सदस्यों का विवरण (Family Members Details)</div>
          <table class="data-table" style="text-align: center;">
            <thead>
              <tr style="background-color: #fafafa; font-weight: bold;">
                <th style="width: 8%; text-align: center;">क्र. (S.N.)</th>
                <th style="width: 42%; text-align: left;">सदस्य का पूरा नाम (Full Name)</th>
                <th style="width: 30%; text-align: left;">संपर्क नंबर (Mobile Number)</th>
                <th style="width: 20%; text-align: center;">लिंग (Gender)</th>
              </tr>
            </thead>
            <tbody>
              ${familyRowsHtml}
            </tbody>
          </table>

          <!-- 4. VEHICLES REGISTER DETAILS -->
          <div class="section-heading">4. पंजीकृत वाहनों का विवरण (Registered Vehicles Details)</div>
          <table class="data-table" style="text-align: center;">
            <thead>
              <tr style="background-color: #fafafa; font-weight: bold;">
                <th style="width: 10%; text-align: center;">क्र. (S.N.)</th>
                <th style="width: 30%; text-align: left;">वाहन का प्रकार (Type: Car/Bike)</th>
                <th style="width: 40%; text-align: left;">पंजीकरण संख्या (Vehicle No Plate)</th>
                <th style="width: 20%; text-align: center;">स्टीकर जारी (Sticker Issued)</th>
              </tr>
            </thead>
            <tbody>
              ${vehicleRowsHtml}
            </tbody>
          </table>

          <!-- DECLARATION -->
          <div class="declaration-box">
            <div class="declaration-title">घोषणा एवं वचनबद्धता (Resident Declaration Statement)</div>
            मैं एतदद्वारा घोषणा करता/करती हूँ कि इस प्रपत्र में मेरे द्वारा प्रदान की गई सभी जानकारियां पूर्णतः सत्य और प्रमाणित हैं। मैं माँ कौशल्या अपार्टमेंट रेसिडेंट वेलफेयर एसोसिएशन (RWA) रायपुर के समस्त नियमों, उप-नियमों, गेट सुरक्षा नियमों और समय-समय पर आरडब्ल्यूए बोर्ड द्वारा जारी सुरक्षा दिशा-निर्देशों का पूरी तरह से पालन करने के लिए बाध्य हूँ। फ्लैट के भीतर किसी भी प्रकार की अनुशासनहीनता, असामाजिक गतिविधि या नियमों के उल्लंघन की स्थिति में एसोसिएशन द्वारा की जाने वाली दंडात्मक कार्रवाई के लिए मैं स्वयं उत्तरदायी रहूँगा/रहूँगी।
          </div>

          <!-- Signatures -->
          <table class="signatures-table">
            <tr>
              <td>
                <div class="sig-line"></div>
                <div class="sig-label">निवासी / फ्लैट स्वामी के हस्ताक्षर</div>
                <div class="sig-sub-label">Signature of Resident / Flat Owner</div>
              </td>
              <td>
                <div class="sig-line"></div>
                <div class="sig-label">अधिकृत हस्ताक्षरकर्ता (RWA अध्यक्ष/सचिव)</div>
                <div class="sig-sub-label">Authorized Signatory (RWA Authority)</div>
              </td>
            </tr>
          </table>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getCategoryLabelHindi = (cat) => {
    switch(cat) {
      case 'Rules': return 'नियम व उप-नियम (Rules)';
      case 'Forms': return 'आधिकारिक फॉर्म (Forms)';
      case 'Audits': return 'लेखा ऑडिट (Audits)';
      case 'Safety': return 'सुरक्षा गाइड (Safety)';
      default: return 'सभी श्रेणियां (All)';
    }
  };

  // Searching filter logic
  const filteredDocs = documentsList.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (doc.title || '').toLowerCase().includes(q) ||
      (doc.englishTitle || '').toLowerCase().includes(q) ||
      (doc.description || '').toLowerCase().includes(q);
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-4xl mx-auto w-full">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <Download size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">सोसायटी दस्तावेज़ डाउनलोड (Downloads)</h1>
            <p className="text-xs text-slate-400">आधिकारिक फॉर्म, सोसायटी नियम पत्रक, वित्तीय बहीखाता ऑडिट और महत्वपूर्ण फाइल्स</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin-only Add Document Button */}
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-premium"
            >
              <Plus size={14} /> नया प्रलेख (Add Doc)
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider shrink-0 shadow-lg">
            <Sparkles size={12} className="animate-spin text-emerald-400 shrink-0" />
            सत्यापित डाउनलोड पोर्टल
          </div>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <ShieldAlert size={14} /> {errorMsg}
        </div>
      )}

      {/* Warning/Guideline Tag */}
      <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/40 flex items-start gap-3">
        <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">आवश्यक सुरक्षा निर्देश (Security Instructions)</h4>
          <p className="text-[10px] text-slate-400 leading-normal">
            यहाँ उपलब्ध सभी फॉर्म और नियम पत्रक **रेसिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) रायपुर** के स्वामित्वाधीन हैं। प्रपत्रों का अनाधिकृत वितरण प्रतिबंधित है।
          </p>
        </div>
      </div>

      {/* Filter and search controllers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 glass-panel p-3.5 rounded-2xl border border-white/5 flex items-center gap-3 bg-slate-950/40">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="फ़ाइल का नाम, शीर्षक या वर्णन द्वारा खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="glass-panel px-4 py-3 rounded-2xl border border-white/5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 bg-slate-950/80 transition-colors"
        >
          <option value="All">सभी श्रेणियां (All Documents)</option>
          <option value="Rules">नियम व उप-नियम (Rules)</option>
          <option value="Forms">आधिकारिक फॉर्म (Forms)</option>
          <option value="Audits">लेखा ऑडिट (Audits)</option>
          <option value="Safety">सुरक्षा गाइड (Safety)</option>
        </select>
      </div>

      {/* Fast Tabs */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {['All', 'Rules', 'Forms', 'Audits', 'Safety'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-600 to-amber-600 text-white border-transparent shadow-premium'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {getCategoryLabelHindi(cat)}
            </button>
          ))}
        </div>

        {/* Reset defaults for demo purposes */}
        <button 
          onClick={resetToDefaults}
          className="text-[9px] font-bold text-slate-500 hover:text-brand-300 transition-colors uppercase underline tracking-wider"
        >
          डिफ़ॉल्ट सूची लोड करें
        </button>
      </div>

      {/* Document cards grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isDownloaded = downloadSuccess === doc.id;
            return (
              <div
                key={doc.id}
                className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/20 transition-all duration-300 group hover:shadow-premium bg-slate-900/10 animate-fadeIn"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${doc.color || 'from-slate-500/10 to-slate-600/10 border-slate-500/25'} flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform`}>
                      <FileText size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-slate-900 border border-white/5 text-slate-400 uppercase tracking-widest">
                        {doc.type} | {doc.size}
                      </span>
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="दस्तावेज़ सूची से हटाएं"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-sm tracking-wide group-hover:text-amber-400 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                      {doc.englishTitle}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-2 text-left">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-5 flex flex-wrap justify-between items-center gap-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    श्रेणी: <span className="text-slate-300">{doc.category}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* View Preview Button */}
                    <button
                      onClick={() => setActivePreviewDoc(doc)}
                      className="px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase text-indigo-400 hover:text-white bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/25 transition-all flex items-center gap-1"
                      title="दस्तावेज़ का पूर्वावलोकन देखें"
                    >
                      <Eye size={10} /> देखें
                    </button>

                    {/* Pre-fill Form Button (If interactive) */}
                    {doc.isInteractiveForm ? (
                      <button
                        onClick={() => setActiveFormDoc(doc)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all"
                      >
                        <FileSignature size={10} /> फ़ॉर्म भरें
                      </button>
                    ) : (
                      /* Standard Download Button */
                      <button
                        onClick={() => handleStandardDownload(doc)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all shadow-lg ${
                          isDownloaded
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white group-hover:shadow-premium-hover'
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <CheckCircle2 size={10} className="text-white shrink-0 animate-bounce" />
                            पूर्ण!
                          </>
                        ) : (
                          <>
                            <Download size={10} className="text-white shrink-0 group-hover:translate-y-0.5 transition-transform" />
                            डाउनलोड
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <FileText size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई दस्तावेज़ नहीं मिला</h3>
          <p className="text-xs text-slate-400 mt-1">कृपया अपनी खोज क्वेरी बदलें या फ़िल्टर रीसेट करें।</p>
        </div>
      )}

      {/* ─── MODAL: PRE-FILL INTERACTIVE FORM ─── */}
      {activeFormDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`bg-slate-900 border border-white/10 rounded-3xl ${activeFormDoc.isUniversalForm ? 'max-w-4xl max-h-[92vh] overflow-y-auto' : 'max-w-md'} w-full p-6 text-left shadow-2xl relative`}>
            <button 
              onClick={() => setActiveFormDoc(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <FileSignature size={18} className="text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">डिजिटल प्रपत्र (Interactive RWA Form)</h3>
                <h2 className="text-sm font-black text-white">{activeFormDoc.title}</h2>
              </div>
            </div>

            <form onSubmit={handlePrefilledFormSubmit} className="flex flex-col gap-3.5 text-xs">
              
              {/* Conditional Form 1: Tenant Verification */}
              {activeFormDoc.id === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">किरायेदार का पूरा नाम (Tenant Name)</label>
                    <input type="text" required placeholder="जैसे: जॉन डो" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">संपर्क मोबाइल नंबर (Tenant Phone)</label>
                    <input type="tel" required placeholder="+91 9988776655" value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">फ्लैट संख्या (Allocated Flat)</label>
                      <input type="text" required placeholder="जैसे: B-304" value={tenantFlat} onChange={(e) => setTenantFlat(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">व्यवसाय / नौकरी (Occupation)</label>
                      <input type="text" required placeholder="उदा. सॉफ्टवेयर डेवलपर" value={tenantOccupation} onChange={(e) => setTenantOccupation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">स्थायी घरेलू पता (Permanent Address)</label>
                    <textarea rows="2" required placeholder="किरायेदार का स्थायी पता लिखें..." value={tenantAddress} onChange={(e) => setTenantAddress(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none" />
                  </div>
                </div>
              )}

              {/* Conditional Form 2: NOC Application */}
              {activeFormDoc.id === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">फ्लैट स्वामी का नाम (Applicant Name)</label>
                    <input type="text" required placeholder="जैसे: आलोक बारिया" value={nocName} onChange={(e) => setNocName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">फ्लैट संख्या (Flat Number)</label>
                      <input type="text" required placeholder="जैसे: C-103" value={nocFlat} onChange={(e) => setNocFlat(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">एनओसी का उद्देश्य (Purpose)</label>
                      <select value={nocPurpose} onChange={(e) => setNocPurpose(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-brand-500 transition-colors">
                        <option value="Renovation">आंतरिक रेनोवेशन (Renovation)</option>
                        <option value="BankLoan">बैंक लोन / बंधक (Bank Loan)</option>
                        <option value="FlatSale">फ्लैट बेचना / बिक्री (Flat Sale)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">आवश्यक विवरण (Reason & Requirements)</label>
                    <textarea rows="3" required placeholder="विवरण लिखें जिसके लिए एनओसी की आवश्यकता है..." value={nocDetails} onChange={(e) => setNocDetails(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none" />
                  </div>
                </div>
              )}

              {/* Conditional Form 3: Parking Sticker */}
              {activeFormDoc.id === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">वाहन स्वामी का नाम (Applicant Name)</label>
                    <input type="text" required placeholder="जैसे: स्वदेश कटियार" value={parkingName} onChange={(e) => setParkingName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">फ्लैट संख्या (Flat Number)</label>
                      <input type="text" required placeholder="जैसे: C-102" value={parkingFlat} onChange={(e) => setParkingFlat(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">वाहन का प्रकार (Vehicle Type)</label>
                      <select value={parkingVehicleType} onChange={(e) => setParkingVehicleType(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:border-brand-500 focus:outline-none transition-colors">
                        <option value="Car">चार पहिया (Car)</option>
                        <option value="Bike">दो पहिया (Bike / Scooty)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">वाहन पंजीकरण संख्या (Vehicle No.)</label>
                      <input type="text" required placeholder="जैसे: CG04-MA-1234" value={parkingVehicleNo} onChange={(e) => setParkingVehicleNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors font-mono" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">वाहन ब्रांड / मॉडल (Brand / Model)</label>
                      <input type="text" required placeholder="जैसे: Honda City / Activa" value={parkingVehicleModel} onChange={(e) => setParkingVehicleModel(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Form 4: Bachelor Tenant Undertaking */}
              {activeFormDoc.id === 7 && (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">किरायेदार का नाम (Bachelor Name) *</label>
                    <input type="text" required placeholder="जैसे: अमित शर्मा" value={bachelorName} onChange={(e) => setBachelorName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">आवंटित फ्लैट संख्या (Flat No.) *</label>
                      <input type="text" required placeholder="जैसे: B-304" value={bachelorFlat} onChange={(e) => setBachelorFlat(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">कॉलेज या कंपनी का नाम *</label>
                      <input type="text" required placeholder="जैसे: NIT Raipur / TCS" value={bachelorOrg} onChange={(e) => setBachelorOrg(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">अभिभावक का नाम (Guardian) *</label>
                      <input type="text" required placeholder="जैसे: मदन लाल शर्मा" value={bachelorGuardian} onChange={(e) => setBachelorGuardian(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-400 uppercase text-[10px]">अभिभावक संपर्क नंबर *</label>
                      <input type="tel" required placeholder="+91 9999988888" value={bachelorGuardianPhone} onChange={(e) => setBachelorGuardianPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase text-[10px]">मकान मालिक का नाम (Flat Owner) *</label>
                    <input type="text" required placeholder="जैसे: नौशाद अहमद" value={bachelorOwner} onChange={(e) => setBachelorOwner(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="flex items-start gap-2 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl mt-1">
                    <input type="checkbox" required checked={bachelorAgreeRules} onChange={(e) => setBachelorAgreeRules(e.target.checked)} className="mt-0.5 rounded cursor-pointer accent-purple-500" />
                    <p className="text-[9px] text-purple-300 leading-snug">
                      मैं रात 10 बजे के बाद शांत समय (Silent Hours) का पालन करने, अभिभावक को सूचित रखने और RWA सुरक्षा नियमों का सम्मान करने की संयुक्त रूप से प्रतिज्ञा करता हूँ।
                    </p>
                  </div>
                </div>
              )}

              {/* Conditional Form 5: Universal Resident Registration Form */}
              {activeFormDoc.isUniversalForm && (
                <div className="flex flex-col gap-4 text-xs text-slate-300">
                  {/* Top Policy & Print Blank Toggle */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-400">आरडब्ल्यूए सार्वभौमिक निवासी पंजीकरण प्रपत्र</h4>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          नए निवासी विवरण संग्रह के लिए यह एक व्यापक प्रपत्र है। आप या तो इसे डिजिटल रूप से भरकर प्रिंट कर सकते हैं, या सीधे खाली प्रपत्र (Blank Form) प्रिंट कर निवासी को भौतिक विवरण भरने हेतु दे सकते हैं।
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handlePrintUniversalForm(true)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-1.5"
                    >
                      🖨️ खाली प्रपत्र प्रिंट करें (Print Blank A4)
                    </button>
                  </div>

                  {/* Two-Column form grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left Column: Basic Info & Profile Photo */}
                    <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5">
                      <h3 className="font-extrabold text-[10px] uppercase text-brand-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                        👤 बुनियादी जानकारी (Personal Information)
                      </h3>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">पूरा नाम (Full Name) *</label>
                        <input type="text" required placeholder="जैसे: मयंक सिंह" value={univName} onChange={(e) => setUnivName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मोबाइल नंबर (Phone) *</label>
                          <input type="tel" required placeholder="+91 9876543210" value={univPhone} onChange={(e) => setUnivPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">ईमेल पता (Email) *</label>
                          <input type="email" required placeholder="resident@domain.com" value={univEmail} onChange={(e) => setUnivEmail(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">आधार नंबर / ID (Aadhaar No) *</label>
                          <input type="text" required placeholder="1234 5678 9012" value={univAadhaar} onChange={(e) => setUnivAadhaar(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">फ्लैट नंबर (Flat No.) *</label>
                          <select required value={univFlatNo} onChange={(e) => setUnivFlatNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:border-brand-500 outline-none transition-colors">
                            <option value="">फ्लैट नंबर चुनें</option>
                            {SOCIETY_FLATS.map(flat => (
                              <option key={flat} value={flat}>{flat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">प्रवेश तिथि (Move-in Date) *</label>
                          <input type="date" required value={univMoveInDate} onChange={(e) => setUnivMoveInDate(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">कब्जा स्थिति (Occupancy) *</label>
                          <select value={univOccupancyStatus} onChange={(e) => setUnivOccupancyStatus(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:border-brand-500 outline-none transition-colors">
                            <option value="Self-Occupied">स्व-कब्जा (Flat Owner)</option>
                            <option value="Rented">किराये पर (Renter / Tenant)</option>
                          </select>
                        </div>
                      </div>

                      {/* Profile Photo uploader */}
                      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">फोटो अपलोड (Resident Profile Photo)</label>
                        <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 rounded-xl p-2.5">
                          <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center overflow-hidden shrink-0 relative group">
                            {univProfilePic ? (
                              <img src={univProfilePic} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">👤</span>
                            )}
                            {univProfilePic && (
                              <button type="button" onClick={() => setUnivProfilePic('')} className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 text-[8px] font-black transition-all">हटाएं</button>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-1 text-left">
                            <input type="file" accept="image/*" id="profile-upload-univ" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setUnivProfilePic(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }} className="hidden" />
                            <label htmlFor="profile-upload-univ" className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[8px] font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm w-fit">फोटो चुनें</label>
                            <p className="text-[7.5px] text-slate-500">फोटो सीधे प्रिंटआउट और आरडब्ल्यूए रिकॉर्ड में शामिल होगी।</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Renter, Emergency & Pets */}
                    <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5">
                      
                      {/* Tenant Fields (Visible if Rented selected) */}
                      {univOccupancyStatus === 'Rented' ? (
                        <div className="flex flex-col gap-3 bg-indigo-500/5 border border-indigo-500/25 p-3 rounded-2xl animate-fadeIn">
                          <h3 className="font-extrabold text-[10px] uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                            🔑 फ्लैट मालिक एवं पट्टा विवरण (Owner Details)
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setUnivTenantCategory('Family')} className={`py-1.5 rounded-lg text-[9px] font-bold transition-all border ${univTenantCategory === 'Family' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-white/10 text-slate-500'}`}>👪 पारिवारिक</button>
                            <button type="button" onClick={() => setUnivTenantCategory('Bachelor')} className={`py-1.5 rounded-lg text-[9px] font-bold transition-all border ${univTenantCategory === 'Bachelor' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-950 border-white/10 text-slate-500'}`}>🚶 अविवाहित (Bachelor)</button>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">मकान मालिक का नाम (Owner Name) *</label>
                            <input type="text" required placeholder="फ्लैट मालिक का नाम" value={univOwnerName} onChange={(e) => setUnivOwnerName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:border-indigo-500 outline-none transition-colors" />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-slate-400 uppercase text-[9px]">मालिक का फोन (Phone) *</label>
                              <input type="tel" required placeholder="मोबाइल नंबर" value={univOwnerPhone} onChange={(e) => setUnivOwnerPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:border-indigo-500 outline-none transition-colors" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-slate-400 uppercase text-[9px]">अनुबंध अवधि (Lease Period) *</label>
                              <input type="text" required placeholder="उदा: 11 महीने" value={univLeaseDuration} onChange={(e) => setUnivLeaseDuration(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:border-indigo-500 outline-none transition-colors" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-2xl text-left">
                          <p className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">🏠 स्व-स्वामित्व विवरण (Self-Occupied)</p>
                          <p className="text-[8px] text-slate-400 leading-normal mt-1">आप इस फ्लैट के स्वामी (Owner) हैं। प्रिंटआउट में फ्लैट ओनर डिटेल्स स्वतः लागू रहेगी।</p>
                        </div>
                      )}

                      {/* Emergency Contact */}
                      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-3">
                        <h3 className="font-extrabold text-[10px] uppercase text-rose-300 tracking-wider flex items-center gap-1.5">
                          🚨 आपातकालीन संपर्क (Emergency Contact)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">संपर्क व्यक्ति का नाम *</label>
                            <input type="text" required placeholder="नाम लिखें" value={univEmergencyName} onChange={(e) => setUnivEmergencyName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">मोबाइल नंबर *</label>
                            <input type="tel" required placeholder="संपर्क नंबर" value={univEmergencyPhone} onChange={(e) => setUnivEmergencyPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Pet owned */}
                      <div className="flex flex-col gap-2 p-3 bg-violet-500/5 border border-violet-500/20 rounded-2xl text-left mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🐾</span>
                          <div>
                            <label className="text-[9.5px] font-bold text-slate-200 uppercase">पालतू जानवर (Pet Owned?)</label>
                            <p className="text-[7.5px] text-slate-400">क्या परिवार के पास पालतू जानवर है?</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-slate-300">
                            <input type="radio" checked={univHasPet === true} onChange={() => setUnivHasPet(true)} className="accent-brand-500" />
                            <span>हाँ (Yes)</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-slate-300 border-l border-white/10 pl-3">
                            <input type="radio" checked={univHasPet === false} onChange={() => { setUnivHasPet(false); setUnivPetDetails(''); }} className="accent-brand-500" />
                            <span>नहीं (No)</span>
                          </label>

                          {univHasPet && (
                            <input type="text" required placeholder="उदा: 1 लैब्राडोर कुत्ता" value={univPetDetails} onChange={(e) => setUnivPetDetails(e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[8.5px] text-slate-200 focus:border-brand-500 outline-none flex-1 transition-colors" />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Family Members Section */}
                  <div className="flex flex-col gap-2.5 p-4 bg-slate-950/20 border border-white/5 rounded-2xl text-left">
                    <div className="flex items-center gap-3 justify-between border-b border-white/5 pb-2">
                      <h3 className="font-extrabold text-[10px] uppercase text-brand-300 tracking-wider flex items-center gap-1.5">
                        👨‍👩‍👧‍👦 परिवार के सदस्य (Family Members)
                      </h3>
                      <div className="flex items-center gap-2">
                        <label className="font-bold text-slate-400 text-[8px] uppercase">कुल संख्या (Count):</label>
                        <input type="number" min="0" max="15" placeholder="उदा: 3" value={univFamilyMembersCount} onChange={handleUnivFamilyMembersChange} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-center w-12 text-[9px]" />
                      </div>
                    </div>

                    {univFamilyMembersList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {univFamilyMembersList.map((member, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-1.5">
                            <p className="text-[8px] font-black uppercase text-brand-400 tracking-wider">सदस्य {idx + 1}</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[7.5px] text-slate-400 font-bold uppercase">नाम (Name)</label>
                                <input type="text" required placeholder="नाम" value={member.name || ''} onChange={(e) => handleUnivFamilyMemberChange(idx, 'name', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[7.5px] text-slate-400 font-bold uppercase">फ़ोन (Phone)</label>
                                <input type="tel" required placeholder="मोबाइल" value={member.phone || ''} onChange={(e) => handleUnivFamilyMemberChange(idx, 'phone', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[7.5px] text-slate-400 font-bold uppercase">जेंडर (Gender)</label>
                                <select value={member.gender || 'Male'} onChange={(e) => handleUnivFamilyMemberChange(idx, 'gender', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full">
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[8.5px] text-slate-500 italic">कोई पारिवारिक सदस्य विवरण नहीं है। (यदि आप प्री-फिल्ड प्रिंट कर रहे हैं, तो ऊपर कुल संख्या दर्ज करें)।</p>
                    )}
                  </div>

                  {/* Registered Vehicles Section */}
                  <div className="flex flex-col gap-2.5 p-4 bg-slate-950/20 border border-white/5 rounded-2xl text-left">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-extrabold text-[10px] uppercase text-emerald-300 tracking-wider flex items-center gap-1.5">
                        🚗 पंजीकृत वाहन (Registered Vehicles)
                      </h3>
                      <button type="button" onClick={handleUnivAddVehicle} className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-lg text-[8px] font-black uppercase transition-colors">
                        + नया वाहन जोड़ें (Add Vehicle)
                      </button>
                    </div>

                    {univVehiclesList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {univVehiclesList.map((vehicle, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-1.5 text-left">
                            <div className="flex items-center gap-2">
                              <select value={vehicle.type} onChange={(e) => handleUnivVehicleChange(idx, 'type', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[9px] text-slate-200 focus:border-emerald-500 outline-none w-1/3">
                                <option value="Car">Car</option>
                                <option value="Bike">Bike / Scooty</option>
                              </select>
                              <input type="text" required placeholder="CG04 AB 1234" value={vehicle.number} onChange={(e) => handleUnivVehicleChange(idx, 'number', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[9px] text-slate-200 placeholder-slate-700 uppercase font-mono focus:border-emerald-500 outline-none flex-1" />
                              <button type="button" onClick={() => handleUnivRemoveVehicle(idx)} className="text-rose-400 hover:text-rose-300 font-bold px-1.5">✕</button>
                            </div>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[8px] font-bold text-slate-400 select-none bg-slate-950 px-2 py-1 rounded w-fit self-end">
                              <input type="checkbox" checked={vehicle.sticker === true} onChange={(e) => handleUnivVehicleChange(idx, 'sticker', e.target.checked)} className="accent-emerald-500" />
                              <span>सोसायटी स्टीकर जारी (Sticker Issued?)</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[8.5px] text-slate-500 italic">कोई पंजीकृत वाहन विवरण नहीं है।</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl mt-2 text-[10px] text-slate-400">
                <span>{activeFormDoc.isUniversalForm ? '* प्रिंटआउट सीधे ए4 (A4) फॉर्मेट में सहेजने के लिए तैयार रहेगा।' : '* प्रमाणित डिजिटल प्रपत्र आरडब्ल्यूए डेटाबेस में ऑटो-दर्ज हो जाएगा।'}</span>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setActiveFormDoc(null)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold uppercase transition-all"
                >
                  रद्द करें
                </button>
                {activeFormDoc.isUniversalForm ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handlePrintUniversalForm(false)} 
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      🖨️ विवरण भरकर प्रिंट करें (Print Pre-filled)
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold uppercase transition-all shadow-premium"
                    >
                      📥 डेटा फाइल डाउनलोड (.txt)
                    </button>
                  </>
                ) : (
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold uppercase transition-all shadow-premium"
                  >
                    दस्तावेज़ डाउनलोड करें (Generate)
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: PREVIEW DOCUMENT MOCKUP ─── */}
      {activePreviewDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-950/90 border border-white/10 rounded-3xl max-w-xl w-full p-6 text-left shadow-2xl relative">
            <button 
              onClick={() => setActivePreviewDoc(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/25 shrink-0">
                <Eye size={18} />
              </div>
              <div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-slate-900 border border-white/5 text-slate-400 uppercase tracking-widest">
                  {activePreviewDoc.type} | {activePreviewDoc.size}
                </span>
                <h3 className="text-sm font-extrabold text-white mt-1">{activePreviewDoc.title}</h3>
              </div>
            </div>

            {/* Document Digital Mockup Content */}
            <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl font-mono text-[10px] text-slate-300 leading-relaxed overflow-y-auto max-h-72 shadow-inner border-l-4 border-l-amber-500">
              <p className="text-center font-bold text-white text-[11px] mb-1">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</p>
              <p className="text-center text-slate-400 uppercase tracking-widest text-[8px] border-b border-white/10 pb-2">RESIDENT WELFARE ASSOCIATION REGISTERED</p>
              
              <div className="mt-4 flex justify-between text-slate-400">
                <span>संख्या: RWA/CERT/2026-0032</span>
                <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
              </div>

              <div className="mt-4 border-t border-white/5 pt-3">
                <p className="font-bold text-white uppercase text-[9px] mb-1">प्रमाणित प्रलेख शीर्षक (Document):</p>
                <p>{activePreviewDoc.title} ({activePreviewDoc.englishTitle})</p>
              </div>

              <div className="mt-3">
                <p className="font-bold text-white uppercase text-[9px] mb-1">प्रशासनिक विवरण (Scope & Context):</p>
                <p className="text-slate-400 leading-normal">{activePreviewDoc.description}</p>
              </div>

              <div className="mt-3">
                <p className="font-bold text-white uppercase text-[9px] mb-1">सुरक्षा एवं दिशानिर्देश (Compliance terms):</p>
                <ul className="list-disc pl-4 flex flex-col gap-1 text-slate-400">
                  <li>यह दस्तावेज़ केवल प्रमाणित फ्लैट सदस्यों और मालिकों के उपयोग के लिए वैध है।</li>
                  <li>इसके दुरुपयोग या अनधिकृत संशोधन पर प्रशासनिक दंडात्मक कार्यवाही हो सकती है।</li>
                  <li>इस फ़ाइल के सभी अधिकार रेसिडेंट वेलफेयर एसोसिएशन रायपुर के पास सुरक्षित हैं।</li>
                </ul>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3 flex justify-between items-end text-slate-500">
                <div>
                  <p className="text-[7px]">आरडब्ल्यूए सुरक्षा विंग</p>
                  <p className="font-bold text-slate-400 text-[8px]">माँ कौशल्या आरडब्ल्यूए रायपुर</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-bold text-amber-500/70">AUTHORIZED DIGITAL SEAL</p>
                  <p className="font-mono text-[7px]">RWA-AUTH-${Math.floor(1000000 + Math.random() * 9000000)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-5 border-t border-white/5 pt-4">
              <button 
                onClick={() => setActivePreviewDoc(null)} 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold uppercase transition-all text-xs"
              >
                बंद करें
              </button>
              {activePreviewDoc.isInteractiveForm ? (
                <button 
                  onClick={() => { setActiveFormDoc(activePreviewDoc); setActivePreviewDoc(null); }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold uppercase transition-all shadow-premium text-xs flex items-center gap-1"
                >
                  <FileSignature size={12} /> फ़ॉर्म भरें (Fill Form)
                </button>
              ) : (
                <button 
                  onClick={() => { handleStandardDownload(activePreviewDoc); setActivePreviewDoc(null); }}
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white rounded-xl font-bold uppercase transition-all shadow-premium text-xs flex items-center gap-1"
                >
                  <Download size={12} /> डाउनलोड (Download)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADMIN ADD NEW DOCUMENT ─── */}
      {showAddDocModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative">
            <button 
              onClick={() => setShowAddDocModal(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Plus size={18} className="text-brand-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">प्रशासन नियंत्रण (Admin Desk)</h3>
                <h2 className="text-sm font-black text-white">नया सोसायटी दस्तावेज़ / घोषणा जोड़ें</h2>
              </div>
            </div>

            <form onSubmit={handleAddDocSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">दस्तावेज़ का नाम (Hindi Title) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="जैसे: लिफ्ट सुरक्षा निर्देश पत्र" 
                    value={newDocTitle} 
                    onChange={(e) => setNewDocTitle(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">अंग्रेजी शीर्षक (English Title) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="जैसे: Elevator Safety Charter" 
                    value={newDocEnglishTitle} 
                    onChange={(e) => setNewDocEnglishTitle(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">श्रेणी (Category)</label>
                  <select 
                    value={newDocCategory} 
                    onChange={(e) => setNewDocCategory(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="Rules">नियम व उप-नियम (Rules)</option>
                    <option value="Forms">आधिकारिक फॉर्म (Forms)</option>
                    <option value="Audits">वित्तीय ऑडिट (Audits)</option>
                    <option value="Safety">सुरक्षा गाइड (Safety)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">फ़ाइल प्रारूप (Format)</label>
                  <select 
                    value={newDocType} 
                    onChange={(e) => setNewDocType(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX (Spreadsheet)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">फ़ाइल का आकार (Size)</label>
                  <select 
                    value={newDocSize} 
                    onChange={(e) => setNewDocSize(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                  >
                    <option value="120 KB">120 KB</option>
                    <option value="250 KB">250 KB</option>
                    <option value="500 KB">500 KB</option>
                    <option value="1.0 MB">1.0 MB</option>
                    <option value="2.5 MB">2.5 MB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">फ़ाइल नाम (System File Name - No extension) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="जैसे: elevator_safety_rules" 
                    value={newDocFileName} 
                    onChange={(e) => setNewDocFileName(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors font-mono" 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">दस्तावेज़ का विस्तृत वर्णन (Description) *</label>
                  <textarea 
                    rows="3" 
                    required 
                    placeholder="दस्तावेज़ या नियमों के बारे में संक्षिप्त में स्पष्ट विवरण लिखें..." 
                    value={newDocDescription} 
                    onChange={(e) => setNewDocDescription(e.target.value)} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none" 
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddDocModal(false)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold uppercase transition-all"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold uppercase transition-all shadow-premium"
                >
                  प्रकाशन करें (Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Downloads;
