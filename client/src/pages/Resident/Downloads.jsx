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
  Home as HomeIcon,
  Calendar
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

  // Tenant Police Verification Form Tab State
  const [tenantFormTab, setTenantFormTab] = useState('landlord');

  // Tenant Police Verification Form States
  const [llFirstName, setLlFirstName] = useState('');
  const [llMiddleName, setLlMiddleName] = useState('');
  const [llLastName, setLlLastName] = useState('');
  const [llFatherName, setLlFatherName] = useState('');
  const [llEmail, setLlEmail] = useState('');
  const [llPhone, setLlPhone] = useState('');
  const [llLandline, setLlLandline] = useState('');
  const [llOccupation, setLlOccupation] = useState('');
  const [llHouseNo, setLlHouseNo] = useState('');
  const [llCountry, setLlCountry] = useState('भारत (India)');
  const [llStreet, setLlStreet] = useState('');
  const [llState, setLlState] = useState('छत्तीसगढ़ (Chhattisgarh)');
  const [llColony, setLlColony] = useState('');
  const [llDistrict, setLlDistrict] = useState('रायपुर (Raipur)');
  const [llCity, setLlCity] = useState('रायपुर (Raipur)');
  const [llPoliceStation, setLlPoliceStation] = useState('');
  const [llTehsil, setLlTehsil] = useState('');
  const [llPinCode, setLlPinCode] = useState('');

  const [tFirstName, setTFirstName] = useState('');
  const [tMiddleName, setTMiddleName] = useState('');
  const [tLastName, setTLastName] = useState('');
  const [tFatherName, setTFatherName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tLandline, setTLandline] = useState('');
  const [tRelativeName, setTRelativeName] = useState('');
  const [tGender, setTGender] = useState('Male');
  const [tRelationType, setTRelationType] = useState('पिता (Father)');
  const [tOccupation, setTOccupation] = useState('');
  const [tPurpose, setTPurpose] = useState('निवास (Residence)');
  const [tDOB, setTDOB] = useState('');

  const [currHouseNo, setCurrHouseNo] = useState('');
  const [currCountry, setCurrCountry] = useState('भारत (India)');
  const [currStreet, setCurrStreet] = useState('');
  const [currState, setCurrState] = useState('छत्तीसगढ़ (Chhattisgarh)');
  const [currColony, setCurrColony] = useState('');
  const [currDistrict, setCurrDistrict] = useState('रायपुर (Raipur)');
  const [currCity, setCurrCity] = useState('रायपुर (Raipur)');
  const [currPoliceStation, setCurrPoliceStation] = useState('');
  const [currTehsil, setCurrTehsil] = useState('');
  const [currPinCode, setCurrPinCode] = useState('');

  const [prevHouseNo, setPrevHouseNo] = useState('');
  const [prevCountry, setPrevCountry] = useState('भारत (India)');
  const [prevStreet, setPrevStreet] = useState('');
  const [prevState, setPrevState] = useState('');
  const [prevColony, setPrevColony] = useState('');
  const [prevDistrict, setPrevDistrict] = useState('');
  const [prevCity, setPrevCity] = useState('');
  const [prevPoliceStation, setPrevPoliceStation] = useState('');
  const [prevTehsil, setPrevTehsil] = useState('');
  const [prevPinCode, setPrevPinCode] = useState('');
  const [prevStayFrom, setPrevStayFrom] = useState('');
  const [prevStayTo, setPrevStayTo] = useState('');

  const [permHouseNo, setPermHouseNo] = useState('');
  const [permCountry, setPermCountry] = useState('भारत (India)');
  const [permStreet, setPermStreet] = useState('');
  const [permState, setPermState] = useState('');
  const [permColony, setPermColony] = useState('');
  const [permDistrict, setPermDistrict] = useState('');
  const [permCity, setPermCity] = useState('');
  const [permPoliceStation, setPermPoliceStation] = useState('');
  const [permTehsil, setPermTehsil] = useState('');
  const [permPinCode, setPermPinCode] = useState('');

  const [tenantFamilyMembersList, setTenantFamilyMembersList] = useState([]);
  const [tenantFamilyMembersCount, setTenantFamilyMembersCount] = useState('');

  const [tHasCriminalRecord, setTHasCriminalRecord] = useState('नहीं');
  const [tCriminalDetails, setTCriminalDetails] = useState('');
  const [tInfoCorrect, setTInfoCorrect] = useState('हाँ');

  const handleTenantFamilyMembersChange = (e) => {
    const val = e.target.value;
    setTenantFamilyMembersCount(val);
    const count = parseInt(val) || 0;
    const safeCount = Math.min(count, 10);
    setTenantFamilyMembersList(prev => {
      const newArr = [...prev];
      if (safeCount > newArr.length) {
        for (let i = newArr.length; i < safeCount; i++) {
          newArr.push({ name: '', relation: '', phone: '' });
        }
      } else if (safeCount < newArr.length) {
        newArr.splice(safeCount);
      }
      return newArr;
    });
  };

  const handleTenantFamilyMemberChange = (index, field, value) => {
    setTenantFamilyMembersList(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };
  
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
  const [univTenantAgreement, setUnivTenantAgreement] = useState(false);
  const [univPoliceVerification, setUnivPoliceVerification] = useState(false);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const ext = file.name.split('.').pop().toUpperCase();
    setNewDocType(ext === 'PDF' ? 'PDF' : ext === 'DOCX' ? 'DOCX' : ext === 'XLSX' ? 'XLSX' : 'PDF');
    
    const sizeInKb = file.size / 1024;
    if (sizeInKb > 1024) {
      setNewDocSize(`${(sizeInKb / 1024).toFixed(1)} MB`);
    } else {
      setNewDocSize(`${sizeInKb.toFixed(0)} KB`);
    }

    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    setNewDocFileName(baseName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setFileBase64(base64String);
    };
    reader.onerror = (error) => {
      console.error('Error converting file to Base64:', error);
    };
    reader.readAsDataURL(file);
  };

  // Notification States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [documentsList, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submissions State
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

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

  // Fetch documents from backend on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          const mappedDocs = data.data.map(doc => ({
            id: doc.id,
            title: doc.title,
            englishTitle: doc.english_title,
            description: doc.description,
            category: doc.category,
            type: doc.file_type,
            size: doc.file_size,
            fileName: doc.file_name,
            fileContent: doc.file_content,
            isInteractiveForm: doc.is_interactive,
            isUniversalForm: doc.id === 8 || doc.file_name === 'universal_resident_registration_form',
            color: getCategoryColor(doc.category)
          }));
          setDocumentsList(mappedDocs);
        } else {
          setErrorMsg(data.message || 'दस्तावेज़ प्राप्त करने में विफल');
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setErrorMsg('सर्वर से कनेक्ट करने में विफल');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDocuments();
    }
  }, [token]);

  // Fetch form submissions on mount/token change
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/documents/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setSubmissionsList(data.data);
        }
      } catch (err) {
        console.error("Error fetching form submissions:", err);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    if (token) {
      fetchSubmissions();
    }
  }, [token]);

  // Auto Pre-fill Form Fields when modal opens
  useEffect(() => {
    if (!activeFormDoc || !user) return;

    // Split name helper
    const nameParts = (user.name || '').trim().split(/\s+/);
    let firstName = '';
    let middleName = '';
    let lastName = '';
    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      middleName = nameParts.slice(1, -1).join(' ');
      lastName = nameParts[nameParts.length - 1];
    }

    if (activeFormDoc.id === 2) {
      // Tenant Verification Form
      if (user.occupancy_status === 'Rented') {
        setTFirstName(firstName);
        setTMiddleName(middleName);
        setTLastName(lastName);
        setTPhone(user.phone || '');
        setTGender(user.gender || 'Male');
        setCurrHouseNo(user.flat_no || '');
        
        const ownerNameParts = (user.owner_name || '').trim().split(/\s+/);
        setLlFirstName(ownerNameParts[0] || '');
        setLlLastName(ownerNameParts.slice(1).join(' ') || '');
        setLlPhone(user.owner_phone || '');
        setLlHouseNo(user.flat_no || '');
      } else {
        setLlFirstName(firstName);
        setLlMiddleName(middleName);
        setLlLastName(lastName);
        setLlEmail(user.email || '');
        setLlPhone(user.phone || '');
        setLlHouseNo(user.flat_no || '');
      }
    } else if (activeFormDoc.id === 3) {
      setNocName(user.name || '');
      setNocFlat(user.flat_no || '');
    } else if (activeFormDoc.id === 4) {
      setParkingName(user.name || '');
      setParkingFlat(user.flat_no || '');
    } else if (activeFormDoc.id === 7) {
      setBachelorName(user.name || '');
      setBachelorFlat(user.flat_no || '');
      setBachelorOwner(user.owner_name || '');
    } else if (activeFormDoc.id === 8 || activeFormDoc.isUniversalForm) {
      setUnivName(user.name || '');
      setUnivEmail(user.email || '');
      setUnivPhone(user.phone || '');
      setUnivFlatNo(user.flat_no || '');
      setUnivAadhaar(user.aadhaar_number || '');
      
      if (user.move_in_date) {
        try {
          const d = new Date(user.move_in_date);
          if (!isNaN(d.getTime())) {
            setUnivMoveInDate(d.toISOString().split('T')[0]);
          }
        } catch (err) {
          setUnivMoveInDate(user.move_in_date);
        }
      }
      
      setUnivEmergencyName(user.emergency_contact_name || '');
      setUnivEmergencyPhone(user.emergency_contact_phone || '');
      setUnivOccupancyStatus(user.occupancy_status || 'Self-Occupied');
      setUnivTenantCategory(user.tenant_type || 'Family');
      setUnivOwnerName(user.owner_name || '');
      setUnivOwnerPhone(user.owner_phone || '');
      setUnivLeaseDuration(user.lease_duration || '');
      setUnivTenantAgreement(user.lease_agreement_submitted || false);
      setUnivPoliceVerification(user.police_verification_status === 'verified');
      setUnivHasPet(user.has_pet || false);
      setUnivPetDetails(user.pet_details || '');
      setUnivProfilePic(user.profile_picture || '');

      if (user.family_member_names) {
        try {
          const list = typeof user.family_member_names === 'string'
            ? JSON.parse(user.family_member_names)
            : user.family_member_names;
          if (Array.isArray(list)) {
            setUnivFamilyMembersList(list.map(m => ({
              name: m.name || '',
              phone: m.phone || '',
              gender: m.gender || 'Male'
            })));
            setUnivFamilyMembersCount(String(list.length));
          }
        } catch (e) {
          console.warn("Failed to parse family_member_names", e);
        }
      }

      if (user.vehicles) {
        try {
          const list = typeof user.vehicles === 'string'
            ? JSON.parse(user.vehicles)
            : user.vehicles;
          if (Array.isArray(list)) {
            setUnivVehiclesList(list.map(v => ({
              type: v.type || 'Car',
              number: v.number || '',
              sticker: v.sticker || false
            })));
          }
        } catch (e) {
          console.warn("Failed to parse vehicles", e);
        }
      }
    }
  }, [activeFormDoc, user]);


  // Seed default templates helper if someone wipes out
  const resetToDefaults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const mappedDocs = data.data.map(doc => ({
            id: doc.id,
            title: doc.title,
            englishTitle: doc.english_title,
            description: doc.description,
            category: doc.category,
            type: doc.file_type,
            size: doc.file_size,
            fileName: doc.file_name,
            fileContent: doc.file_content,
            isInteractiveForm: doc.is_interactive,
            isUniversalForm: doc.id === 8 || doc.file_name === 'universal_resident_registration_form',
            color: getCategoryColor(doc.category)
          }));
        setDocumentsList(mappedDocs);
        setSuccessMsg("दस्तावेज़ों की सूची सफलतापूर्वक अपडेट हो गई है!");
      }
    } catch (e) {
      setErrorMsg("रीसेट करने में त्रुटि आई");
    } finally {
      setLoading(false);
      setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 2000);
    }
  };

  // Admin: Delete Document
  const handleDeleteDoc = async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const updated = documentsList.filter(doc => doc.id !== id);
        setDocumentsList(updated);
        setSuccessMsg("दस्तावेज़ सूची से हटा दिया गया है!");
      } else {
        setErrorMsg(data.message || 'दस्तावेज़ हटाने में विफल');
      }
    } catch (err) {
      setErrorMsg('सर्वर त्रुटि');
    }
    setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 2000);
  };

  // Admin: Add New Document
  const handleAddDocSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newDocTitle.trim() || !newDocEnglishTitle.trim() || !newDocDescription.trim() || !newDocFileName.trim()) {
      setErrorMsg("कृपया सभी आवश्यक फ़ील्ड भरें!");
      return;
    }

    try {
      const cleanFileName = newDocFileName.trim().toLowerCase().replace(/\s+/g, '_');
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newDocTitle,
          englishTitle: newDocEnglishTitle,
          description: newDocDescription,
          category: newDocCategory,
          fileType: newDocType,
          fileSize: newDocSize,
          fileName: cleanFileName,
          fileContent: fileBase64,
          isInteractive: false
        })
      });

      const data = await response.json();
      if (data.success) {
        const doc = data.data;
        const newMappedDoc = {
          id: doc.id,
          title: doc.title,
          englishTitle: doc.english_title,
          description: doc.description,
          category: doc.category,
          type: doc.file_type,
          size: doc.file_size,
          fileName: doc.file_name,
          fileContent: doc.file_content,
          isInteractiveForm: doc.is_interactive,
          isUniversalForm: doc.id === 8 || doc.file_name === 'universal_resident_registration_form',
          color: getCategoryColor(doc.category)
        };
        setDocumentsList([newMappedDoc, ...documentsList]);
        setSuccessMsg("नया दस्तावेज़ डेटाबेस में जोड़ दिया गया है!");
        
        // Clear state
        setNewDocTitle('');
        setNewDocEnglishTitle('');
        setNewDocDescription('');
        setNewDocFileName('');
        setSelectedFile(null);
        setFileBase64('');
        setShowAddDocModal(false);
      } else {
        setErrorMsg(data.message || 'दस्तावेज़ जोड़ने में विफल');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('सर्वर त्रुटि');
    }
    setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 2000);
  };

  // Standard Certified Download Generator
  const handleStandardDownload = (doc) => {
    if (doc.fileContent) {
      const mimeType = doc.type.toLowerCase() === 'pdf' 
        ? 'application/pdf' 
        : doc.type.toLowerCase() === 'docx' 
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
          : doc.type.toLowerCase() === 'xlsx' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            : 'application/octet-stream';
      
      triggerBinaryDownload(doc.fileContent, `${doc.fileName}.${doc.type.toLowerCase()}`, mimeType);
      setDownloadSuccess(doc.id);
      setTimeout(() => setDownloadSuccess(null), 3000);
      return;
    }

    const content = `========================================================================
     रेसिडेंट वेलफेयर एसोसिएशन (Resident Welfare Association) रायपुर
                  माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
        सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015
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

  // Trigger Binary File Download from Base64
  const triggerBinaryDownload = (base64Content, fileName, mimeType) => {
    try {
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("⚠️ Failed to download binary file:", e);
      setErrorMsg("फ़ाइल डाउनलोड करने में त्रुटि आई।");
      setTimeout(() => setErrorMsg(''), 3000);
    }
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
  const handlePrefilledFormSubmit = async (e) => {
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
                 किरायेदार पुलिस सत्यापन अनुरोध डेटा फ़ाइल
========================================================================
दिनांक: ${new Date().toLocaleDateString('hi-IN')}          सत्यापन संदर्भ: ${authCode}
------------------------------------------------------------------------

[1. मकान मालिक की सूचना (Landlord Information)]
• नाम: ${llFirstName} ${llMiddleName} ${llLastName}
• पिता/पति का नाम: ${llFatherName}
• ईमेल: ${llEmail}
• मोबाइल: ${llPhone}
• लैंडलाइन: ${llLandline}
• व्यवसाय: ${llOccupation}
• मकान मालिक पता: मकान संख्या ${llHouseNo}, ${llStreet}, ${llColony}, ${llCity}, ${llDistrict}, ${llState}, ${llCountry} - ${llPinCode}
• संबंधित पुलिस स्टेशन: ${llPoliceStation}

[2. किरायेदार की सूचना (Tenant Information)]
• नाम: ${tFirstName} ${tMiddleName} ${tLastName}
• पिता/पति का नाम: ${tFatherName}
• मोबाइल: ${tPhone}
• रिश्तेदार का नाम: ${tRelativeName}
• लिंग: ${tGender}
• संबंध: ${tRelationType}
• व्यवसाय: ${tOccupation}
• किरायेदारी का उद्देश्य: ${tPurpose}
• जन्म तिथि: ${tDOB}
• लैंडलाइन: ${tLandline}

[3. वर्तमान पता (Current Address)]
• मकान संख्या ${currHouseNo}, ${currStreet}, ${currColony}, ${currCity}, ${currDistrict}, ${currState}, ${currCountry} - ${currPinCode}
• पुलिस स्टेशन: ${currPoliceStation}

[4. पिछला पता (Previous Address)]
• मकान संख्या ${prevHouseNo}, ${prevStreet}, ${prevColony}, ${prevCity}, ${prevDistrict}, ${prevState}, ${prevCountry} - ${prevPinCode}
• पुलिस स्टेशन: ${prevPoliceStation}
• रहने की अवधि: ${prevStayFrom} से ${prevStayTo}

[5. स्थायी पता (Permanent Address)]
• मकान संख्या ${permHouseNo}, ${permStreet}, ${permColony}, ${permCity}, ${permDistrict}, ${permState}, ${permCountry} - ${permPinCode}
• पुलिस स्टेशन: ${permPoliceStation}

[6. किरायेदार के परिवार के सदस्यों की जानकारी]
${tenantFamilyMembersList.length > 0 ? tenantFamilyMembersList.map((m, i) => `  ${i+1}. नाम: ${m.name || 'N/A'} | संबंध: ${m.relation || 'N/A'} | फ़ोन: ${m.phone || 'N/A'}`).join('\n') : '  कोई परिवार सदस्य पंजीकृत नहीं है।'}

[7. शपथ एवं घोषणा (Undertaking)]
• आपराधिक रिकॉर्ड: ${tHasCriminalRecord}
${tHasCriminalRecord === 'हाँ' ? `• आपराधिक विवरण: ${tCriminalDetails}` : ''}
• सभी जानकारी सही होने की पुष्टि: ${tInfoCorrect}

------------------------------------------------------------------------
(C) 2026 माँ कौशल्या अपार्टमेंट वेलफेयर एसोसिएशन, रायपुर।
========================================================================`;
      downloadName = `police_verification_request_flat_${llHouseNo || 'unknown'}.txt`;

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
• पट्टा अनुबंध अवधि: ${univLeaseDuration || 'N/A'}
• एग्रीमेंट जमा (Lease Agreement?): ${univTenantAgreement ? 'हाँ (Yes)' : 'नहीं (No)'}
• पुलिस सत्यापन (Police Verified?): ${univPoliceVerification ? 'हाँ (Yes)' : 'नहीं (No)'}` : '• फ्लैट स्वामी स्वयं रह रहे हैं (Self-Occupied)'}

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

    // Save to Database
    let formType = '';
    let flatNo = user?.flat_no || 'N/A';
    let submissionData = {};

    if (activeFormDoc.id === 2) {
      formType = 'tenant_verification';
      flatNo = llHouseNo || currHouseNo || user?.flat_no || 'N/A';
      submissionData = {
        llFirstName, llMiddleName, llLastName, llFatherName, llEmail, llPhone, llLandline, llOccupation,
        llHouseNo, llCountry, llStreet, llState, llColony, llDistrict, llCity, llPoliceStation, llTehsil, llPinCode,
        tFirstName, tMiddleName, tLastName, tFatherName, tPhone, tLandline, tRelativeName, tGender, tRelationType,
        tOccupation, tPurpose, tDOB, currHouseNo, currCountry, currStreet, currState, currColony, currDistrict,
        currCity, currPoliceStation, currTehsil, currPinCode, prevHouseNo, prevCountry, prevStreet, prevState,
        prevColony, prevDistrict, prevCity, prevPoliceStation, prevTehsil, prevPinCode, prevStayFrom, prevStayTo,
        permHouseNo, permCountry, permStreet, permState, permColony, permDistrict, permCity, permPoliceStation,
        permTehsil, permPinCode, tenantFamilyMembersList, tHasCriminalRecord, tCriminalDetails, tInfoCorrect
      };
    } else if (activeFormDoc.id === 3) {
      formType = 'noc';
      flatNo = nocFlat || user?.flat_no || 'N/A';
      submissionData = { nocName, nocFlat, nocPurpose, nocDetails };
    } else if (activeFormDoc.id === 4) {
      formType = 'parking_sticker';
      flatNo = parkingFlat || user?.flat_no || 'N/A';
      submissionData = { parkingName, parkingFlat, parkingVehicleType, parkingVehicleNo, parkingVehicleModel };
    } else if (activeFormDoc.id === 7) {
      formType = 'bachelor_undertaking';
      flatNo = bachelorFlat || user?.flat_no || 'N/A';
      submissionData = { bachelorName, bachelorFlat, bachelorOrg, bachelorGuardian, bachelorGuardianPhone, bachelorOwner, bachelorAgreeRules };
    } else if (activeFormDoc.id === 8 || activeFormDoc.isUniversalForm) {
      formType = 'universal_resident';
      flatNo = univFlatNo || user?.flat_no || 'N/A';
      submissionData = {
        univName, univEmail, univPhone, univFlatNo, univAadhaar, univMoveInDate, univEmergencyName, univEmergencyPhone,
        univOccupancyStatus, univTenantCategory, univOwnerName, univOwnerPhone, univLeaseDuration, univTenantAgreement,
        univPoliceVerification, univHasPet, univPetDetails, univProfilePic, univFamilyMembersList, univVehiclesList
      };
    }

    if (formType) {
      try {
        const response = await fetch('/api/documents/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ formType, flatNo, submissionData })
        });
        const data = await response.json();
        if (data.success) {
          setSubmissionsList(prev => [data.data, ...prev]);
        }
      } catch (err) {
        console.error("Failed to save submission in database:", err);
      }
    }

    // Instead of raw text file download, trigger high-fidelity A4 printing for the submission
    if (activeFormDoc.id === 2) {
      handlePrintTenantVerificationForm(false);
    } else if (activeFormDoc.id === 3) {
      handlePrintNocForm();
    } else if (activeFormDoc.id === 4) {
      handlePrintParkingStickerForm();
    } else if (activeFormDoc.id === 7) {
      handlePrintBachelorUndertakingForm();
    } else if (activeFormDoc.id === 8 || activeFormDoc.isUniversalForm) {
      handlePrintUniversalForm(false);
    }
    
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
    setUnivTenantAgreement(false);
    setUnivPoliceVerification(false);
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

  // High-fidelity A4 Printable Form Generator for Tenant Verification
  const handlePrintTenantVerificationForm = (isBlank) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक (Popup Blocker) सक्रिय है! कृपया इसे इस वेबसाइट के लिए सक्षम करें ताकि प्रिंट प्रपत्र खुल सके।");
      return;
    }

    const dateStr = new Date().toLocaleDateString('hi-IN');
    const authCode = `RWA-POL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare family rows
    let familyRowsHtml = '';
    const safeFamilyList = isBlank ? Array(4).fill({ name: '', relation: '', phone: '' }) : tenantFamilyMembersList;
    if (safeFamilyList.length > 0) {
      safeFamilyList.forEach((member, index) => {
        familyRowsHtml += `
          <tr>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
            <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10.5px;">${member.name || ''}</td>
            <td style="border: 1px solid #111; padding: 6px; font-size: 10px;">${member.relation || ''}</td>
            <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${member.phone || ''}</td>
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

    const valOrDot = (val) => isBlank ? '..................................................' : (val || 'N/A');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>किरायेदार पुलिस सत्यापन अनुरोध फॉर्म - माँ कौशल्या अपार्टमेंट</title>
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
            margin-bottom: 10px;
            border-bottom: 2px double #000;
          }
          .header-logo-cell {
            width: 60px;
            vertical-align: middle;
            text-align: center;
          }
          .header-text-cell {
            vertical-align: middle;
            text-align: center;
            padding-right: 60px;
          }
          .rwa-title-hi {
            font-size: 18px;
            font-weight: 900;
            margin: 0;
            color: #111;
            letter-spacing: 0.5px;
          }
          .rwa-title-en {
            font-size: 11px;
            font-weight: bold;
            margin: 2px 0 0 0;
            color: #333;
            letter-spacing: 1px;
          }
          .rwa-address {
            font-size: 8.5px;
            color: #555;
            margin: 2px 0 0 0;
          }
          .form-title-container {
            text-align: center;
            margin: 5px 0 10px 0;
          }
          .form-title-hi {
            font-size: 12px;
            font-weight: bold;
            background-color: #eee;
            padding: 3px 10px;
            border: 1px solid #222;
            display: inline-block;
          }
          .photo-box {
            width: 100px;
            height: 120px;
            border: 1.5px dashed #333;
            text-align: center;
            vertical-align: middle;
            font-size: 8.5px;
            color: #555;
            background-color: #fafafa;
          }
          .section-heading {
            font-size: 10px;
            font-weight: bold;
            background-color: #f2f2f2;
            padding: 3px 8px;
            border: 1px solid #111;
            margin-top: 8px;
            margin-bottom: 4px;
            text-transform: uppercase;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
          }
          .data-table th, .data-table td {
            border: 1px solid #111;
            padding: 4px 6px;
            text-align: left;
            vertical-align: middle;
          }
          .data-table th {
            background-color: #fafafa;
            font-weight: bold;
            width: 25%;
            font-size: 9px;
          }
          .data-table td {
            width: 25%;
          }
          .signatures-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
          }
          .signatures-table td {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
          }
          .sig-line {
            width: 180px;
            border-bottom: 1px solid #000;
            margin: 0 auto 5px auto;
          }
          .sig-label {
            font-weight: bold;
            font-size: 9.5px;
          }
          .print-button-container {
            margin: 15px 0;
            text-align: center;
          }
          .print-btn {
            background-color: #0284c7;
            color: white;
            border: none;
            padding: 8px 20px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
          }
          @media print {
            .print-button-container {
              display: none;
            }
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-button-container">
          <button class="print-btn" onclick="window.print()">प्रिंट करें / PDF सहेजें (Print / Save PDF)</button>
        </div>

        <div class="container">
          <table class="header-table">
            <tr>
              <td class="header-logo-cell">
                <span style="font-size: 28px;">🏢</span>
              </td>
              <td class="header-text-cell">
                <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</h2>
                <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
              </td>
            </tr>
          </table>

          <div class="form-title-container">
            <div class="form-title-hi">किरायेदार / पी.जी.सत्यापन अनुरोध फॉर्म</div>
            <div style="font-size: 8.5px; color: #444; font-weight: bold; margin-top: 2px;">TENANT / PG VERIFICATION REQUEST FORM</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
            <tr>
              <td style="vertical-align: top;">
                <table style="font-size: 9px; line-height: 1.5;">
                  <tr>
                    <td style="font-weight: bold; width: 140px;">संदर्भ नंबर (Ref ID):</td>
                    <td style="font-family: monospace;">${authCode}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">दिनांक (Date):</td>
                    <td>${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">पुलिस थाना (Police Station):</td>
                    <td>${valOrDot(isBlank ? '' : currPoliceStation)}</td>
                  </tr>
                </table>
              </td>
              <td style="width: 100px; text-align: right; vertical-align: top;">
                <div class="photo-box">
                  <div style="padding-top: 40px; font-weight: bold; line-height: 1.2;">पासपोर्ट फोटो<br/><span style="font-size: 7px; font-weight: normal; color: #777;">Affix Photo</span></div>
                </div>
              </td>
            </tr>
          </table>

          <!-- 1. LANDLORD DETAILS -->
          <div class="section-heading">मकान मालिक की सूचना (Landlord Information)</div>
          <table class="data-table">
            <tr>
              <th>प्रथम नाम (First Name)*</th>
              <td>${valOrDot(llFirstName)}</td>
              <th>मध्य नाम (Middle Name)</th>
              <td>${valOrDot(llMiddleName)}</td>
            </tr>
            <tr>
              <th>अंतिम नाम (Last Name)</th>
              <td>${valOrDot(llLastName)}</td>
              <th>पिता / पति का नाम</th>
              <td>${valOrDot(llFatherName)}</td>
            </tr>
            <tr>
              <th>ईमेल आईडी (Email ID)</th>
              <td>${valOrDot(llEmail)}</td>
              <th>मोबाइल नम्बर (Mobile No)</th>
              <td>${valOrDot(llPhone)}</td>
            </tr>
            <tr>
              <th>व्यवसाय (Occupation)</th>
              <td>${valOrDot(llOccupation)}</td>
              <th>लैण्ड लाइन नंबर</th>
              <td>${valOrDot(llLandline)}</td>
            </tr>
          </table>

          <table class="data-table">
            <tr>
              <th>मकान संख्या (Flat/House No)</th>
              <td>${valOrDot(llHouseNo)}</td>
              <th>गली का नाम (Street)</th>
              <td>${valOrDot(llStreet)}</td>
            </tr>
            <tr>
              <th>कालोनी / क्षेत्र (Colony)</th>
              <td>${valOrDot(llColony)}</td>
              <th>ग्राम / नगर / शहर*</th>
              <td>${valOrDot(llCity)}</td>
            </tr>
            <tr>
              <th>तहसील / ब्लॉक / मंडल</th>
              <td>${valOrDot(llTehsil)}</td>
              <th>जिला (District)</th>
              <td>${valOrDot(llDistrict)}</td>
            </tr>
            <tr>
              <th>राज्य (State)</th>
              <td>${valOrDot(llState)}</td>
              <th>देश* (Country)</th>
              <td>${valOrDot(llCountry)}</td>
            </tr>
            <tr>
              <th>पुलिस स्टेशन (PS)</th>
              <td>${valOrDot(llPoliceStation)}</td>
              <th>पिन कोड (Pin Code)</th>
              <td>${valOrDot(llPinCode)}</td>
            </tr>
          </table>

          <!-- 2. TENANT DETAILS -->
          <div class="section-heading">किरायेदार की सूचना (Tenant Information)</div>
          <table class="data-table">
            <tr>
              <th>प्रथम नाम (First Name)</th>
              <td>${valOrDot(tFirstName)}</td>
              <th>मध्य नाम (Middle Name)</th>
              <td>${valOrDot(tMiddleName)}</td>
            </tr>
            <tr>
              <th>अंतिम नाम (Last Name)</th>
              <td>${valOrDot(tLastName)}</td>
              <th>पिता / पति का नाम</th>
              <td>${valOrDot(tFatherName)}</td>
            </tr>
            <tr>
              <th>मोबाइल नंबर (Mobile No)</th>
              <td>${valOrDot(tPhone)}</td>
              <th>रिश्तेदार का नाम</th>
              <td>${valOrDot(tRelativeName)}</td>
            </tr>
            <tr>
              <th>लिंग (Gender)</th>
              <td>${valOrDot(isBlank ? '' : tGender)}</td>
              <th>संबंध के प्रकार</th>
              <td>${valOrDot(isBlank ? '' : tRelationType)}</td>
            </tr>
            <tr>
              <th>व्यवसाय (Occupation)</th>
              <td>${valOrDot(tOccupation)}</td>
              <th>किरायेदारी का उद्देश्य</th>
              <td>${valOrDot(isBlank ? '' : tPurpose)}</td>
            </tr>
            <tr>
              <th>जन्म तिथी (DOB)</th>
              <td>${valOrDot(tDOB)}</td>
              <th>लैण्ड लाईन नम्बर</th>
              <td>${valOrDot(tLandline)}</td>
            </tr>
          </table>

          <!-- 3. CURRENT ADDRESS -->
          <div class="section-heading">वर्तमान पता (Current Address)</div>
          <table class="data-table">
            <tr>
              <th>मकान संख्या</th>
              <td>${valOrDot(currHouseNo)}</td>
              <th>गली का नाम</th>
              <td>${valOrDot(currStreet)}</td>
            </tr>
            <tr>
              <th>कालोनी / क्षेत्र</th>
              <td>${valOrDot(currColony)}</td>
              <th>ग्राम / नगर / शहर</th>
              <td>${valOrDot(currCity)}</td>
            </tr>
            <tr>
              <th>तहसील / ब्लॉक / मंडल</th>
              <td>${valOrDot(currTehsil)}</td>
              <th>जिला</th>
              <td>${valOrDot(currDistrict)}</td>
            </tr>
            <tr>
              <th>राज्य</th>
              <td>${valOrDot(currState)}</td>
              <th>देश</th>
              <td>${valOrDot(currCountry)}</td>
            </tr>
            <tr>
              <th>पुलिस स्टेशन</th>
              <td>${valOrDot(currPoliceStation)}</td>
              <th>पिन कोड</th>
              <td>${valOrDot(currPinCode)}</td>
            </tr>
          </table>

          <div style="page-break-before: always;"></div>

          <table class="header-table">
            <tr>
              <td class="header-logo-cell">
                <span style="font-size: 20px;">🏢</span>
              </td>
              <td class="header-text-cell" style="padding-right: 20px;">
                <h1 style="font-size: 14px; margin:0;">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <p style="font-size: 7.5px; color:#555; margin:0;">किरायेदार पुलिस सत्यापन अनुरोध फॉर्म - भाग 2</p>
              </td>
            </tr>
          </table>

          <!-- 4. PREVIOUS ADDRESS -->
          <div class="section-heading">पिछला पता (Previous Address)</div>
          <table class="data-table">
            <tr>
              <th>मकान संख्या</th>
              <td>${valOrDot(prevHouseNo)}</td>
              <th>गली का नाम</th>
              <td>${valOrDot(prevStreet)}</td>
            </tr>
            <tr>
              <th>कालोनी / क्षेत्र</th>
              <td>${valOrDot(prevColony)}</td>
              <th>ग्राम / नगर / शहर</th>
              <td>${valOrDot(prevCity)}</td>
            </tr>
            <tr>
              <th>तहसील / ब्लॉक / मंडल</th>
              <td>${valOrDot(prevTehsil)}</td>
              <th>जिला</th>
              <td>${valOrDot(prevDistrict)}</td>
            </tr>
            <tr>
              <th>राज्य</th>
              <td>${valOrDot(prevState)}</td>
              <th>देश</th>
              <td>${valOrDot(prevCountry)}</td>
            </tr>
            <tr>
              <th>police station (थाना)</th>
              <td>${valOrDot(prevPoliceStation)}</td>
              <th>पिन कोड</th>
              <td>${valOrDot(prevPinCode)}</td>
            </tr>
            <tr>
              <th>रहने की दिनांक (From)</th>
              <td>${valOrDot(prevStayFrom)}</td>
              <th>छोड़ने की दिनांक (To)</th>
              <td>${valOrDot(prevStayTo)}</td>
            </tr>
          </table>

          <!-- 5. PERMANENT ADDRESS -->
          <div class="section-heading">स्थायी पता (Permanent Address)</div>
          <table class="data-table">
            <tr>
              <th>मकान संख्या</th>
              <td>${valOrDot(permHouseNo)}</td>
              <th>गली का नाम</th>
              <td>${valOrDot(permStreet)}</td>
            </tr>
            <tr>
              <th>कालोनी / क्षेत्र</th>
              <td>${valOrDot(permColony)}</td>
              <th>ग्राम / नगर / शहर</th>
              <td>${valOrDot(permCity)}</td>
            </tr>
            <tr>
              <th>तहसील / ब्लॉक / मंडल</th>
              <td>${valOrDot(permTehsil)}</td>
              <th>जिला</th>
              <td>${valOrDot(permDistrict)}</td>
            </tr>
            <tr>
              <th>राज्य</th>
              <td>${valOrDot(permState)}</td>
              <th>देश</th>
              <td>${valOrDot(permCountry)}</td>
            </tr>
            <tr>
              <th>पुलिस स्टेशन</th>
              <td>${valOrDot(permPoliceStation)}</td>
              <th>पिन कोड</th>
              <td>${valOrDot(permPinCode)}</td>
            </tr>
          </table>

          <!-- 6. FAMILY DETAILS -->
          <div class="section-heading">किरायेदार के परिवार के सदस्यों की जानकारी</div>
          <table class="data-table" style="text-align: center;">
            <thead>
              <tr style="background-color: #fafafa; font-weight: bold;">
                <th style="width: 10%; text-align: center;">क्र. (S.N.)</th>
                <th style="width: 40%; text-align: left;">सदस्य का पूरा नाम (Full Name)</th>
                <th style="width: 30%; text-align: left;">किरायेदार के साथ संबंध</th>
                <th style="width: 20%; text-align: center;">मोबाईल नंबर (Mobile)</th>
              </tr>
            </thead>
            <tbody>
              ${familyRowsHtml}
            </tbody>
          </table>

          <div style="font-size: 8px; font-weight: bold; margin: 5px 0;">
            नोट :- किरायेदार के पहचान / पते का दस्तावेज (आधार कार्ड / ड्राइविंग लाईसेंस / पेन कार्ड / एम्प्लाई कार्ड इत्यादि) साथ में संलग्न करें।
          </div>

          <!-- 7. SHAPATH / DECLARATION -->
          <div class="section-heading">शपथ (Undertaking / Declaration)</div>
          <div style="border: 1px solid #111; padding: 6px; font-size: 9px; line-height: 1.5; text-align: justify; background-color: #fafafa;">
            <strong>प्रश्न:</strong> क्या आपका कोई आपराधिक रिकॉर्ड है या देश के किसी भी भाग में आप या आपके परिवार के विरुद्ध कहीं कोई आपराधिक मामला चल रहा है? यदि हाँ विवरण प्रदान करे।<br/>
            <strong>उत्तर (हाँ / नहीं):</strong> <span style="font-weight: bold; border-bottom: 1px solid #000; padding: 0 10px;">${valOrDot(tHasCriminalRecord)}</span><br/>
            ${(!isBlank && tHasCriminalRecord === 'हाँ' && tCriminalDetails) ? `<strong>विवरण:</strong> ${tCriminalDetails}<br/>` : ''}
            <br/>
            मैं एतदद्वारा घोषणा करता/करती हूँ कि उपरोक्त सभी उपलब्ध कराई गई जानकारी पूरी तरह से सही है (हाँ / नहीं): 
            <span style="font-weight: bold; border-bottom: 1px solid #000; padding: 0 10px;">${valOrDot(tInfoCorrect)}</span>
          </div>

          <!-- SIGNATURES -->
          <table class="signatures-table">
            <tr>
              <td>
                <div class="sig-line"></div>
                <div class="sig-label">हस्ताक्षर मकान मालिक</div>
                <div style="font-size: 7.5px; color:#555; margin-top:2px;">Signature of Landlord</div>
              </td>
              <td>
                <div class="sig-line"></div>
                <div class="sig-label">हस्ताक्षर किरायेदार</div>
                <div style="font-size: 7.5px; color:#555; margin-top:2px;">Signature of Tenant</div>
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
          <tr style="${isBlank ? 'height: 28px;' : ''}">
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
          <tr style="${isBlank ? 'height: 28px;' : ''}">
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
                  सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015
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
                ${isBlank ? '....................................................................................................' : univName}
              </td>
            </tr>
            <tr>
              <th>मोबाइल नंबर (Mobile No)</th>
              <td>${isBlank ? '...........................................................' : univPhone}</td>
              <th>ईमेल पता (Email Address)</th>
              <td>${isBlank ? '...........................................................' : univEmail}</td>
            </tr>
            <tr>
              <th>आधार संख्या / ID Number</th>
              <td>${isBlank ? '...........................................................' : univAadhaar}</td>
              <th>फ्लैट नंबर (Flat Number)</th>
              <td style="font-weight: bold; font-size: 11.5px;">${isBlank ? '...........................................................' : univFlatNo}</td>
            </tr>
            <tr>
              <th>प्रवेश तिथि (Move-in Date)</th>
              <td>${isBlank ? '...........................................................' : univMoveInDate}</td>
              <th>पालतू जानवर (Pet Owned)</th>
              <td>
                ${isBlank ? 'हाँ (Yes) / नहीं (No) | विवरण: .......................' : (univHasPet ? `हाँ: ${univPetDetails}` : 'नहीं (No)')}
              </td>
            </tr>
            <tr>
              <th>आपातकालीन संपर्क नाम</th>
              <td>${isBlank ? '...........................................................' : univEmergencyName}</td>
              <th>आपातकालीन संपर्क नंबर</th>
              <td>${isBlank ? '...........................................................' : univEmergencyPhone}</td>
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
                ${isBlank ? 'पारिवारिक (Family) / अविवाहित (Bachelor) [टिक करें]' : (univTenantCategory === 'Family' ? 'पारिवारिक किरायेदार (Family Tenant)' : 'बैचलर किरायेदार (Bachelor Tenant - RWA Approved)')}
              </td>
            </tr>
            ${(!isBlank && univTenantCategory === 'Bachelor') ? `
            <tr style="background-color: #fff1f2;">
              <td colspan="4" style="color: #be123c; font-weight: bold; font-size: 9px; padding: 6px; border: 1px solid #be123c;">
                ⚠️ आरडब्ल्यूए चेतावनी (RWA Security Warning): अविवाहित किरायेदार (Bachelor Tenant) श्रेणी के पंजीकरण के लिए RWA नियमों के अनुसार संयुक्त सुरक्षा घोषणा-पत्र (Bachelor Undertaking - Form 7) का विधिवत हस्ताक्षर कर संलग्न होना अनिवार्य है।
              </td>
            </tr>
            ` : ''}
            <tr>
              <th>फ्लैट मालिक का नाम</th>
              <td>${isBlank ? '...........................................................' : univOwnerName}</td>
              <th>малик का फोन नंबर</th>
              <td>${isBlank ? '...........................................................' : univOwnerPhone}</td>
            </tr>
            <tr>
              <th>पट्टा अवधि (Lease Period)</th>
              <td colspan="3">${isBlank ? '....................................................................................................' : univLeaseDuration}</td>
            </tr>
            <tr>
              <th>एग्रीमेंट जमा? (Lease Agreement?)</th>
              <td>${isBlank ? 'हाँ (Yes) / नहीं (No)' : (univTenantAgreement ? 'हाँ (Yes)' : 'नहीं (No)')}</td>
              <th>पुलिस सत्यापन? (Police Verification?)</th>
              <td>${isBlank ? 'हाँ (Yes) / नहीं (No)' : (univPoliceVerification ? 'हाँ (Yes)' : 'नहीं (No)')}</td>
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

  const handlePrintNocForm = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक सक्रिय है! कृपया इस साईट के लिए अनुमति दें।");
      return;
    }

    const dateStr = new Date().toLocaleDateString('hi-IN');
    const authCode = `RWA-NOC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NOC आवेदन - माँ कौशल्या अपार्टमेंट</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
          .container { max-width: 800px; margin: 0 auto; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
          .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
          .header-text-cell { text-align: center; padding-right: 60px; }
          .rwa-title-hi { font-size: 20px; font-weight: bold; margin: 0; }
          .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
          .rwa-address { font-size: 9px; color: #555; }
          .form-title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; font-weight: bold; }
          .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 20px; font-size: 11px; }
          .field { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .details { border: 1px solid #111; padding: 15px; font-size: 11px; min-height: 150px; margin-top: 10px; background: #fff; white-space: pre-wrap; }
          .footer-table { width: 100%; margin-top: 50px; }
          .footer-table td { width: 50%; text-align: center; }
          .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          .print-btn { background-color: #0284c7; color: white; border: none; padding: 8px 20px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: center;"><button class="print-btn" onclick="window.print()">प्रिंट करें / PDF सहेजें</button></div>
        <div class="container">
          <table class="header-table">
            <tr>
              <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
              <td class="header-text-cell">
                <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</p>
                <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
              </td>
            </tr>
          </table>
          <div class="form-title">अनापत्ति प्रमाण पत्र (NOC) आवेदन पत्र</div>
          <div class="meta"><span>संदर्भ आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
          <div class="box">
            <div class="field"><span class="label">आवेदक का पूरा नाम:</span><span>${nocName || '____________________'}</span></div>
            <div class="field"><span class="label">आवंटित फ्लैट संख्या:</span><span>${nocFlat || '____________________'}</span></div>
            <div class="field"><span class="label">आवेदन का उद्देश्य:</span><span>${nocPurpose === 'Renovation' ? 'आंतरिक नवीनीकरण (Renovation)' : nocPurpose === 'BankLoan' ? 'बैंक ऋण अनापत्ति (Bank Loan)' : 'फ्लैट हस्तांतरण/बिक्री (Flat Sale)'}</span></div>
          </div>
          <p><strong>आवेदन का विवरण (NOC Request Details):</strong></p>
          <div class="details">${nocDetails || 'N/A'}</div>
          <p style="font-size: 9.5px; color: #444; margin-top: 15px;">उपरोक्त विवरण के आधार पर RWA माँ कौशल्या अपार्टमेंट रायपुर द्वारा यह पुष्टि की जाती है कि आवेदक का सोसायटी रखरखाव शुल्क (Maintenance dues) पूरी तरह शून्य है और उक्त गतिविधियों हेतु अनापत्ति दी जाती है।</p>
          <table class="footer-table">
            <tr>
              <td><div class="sig-line"></div><div>आवेदक के हस्ताक्षर</div></td>
              <td><div class="sig-line"></div><div>RWA प्रशासनिक डेस्क</div></td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handlePrintParkingStickerForm = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक सक्रिय है! कृपया इस साईट के लिए अनुमति दें।");
      return;
    }

    const dateStr = new Date().toLocaleDateString('hi-IN');
    const authCode = `RWA-PARK-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>वाहन पार्किंग स्टिकर - माँ कौशल्या अपार्टमेंट</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
          .container { max-width: 800px; margin: 0 auto; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
          .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
          .header-text-cell { text-align: center; padding-right: 60px; }
          .rwa-title-hi { font-size: 20px; font-weight: bold; margin: 0; }
          .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
          .rwa-address { font-size: 9px; color: #555; }
          .form-title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; font-weight: bold; }
          .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 20px; font-size: 11px; }
          .field { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; }
          .footer-table { width: 100%; margin-top: 50px; }
          .footer-table td { width: 50%; text-align: center; }
          .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          .print-btn { background-color: #0284c7; color: white; border: none; padding: 8px 20px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: center;"><button class="print-btn" onclick="window.print()">प्रिंट करें / PDF सहेजें</button></div>
        <div class="container">
          <table class="header-table">
            <tr>
              <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
              <td class="header-text-cell">
                <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</p>
                <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
              </td>
            </tr>
          </table>
          <div class="form-title">वाहन गेट-पास एवं पार्किंग स्टिकर प्रपत्र</div>
          <div class="meta"><span>संदर्भ आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
          <div class="box">
            <div class="field"><span class="label">वाहन स्वामी का नाम:</span><span>${parkingName || '____________________'}</span></div>
            <div class="field"><span class="label">संबंधित फ्लैट नंबर:</span><span>${parkingFlat || '____________________'}</span></div>
            <div class="field"><span class="label">वाहन का प्रकार:</span><span>${parkingVehicleType === 'Car' ? 'चार पहिया वाहन (Car)' : 'दो पहिया वाहन (Bike/Scooty)'}</span></div>
            <div class="field"><span class="label">वाहन का नंबर प्लेट:</span><span>${parkingVehicleNo || '____________________'}</span></div>
            <div class="field"><span class="label">ब्रांड एवं मॉडल:</span><span>${parkingVehicleModel || '____________________'}</span></div>
          </div>
          <p><strong>पार्किंग एवं सुरक्षा नियम (Parking Regulations):</strong></p>
          <div class="rules-list" style="padding: 12px 20px;">
            1. स्टिकर को वाहन की बाईं विंडस्क्रीन/मडगार्ड पर चिपकाना अनिवार्य है।<br/>
            2. निर्धारित पार्किंग स्थल (Reserved slot) पर ही पार्क करें।<br/>
            3. परिसर के भीतर वाहन की गति सीमा 10 किमी/घंटा से कम रखें।<br/>
            4. Gate पर सुरक्षा गार्ड को स्टिकर स्पष्ट दिखना चाहिए।
          </div>
          <table class="footer-table">
            <tr>
              <td><div class="sig-line"></div><div>वाहन स्वामी के हस्ताक्षर</div></td>
              <td><div class="sig-line"></div><div>सुरक्षा विंग अधिकृत हस्ताक्षर</div></td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handlePrintBachelorUndertakingForm = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक सक्रिय है! कृपया इस साईट के लिए अनुमति दें।");
      return;
    }

    const dateStr = new Date().toLocaleDateString('hi-IN');
    const authCode = `RWA-BACH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>घोषणा-पत्र - माँ कौशल्या अपार्टमेंट</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
          .container { max-width: 800px; margin: 0 auto; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
          .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
          .header-text-cell { text-align: center; padding-right: 60px; }
          .rwa-title-hi { font-size: 18px; font-weight: bold; margin: 0; }
          .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
          .rwa-address { font-size: 9px; color: #555; }
          .form-title { text-align: center; font-size: 13px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; font-weight: bold; }
          .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 15px; font-size: 11px; }
          .field { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; text-align: justify; }
          .footer-table { width: 100%; margin-top: 50px; }
          .footer-table td { width: 50%; text-align: center; }
          .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          .print-btn { background-color: #0284c7; color: white; border: none; padding: 8px 20px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: center;"><button class="print-btn" onclick="window.print()">प्रिंट करें / PDF सहेजें</button></div>
        <div class="container">
          <table class="header-table">
            <tr>
              <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
              <td class="header-text-cell">
                <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</p>
                <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
              </td>
            </tr>
          </table>
          <div class="form-title">बैचलर किरायेदार सहमति एवं सुरक्षा घोषणा-पत्र (UNDERTAKING)</div>
          <div class="meta"><span>घोषणा आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
          <div class="box">
            <div class="field"><span class="label">फ्लैट संख्या:</span><span>${bachelorFlat || '____________________'}</span></div>
            <div class="field"><span class="label">फ्लैट मालिक का नाम:</span><span>${bachelorOwner || '____________________'}</span></div>
            <div class="field"><span class="label">किरायेदार का पूरा नाम:</span><span>${bachelorName || '____________________'}</span></div>
            <div class="field"><span class="label">कॉलेज / संस्थान / कंपनी:</span><span>${bachelorOrg || '____________________'}</span></div>
            <div class="field"><span class="label">अभिभावक का नाम:</span><span>${bachelorGuardian || '____________________'}</span></div>
            <div class="field"><span class="label">अभिभावक का मोबाइल:</span><span>${bachelorGuardianPhone || '____________________'}</span></div>
          </div>
          <p><strong>सुरक्षा एवं नैतिक दिशानिर्देश अनुपालन (RWA Guidelines compliance):</strong></p>
          <div class="rules-list" style="padding: 12px 20px;">
            1. आवंटित फ्लैट में शांत समय (Silent Hours) रात 10:00 बजे से सुबह 06:00 बजे तक रहेगा, इस दौरान शोरगुल पूरी तरह से प्रतिबंधित है।<br/>
            2. फ्लैट के भीतर अनधिकृत बाहरी मेहमान या रात में ठहरने वाले आगंतुक की जानकारी सुरक्षा गेट तथा सुरक्षा गार्ड रजिस्टर में दर्ज कराना अनिवार्य होगा।<br/>
            3. किसी भी प्रकार की असामाजिक, अवैध या अनैतिक गतिविधियों के पाए जाने पर RWA को बिना किसी पूर्व सूचना के 24 घंटे के भीतर फ्लैट खाली कराने का पूर्ण अधिकार होगा।<br/>
            4. मकान मालिक (Owner) किरायेदार के किसी भी प्रकार के दुर्व्यवहार या अनुशासनहीनता की स्थिति में समिति के समक्ष अंतिम रूप से उत्तरदायी रहेंगे।
          </div>
          <table class="footer-table">
            <tr>
              <td><div class="sig-line"></div><div>हस्ताक्षर किरायेदार</div></td>
              <td><div class="sig-line"></div><div>हस्ताक्षर मकान मालिक</div></td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const printSubmission = (sub) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक सक्रिय है! कृपया इस साईट के लिए अनुमति दें।");
      return;
    }

    const dateStr = new Date(sub.created_at).toLocaleDateString('hi-IN');
    const authCode = `RWA-SUB-0${sub.id}`;
    const d = sub.submission_data || {};

    let htmlContent = "";

    if (sub.form_type === 'tenant_verification') {
      let familyRowsHtml = '';
      const safeFamilyList = d.tenantFamilyMembersList || [];
      if (safeFamilyList.length > 0) {
        safeFamilyList.forEach((member, index) => {
          familyRowsHtml += `
            <tr>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
              <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10.5px;">${member.name || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; font-size: 10px;">${member.relation || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${member.phone || ''}</td>
            </tr>
          `;
        });
      } else {
        familyRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई पारिवारिक सदस्य पंजीकृत नहीं है</td></tr>`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>किरायेदार पुलिस सत्यापन अनुरोध - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; margin: 0; padding: 0; font-size: 11px; line-height: 1.4; }
            .container { width: 100%; max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: 900; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 8.5px; color: #555; margin: 2px 0 0 0; }
            .form-title-container { text-align: center; margin: 5px 0 10px 0; }
            .form-title-hi { font-size: 12px; font-weight: bold; background-color: #eee; padding: 3px 10px; border: 1px solid #222; display: inline-block; }
            .photo-box { width: 100px; height: 120px; border: 1.5px dashed #333; text-align: center; vertical-align: middle; font-size: 8.5px; color: #555; }
            .section-heading { font-size: 10px; font-weight: bold; background-color: #f2f2f2; padding: 3px 8px; border: 1px solid #111; margin-top: 8px; margin-bottom: 4px; }
            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
            .data-table th, .data-table td { border: 1px solid #111; padding: 4px 6px; text-align: left; }
            .data-table th { background-color: #fafafa; font-weight: bold; width: 25%; font-size: 9px; }
            .data-table td { width: 25%; }
            .signatures-table { width: 100%; margin-top: 25px; border-collapse: collapse; }
            .signatures-table td { width: 50%; text-align: center; vertical-align: bottom; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
            .sig-label { font-weight: bold; font-size: 9.5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 28px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</h2>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title-container">
              <div class="form-title-hi">किरायेदार पुलिस सत्यापन अनुरोध फॉर्म (सहेजा गया आवेदन)</div>
            </div>
            <table style="width: 100%; margin-bottom: 5px;">
              <tr>
                <td>
                  <table style="font-size: 9px; line-height: 1.5;">
                    <tr><td style="font-weight: bold; width: 120px;">सबमिशन संदर्भ:</td><td>${authCode}</td></tr>
                    <tr><td style="font-weight: bold;">दिनांक (Date):</td><td>${dateStr}</td></tr>
                    <tr><td style="font-weight: bold;">थाना (Police PS):</td><td>${d.currPoliceStation || 'N/A'}</td></tr>
                  </table>
                </td>
                <td style="width: 100px; text-align: right;">
                  <div class="photo-box"><div style="padding-top: 40px; font-weight: bold;">किरायेदार फोटो</div></div>
                </td>
              </tr>
            </table>

            <div class="section-heading">मकान मालिक की सूचना (Landlord Information)</div>
            <table class="data-table">
              <tr><th>नाम</th><td>${d.llFirstName || ''} ${d.llMiddleName || ''} ${d.llLastName || ''}</td><th>पिता/पति का नाम</th><td>${d.llFatherName || 'N/A'}</td></tr>
              <tr><th>ईमेल</th><td>${d.llEmail || 'N/A'}</td><th>मोबाइल नम्बर</th><td>${d.llPhone || 'N/A'}</td></tr>
              <tr><th>मकान संख्या</th><td>${d.llHouseNo || 'N/A'}</td><th>गली/क्षेत्र</th><td>${d.llStreet || 'N/A'}, ${d.llColony || 'N/A'}</td></tr>
              <tr><th>शहर/जिला</th><td>${d.llCity || 'N/A'}, ${d.llDistrict || 'N/A'}</td><th>राज्य/देश/पिन</th><td>${d.llState || 'N/A'}, ${d.llCountry || 'N/A'} - ${d.llPinCode || ''}</td></tr>
            </table>

            <div class="section-heading">किरायेदार की सूचना (Tenant Information)</div>
            <table class="data-table">
              <tr><th>नाम</th><td>${d.tFirstName || ''} ${d.tMiddleName || ''} ${d.tLastName || ''}</td><th>पिता/पति का नाम</th><td>${d.tFatherName || 'N/A'}</td></tr>
              <tr><th>मोबाइल</th><td>${d.tPhone || 'N/A'}</td><th>रिश्तेदार/लिंग</th><td>${d.tRelativeName || 'N/A'} (${d.tGender || 'Male'})</td></tr>
              <tr><th>व्यवसाय</th><td>${d.tOccupation || 'N/A'}</td><th>जन्म तिथी (DOB)</th><td>${d.tDOB || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">वर्तमान पता (Current Address)</div>
            <table class="data-table">
              <tr><th>मकान संख्या</th><td>${d.currHouseNo || 'N/A'}</td><th>गली/शहर</th><td>${d.currStreet || 'N/A'}, ${d.currCity || 'N/A'}</td></tr>
              <tr><th>पुलिस स्टेशन/पिन</th><td>${d.currPoliceStation || 'N/A'} - ${d.currPinCode || ''}</td><th>राज्य/देश</th><td>${d.currState || 'N/A'}, ${d.currCountry || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">स्थायी पता (Permanent Address)</div>
            <table class="data-table">
              <tr><th>मकान संख्या</th><td>${d.permHouseNo || 'N/A'}</td><th>गली/शहर</th><td>${d.permStreet || 'N/A'}, ${d.permCity || 'N/A'}</td></tr>
              <tr><th>पुलिस स्टेशन/पिन</th><td>${d.permPoliceStation || 'N/A'} - ${d.permPinCode || ''}</td><th>राज्य/देश</th><td>${d.permState || 'N/A'}, ${d.permCountry || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">पारिवारिक सदस्य</div>
            <table class="data-table">${familyRowsHtml}</table>

            <div class="section-heading">घोषणा/Undertaking</div>
            <div style="border: 1px solid #111; padding: 6px; background-color: #fafafa;">
              criminal record: ${d.tHasCriminalRecord || 'नहीं'}<br/>
              declarative verify: ${d.tInfoCorrect || 'हाँ'}
            </div>

            <table class="signatures-table">
              <tr>
                <td><div class="sig-line"></div><div class="sig-label">हस्ताक्षर मकान मालिक</div></td>
                <td><div class="sig-line"></div><div class="sig-label">हस्ताक्षर किरायेदार</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 350); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'noc') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>NOC आवेदन - माँ कौशल्या अपार्टमेंट</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            .letterhead { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; }
            .content { margin: 20px 0; }
            .footer { margin-top: 50px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <h2>माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h2>
            <p>सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
          </div>
          <div class="meta">
            <span>संदर्भ: RWA-NOC-SUB-0${sub.id}</span>
            <span>दिनांक: ${dateStr}</span>
          </div>
          <h3>विषय: अनापत्ति प्रमाण पत्र (NOC) हेतु आवेदन</h3>
          <div class="content">
            <p><strong>आवेदक का नाम:</strong> ${d.nocName || 'N/A'}</p>
            <p><strong>फ्लैट संख्या:</strong> ${d.nocFlat || 'N/A'}</p>
            <p><strong>उद्देश्य:</strong> ${d.nocPurpose || 'N/A'}</p>
            <br/>
            <p><strong>अनुरोध पत्र विवरण:</strong></p>
            <p style="border: 1px solid #ddd; padding: 15px; background: #f9f9f9; border-radius: 8px;">"${d.nocDetails || 'N/A'}"</p>
          </div>
          <div class="footer">
            <p>आवेदक के हस्ताक्षर: ___________________</p>
            <br/><br/>
            <p>RWA अध्यक्ष / सचिव</p>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'parking_sticker') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>वाहन पार्किंग स्टिकर - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 20px; font-weight: bold; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 9px; color: #555; }
            .form-title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; font-weight: bold; }
            .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 20px; font-size: 11px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; display: inline-block; width: 180px; }
            .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; }
            .footer-table { width: 100%; margin-top: 50px; }
            .footer-table td { width: 50%; text-align: center; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</p>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title">वाहन गेट-पास एवं पार्किंग स्टिकर प्रपत्र (सहेजा गया आवेदन)</div>
            <div class="meta"><span>संदर्भ आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
            <div class="box">
              <div class="field"><span class="label">वाहन स्वामी का नाम:</span><span>${d.parkingName || 'N/A'}</span></div>
              <div class="field"><span class="label">संबंधित फ्लैट नंबर:</span><span>${d.parkingFlat || 'N/A'}</span></div>
              <div class="field"><span class="label">वाहन का प्रकार:</span><span>${d.parkingVehicleType === 'Car' ? 'चार पहिया वाहन (Car)' : 'दो पहिया वाहन (Bike/Scooty)'}</span></div>
              <div class="field"><span class="label">वाहन का नंबर प्लेट:</span><span>${d.parkingVehicleNo || 'N/A'}</span></div>
              <div class="field"><span class="label">ब्रांड एवं मॉडल:</span><span>${d.parkingVehicleModel || 'N/A'}</span></div>
            </div>
            <p><strong>पार्किंग एवं सुरक्षा नियम (Parking Regulations):</strong></p>
            <div class="rules-list" style="padding: 12px 20px;">
              1. स्टिकर को वाहन की बाईं विंडस्क्रीन/मडगार्ड पर चिपकाना अनिवार्य है।<br/>
              2. निर्धारित पार्किंग स्थल (Reserved slot) पर ही पार्क करें।<br/>
              3. परिसर के भीतर वाहन की गति सीमा 10 किमी/घंटा से कम रखें।<br/>
              4. Gate पर सुरक्षा गार्ड को स्टिकर स्पष्ट दिखना चाहिए।
            </div>
            <table class="footer-table">
              <tr>
                <td><div class="sig-line"></div><div>वाहन स्वामी के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>सुरक्षा विंग अधिकृत हस्ताक्षर</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'bachelor_undertaking') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>घोषणा-पत्र - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: bold; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 9px; color: #555; }
            .form-title { text-align: center; font-size: 13px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; font-weight: bold; }
            .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 15px; font-size: 11px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; display: inline-block; width: 180px; }
            .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; text-align: justify; }
            .footer-table { width: 100%; margin-top: 50px; }
            .footer-table td { width: 50%; text-align: center; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</p>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title">बैचलर किरायेदार सहमति एवं सुरक्षा घोषणा-पत्र (UNDERTAKING)</div>
            <div class="meta"><span>घोषणा आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
            <div class="box">
              <div class="field"><span class="label">फ्लैट संख्या:</span><span>${d.bachelorFlat || 'N/A'}</span></div>
              <div class="field"><span class="label">फ्लैट मालिक का नाम:</span><span>${d.bachelorOwner || 'N/A'}</span></div>
              <div class="field"><span class="label">किरायेदार का पूरा नाम:</span><span>${d.bachelorName || 'N/A'}</span></div>
              <div class="field"><span class="label">कॉलेज / संस्थान / कंपनी:</span><span>${d.bachelorOrg || 'N/A'}</span></div>
              <div class="field"><span class="label">माता-पिता / अभिभावक का नाम:</span><span>${d.bachelorGuardian || 'N/A'}</span></div>
              <div class="field"><span class="label">अभिभावक का मोबाइल नंबर:</span><span>${d.bachelorGuardianPhone || 'N/A'}</span></div>
            </div>
            <p><strong>आरडब्ल्यूए सुरक्षा एवं नैतिक दिशानिर्देश अनुपालन (Undertaking Terms):</strong></p>
            <div class="rules-list">
              1. शांत समय (Silent Hours) रात 10:00 बजे से सुबह 06:00 बजे तक रहेगा, इस दौरान किसी भी प्रकार का शोरगुल या हुड़दंग प्रतिबंधित रहेगा।<br/>
              2. फ्लैट के अंदर किसी भी अनधिकृत बाहरी मेहमान या रात में ठहरने वाले आगंतुक की जानकारी सुरक्षा गेट तथा गार्ड रजिस्टर में दर्ज कराना अनिवार्य है।<br/>
              3. किसी भी प्रकार की असामाजिक, अवैध या अनैतिक गतिविधियों के पाए जाने पर RWA को बिना किसी पूर्व सूचना के 24 घंटे के भीतर फ्लैट खाली कराने का पूर्ण अधिकार होगा।<br/>
              4. मकान मालिक (Owner) किरायेदार के किसी भी प्रकार के दुर्व्यवहार या अनुशासनहीनता की स्थिति में समिति के समक्ष उत्तरदायी रहेंगे।
            </div>
            <table class="footer-table">
              <tr>
                <td><div class="sig-line"></div><div>किरायेदार के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>मकान मालिक के हस्ताक्षर</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'universal_resident') {
      let familyRowsHtml = '';
      const safeFamilyList = d.univFamilyMembersList || [];
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
        familyRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई पारिवारिक सदस्य पंजीकृत नहीं है</td></tr>`;
      }

      let vehicleRowsHtml = '';
      const safeVehiclesList = d.univVehiclesList || [];
      if (safeVehiclesList.length > 0) {
        safeVehiclesList.forEach((vehicle, index) => {
          vehicleRowsHtml += `
            <tr>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
              <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10px;">${vehicle.type || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; font-family: monospace; font-size: 10.5px;">${(vehicle.number || '').toUpperCase()}</td>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${vehicle.sticker ? 'हाँ (Yes)' : 'नहीं (No)'}</td>
            </tr>
          `;
        });
      } else {
        vehicleRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई वाहन पंजीकृत नहीं है</td></tr>`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Universal Resident Form - Maa Kaushalya Apartment</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; background-color: #fff; margin: 0; padding: 0; font-size: 10px; line-height: 1.3; }
            .container { width: 100%; max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: 900; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 8.5px; color: #555; }
            .form-title-container { text-align: center; margin: 5px 0 10px 0; }
            .form-title-hi { font-size: 12px; font-weight: bold; background-color: #eee; padding: 3px 10px; border: 1px solid #222; display: inline-block; }
            .photo-box { width: 100px; height: 120px; border: 1.5px dashed #333; text-align: center; vertical-align: middle; font-size: 8.5px; color: #555; }
            .section-heading { font-size: 9.5px; font-weight: bold; background-color: #f2f2f2; padding: 3px 8px; border: 1px solid #111; margin-top: 8px; margin-bottom: 4px; }
            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
            .data-table th, .data-table td { border: 1px solid #111; padding: 4px 6px; text-align: left; }
            .data-table th { background-color: #fafafa; font-weight: bold; width: 25%; font-size: 9px; }
            .data-table td { width: 25%; }
            .signatures-table { width: 100%; margin-top: 25px; border-collapse: collapse; }
            .signatures-table td { width: 50%; text-align: center; vertical-align: bottom; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 28px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</h2>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title-container">
              <div class="form-title-hi">सार्वभौमिक निवासी पंजीकरण प्रपत्र (Universal Form)</div>
            </div>
            <table style="width: 100%; margin-bottom: 5px;">
              <tr>
                <td>
                  <table style="font-size: 9px; line-height: 1.5;">
                    <tr><td style="font-weight: bold; width: 120px;">सबमिशन संदर्भ:</td><td>${authCode}</td></tr>
                    <tr><td style="font-weight: bold;">दिनांक (Date):</td><td>${dateStr}</td></tr>
                  </table>
                </td>
                <td style="width: 100px; text-align: right;">
                  <div class="photo-box">
                    ${d.univProfilePic ? `<img style="width:100%;height:100%;object-fit:cover;" src="${d.univProfilePic}" alt="Resident Photo" />` : `<div style="padding-top: 40px; font-weight: bold;">फोटो चस्पा करें</div>`}
                  </div>
                </td>
              </tr>
            </table>

            <div class="section-heading">1. निवासी व्यक्तिगत विवरण (Resident Details)</div>
            <table class="data-table">
              <tr><th>नाम (Name)</th><td>${d.univName || 'N/A'}</td><th>ईमेल (Email)</th><td>${d.univEmail || 'N/A'}</td></tr>
              <tr><th>मोबाइल (Phone)</th><td>${d.univPhone || 'N/A'}</td><th>आधार (Aadhaar No.)</th><td>${d.univAadhaar || 'N/A'}</td></tr>
              <tr><th>फ्लैट नं. (Flat No.)</th><td>${d.univFlatNo || 'N/A'}</td><th>प्रवेश तिथि (Move-in)</th><td>${d.univMoveInDate || 'N/A'}</td></tr>
              <tr><th>पालतू जानवर (Pet Info)</th><td colspan="3">${d.univHasPet ? 'हाँ (Yes) - ' + (d.univPetDetails || '') : 'नहीं (No)'}</td></tr>
            </table>

            <div class="section-heading">2. फ्लैट कब्ज़ा विवरण (Occupancy & Lease Details)</div>
            <table class="data-table">
              <tr><th>कब्ज़ा स्थिति (Status)</th><td>${d.univOccupancyStatus === 'Self-Occupied' ? 'स्व-कब्जा (Owner)' : 'किराये पर (Renter)'}</td><th>किरायेदार श्रेणी</th><td>${d.univOccupancyStatus === 'Rented' ? (d.univTenantCategory || 'Family') : 'N/A'}</td></tr>
              ${d.univOccupancyStatus === 'Rented' ? `
                ${d.univTenantCategory === 'Bachelor' ? `
                <tr style="background-color: #fff1f2;">
                  <td colspan="4" style="color: #be123c; font-weight: bold; font-size: 9px; padding: 6px; border: 1px solid #be123c;">
                    ⚠️ आरडब्ल्यूए चेतावनी (RWA Security Warning): अविवाहित किरायेदार (Bachelor Tenant) श्रेणी के पंजीकरण के लिए RWA नियमों के अनुसार संयुक्त सुरक्षा घोषणा-पत्र (Bachelor Undertaking - Form 7) का विधिवत हस्ताक्षर कर संलग्न होना अनिवार्य है।
                  </td>
                </tr>
                ` : ''}
                <tr><th>मकान मालिक नाम</th><td>${d.univOwnerName || 'N/A'}</td><th>मालिक का फोन</th><td>${d.univOwnerPhone || 'N/A'}</td></tr>
                <tr><th>अनुबंध अवधि</th><td>${d.univLeaseDuration || 'N/A'}</td><th>एग्रीमेंट जमा?</th><td>${d.univTenantAgreement ? 'हाँ' : 'नहीं'}</td></tr>
                <tr><th>पुलिस सत्यापन?</th><td>${d.univPoliceVerification ? 'हाँ' : 'नहीं'}</td><th>-</th><td>-</td></tr>
              ` : `
                <tr><td colspan="4" style="text-align: center; color: #555; font-style: italic;">फ्लैट स्वामी स्वयं रह रहे हैं (Self-Occupied)</td></tr>
              `}
            </table>

            <div class="section-heading">3. आपातकालीन संपर्क (Emergency Contact)</div>
            <table class="data-table">
              <tr><th>संपर्क व्यक्ति नाम</th><td>${d.univEmergencyName || 'N/A'}</td><th>मोबाइल नम्बर</th><td>${d.univEmergencyPhone || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">4. परिवार के सदस्यों का विवरण (Family Members)</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">क्र.</th>
                  <th style="width: 45%;">नाम (Name)</th>
                  <th style="width: 25%;">फ़ोन (Phone)</th>
                  <th style="width: 20%; text-align: center;">जेंडर (Gender)</th>
                </tr>
              </thead>
              <tbody>
                ${familyRowsHtml}
              </tbody>
            </table>

            <div class="section-heading">5. पंजीकृत वाहनों का विवरण (Registered Vehicles)</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">क्र.</th>
                  <th style="width: 30%;">वाहन प्रकार (Type)</th>
                  <th style="width: 40%;">वाहन नंबर (Vehicle Number)</th>
                  <th style="width: 20%; text-align: center;">स्टीकर जारी?</th>
                </tr>
              </thead>
              <tbody>
                ${vehicleRowsHtml}
              </tbody>
            </table>

            <table class="signatures-table">
              <tr>
                <td><div class="sig-line"></div><div>निवासी के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>RWA प्रशासनिक डेस्क</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    }

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
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center w-full">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">दस्तावेज़ लोड हो रहे हैं...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
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
          <div className={`bg-slate-900 border border-white/10 rounded-3xl ${(activeFormDoc.isUniversalForm || activeFormDoc.id === 2) ? 'max-w-4xl max-h-[92vh] overflow-y-auto' : 'max-w-md'} w-full p-6 text-left shadow-2xl relative`}>
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
                <div className="flex flex-col gap-4 text-xs text-slate-300">
                  {/* Tab Navigation */}
                  <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3 mb-2">
                    {[
                      { id: 'landlord', label: '🏠 मकान मालिक (Landlord)' },
                      { id: 'tenant', label: '👤 किरायेदार (Tenant)' },
                      { id: 'addresses', label: '📍 पते (Addresses)' },
                      { id: 'family', label: '👥 परिवार (Family)' },
                      { id: 'undertaking', label: '⚖️ शपथ (Declaration)' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTenantFormTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all border ${
                          tenantFormTab === tab.id
                            ? 'bg-gradient-to-r from-sky-600 to-indigo-600 border-transparent text-white shadow-premium'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Landlord */}
                  {tenantFormTab === 'landlord' && (
                    <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5 animate-fadeIn">
                      <h3 className="font-extrabold text-[10px] uppercase text-brand-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                        🏠 मकान मालिक की सूचना (Landlord Information)
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">प्रथम नाम *</label>
                          <input type="text" required placeholder="जैसे: नौशाद" value={llFirstName} onChange={(e) => setLlFirstName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मध्य नाम</label>
                          <input type="text" placeholder="मध्य नाम" value={llMiddleName} onChange={(e) => setLlMiddleName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">अंतिम नाम</label>
                          <input type="text" placeholder="जैसे: अहमद" value={llLastName} onChange={(e) => setLlLastName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">पिता / पति का नाम</label>
                          <input type="text" placeholder="पिता या पति का नाम" value={llFatherName} onChange={(e) => setLlFatherName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">व्यवसाय (Occupation)</label>
                          <input type="text" placeholder="व्यवसाय या नौकरी" value={llOccupation} onChange={(e) => setLlOccupation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">ईमेल (Email ID)</label>
                          <input type="email" placeholder="email@domain.com" value={llEmail} onChange={(e) => setLlEmail(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मोबाइल नम्बर *</label>
                          <input type="tel" required placeholder="मोबाइल नंबर" value={llPhone} onChange={(e) => setLlPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">लैण्ड लाइन नंबर</label>
                          <input type="text" placeholder="लैंडलाइन नंबर" value={llLandline} onChange={(e) => setLlLandline(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>

                      <h4 className="font-bold text-[9px] uppercase text-brand-300 tracking-wider mt-2 flex items-center gap-1">📍 मकान मालिक का पता (Landlord Address)</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मकान संख्या *</label>
                          <input type="text" required placeholder="जैसे: Flat A-101" value={llHouseNo} onChange={(e) => setLlHouseNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">गली का नाम</label>
                          <input type="text" placeholder="गली का नाम" value={llStreet} onChange={(e) => setLlStreet(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">कालोनी / लोकैलिटी</label>
                          <input type="text" placeholder="कालोनी या क्षेत्र" value={llColony} onChange={(e) => setLlColony(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">ग्राम / नगर / शहर *</label>
                          <input type="text" required placeholder="जैसे: रायपुर" value={llCity} onChange={(e) => setLlCity(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">तहसील / ब्लॉक</label>
                          <input type="text" placeholder="तहसील" value={llTehsil} onChange={(e) => setLlTehsil(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">जिला *</label>
                          <input type="text" required placeholder="रायपुर" value={llDistrict} onChange={(e) => setLlDistrict(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">राज्य *</label>
                          <input type="text" required placeholder="छत्तीसगढ़" value={llState} onChange={(e) => setLlState(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">देश *</label>
                          <input type="text" required placeholder="भारत" value={llCountry} onChange={(e) => setLlCountry(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">पिन कोड *</label>
                          <input type="text" required placeholder="492015" value={llPinCode} onChange={(e) => setLlPinCode(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">संबंधित पुलिस स्टेशन (Police Station)</label>
                        <input type="text" placeholder="उदा. पचपेड़ी नाका पुलिस थाना" value={llPoliceStation} onChange={(e) => setLlPoliceStation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Tenant */}
                  {tenantFormTab === 'tenant' && (
                    <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5 animate-fadeIn">
                      <h3 className="font-extrabold text-[10px] uppercase text-sky-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                        👤 किरायेदार की सूचना (Tenant Information)
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">प्रथम नाम *</label>
                          <input type="text" required placeholder="प्रथम नाम" value={tFirstName} onChange={(e) => setTFirstName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मध्य नाम</label>
                          <input type="text" placeholder="मध्य नाम" value={tMiddleName} onChange={(e) => setTMiddleName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">अंतिम नाम</label>
                          <input type="text" placeholder="अंतिम नाम" value={tLastName} onChange={(e) => setTLastName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">पिता / पति का नाम *</label>
                          <input type="text" required placeholder="पिता या पति का नाम" value={tFatherName} onChange={(e) => setTFatherName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">रिश्तेदार का नाम</label>
                          <input type="text" placeholder="रिश्तेदार का नाम" value={tRelativeName} onChange={(e) => setTRelativeName(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">लिंग (Gender) *</label>
                          <select value={tGender} onChange={(e) => setTGender(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:border-brand-500 outline-none transition-colors">
                            <option value="Male">Male (पुरुष)</option>
                            <option value="Female">Female (महिला)</option>
                            <option value="Other">Other (अन्य)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">संबंध के प्रकार</label>
                          <select value={tRelationType} onChange={(e) => setTRelationType(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:border-brand-500 outline-none transition-colors">
                            <option value="पिता (Father)">पिता (Father)</option>
                            <option value="माता (Mother)">माता (Mother)</option>
                            <option value="पति (Husband)">पति (Husband)</option>
                            <option value="पत्नी (Wife)">पत्नी (Wife)</option>
                            <option value="अन्य (Other)">अन्य (Other)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">जन्म तिथी (DOB) *</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              required 
                              value={tDOB} 
                              onChange={(e) => setTDOB(e.target.value)} 
                              onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                              className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors w-full cursor-pointer [color-scheme:dark]" 
                            />
                            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">व्यवसाय (Occupation)</label>
                          <input type="text" placeholder="नौकरी या व्यवसाय" value={tOccupation} onChange={(e) => setTOccupation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">किरायेदारी का उद्देश्य</label>
                          <select value={tPurpose} onChange={(e) => setTPurpose(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:border-brand-500 outline-none transition-colors">
                            <option value="निवास (Residence)">निवास (Residence)</option>
                            <option value="व्यवसाय (Commercial)">व्यवसाय (Commercial)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">मोबाइल नंबर *</label>
                          <input type="tel" required placeholder="मोबाइल नंबर" value={tPhone} onChange={(e) => setTPhone(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">लैण्ड लाईन नम्बर</label>
                        <input type="text" placeholder="लैंडलाइन" value={tLandline} onChange={(e) => setTLandline(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Addresses */}
                  {tenantFormTab === 'addresses' && (
                    <div className="flex flex-col gap-4 text-left animate-fadeIn">
                      {/* Current Address */}
                      <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5">
                        <h3 className="font-extrabold text-[10px] uppercase text-emerald-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                          📍 वर्तमान पता (Current Address)
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">मकान संख्या *</label>
                            <input type="text" required placeholder="जैसे: Flat B-304" value={currHouseNo} onChange={(e) => setCurrHouseNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">गली का नाम</label>
                            <input type="text" placeholder="गली" value={currStreet} onChange={(e) => setCurrStreet(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">कालोनी / क्षेत्र</label>
                            <input type="text" placeholder="कालोनी" value={currColony} onChange={(e) => setCurrColony(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">नगर / शहर *</label>
                            <input type="text" required placeholder="जैसे: रायपुर" value={currCity} onChange={(e) => setCurrCity(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">तहसील / ब्लॉक</label>
                            <input type="text" placeholder="तहसील" value={currTehsil} onChange={(e) => setCurrTehsil(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">जिला *</label>
                            <input type="text" required placeholder="रायपुर" value={currDistrict} onChange={(e) => setCurrDistrict(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">राज्य *</label>
                            <input type="text" required placeholder="छत्तीसगढ़" value={currState} onChange={(e) => setCurrState(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">देश *</label>
                            <input type="text" required placeholder="भारत" value={currCountry} onChange={(e) => setCurrCountry(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">पिन कोड *</label>
                            <input type="text" required placeholder="492015" value={currPinCode} onChange={(e) => setCurrPinCode(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">पुलिस स्टेशन (PS)</label>
                            <input type="text" placeholder="उदा. पचपेड़ी नाका पुलिस थाना" value={currPoliceStation} onChange={(e) => setCurrPoliceStation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Previous Address */}
                      <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5">
                        <h3 className="font-extrabold text-[10px] uppercase text-amber-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                          ⏪ पिछला पता (Previous Address)
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">मकान संख्या</label>
                            <input type="text" placeholder="मकान संख्या" value={prevHouseNo} onChange={(e) => setPrevHouseNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">गली का नाम</label>
                            <input type="text" placeholder="गली" value={prevStreet} onChange={(e) => setPrevStreet(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">कालोनी / क्षेत्र</label>
                            <input type="text" placeholder="कालोनी" value={prevColony} onChange={(e) => setPrevColony(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">नगर / शहर</label>
                            <input type="text" placeholder="नगर/शहर" value={prevCity} onChange={(e) => setPrevCity(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">तहसील / ब्लॉक</label>
                            <input type="text" placeholder="तहसील" value={prevTehsil} onChange={(e) => setPrevTehsil(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">जिला</label>
                            <input type="text" placeholder="जिला" value={prevDistrict} onChange={(e) => setPrevDistrict(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">राज्य</label>
                            <input type="text" placeholder="राज्य" value={prevState} onChange={(e) => setPrevState(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">देश</label>
                            <input type="text" placeholder="देश" value={prevCountry} onChange={(e) => setPrevCountry(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">पिन कोड</label>
                            <input type="text" placeholder="पिन कोड" value={prevPinCode} onChange={(e) => setPrevPinCode(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">पुलिस स्टेशन</label>
                            <input type="text" placeholder="थाना" value={prevPoliceStation} onChange={(e) => setPrevPoliceStation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">रहने की दिनांक (Stay From)</label>
                            <div className="relative">
                              <input 
                                type="date" 
                                value={prevStayFrom} 
                                onChange={(e) => setPrevStayFrom(e.target.value)} 
                                onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                                className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors w-full cursor-pointer [color-scheme:dark]" 
                              />
                              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">छोड़ने की दिनांक (Stay To)</label>
                            <div className="relative">
                              <input 
                                type="date" 
                                value={prevStayTo} 
                                onChange={(e) => setPrevStayTo(e.target.value)} 
                                onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                                className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors w-full cursor-pointer [color-scheme:dark]" 
                              />
                              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Permanent Address */}
                      <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5">
                        <h3 className="font-extrabold text-[10px] uppercase text-violet-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                          🏡 स्थायी पता (Permanent Address)
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">मकान संख्या</label>
                            <input type="text" placeholder="मकान संख्या" value={permHouseNo} onChange={(e) => setPermHouseNo(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">गली का नाम</label>
                            <input type="text" placeholder="गली" value={permStreet} onChange={(e) => setPermStreet(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">कालोनी / क्षेत्र</label>
                            <input type="text" placeholder="कालोनी" value={permColony} onChange={(e) => setPermColony(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">नगर / शहर</label>
                            <input type="text" placeholder="नगर/शहर" value={permCity} onChange={(e) => setPermCity(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">तहसील / ब्लॉक</label>
                            <input type="text" placeholder="तहसील" value={permTehsil} onChange={(e) => setPermTehsil(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">जिला</label>
                            <input type="text" placeholder="जिला" value={permDistrict} onChange={(e) => setPermDistrict(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">राज्य</label>
                            <input type="text" placeholder="राज्य" value={permState} onChange={(e) => setPermState(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">देश</label>
                            <input type="text" placeholder="देश" value={permCountry} onChange={(e) => setPermCountry(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-400 uppercase text-[9px]">पिन कोड</label>
                            <input type="text" placeholder="पिन कोड" value={permPinCode} onChange={(e) => setPermPinCode(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-400 uppercase text-[9px]">पुलिस स्टेशन (PS)</label>
                          <input type="text" placeholder="थाना" value={permPoliceStation} onChange={(e) => setPermPoliceStation(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Family */}
                  {tenantFormTab === 'family' && (
                    <div className="flex flex-col gap-2.5 p-4 bg-slate-950/20 border border-white/5 rounded-2xl text-left animate-fadeIn">
                      <div className="flex items-center gap-3 justify-between border-b border-white/5 pb-2">
                        <h3 className="font-extrabold text-[10px] uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                          👨‍👩‍👧‍👦 किरायेदार के परिवार के सदस्यों की जानकारी (Family Members)
                        </h3>
                        <div className="flex items-center gap-2">
                          <label className="font-bold text-slate-400 text-[8px] uppercase">कुल सदस्य संख्या:</label>
                          <input type="number" min="0" max="10" placeholder="उदा: 3" value={tenantFamilyMembersCount} onChange={handleTenantFamilyMembersChange} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-center w-12 text-[9px]" />
                        </div>
                      </div>

                      {tenantFamilyMembersList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {tenantFamilyMembersList.map((member, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-1.5">
                              <p className="text-[8px] font-black uppercase text-brand-400 tracking-wider">परिवार सदस्य {idx + 1}</p>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col gap-0.5 col-span-1">
                                  <label className="text-[7.5px] text-slate-400 font-bold uppercase">सदस्य का नाम</label>
                                  <input type="text" required placeholder="नाम" value={member.name || ''} onChange={(e) => handleTenantFamilyMemberChange(idx, 'name', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[7.5px] text-slate-400 font-bold uppercase">किरायेदार से संबंध</label>
                                  <input type="text" required placeholder="जैसे: माता/पुत्र" value={member.relation || ''} onChange={(e) => handleTenantFamilyMemberChange(idx, 'relation', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[7.5px] text-slate-400 font-bold uppercase">मोबाईल नंबर</label>
                                  <input type="tel" required placeholder="मोबाइल नंबर" value={member.phone || ''} onChange={(e) => handleTenantFamilyMemberChange(idx, 'phone', e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-[9px] focus:border-brand-500 outline-none w-full" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[8.5px] text-slate-500 italic">कोई पारिवारिक सदस्य दर्ज नहीं किया गया है। भौतिक प्रिंटआउट निकालने के बाद पेन से भी भरा जा सकता है।</p>
                      )}
                    </div>
                  )}

                  {/* Tab 5: Oath/Undertaking */}
                  {tenantFormTab === 'undertaking' && (
                    <div className="flex flex-col gap-3.5 bg-slate-950/20 p-4 rounded-2xl border border-white/5 text-left animate-fadeIn">
                      <h3 className="font-extrabold text-[10px] uppercase text-rose-300 tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                        ⚖️ शपथ एवं घोषणा (Undertaking / Declaration)
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5 bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl">
                          <label className="font-bold text-slate-300 uppercase text-[9.5px]">क्या आपका कोई आपराधिक रिकॉर्ड है या आपके विरुद्ध कोई मामला चल रहा है? *</label>
                          <div className="flex items-center gap-4 mt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-200">
                              <input type="radio" name="criminal-record" checked={tHasCriminalRecord === 'हाँ'} onChange={() => setTHasCriminalRecord('हाँ')} className="accent-rose-500" />
                              <span>हाँ (Yes)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-200">
                              <input type="radio" name="criminal-record" checked={tHasCriminalRecord === 'नहीं'} onChange={() => { setTHasCriminalRecord('नहीं'); setTCriminalDetails(''); }} className="accent-rose-500" />
                              <span>नहीं (No)</span>
                            </label>
                          </div>

                          {tHasCriminalRecord === 'हाँ' && (
                            <div className="flex flex-col gap-1 mt-2">
                              <label className="font-bold text-slate-400 uppercase text-[8px]">आपराधिक मामले का विस्तृत विवरण लिखें (Details):</label>
                              <textarea rows="2" required placeholder="आपराधिक मामले या एफआईआर का विवरण प्रदान करें..." value={tCriminalDetails} onChange={(e) => setTCriminalDetails(e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-200 focus:border-rose-500 outline-none resize-none" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl mt-1">
                          <label className="font-bold text-slate-300 uppercase text-[9.5px]">क्या आपके द्वारा प्रदान की गई सभी जानकारियां सत्य हैं? *</label>
                          <div className="flex items-center gap-4 mt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-200">
                              <input type="radio" name="info-correct" checked={tInfoCorrect === 'हाँ'} onChange={() => setTInfoCorrect('हाँ')} className="accent-emerald-500" />
                              <span>हाँ (Yes)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-200">
                              <input type="radio" name="info-correct" checked={tInfoCorrect === 'नहीं'} onChange={() => setTInfoCorrect('नहीं')} className="accent-emerald-500" />
                              <span>नहीं (No)</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                          <div className="relative">
                            <input 
                              type="date" 
                              required 
                              value={univMoveInDate} 
                              onChange={(e) => setUnivMoveInDate(e.target.value)} 
                              onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                              className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:border-brand-500 outline-none transition-colors w-full cursor-pointer [color-scheme:dark]" 
                            />
                            <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                          </div>
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

                          <div className="grid grid-cols-2 gap-2.5 border-t border-indigo-500/10 pt-2.5">
                            <div className="flex flex-col gap-1 text-left">
                              <label className="font-bold text-slate-400 uppercase text-[9px]">किरायेदार एग्रीमेंट जमा? (Lease Agreement?)</label>
                              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 w-full justify-between">
                                <label className="flex items-center gap-1 cursor-pointer select-none">
                                  <input type="radio" name="agreement-status" checked={univTenantAgreement === true} onChange={() => setUnivTenantAgreement(true)} className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" />
                                  <span>हाँ (Yes)</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer select-none border-l border-white/10 pl-3">
                                  <input type="radio" name="agreement-status" checked={univTenantAgreement === false} onChange={() => setUnivTenantAgreement(false)} className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" />
                                  <span>नहीं (No)</span>
                                </label>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 text-left">
                              <label className="font-bold text-slate-400 uppercase text-[9px]">पुलिस सत्यापन पूर्ण? (Police Verification?)</label>
                              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 w-full justify-between">
                                <label className="flex items-center gap-1 cursor-pointer select-none">
                                  <input type="radio" name="police-status" checked={univPoliceVerification === true} onChange={() => setUnivPoliceVerification(true)} className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" />
                                  <span>हाँ (Yes)</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer select-none border-l border-white/10 pl-3">
                                  <input type="radio" name="police-status" checked={univPoliceVerification === false} onChange={() => setUnivPoliceVerification(false)} className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" />
                                  <span>नहीं (No)</span>
                                </label>
                              </div>
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
                <span>{(activeFormDoc.isUniversalForm || activeFormDoc.id === 2) ? '* प्रिंटआउट सीधे ए4 (A4) फॉर्मेट में सहेजने के लिए तैयार रहेगा।' : '* प्रमाणित डिजिटल प्रपत्र आरडब्ल्यूए डेटाबेस में ऑटो-दर्ज हो जाएगा।'}</span>
              </div>

              <div className="flex gap-2 justify-end mt-2 flex-wrap">
                <button 
                  type="button" 
                  onClick={() => setActiveFormDoc(null)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold uppercase transition-all"
                >
                  रद्द करें
                </button>
                {activeFormDoc.id === 2 ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handlePrintTenantVerificationForm(true)} 
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase transition-all flex items-center gap-1"
                    >
                      🖨️ खाली प्रपत्र प्रिंट (Print Blank)
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      💾 सबमिट करें और प्रिंट निकालें (Submit & Print)
                    </button>
                  </>
                ) : activeFormDoc.id === 3 ? (
                  <>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      💾 सबमिट करें और प्रिंट निकालें (Submit & Print)
                    </button>
                  </>
                ) : activeFormDoc.id === 4 ? (
                  <>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      💾 सबमिट करें और प्रिंट निकालें (Submit & Print)
                    </button>
                  </>
                ) : activeFormDoc.id === 7 ? (
                  <>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      💾 सबमिट करें और प्रिंट निकालें (Submit & Print)
                    </button>
                  </>
                ) : activeFormDoc.isUniversalForm ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handlePrintUniversalForm(true)} 
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase transition-all flex items-center gap-1"
                    >
                      🖨️ खाली प्रपत्र प्रिंट (Print Blank)
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold uppercase transition-all shadow-premium flex items-center gap-1"
                    >
                      💾 सबमिट करें और प्रिंट निकालें (Submit & Print)
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
              {/* File Uploader Input */}
              <div className="flex flex-col gap-1 border border-dashed border-white/10 p-3.5 rounded-2xl bg-slate-950/40 hover:border-brand-500/30 transition-all relative">
                <label className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1.5 cursor-pointer">
                  📁 दस्तावेज़ फ़ाइल चुनें (Choose File) *
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.docx,.xlsx"
                  onChange={handleFileChange}
                  className="mt-1 bg-transparent text-slate-300 text-xs w-full focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:uppercase file:bg-brand-600/20 file:text-brand-400 hover:file:bg-brand-600/35 cursor-pointer file:cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-[9px] text-emerald-400 mt-1 font-bold">
                    ✓ चयनित फ़ाइल: {selectedFile.name} ({newDocSize})
                  </p>
                )}
              </div>

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

      {/* ─── RESIDENT SUBMISSIONS TRACKER ─── */}
      {user?.role !== 'Admin' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/20 flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <FileSignature size={18} className="text-amber-400" />
            <div>
              <h2 className="text-sm font-black text-white">मेरे प्रपत्र आवेदन (My Form Submissions)</h2>
              <p className="text-[10px] text-slate-400">आपके द्वारा जमा किए गए ऑनलाइन प्रपत्रों की वास्तविक समय स्थिति</p>
            </div>
          </div>

          {loadingSubmissions ? (
            <div className="text-center py-6">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[10px] text-slate-400">आवेदन लोड हो रहे हैं...</p>
            </div>
          ) : submissionsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">आवेदन प्रकार (Form Type)</th>
                    <th className="py-2.5 px-3">फ्लैट नंबर</th>
                    <th className="py-2.5 px-3">दिनांक (Date)</th>
                    <th className="py-2.5 px-3 text-center">स्थिति (Status)</th>
                    <th className="py-2.5 px-3 text-right">कार्रवाई (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissionsList.map((sub) => {
                    let typeLabel = "Universal Form";
                    if (sub.form_type === 'tenant_verification') typeLabel = "किरायेदार सत्यापन (Tenant Verification)";
                    else if (sub.form_type === 'noc') typeLabel = "NOC अनापत्ति प्रमाण पत्र";
                    else if (sub.form_type === 'parking_sticker') typeLabel = "पार्किंग स्टिकर (Parking Sticker)";
                    else if (sub.form_type === 'bachelor_undertaking') typeLabel = "बैचलर घोषणा (Undertaking)";

                    let statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    let statusLabel = "प्रतीक्षारत (Pending)";
                    if (sub.status === 'approved') {
                      statusClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      statusLabel = "स्वीकृत (Approved)";
                    } else if (sub.status === 'rejected') {
                      statusClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                      statusLabel = "अस्वीकृत (Rejected)";
                    }

                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{typeLabel}</td>
                        <td className="py-3 px-3">{sub.flat_no}</td>
                        <td className="py-3 px-3">{new Date(sub.created_at).toLocaleDateString('hi-IN')}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => printSubmission(sub)}
                              className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-[9px] transition-colors font-bold uppercase"
                              title="प्रपत्र प्रिंट करें या PDF सहेजें"
                            >
                              🖨️ प्रिंट
                            </button>
                            <button
                              onClick={() => {
                                const report = `========================================================================
             माँ कौशल्या अपार्टमेंट (Maa Kaushalya Apartment RWA)
                       ऑनलाइन जमा फॉर्म का विवरण (SUBMISSION RECEIPT)
========================================================================
• सबमिशन आईडी: SUB-0${sub.id}
• फॉर्म प्रकार: ${typeLabel}
• फ्लैट नंबर: ${sub.flat_no}
• आवेदक का नाम: ${sub.user_name}
• दिनांक: ${new Date(sub.created_at).toLocaleString('hi-IN')}
• वर्तमान स्थिति: ${sub.status.toUpperCase()}
------------------------------------------------------------------------
विवरण (Submission Fields):
${JSON.stringify(sub.submission_data, null, 2)}
------------------------------------------------------------------------
(C) 2026 माँ कौशल्या अपार्टमेंट वेलफेयर एसोसिएशन, रायपुर।
========================================================================`;
                                triggerTextDownload(report, `submission_receipt_${sub.id}.txt`);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 rounded-lg text-[9px] transition-colors font-bold uppercase"
                              title="डेटा रसीद डाउनलोड करें"
                            >
                              📥 रसीद
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
              <p className="text-[10px] text-slate-500">आपने अभी तक कोई डिजिटल फॉर्म जमा नहीं किया है।</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Downloads;
