import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, Search, PlusCircle, UserPlus, Check, Phone, Mail, Building, 
  Upload, Download, Edit, Trash2, Eye, EyeOff, X, LayoutGrid, Table, 
  Copy, ChevronDown, ChevronUp, AlertCircle, Info, Sparkles, ShieldCheck,
  Calendar 
} from 'lucide-react';
import { SOCIETY_FLATS } from '../../utils/flats';

export const Directory = () => {
  const { token, register } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // Default to 'table' for practical overview

  // Filter & Sorting States
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');
  const [activeOccupancyFilter, setActiveOccupancyFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('flat');
  const [sortDirection, setSortDirection] = useState('asc');

  // Interactive UI States
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [revealedAadhaars, setRevealedAadhaars] = useState(new Set());
  const [copiedId, setCopiedId] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Add Member Modal/Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default password for newly registered members
  const [role, setRole] = useState('Resident');
  const [gender, setGender] = useState('Male');
  const [flatNo, setFlatNo] = useState('');
  const [phone, setPhone] = useState('');
  const [occupancyStatus, setOccupancyStatus] = useState('Self-Occupied');
  const [tenantType, setTenantType] = useState('Family');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [familyMemberNames, setFamilyMemberNames] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  // Practical Pet States
  const [hasPet, setHasPet] = useState(false);
  const [petDetails, setPetDetails] = useState('');

  // Legacy Bachelor States
  const [isLegacyBachelor, setIsLegacyBachelor] = useState(false);
  const [exemptionRef, setExemptionRef] = useState('');

  // Renter Verification States
  const [leaseAgreementSubmitted, setLeaseAgreementSubmitted] = useState(false);
  const [policeVerificationStatus, setPoliceVerificationStatus] = useState('pending');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit / Delete / View States
  const [editUser, setEditUser] = useState(null);
  const [showAdminEditPassword, setShowAdminEditPassword] = useState(false);
  const [copiedPasswordText, setCopiedPasswordText] = useState(false);

  const generateRandomPassword = () => {
    const prefixes = ['Maa', 'RWA', 'Apartment', 'Society', 'Sector1', 'Flat'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const chars = '@#$&';
    const char = chars[Math.floor(Math.random() * chars.length)];
    return `${prefix}${char}${num}`;
  };
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleFamilyMembersChange = (e) => {
    const val = e.target.value;
    setFamilyMembers(val);
    const count = parseInt(val) || 0;
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

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/directory', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch directory');
      }
    } catch (err) {
      console.error("Failed to fetch directory:", err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [token]);

  const handleCSVExport = () => {
    const headers = [
      "Name", 
      "Email", 
      "Role", 
      "Gender",
      "Flat No", 
      "Phone", 
      "Occupancy Status", 
      "Owner Name", 
      "Owner Phone", 
      "Aadhaar Number", 
      "Family Members", 
      "Family Member Names", 
      "Vehicles", 
      "Move In Date", 
      "Lease Duration", 
      "Emergency Contact Name", 
      "Emergency Contact Phone", 
      "Profile Picture", 
      "Has Pet", 
      "Pet Details", 
      "Legacy Bachelor", 
      "Exemption Reference", 
      "Created At"
    ];
    const rows = usersList.map(u => [
      u.name || '',
      u.email || '',
      u.role || '',
      u.gender || '',
      u.flat_no || '',
      u.phone || '',
      u.occupancy_status || 'Self-Occupied',
      u.owner_name || '',
      u.owner_phone || '',
      u.aadhaar_number || '',
      u.family_members !== undefined && u.family_members !== null ? u.family_members.toString() : '0',
      u.family_member_names || '',
      u.vehicles || '',
      u.move_in_date || '',
      u.lease_duration || '',
      u.emergency_contact_name || '',
      u.emergency_contact_phone || '',
      u.profile_picture || '',
      u.has_pet ? "Yes" : "No",
      u.pet_details || '',
      u.is_legacy_bachelor ? "Yes" : "No",
      u.exemption_ref || '',
      u.created_at || ''
    ]);

    const csvString = [
      headers.join(","),
      ...rows.map(e => e.map(val => {
        const stringVal = (val === undefined || val === null) ? '' : val.toString();
        return `"${stringVal.replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `makaushalya_society_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      if (lines.length <= 1) return;

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const roleIdx = headers.indexOf('role');
      const genderIdx = headers.indexOf('gender');
      const flatNoIdx = headers.indexOf('flat no') !== -1 ? headers.indexOf('flat no') : headers.indexOf('flat_no');
      const phoneIdx = headers.indexOf('phone');
      const occupancyIdx = headers.indexOf('occupancy status') !== -1 ? headers.indexOf('occupancy status') : headers.indexOf('occupancy_status');
      const ownerNameIdx = headers.indexOf('owner name') !== -1 ? headers.indexOf('owner name') : headers.indexOf('owner_name');
      const ownerPhoneIdx = headers.indexOf('owner phone') !== -1 ? headers.indexOf('owner phone') : headers.indexOf('owner_phone');
      
      // Extended Headers
      const aadhaarIdx = headers.indexOf('aadhaar number') !== -1 ? headers.indexOf('aadhaar number') : headers.indexOf('aadhaar_number');
      const familyMembersIdx = headers.indexOf('family members') !== -1 ? headers.indexOf('family members') : headers.indexOf('family_members');
      const familyMemberNamesIdx = headers.indexOf('family member names') !== -1 ? headers.indexOf('family member names') : headers.indexOf('family_member_names');
      const vehiclesIdx = headers.indexOf('vehicles') !== -1 ? headers.indexOf('vehicles') : headers.indexOf('vehicles');
      const moveInDateIdx = headers.indexOf('move in date') !== -1 ? headers.indexOf('move in date') : headers.indexOf('move_in_date');
      const leaseDurationIdx = headers.indexOf('lease duration') !== -1 ? headers.indexOf('lease duration') : headers.indexOf('lease_duration');
      const emergencyNameIdx = headers.indexOf('emergency contact name') !== -1 ? headers.indexOf('emergency contact name') : headers.indexOf('emergency_contact_name');
      const emergencyPhoneIdx = headers.indexOf('emergency contact phone') !== -1 ? headers.indexOf('emergency contact phone') : headers.indexOf('emergency_contact_phone');
      const profilePictureIdx = headers.indexOf('profile picture') !== -1 ? headers.indexOf('profile picture') : headers.indexOf('profile_picture');
      const hasPetIdx = headers.indexOf('has pet') !== -1 ? headers.indexOf('has pet') : headers.indexOf('has_pet');
      const petDetailsIdx = headers.indexOf('pet details') !== -1 ? headers.indexOf('pet details') : headers.indexOf('pet_details');
      const legacyBachelorIdx = headers.indexOf('legacy bachelor') !== -1 ? headers.indexOf('legacy bachelor') : headers.indexOf('is_legacy_bachelor');
      const exemptionRefIdx = headers.indexOf('exemption reference') !== -1 ? headers.indexOf('exemption reference') : headers.indexOf('exemption_ref');

      if (nameIdx === -1 || emailIdx === -1) {
        setError("त्रुटि: CSV में 'Name' और 'Email' कॉलम होना आवश्यक है।");
        return;
      }

      const usersToImport = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let inQuotes = false;
        let currentField = '';
        for (let charIdx = 0; charIdx < line.length; charIdx++) {
          const c = line[charIdx];
          if (c === '"') {
            inQuotes = !inQuotes;
          } else if (c === ',' && !inQuotes) {
            row.push(currentField.trim().replace(/^["']|["']$/g, ''));
            currentField = '';
          } else {
            currentField += c;
          }
        }
        row.push(currentField.trim().replace(/^["']|["']$/g, ''));

        if (row.length < 2) continue;

        const rowName = row[nameIdx];
        const rowEmail = row[emailIdx];
        if (!rowName || !rowEmail) continue;

        const rowRole = roleIdx !== -1 && row[roleIdx] ? row[roleIdx] : 'Resident';
        const rowGender = genderIdx !== -1 && row[genderIdx] ? row[genderIdx] : 'Male';
        const rowFlat = flatNoIdx !== -1 && row[flatNoIdx] ? row[flatNoIdx] : null;
        const rowPhone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx] : null;
        const rowOccupancy = occupancyIdx !== -1 && row[occupancyIdx] ? row[occupancyIdx] : 'Self-Occupied';
        const rowOwnerName = ownerNameIdx !== -1 && row[ownerNameIdx] ? row[ownerNameIdx] : null;
        const rowOwnerPhone = ownerPhoneIdx !== -1 && row[ownerPhoneIdx] ? row[ownerPhoneIdx] : null;
        
        // Parsing New fields
        const rowAadhaar = aadhaarIdx !== -1 && row[aadhaarIdx] ? row[aadhaarIdx] : null;
        const rowFamilyMembers = familyMembersIdx !== -1 && row[familyMembersIdx] ? parseInt(row[familyMembersIdx]) || 0 : null;
        const rowFamilyMemberNames = familyMemberNamesIdx !== -1 && row[familyMemberNamesIdx] ? row[familyMemberNamesIdx] : null;
        const rowVehicles = vehiclesIdx !== -1 && row[vehiclesIdx] ? row[vehiclesIdx] : null;
        const rowMoveInDate = moveInDateIdx !== -1 && row[moveInDateIdx] ? row[moveInDateIdx] : null;
        const rowLeaseDuration = leaseDurationIdx !== -1 && row[leaseDurationIdx] ? row[leaseDurationIdx] : null;
        const rowEmergencyName = emergencyNameIdx !== -1 && row[emergencyNameIdx] ? row[emergencyNameIdx] : null;
        const rowEmergencyPhone = emergencyPhoneIdx !== -1 && row[emergencyPhoneIdx] ? row[emergencyPhoneIdx] : null;
        const rowProfilePicture = profilePictureIdx !== -1 && row[profilePictureIdx] ? row[profilePictureIdx] : null;
        const rowHasPetVal = hasPetIdx !== -1 && row[hasPetIdx] ? row[hasPetIdx].trim().toLowerCase() : 'no';
        const rowHasPet = rowHasPetVal === 'yes' || rowHasPetVal === 'true';
        const rowPetDetails = petDetailsIdx !== -1 && row[petDetailsIdx] ? row[petDetailsIdx] : null;
        const rowLegacyVal = legacyBachelorIdx !== -1 && row[legacyBachelorIdx] ? row[legacyBachelorIdx].trim().toLowerCase() : 'no';
        const rowLegacy = rowLegacyVal === 'yes' || rowLegacyVal === 'true';
        const rowExemption = exemptionRefIdx !== -1 && row[exemptionRefIdx] ? row[exemptionRefIdx] : null;

        usersToImport.push({
          name: rowName,
          email: rowEmail,
          role: rowRole,
          gender: rowGender,
          flatNo: rowFlat,
          phone: rowPhone,
          occupancyStatus: rowOccupancy,
          ownerName: rowOwnerName,
          ownerPhone: rowOwnerPhone,
          aadhaarNumber: rowAadhaar,
          familyMembers: rowFamilyMembers,
          familyMemberNames: rowFamilyMemberNames,
          vehicles: rowVehicles,
          moveInDate: rowMoveInDate,
          leaseDuration: rowLeaseDuration,
          emergencyContactName: rowEmergencyName,
          emergencyContactPhone: rowEmergencyPhone,
          profilePicture: rowProfilePicture,
          hasPet: rowHasPet,
          petDetails: rowPetDetails,
          isLegacyBachelor: rowLegacy,
          exemptionRef: rowExemption
        });
      }

      if (usersToImport.length === 0) {
        setError("त्रुटि: CSV में कोई वैध सदस्य डेटा नहीं मिला।");
        return;
      }

      try {
        const res = await fetch('/api/admin/users/bulk-import', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ users: usersToImport })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess(`बल्क अपलोड पूरा हुआ! ${data.count} सदस्य जोड़े गए।`);
          fetchDirectory();
        } else {
          throw new Error(data.message || 'Bulk import failed');
        }
      } catch (err) {
        console.error("Bulk upload failed:", err);
        setError(err.message || 'बल्क अपलोड विफल');
      }
      setTimeout(() => setSuccess(''), 3000);
    };
    reader.readAsText(file);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name,
      email,
      password,
      role,
      gender,
      flatNo: role === 'Resident' ? flatNo : null,
      phone,
      occupancyStatus: role === 'Resident' ? occupancyStatus : 'Self-Occupied',
      tenantType: role === 'Resident' && occupancyStatus === 'Rented' ? tenantType : 'Family',
      ownerName: (role === 'Resident' && occupancyStatus === 'Rented') ? ownerName : null,
      ownerPhone: (role === 'Resident' && occupancyStatus === 'Rented') ? ownerPhone : null,
      aadhaarNumber: aadhaarNumber || null,
      familyMembers: familyMembers ? parseInt(familyMembers) : null,
      familyMemberNames: familyMemberNames.length > 0 ? JSON.stringify(familyMemberNames) : null,
      vehicles: vehicles.length > 0 ? JSON.stringify(vehicles) : null,
      moveInDate: moveInDate || null,
      leaseDuration: (role === 'Resident' && occupancyStatus === 'Rented') ? leaseDuration : null,
      leaseAgreementSubmitted: role === 'Resident' && occupancyStatus === 'Rented' ? leaseAgreementSubmitted : false,
      policeVerificationStatus: role === 'Resident' && occupancyStatus === 'Rented' ? policeVerificationStatus : 'pending',
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      profilePicture: profilePicture || null,
      hasPet: role === 'Resident' ? hasPet : false,
      petDetails: (role === 'Resident' && hasPet) ? petDetails : null,
      isLegacyBachelor: role === 'Resident' && occupancyStatus === 'Rented' ? isLegacyBachelor : false,
      exemptionRef: (role === 'Resident' && occupancyStatus === 'Rented' && isLegacyBachelor) ? exemptionRef : null
    };

    const resetForm = () => {
      setName('');
      setEmail('');
      setGender('Male');
      setFlatNo('');
      setPhone('');
      setTenantType('Family');
      setOwnerName('');
      setOwnerPhone('');
      setAadhaarNumber('');
      setFamilyMembers('');
      setFamilyMemberNames([]);
      setVehicles([]);
      setMoveInDate('');
      setLeaseDuration('');
      setLeaseAgreementSubmitted(false);
      setPoliceVerificationStatus('pending');
      setEmergencyContactName('');
      setEmergencyContactPhone('');
      setProfilePicture('');
      setHasPet(false);
      setPetDetails('');
      setIsLegacyBachelor(false);
      setExemptionRef('');
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(`सदस्य ${name} सफलतापूर्वक पंजीकृत हो गया!`);
        resetForm();
        setTimeout(() => {
          setShowAddForm(false);
          setSuccess('');
          fetchDirectory();
        }, 1200);
      } else {
        throw new Error(data.message || 'पंजीकरण विफल');
      }
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.message || 'पंजीकरण विफल');
    }
  };

  // Clipboard copy helper
  const handleCopyToClipboard = (text, id, field) => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${field}`);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Setup state lists when starting to edit a user
  const startEditing = (item) => {
    let parsedFamily = [];
    try {
      if (item.family_member_names) {
        parsedFamily = typeof item.family_member_names === 'string'
          ? JSON.parse(item.family_member_names)
          : item.family_member_names;
      }
    } catch (e) {}

    let parsedVehicles = [];
    try {
      if (item.vehicles) {
        parsedVehicles = typeof item.vehicles === 'string'
          ? JSON.parse(item.vehicles)
          : item.vehicles;
      }
    } catch (e) {}

    setEditUser({
      ...item,
      has_pet: item.has_pet || false,
      pet_details: item.pet_details || '',
      is_legacy_bachelor: item.is_legacy_bachelor || false,
      exemption_ref: item.exemption_ref || '',
      family_member_names_arr: Array.isArray(parsedFamily) ? parsedFamily : [],
      vehicles_arr: Array.isArray(parsedVehicles) ? parsedVehicles : [],
      tenant_type: item.tenant_type || 'Family',
      police_verification_status: item.police_verification_status || 'pending',
      lease_agreement_submitted: item.lease_agreement_submitted || false,
      bachelor_notes: item.bachelor_notes || ''
    });
  };

  const handleEditFamilyMembersChange = (e) => {
    const val = e.target.value;
    const count = parseInt(val) || 0;
    const safeCount = Math.min(count, 15);
    
    setEditUser(prev => {
      const newArr = [...(prev.family_member_names_arr || [])];
      if (safeCount > newArr.length) {
        for (let i = newArr.length; i < safeCount; i++) newArr.push({ name: '', phone: '' });
      } else if (safeCount < newArr.length) {
        newArr.splice(safeCount);
      }
      return {
        ...prev,
        family_members: val,
        family_member_names_arr: newArr
      };
    });
  };

  const handleEditFamilyMemberChange = (index, field, value) => {
    setEditUser(prev => {
      const newArr = [...(prev.family_member_names_arr || [])];
      newArr[index] = { ...newArr[index], [field]: value };
      return {
        ...prev,
        family_member_names_arr: newArr
      };
    });
  };

  const handleEditAddVehicle = () => {
    setEditUser(prev => ({
      ...prev,
      vehicles_arr: [...(prev.vehicles_arr || []), { type: 'Car', number: '', sticker: false }]
    }));
  };

  const handleEditRemoveVehicle = (index) => {
    setEditUser(prev => ({
      ...prev,
      vehicles_arr: (prev.vehicles_arr || []).filter((_, i) => i !== index)
    }));
  };

  const handleEditVehicleChange = (index, field, value) => {
    setEditUser(prev => {
      const newArr = [...(prev.vehicles_arr || [])];
      newArr[index] = { ...newArr[index], [field]: value };
      return {
        ...prev,
        vehicles_arr: newArr
      };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const serializedFamily = editUser.role === 'Resident' && editUser.family_member_names_arr && editUser.family_member_names_arr.length > 0
      ? JSON.stringify(editUser.family_member_names_arr)
      : null;

    const serializedVehicles = editUser.role === 'Resident' && editUser.vehicles_arr && editUser.vehicles_arr.length > 0
      ? JSON.stringify(editUser.vehicles_arr)
      : null;

    try {
      const payload = {
        userId: editUser.id,
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        flatNo: editUser.role === 'Resident' ? editUser.flat_no : null,
        occupancyStatus: editUser.role === 'Resident' ? editUser.occupancy_status : 'Self-Occupied',
        tenantType: editUser.role === 'Resident' && editUser.occupancy_status === 'Rented' ? editUser.tenant_type : 'Family',
        ownerName: (editUser.role === 'Resident' && editUser.occupancy_status === 'Rented') ? editUser.owner_name : null,
        ownerPhone: (editUser.role === 'Resident' && editUser.occupancy_status === 'Rented') ? editUser.owner_phone : null,
        aadhaarNumber: editUser.aadhaar_number || null,
        familyMembers: editUser.role === 'Resident' ? (editUser.family_members ? parseInt(editUser.family_members) : null) : null,
        familyMemberNames: serializedFamily,
        vehicles: serializedVehicles,
        moveInDate: editUser.move_in_date || null,
        leaseDuration: (editUser.role === 'Resident' && editUser.occupancy_status === 'Rented') ? editUser.lease_duration : null,
        leaseExpiryDate: (editUser.role === 'Resident' && editUser.occupancy_status === 'Rented') ? editUser.lease_expiry_date : null,
        leaseAgreementSubmitted: editUser.role === 'Resident' && editUser.occupancy_status === 'Rented' ? editUser.lease_agreement_submitted : false,
        policeVerificationStatus: editUser.role === 'Resident' && editUser.occupancy_status === 'Rented' ? editUser.police_verification_status : 'pending',
        emergencyContactName: editUser.emergency_contact_name || null,
        emergencyContactPhone: editUser.emergency_contact_phone || null,
        profilePicture: editUser.profile_picture || null,
        hasPet: editUser.role === 'Resident' ? editUser.has_pet : false,
        petDetails: (editUser.role === 'Resident' && editUser.has_pet) ? editUser.pet_details : null,
        isLegacyBachelor: editUser.role === 'Resident' && editUser.occupancy_status === 'Rented' ? editUser.is_legacy_bachelor : false,
        exemptionRef: (editUser.role === 'Resident' && editUser.occupancy_status === 'Rented' && editUser.is_legacy_bachelor) ? editUser.exemption_ref : null,
        password: editUser.password || undefined
      };

      const res = await fetch('/api/users/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("सदस्य अद्यतन सफल (Updated successfully)!");
        setEditUser(null);
        fetchDirectory();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'अपडेट विफल');
      }
    } catch (err) {
      console.error("Error updating member:", err);
      setError(err.message || 'अपडेट विफल');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/users/delete/${deleteUserId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("सदस्य को हटा दिया गया है (Deleted)!");
        setDeleteUserId(null);
        fetchDirectory();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'हटाना विफल');
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      alert('हटाना विफल: ' + err.message);
      setDeleteUserId(null);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/approve/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("खाता सफलतापूर्वक स्वीकृत (Approved) किया गया!");
        fetchDirectory();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'स्वीकृति विफल');
      }
    } catch (err) {
      console.error("Error approving member:", err);
      alert('स्वीकृति विफल: ' + err.message);
    }
  };

  const handleCheckoutUser = async (userId) => {
    if (!window.confirm("क्या आप वाकई इस निवासी को चेक-आउट करना चाहते हैं? इससे उनका फ्लैट नंबर खाली हो जाएगा। (Are you sure you want to checkout this resident?)")) {
      return;
    }
    try {
      const res = await fetch(`/api/users/checkout/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("निवासी को सफलतापूर्वक चेक-आउट कर दिया गया है!");
        fetchDirectory();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        throw new Error(data.message || 'चेक-आउट विफल');
      }
    } catch (err) {
      console.error("Error checking out member:", err);
      alert('चेक-आउट विफल: ' + err.message);
    }
  };

  // Toggle dynamic expanded accordion rows
  const toggleRowExpanded = (userId) => {
    if (typeof userId === 'string' && userId.startsWith('vacant-')) return;
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  // Toggle Aadhaar reveal inline
  const toggleAadhaarRevealed = (userId) => {
    const newRevealed = new Set(revealedAadhaars);
    if (newRevealed.has(userId)) {
      newRevealed.delete(userId);
    } else {
      newRevealed.add(userId);
    }
    setRevealedAadhaars(newRevealed);
  };

  // Highlight matches inside table text
  const highlightText = (text, highlight) => {
    if (!text) return '-';
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = (text || '').split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) 
            ? <mark key={i} className="bg-amber-500/35 text-amber-200 px-0.5 rounded font-bold">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  // Real-time directory filtering based on Query + Tab selections
  const occupiedFlatsSet = new Set(
    usersList
      .filter(u => u.role === 'Resident' && u.is_approved !== false && (u.occupancy_status === 'Self-Occupied' || u.occupancy_status === 'Rented') && u.flat_no)
      .map(u => u.flat_no)
  );

  let filteredUsers = [];
  if (activeOccupancyFilter === 'Vacant') {
    const vacantFlats = SOCIETY_FLATS.filter(f => !occupiedFlatsSet.has(f));
    filteredUsers = vacantFlats.map(flatNo => ({
      id: `vacant-${flatNo}`,
      flat_no: flatNo,
      name: 'रिक्त फ्लैट (Vacant Flat)',
      email: '—',
      phone: '—',
      role: 'Resident',
      occupancy_status: 'Vacant',
      is_approved: true,
      is_vacant_flat: true
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(u => u.flat_no.toLowerCase().includes(q));
    }
  } else {
    filteredUsers = usersList.filter(user => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (
        (user.name || '').toLowerCase().includes(q) ||
        (user.email || '').toLowerCase().includes(q) ||
        (user.flat_no || '').toLowerCase().includes(q) ||
        (user.role || '').toLowerCase().includes(q)
      );

      // If 'Pending' filter is active, only show unapproved users
      if (activeRoleFilter === 'Pending') {
        return matchesSearch && user.is_approved === false;
      }

      const matchesApproved = user.is_approved !== false;
      const matchesRole = activeRoleFilter === 'All' || user.role === activeRoleFilter;

      const matchesOccupancy = activeOccupancyFilter === 'All' || 
        (user.role === 'Resident' && user.occupancy_status === activeOccupancyFilter);

      return matchesSearch && matchesApproved && matchesRole && matchesOccupancy;
    });
  }

  // Calculate live statistics based on full directory database (before search filters)
  const statsTotal = usersList.length;
  const statsOwners = usersList.filter(u => u.role === 'Resident' && u.is_approved !== false && u.occupancy_status === 'Self-Occupied').length;
  const statsTenants = usersList.filter(u => u.role === 'Resident' && u.is_approved !== false && u.occupancy_status === 'Rented').length;
  
  // Jo flat kisiki occupancy me nahi hai, wo vacant hai (512 - occupied)
  const occupiedFlatsCount = occupiedFlatsSet.size;
  const statsVacant = SOCIETY_FLATS.length - occupiedFlatsCount;

  // Sorting Handler
  const requestSort = (columnName) => {
    let direction = 'asc';
    if (sortColumn === columnName && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortColumn(columnName);
    setSortDirection(direction);
    setCurrentPage(1); // Reset page on sort
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Custom sort triggers
    if (sortColumn === 'flat') {
      const flatA = a.flat_no || '';
      const flatB = b.flat_no || '';
      
      // Push empty/null values to the bottom regardless of sort direction
      if (!flatA && flatB) return 1;
      if (flatA && !flatB) return -1;
      if (!flatA && !flatB) return 0;
      
      return sortDirection === 'asc'
        ? flatA.localeCompare(flatB, 'hi-IN', { numeric: true })
        : flatB.localeCompare(flatA, 'hi-IN', { numeric: true });
    }

    let valA = a[sortColumn] || '';
    let valB = b[sortColumn] || '';

    if (sortColumn === 'name') {
      valA = a.name || '';
      valB = b.name || '';
    } else if (sortColumn === 'role') {
      valA = a.role || '';
      valB = b.role || '';
    } else if (sortColumn === 'occupancy') {
      valA = a.occupancy_status || '';
      valB = b.occupancy_status || '';
    } else if (sortColumn === 'moveIn') {
      valA = a.move_in_date || '';
      valB = b.move_in_date || '';
    }

    if (typeof valA === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB, 'hi-IN')
        : valB.localeCompare(valA, 'hi-IN');
    } else {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
  });

  // Client-Side Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRoleHindi = (role) => {
    switch (role) {
      case 'Admin':
        return 'मुख्य एडमिन (Admin)';
      case 'Committee':
        return 'समिति सदस्य (Committee)';
      case 'Security':
        return 'सुरक्षा गार्ड (Security)';
      case 'Resident':
      default:
        return 'निवासी (Resident)';
    }
  };

  return (
    <div className={`flex-1 p-6 text-left flex flex-col gap-6 mx-auto w-full transition-all duration-300 ${
      viewMode === 'table' ? 'max-w-7xl' : 'max-w-4xl'
    }`}>
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-brand-400 flex items-center justify-center border border-brand-500/25">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
              सोसायटी सदस्य निर्देशिका
              <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30 uppercase tracking-widest font-black shrink-0">
                Dashboard
              </span>
            </h1>
            <p className="text-xs text-slate-400">सभी फ्लैट निवासियों और समिति के सदस्यों का डेटाबेस रजिस्टर</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk CSV Upload */}
          <label className="cursor-pointer px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all">
            <Upload size={14} />
            बल्क अपलोड (CSV)
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>

          {/* Bulk CSV Download */}
          <button
            onClick={handleCSVExport}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> डेटा डाउनलोड (CSV)
          </button>

          {/* Add Member button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-premium hover:shadow-premium-hover transition-all"
          >
            <UserPlus size={14} /> नया सदस्य जोड़ें
          </button>
        </div>
      </div>

      {/* RWA Overview Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
        {/* Stat 1: Total Directory */}
        <div 
          onClick={() => {
            setActiveRoleFilter('All');
            setActiveOccupancyFilter('All');
            setCurrentPage(1);
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] cursor-pointer relative overflow-hidden group hover:scale-[1.01] duration-200 ${
            activeRoleFilter === 'All' && activeOccupancyFilter === 'All'
              ? 'border-violet-500/60 bg-violet-900/20 shadow-premium glow-violet-sm'
              : 'border-white/5 bg-slate-950/40 hover:border-violet-500/35'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all"></div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">कुल सदस्य (Total)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-white">{statsTotal}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20 font-bold uppercase">
              Roster
            </span>
          </div>
        </div>

        {/* Stat 2: Self Occupied (Owners) */}
        <div 
          onClick={() => {
            setActiveRoleFilter('Resident');
            setActiveOccupancyFilter('Self-Occupied');
            setCurrentPage(1);
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] cursor-pointer relative overflow-hidden group hover:scale-[1.01] duration-200 ${
            activeRoleFilter === 'Resident' && activeOccupancyFilter === 'Self-Occupied'
              ? 'border-emerald-500/60 bg-emerald-900/20 shadow-premium glow-emerald-sm'
              : 'border-white/5 bg-slate-950/40 hover:border-emerald-500/35'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-all"></div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">स्व-कब्जा (Self-Occupied)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-emerald-400">{statsOwners}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
              Owners
            </span>
          </div>
        </div>

        {/* Stat 3: Rented Flats (Tenants) */}
        <div 
          onClick={() => {
            setActiveRoleFilter('Resident');
            setActiveOccupancyFilter('Rented');
            setCurrentPage(1);
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] cursor-pointer relative overflow-hidden group hover:scale-[1.01] duration-200 ${
            activeRoleFilter === 'Resident' && activeOccupancyFilter === 'Rented'
              ? 'border-sky-500/60 bg-sky-900/20 shadow-premium glow-sky-sm'
              : 'border-white/5 bg-slate-950/40 hover:border-sky-500/35'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-600/5 rounded-full blur-2xl group-hover:bg-sky-600/10 transition-all"></div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">किरायेदार (Rented Flats)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-sky-400">{statsTenants}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/20 font-bold uppercase">
              Tenants
            </span>
          </div>
        </div>

        {/* Stat 4: Vacant Flats Only */}
        <div 
          onClick={() => {
            setActiveRoleFilter('Resident');
            setActiveOccupancyFilter('Vacant');
            setCurrentPage(1);
          }}
          className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] cursor-pointer relative overflow-hidden group hover:scale-[1.01] duration-200 ${
            activeRoleFilter === 'Resident' && activeOccupancyFilter === 'Vacant'
              ? 'border-slate-400/60 bg-slate-800/30 shadow-premium'
              : 'border-white/5 bg-slate-950/40 hover:border-slate-500/35'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-600/5 rounded-full blur-2xl group-hover:bg-slate-600/10 transition-all"></div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">रिक्त फ्लैट (Vacant Flats)</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-slate-300">{statsVacant}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-500/15 text-slate-400 border border-slate-500/20 font-bold uppercase">
              Vacant
            </span>
          </div>
        </div>
      </div>

      {/* RWA Add Member Form Panel */}
      {showAddForm && (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-brand animate-fadeIn">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">सोसायटी के नए सदस्य का पंजीकरण करें</h3>

          <form onSubmit={handleAddMemberSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">पूरा नाम (Full Name)</label>
                <input
                  type="text"
                  required
                  placeholder="पूरा नाम दर्ज करें"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">ईमेल पता (Email Address)</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">जेंडर (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">भूमिका आवंटित करें (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="Resident">निवासी (Resident)</option>
                  <option value="Committee">समिति सदस्य (Committee Member)</option>
                  <option value="Admin">मुख्य एडमिन (Admin)</option>
                  <option value="Security">सुरक्षा गार्ड (Security)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">संपर्क फोन नंबर (Phone)</label>
                <input
                  type="tel"
                  required
                  placeholder="+9198765432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">फ्लैट नंबर (Flat No.)</label>
                <select
                  disabled={role !== 'Resident'}
                  required={role === 'Resident'}
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-40"
                >
                  <option value="">फ्लैट नंबर चुनें</option>
                  {SOCIETY_FLATS.map(flat => (
                    <option key={flat} value={flat}>{flat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Common Metadata Fields: Aadhaar, Emergency Contact, Profile Pic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आधार नंबर / ID (Aadhaar No.)</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आपातकालीन संपर्क नाम (Emergency Name)</label>
                <input
                  type="text"
                  placeholder="संपर्क व्यक्ति का नाम"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-slate-400">आपातकालीन फ़ोन (Emergency Phone)</label>
                <input
                  type="tel"
                  placeholder="+9198765432"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
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
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 text-xs font-bold transition-all"
                      >
                        हटाएं
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-upload"
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
                      htmlFor="profile-upload"
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition-colors shadow-premium w-fit"
                    >
                      फोटो चुनें / अपलोड करें
                    </label>
                    <p className="text-[9px] text-slate-500 leading-normal">PNG, JPG या GIF। फोटो सीधे डेटाबेस में सहेजी जाएगी।</p>
                  </div>
                </div>
              </div>
            </div>

            {role === 'Resident' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-3 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase text-slate-400">कब्जा स्थिति (Occupancy Status)</label>
                    <select
                      value={occupancyStatus}
                      onChange={(e) => setOccupancyStatus(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                    >
                      <option value="Self-Occupied">स्व-कब्जा (Self-Occupied)</option>
                      <option value="Rented">किराये पर (Rented)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase text-slate-400">परिवार का आकार (Family Size)</label>
                    <input
                      type="number"
                      placeholder="उदा: 4"
                      min="1"
                      max="15"
                      value={familyMembers}
                      onChange={handleFamilyMembersChange}
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase text-slate-400">प्रवेश तिथि (Move-in Date)</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                        className="bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors w-full cursor-pointer [color-scheme:dark]"
                      />
                      <Calendar size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {occupancyStatus === 'Rented' && (
                    <>
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-xs font-bold uppercase text-slate-400">किरायेदार का प्रकार (Tenant Type)</label>
                        <select
                          value={tenantType}
                          onChange={(e) => setTenantType(e.target.value)}
                          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors appearance-none"
                        >
                          <option value="Family">परिवार (Family)</option>
                          <option value="Bachelor">बैचलर / फ्लैटमेट्स (Bachelor)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 animate-fadeIn">
                        <label className="text-xs font-bold uppercase text-slate-400">पट्टा अवधि (Lease Duration)</label>
                        <input
                          type="text"
                          placeholder="उदा: 11 months"
                          value={leaseDuration}
                          onChange={(e) => setLeaseDuration(e.target.value)}
                          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Practical Pets Onboarding Form Section inside Registration */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl animate-fadeIn text-left mt-3">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xl">🐾</span>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-xs font-bold uppercase text-slate-200">पालतू जानवर (Pet Owned?)</label>
                      <p className="text-[10px] text-slate-400">क्या आपके पास कोई पालतू पशु है?</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
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
                          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none w-full transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {occupancyStatus === 'Rented' && (
                  <div className="flex flex-col gap-3.5 border-t border-white/5 pt-3 animate-fadeIn">
                    {/* Tenant Category Toggle for RWA Admin Override */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-fadeIn text-left">
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xl">🛡️</span>
                        <div className="flex flex-col gap-0.5">
                          <label className="text-xs font-bold uppercase text-slate-200">किरायेदार श्रेणी (Tenant Category)</label>
                          <p className="text-[10px] text-slate-400">विरासत अविवाहित किरायेदार (Legacy Bachelor)?</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="add-is-legacy"
                              checked={isLegacyBachelor === false}
                              onChange={() => {
                                setIsLegacyBachelor(false);
                                setExemptionRef('');
                              }}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>सामान्य परिवार (Family)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                            <input
                              type="radio"
                              name="add-is-legacy"
                              checked={isLegacyBachelor === true}
                              onChange={() => setIsLegacyBachelor(true)}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>विरासत अविवाहित (Legacy Bachelor)</span>
                          </label>
                        </div>

                        {isLegacyBachelor && (
                          <div className="flex-1 flex flex-col gap-1 w-full animate-fadeIn">
                            <input
                              type="text"
                              required
                              placeholder="घोषणा-पत्र संदर्भ क्रमांक व दिनांक (उदा: RWA-2024-U72)"
                              value={exemptionRef}
                              onChange={(e) => setExemptionRef(e.target.value)}
                              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none w-full transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lease Agreement and Police Verification switches for Renter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl animate-fadeIn text-left mb-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-slate-300">किराया एग्रीमेंट (Lease Agreement Submitted?)</label>
                        <div className="flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="add-lease-agreement"
                              checked={leaseAgreementSubmitted === true}
                              onChange={() => setLeaseAgreementSubmitted(true)}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>हाँ (Yes)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                            <input
                              type="radio"
                              name="add-lease-agreement"
                              checked={leaseAgreementSubmitted === false}
                              onChange={() => setLeaseAgreementSubmitted(false)}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>नहीं (No)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-slate-300">पुलिस सत्यापन (Police Verification Status)</label>
                        <div className="flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="add-police-verification"
                              checked={policeVerificationStatus === 'verified'}
                              onChange={() => setPoliceVerificationStatus('verified')}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>सत्यापित (Verified)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                            <input
                              type="radio"
                              name="add-police-verification"
                              checked={policeVerificationStatus === 'pending'}
                              onChange={() => setPoliceVerificationStatus('pending')}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>लंबित (Pending)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-slate-400">फ्लैट मालिक का नाम (Owner Name)</label>
                        <input
                          type="text"
                          required
                          placeholder="मालिक का नाम दर्ज करें"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-slate-400">मालिक का फोन नंबर (Owner Phone)</label>
                        <input
                          type="tel"
                          required
                          placeholder="+9198765432"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Family member details subform */}
                {familyMemberNames.length > 0 && (
                  <div className="flex flex-col gap-2.5 p-4 bg-brand-500/5 border border-brand-500/20 rounded-2xl animate-fadeIn">
                    <p className="text-[10px] font-extrabold uppercase text-brand-300 tracking-wider">परिवार के सदस्य (Family Members Details)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {familyMemberNames.map((member, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2">
                          <p className="text-[9px] font-extrabold uppercase text-brand-400 tracking-wider">सदस्य {idx + 1}</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[8px] font-bold uppercase text-slate-400">नाम (Name)</label>
                              <input
                                type="text"
                                required
                                placeholder="नाम दर्ज करें"
                                value={member.name || ''}
                                onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-brand-500 focus:outline-none w-full transition-colors"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[8px] font-bold uppercase text-slate-400">फ़ोन (Phone)</label>
                              <input
                                type="tel"
                                required
                                placeholder="मोबाइल नंबर"
                                value={member.phone || ''}
                                onChange={(e) => handleFamilyMemberChange(idx, 'phone', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-brand-500 focus:outline-none w-full transition-colors"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[8px] font-bold uppercase text-slate-400">जेंडर</label>
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

                {/* Vehicles registration subform */}
                <div className="flex flex-col gap-2.5 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase text-emerald-300 tracking-wider">पंजीकृत वाहन (Vehicles Registered)</p>
                    <button
                      type="button"
                      onClick={handleAddVehicle}
                      className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/40 transition-colors"
                    >
                      + Add Vehicle
                    </button>
                  </div>
                  {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicles.map((veh, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <select
                            value={veh.type}
                            onChange={(e) => handleVehicleChange(idx, 'type', e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-emerald-500 focus:outline-none w-1/3"
                          >
                            <option value="Car">Car</option>
                            <option value="Bike">Bike / Scooty</option>
                          </select>
                          <input
                            type="text"
                            required
                            placeholder="नंबर (उदा: CG04 AB 1234)"
                            value={veh.number}
                            onChange={(e) => handleVehicleChange(idx, 'number', e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder-slate-600 text-[10px] focus:border-emerald-500 focus:outline-none flex-1"
                          />
                          
                          {/* Sticker Issued Switch */}
                          <label className="flex items-center gap-1 cursor-pointer select-none shrink-0 bg-slate-950 px-2 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-slate-300 hover:text-white transition-colors">
                            <input
                              type="checkbox"
                              checked={veh.sticker === true}
                              onChange={(e) => handleVehicleChange(idx, 'sticker', e.target.checked)}
                              className="accent-brand-500 w-3 h-3 cursor-pointer"
                            />
                            <span>🎫 स्टीकर जारी</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">कोई वाहन नहीं जोड़ा गया।</p>
                  )}
                </div>
              </>
            )}

            {/* Note on default password */}
            <p className="text-[10px] text-slate-500">
              * नोट: नए पंजीकृत खाते का डिफ़ॉल्ट पासवर्ड <span className="font-bold text-slate-300">"password123"</span> सेट होगा जिसे बाद में प्रोफ़ाइल पोर्टल में जाकर बदला जा सकता है।
            </p>

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
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 border border-brand-500/20 rounded-xl text-xs font-bold text-white transition-all uppercase shadow-premium hover:shadow-premium-hover"
              >
                खाता बनाएं
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Advanced Filter Tab System */}
      <div className="flex flex-col gap-4">
        {/* Main Search and View Toggle controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <Search size={16} className="text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="खोजें: सदस्य का नाम, ईमेल, फ्लैट नंबर या भूमिका..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to page 1
              }}
              className="bg-transparent border-0 text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-white text-[10px] font-bold"
              >
                ✕ Clear
              </button>
            )}
          </div>
          
          {/* View Mode Toggle */}
          <div className="glass-panel p-1.5 rounded-2xl border border-white/5 flex items-center gap-1 shrink-0 bg-slate-950/40">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-premium'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ग्रिड व्यू (Grid View)"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('table');
              }}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-premium'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="तालिका व्यू (Table View)"
            >
              <Table size={14} />
              <span>Interactive Table</span>
            </button>
          </div>
        </div>
        {/* Tabbed Pills for Roles & Occupancy filtering */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col gap-3.5 text-xs text-left bg-slate-950/20">
          {/* Row 1: Role Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider w-24">भूमिका (Role):</span>
            {[
              { id: 'All', label: 'सभी सदस्य (All)' },
              { id: 'Resident', label: 'निवासी (Residents)' },
              { id: 'Committee', label: 'समिति सदस्य (Committee)' },
              { id: 'Admin', label: 'मुख्य एडमिन (Admin)' },
              { id: 'Security', label: 'सुरक्षा स्टाफ (Security)' },
              { id: 'Pending', label: 'अनुमोदन लंबित (Pending Approval)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveRoleFilter(tab.id);
                  if (tab.id !== 'Resident') setActiveOccupancyFilter('All');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border text-[11px] ${
                  activeRoleFilter === tab.id
                    ? 'bg-brand-600/10 border-brand-500/55 text-brand-300 shadow-sm'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Row 2: Occupancy Filters (visible only for Residents or All) */}
          {(activeRoleFilter === 'All' || activeRoleFilter === 'Resident') && (
            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 animate-fadeIn">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider w-24">स्थिति (Occupancy):</span>
              {[
                { id: 'All', label: 'सभी फ्लैट (All Occupancies)' },
                { id: 'Self-Occupied', label: 'स्व-कब्जा (Self-Occupied Owners)' },
                { id: 'Rented', label: 'किरायेदार (Tenants)' },
                { id: 'Vacant', label: 'खाली फ्लैट (Vacant)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveOccupancyFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all border text-[11px] ${
                    activeOccupancyFilter === tab.id
                      ? 'bg-emerald-600/10 border-emerald-500/55 text-emerald-300 shadow-sm'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Directory Content List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : sortedUsers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedUsers.map((item) => {
              const isVacant = item.is_vacant_flat;
              
              // Parse vehicle list
              let vehicleList = [];
              if (!isVacant) {
                try {
                  if (item.vehicles) {
                    vehicleList = typeof item.vehicles === 'string'
                      ? JSON.parse(item.vehicles)
                      : item.vehicles;
                  }
                } catch (e) {}
              }

              if (isVacant) {
                return (
                  <div
                    key={item.id}
                    className="glass-panel p-5 rounded-3xl border border-slate-500/20 bg-slate-950/40 flex flex-col justify-between hover:border-slate-400/35 transition-all duration-300 hover:-translate-y-0.5 animate-fadeIn"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          {/* Home/Building avatar for vacant */}
                          <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 shadow-premium text-slate-500">
                            <Building size={16} />
                          </div>
                          
                          <div className="flex flex-col gap-1 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-500/25 text-slate-300 border border-slate-500/35 uppercase tracking-wider shrink-0 shadow-sm animate-pulse-subtle">
                                Flat {item.flat_no}
                              </span>
                              <h3 className="font-extrabold text-white text-sm tracking-wide">रिक्त फ्लैट (Vacant Flat)</h3>
                            </div>
                            <span className="self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-slate-500/15 text-slate-400 border border-slate-500/20">
                              खाली (Vacant)
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-slate-500/15 text-slate-400 border border-slate-500/20">
                          निवासी (Resident)
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3 text-[10px] text-slate-400 text-left">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-slate-500 shrink-0" />
                          <span>आवंटित फ्लैट: <span className="font-bold text-slate-200">{item.flat_no}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-500 shrink-0" />
                          <span>—</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-500 shrink-0" />
                          <span>—</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                      <button 
                        onClick={() => {
                          setRole('Resident');
                          setFlatNo(item.flat_no);
                          setOccupancyStatus('Self-Occupied');
                          setShowAddForm(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-1.5"
                      >
                        <UserPlus size={12} /> सदस्य जोड़ें
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-500/10 transition-all duration-300 hover:-translate-y-0.5 animate-fadeIn"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        {/* Premium Resident Profile Avatar */}
                        <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 shadow-premium">
                          {item.profile_picture ? (
                            <img src={item.profile_picture} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black text-brand-300 uppercase">
                              {(item.name || ' ')[0]}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-brand-500/25 text-brand-300 border border-brand-500/30 uppercase tracking-wider shrink-0 shadow-sm animate-pulse-subtle">
                              {item.flat_no ? `Flat ${item.flat_no}` : 'N/A'}
                            </span>
                            <h3 className="font-extrabold text-white text-sm tracking-wide">{item.name}</h3>
                          </div>
                          {item.role === 'Resident' && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              <span className={`self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${item.occupancy_status === 'Rented' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' :
                                item.occupancy_status === 'Vacant' ? 'bg-slate-500/15 text-slate-400 border border-slate-500/20' :
                                  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                {item.occupancy_status === 'Rented' ? (item.tenant_type === 'Bachelor' ? 'बैचलर (Bachelor)' : 'किराये पर (Rented)') :
                                  item.occupancy_status === 'Vacant' ? 'खाली (Vacant)' :
                                    'स्व-कब्जा (Self-Occupied)'}
                              </span>
                              {item.occupancy_status === 'Rented' && item.is_legacy_bachelor && (
                                <span className="self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-sm animate-fadeIn">
                                  🛡️ विरासत (Legacy Tenant)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${item.role === 'Admin' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                        item.role === 'Committee' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' :
                        item.role === 'Security' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {getRoleHindi(item.role)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3 text-[10px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-slate-500 shrink-0" />
                        <span>आवंटित फ्लैट: <span className="font-bold text-slate-200">{item.flat_no || 'सुरक्षा/समिति (N/A)'}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-500 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-500 shrink-0" />
                        <span>{item.phone || 'कोई संपर्क नंबर नहीं'}</span>
                      </div>

                      {item.role === 'Resident' && item.occupancy_status === 'Rented' && (item.owner_name || item.owner_phone || item.is_legacy_bachelor) && (
                        <div className="mt-2 p-2 rounded-xl bg-sky-950/20 border border-sky-500/10 text-sky-300">
                          <div className="font-bold uppercase tracking-wider text-[8px] text-sky-400">किरायेदार एवं मालिक जानकारी</div>
                          <div className="mt-1 flex flex-col gap-0.5 text-[9px]">
                            {item.is_legacy_bachelor && (
                              <div className="text-amber-400 font-bold mb-1.5 flex flex-col gap-0.5">
                                <span>🛡️ विरासत किरायेदार (Legacy Tenant):</span>
                                <span className="text-white font-mono text-[8px] bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 w-fit">
                                  {item.exemption_ref || 'RWA Undertaking Signed'}
                                </span>
                              </div>
                            )}
                            {(item.owner_name || item.owner_phone) && (
                              <>
                                <div>मालिक का नाम: <span className="font-bold text-white">{item.owner_name || 'N/A'}</span></div>
                                <div>संपर्क: <span className="font-bold text-white">{item.owner_phone || 'N/A'}</span></div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                    {item.is_approved === false ? (
                      <>
                        <button onClick={() => handleApproveUser(item.id)} className="flex-1 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-1.5 animate-fadeIn">
                          <Check size={12} /> स्वीकार (Approve)
                        </button>
                        <button onClick={() => setDeleteUserId(item.id)} className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all" title="अस्वीकार (Reject)">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setSelectedUser(item)} className="flex-1 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-1.5">
                          <Eye size={12} /> विवरण (View)
                        </button>
                        <button onClick={() => startEditing(item)} className="flex-1 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-1.5">
                          <Edit size={12} /> संपादित करें (Edit)
                        </button>
                        {item.role === 'Resident' && item.is_approved && (
                          <button onClick={() => handleCheckoutUser(item.id)} className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex justify-center items-center gap-1.5" title="चेक-आउट (Vacate Flat)">
                            <Building size={12} /> खाली करें
                          </button>
                        )}
                        <button onClick={() => setDeleteUserId(item.id)} className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* High-Fidelity Interactive Table View with Row Expanders, Clipboard Copy & Pagination */
          <div className="flex flex-col gap-3.5 w-full animate-fadeIn">
            {/* Table Scroll/Interactive Helper Tip banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-violet-600/10 border border-violet-500/20 px-4 py-2.5 rounded-2xl text-[11px] font-bold text-slate-300 gap-2">
              <span className="flex items-center gap-1.5 text-violet-300">
                <Building size={14} className="shrink-0 text-violet-400" />
                <span>निवासी तालिका: कॉलम सॉर्टिंग और त्वरित विस्तारक (Expandable Table) सक्रिय है।</span>
              </span>
              <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-[9px] uppercase tracking-wider">
                दिखाए जा रहे हैं {indexOfFirstItem + 1} से {Math.min(indexOfLastItem, sortedUsers.length)} (कुल {sortedUsers.length} सदस्य)
              </span>
            </div>

            {/* Custom styled scrollable table */}
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {/* Sortable Column Headers */}
                    <th 
                      onClick={() => requestSort('name')}
                      className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 cursor-pointer hover:bg-white/5 transition-all select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>सदस्य / निवासी (Resident)</span>
                        {sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : <span className="opacity-20 text-[8px]">▲▼</span>}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 select-none"
                    >
                      <span>संपर्क विवरण (Contact)</span>
                    </th>
                    <th 
                      onClick={() => requestSort('role')}
                      className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 cursor-pointer hover:bg-white/5 transition-all select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>भूमिका व स्थिति (Role & Status)</span>
                        {sortColumn === 'role' ? (sortDirection === 'asc' ? '▲' : '▼') : <span className="opacity-20 text-[8px]">▲▼</span>}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 select-none"
                    >
                      <span>परिवार & वाहन (Family/Vehicles)</span>
                    </th>
                    <th 
                      onClick={() => requestSort('moveIn')}
                      className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 cursor-pointer hover:bg-white/5 transition-all select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>पहचान & प्रवेश (ID & Move-in)</span>
                        {sortColumn === 'moveIn' ? (sortDirection === 'asc' ? '▲' : '▼') : <span className="opacity-20 text-[8px]">▲▼</span>}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 text-center select-none w-[120px]">
                      <span>कार्रवाई (Actions)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentItems.map((item) => {
                    const isExpanded = expandedRows.has(item.id);
                    const isAadhaarRevealed = revealedAadhaars.has(item.id);
                    
                    // Parse vehicles count safely
                    let vehicleList = [];
                    try {
                      if (item.vehicles) {
                        const parsed = typeof item.vehicles === 'string' ? JSON.parse(item.vehicles) : item.vehicles;
                        if (Array.isArray(parsed)) vehicleList = parsed;
                      }
                    } catch (e) {}

                    if (item.is_vacant_flat) {
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] group animate-fadeIn">
                          {/* Column 1: Flat No (Primary Focus) + Avatar + Label */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {/* Dummy placeholder for expander to align columns */}
                              <div className="w-5 h-5"></div>

                              {/* Prominent High-Visibility Flat No Badge (Vacant Theme) */}
                              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-500/20 text-slate-300 border border-slate-500/35 uppercase tracking-wider shadow-sm select-all shrink-0 animate-pulse-subtle">
                                Flat {item.flat_no}
                              </span>

                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-premium text-slate-500">
                                <Building size={16} />
                              </div>

                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="font-extrabold text-white text-xs block tracking-wide">
                                  रिक्त फ्लैट (Vacant Flat)
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Contact Details */}
                          <td className="px-4 py-4 text-xs text-slate-500">
                            —
                          </td>

                          {/* Column 3: Role & Occupancy Badge */}
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 text-left">
                              <span className="self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-slate-500/15 text-slate-400 border border-slate-500/20">
                                खाली (Vacant)
                              </span>
                            </div>
                          </td>

                          {/* Column 4: Family & Vehicles Count */}
                          <td className="px-4 py-4 text-xs text-slate-500">
                            —
                          </td>

                          {/* Column 5: Privacy-Masked Aadhaar Number & Move-in Date */}
                          <td className="px-4 py-4 text-xs text-slate-500">
                            —
                          </td>

                          {/* Column 6: Action Buttons */}
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => {
                                  setRole('Resident');
                                  setFlatNo(item.flat_no);
                                  setOccupancyStatus('Self-Occupied');
                                  setShowAddForm(true);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1"
                              >
                                <UserPlus size={11} /> सदस्य जोड़ें
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <React.Fragment key={item.id}>
                        <tr className={`hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] group ${isExpanded ? 'bg-white/[0.01]' : ''}`}>
                          {/* Column 1: Flat No (Primary Focus) + Profile image + Resident Name */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {/* Toggle Accordion Expand Icon */}
                              <button 
                                onClick={() => toggleRowExpanded(item.id)}
                                className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={14} className="text-brand-400" /> : <ChevronDown size={14} />}
                              </button>

                              {/* Prominent High-Visibility Flat No Badge */}
                              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/35 uppercase tracking-wider shadow-sm select-all animate-pulse-subtle shrink-0">
                                {item.flat_no ? `Flat ${item.flat_no}` : 'N/A'}
                              </span>

                              {/* Profile Avatar */}
                              <div 
                                onClick={() => setSelectedUser(item)}
                                className="w-10 h-10 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-premium group-hover:border-brand-500/30 transition-colors cursor-pointer"
                              >
                                {item.profile_picture ? (
                                  <img src={item.profile_picture} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-black text-brand-300 uppercase">
                                    {(item.name || ' ')[0]}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-0.5 text-left">
                                <span 
                                  onClick={() => setSelectedUser(item)}
                                  className="font-extrabold text-white text-xs block tracking-wide hover:text-brand-400 transition-colors cursor-pointer"
                                >
                                  {highlightText(item.name, searchQuery)}
                                </span>
                                {item.role !== 'Resident' && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-bold uppercase tracking-wider w-fit mt-0.5">
                                    {getRoleHindi(item.role)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Contact Details with copy to clipboard buttons */}
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 text-left text-xs">
                              {/* Email row */}
                              <div className="flex items-center gap-1 group/btn">
                                <a 
                                  href={`mailto:${item.email}`}
                                  className="text-slate-200 font-medium hover:text-brand-400 transition-colors truncate max-w-[150px]"
                                  title="Send Email"
                                >
                                  {highlightText(item.email, searchQuery)}
                                </a>
                                <button 
                                  onClick={() => handleCopyToClipboard(item.email, item.id, 'email')}
                                  className="opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 p-0.5 text-slate-500 hover:text-white rounded transition-all"
                                  title="Copy Email"
                                >
                                  {copiedId === `${item.id}-email` ? <Check size={10} className="text-emerald-400 font-bold" /> : <Copy size={10} />}
                                </button>
                              </div>

                              {/* Phone row */}
                              <div className="flex items-center gap-1 group/btn mt-0.5">
                                <a 
                                  href={`tel:${item.phone}`}
                                  className="text-[10px] text-slate-400 font-semibold hover:text-emerald-400 transition-colors"
                                  title="Call Member"
                                >
                                  📞 {item.phone ? highlightText(item.phone, searchQuery) : '-'}
                                </a>
                                {item.phone && (
                                  <button 
                                    onClick={() => handleCopyToClipboard(item.phone, item.id, 'phone')}
                                    className="opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 p-0.5 text-slate-500 hover:text-white rounded transition-all"
                                    title="Copy Phone"
                                  >
                                    {copiedId === `${item.id}-phone` ? <Check size={10} className="text-emerald-400 font-bold" /> : <Copy size={10} />}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Column 3: Role & Occupancy Badge */}
                          <td className="px-4 py-4">
                            {item.role === 'Resident' ? (
                              <div className="flex flex-col gap-1 text-left">
                                <span className={`self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                                  item.occupancy_status === 'Rented' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' :
                                  item.occupancy_status === 'Vacant' ? 'bg-slate-500/15 text-slate-400 border border-slate-500/20' :
                                  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {item.occupancy_status === 'Rented' ? (item.tenant_type === 'Bachelor' ? 'बैचलर (Bachelor)' : 'किरायेदार (Tenant)') :
                                  item.occupancy_status === 'Vacant' ? 'खाली (Vacant)' :
                                  'मालिक (Owner)'}
                                </span>
                                {item.occupancy_status === 'Rented' && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${item.lease_agreement_submitted ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                                      📜 एग्रीमेंट: {item.lease_agreement_submitted ? 'हाँ' : 'नहीं'}
                                    </span>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${item.police_verification_status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                                      👮 सत्यापन: {item.police_verification_status === 'verified' ? 'हाँ' : 'लंबित'}
                                    </span>
                                  </div>
                                )}
                                {item.occupancy_status === 'Rented' && item.is_legacy_bachelor && (
                                  <span className="self-start text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-sm animate-fadeIn" title={`घोषणा-पत्र: ${item.exemption_ref || 'N/A'}`}>
                                    🛡️ विरासत (Legacy)
                                  </span>
                                )}
                                {item.occupancy_status === 'Rented' && (item.owner_name || item.owner_phone) && (
                                  <span className="text-[9px] text-sky-400 font-medium cursor-help" title={`मालिक: ${item.owner_name} (${item.owner_phone})`}>
                                    👤 मालिक: {item.owner_name || 'N/A'}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[10px] italic">कमेटी / स्टाफ</span>
                            )}
                          </td>

                          {/* Column 4: Family & Vehicles Count */}
                          <td className="px-4 py-4 text-xs">
                            <div 
                              onClick={() => toggleRowExpanded(item.id)}
                              className="flex flex-col gap-0.5 text-left text-slate-300 cursor-pointer hover:text-brand-400 transition-all"
                              title="Click to view detailed Roster details below"
                            >
                              <span className="font-semibold text-slate-200">👨‍👩‍👧‍👦 {item.family_members || '0'} सदस्य</span>
                              <span className="text-[10px] text-slate-400 font-medium">🚗 {vehicleList.length} पंजीकृत वाहन</span>
                            </div>
                          </td>

                          {/* Column 5: Privacy-Masked Aadhaar Number & Move-in Date */}
                          <td className="px-4 py-4 text-xs text-slate-400">
                            <div className="flex flex-col gap-0.5 text-left">
                              {/* Aadhaar with privacy toggle */}
                              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
                                <span>🆔</span>
                                <span>
                                  {item.aadhaar_number 
                                    ? (isAadhaarRevealed ? item.aadhaar_number : `•••• •••• ${item.aadhaar_number.slice(-4)}`) 
                                    : '-'}
                                </span>
                                {item.aadhaar_number && (
                                  <button
                                    onClick={() => toggleAadhaarRevealed(item.id)}
                                    className="text-slate-500 hover:text-slate-200 transition-colors p-0.5"
                                    title={isAadhaarRevealed ? "Hide ID" : "Reveal ID"}
                                  >
                                    {isAadhaarRevealed ? <EyeOff size={10} /> : <Eye size={10} />}
                                  </button>
                                )}
                              </div>
                              
                              {/* Move in date */}
                              <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                                📅 प्रवेश: {item.move_in_date ? new Date(item.move_in_date).toLocaleDateString() : '-'}
                              </span>
                            </div>
                          </td>

                          {/* Column 6: Action Buttons */}
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {item.is_approved === false ? (
                                <>
                                  <button onClick={() => handleApproveUser(item.id)} className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all" title="अनुमोदन स्वीकार करें (Approve)">
                                    <Check size={12} />
                                  </button>
                                  <button onClick={() => setDeleteUserId(item.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all" title="अस्वीकार करें (Reject)">
                                    <X size={12} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setSelectedUser(item)} className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl transition-all" title="विवरण देखें (View Details)">
                                    <Eye size={12} />
                                  </button>
                                  <button onClick={() => startEditing(item)} className="p-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-xl transition-all" title="संपादित करें (Edit)">
                                    <Edit size={12} />
                                  </button>
                                  {item.role === 'Resident' && item.is_approved && (
                                    <button onClick={() => handleCheckoutUser(item.id)} className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl transition-all" title="चेक-आउट: फ्लैट खाली करें (Vacate Flat)">
                                      <Building size={12} />
                                    </button>
                                  )}
                                  <button onClick={() => setDeleteUserId(item.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all" title="हटाएं (Delete)">
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Accordion Expand Row: Renders Family names & vehicles registered */}
                        {isExpanded && (
                          <tr className="bg-slate-950/40 animate-fadeIn">
                            <td colSpan={6} className="px-8 py-4 border-l-2 border-brand-500">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
                                {/* Section A: Family members */}
                                <div className="flex flex-col gap-2">
                                  <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <span>👨‍👩‍👧‍👦</span> परिवार के सदस्य ({item.family_members || 0})
                                  </h4>
                                  {item.family_member_names ? (
                                    <div className="flex flex-col gap-1.5 mt-1">
                                      {(() => {
                                        try {
                                          const names = typeof item.family_member_names === 'string'
                                            ? JSON.parse(item.family_member_names)
                                            : item.family_member_names;
                                          return Array.isArray(names) && names.length > 0 ? (
                                            names.map((n, i) => (
                                              <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl">
                                                <span className="font-bold text-slate-200">👤 {n.name}</span>
                                                <span className="text-slate-400 font-mono text-[10px]">{n.phone || '-'}</span>
                                              </div>
                                            ))
                                          ) : <span className="text-slate-500 italic">कोई परिवार सदस्य दर्ज नहीं</span>;
                                        } catch (e) {
                                          return <span className="text-slate-400">{item.family_member_names}</span>;
                                        }
                                      })()}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 italic mt-1">कोई परिवार सदस्य दर्ज नहीं</span>
                                  )}
                                </div>

                                {/* Section B: Registered Vehicles */}
                                <div className="flex flex-col gap-2">
                                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <span>🚗</span> पंजीकृत वाहन ({vehicleList.length})
                                  </h4>
                                  {vehicleList.length > 0 ? (
                                    <div className="flex flex-col gap-1.5 mt-1">
                                      {vehicleList.map((v, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                          <span 
                                            className={`px-2.5 py-1.5 rounded-xl font-extrabold flex items-center justify-between gap-1.5 border ${
                                              v.type === 'Car' 
                                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                                                : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300'
                                            }`}
                                          >
                                            <span className="flex items-center gap-1">
                                              <span>{v.type === 'Car' ? '🚗 Car' : '🛵 Bike'}</span>
                                              <span className="font-mono text-white text-[10px]">{v.number}</span>
                                            </span>
                                            
                                            {/* Sticker Badge Indicator */}
                                            {v.sticker ? (
                                              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/30 uppercase font-black tracking-widest" title="Society Sticker Issued">
                                                🎫 Sticker Ok
                                              </span>
                                            ) : (
                                              <span className="text-[8px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded-md border border-rose-500/20 uppercase font-black tracking-widest" title="No Society Sticker Issued">
                                                ⚠️ No Sticker
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 italic mt-1">कोई पंजीकृत वाहन नहीं</span>
                                  )}
                                </div>

                                {/* Section C: Emergency Contacts & Lease Info */}
                                <div className="flex flex-col gap-2">
                                  <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <span>🚨</span> आपातकालीन एवं पट्टा विवरण
                                  </h4>
                                  
                                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col gap-2 mt-1">
                                    {/* Emergency contact */}
                                    <div className="flex flex-col">
                                      <span className="text-[9px] uppercase text-slate-500 font-bold">आपातकालीन संपर्क (Emergency Contact):</span>
                                      <span className="font-semibold text-slate-200 mt-0.5">
                                        {item.emergency_contact_name 
                                          ? `👤 ${item.emergency_contact_name} (${item.emergency_contact_phone || 'N/A'})` 
                                          : 'कोई जानकारी नहीं (None)'}
                                      </span>
                                    </div>
                                    
                                    {/* Lease duration for tenants */}
                                    {item.occupancy_status === 'Rented' && (
                                      <div className="flex flex-col border-t border-white/5 pt-2 mt-1 gap-1.5 text-[11px]">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[9px] uppercase text-slate-500 font-bold">पट्टा अवधि (Lease Period):</span>
                                          <span className="font-semibold text-sky-400">📅 {item.lease_duration || '11 months (Default)'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
                                          <span className="text-[9px] uppercase text-slate-500 font-bold">किराया एग्रीमेंट (Agreement):</span>
                                          <span className={`font-extrabold uppercase tracking-wide text-[9px] px-2 py-0.5 rounded ${item.lease_agreement_submitted ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                                            {item.lease_agreement_submitted ? 'जमा है (Yes)' : 'लंबित (No)'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
                                          <span className="text-[9px] uppercase text-slate-500 font-bold">पुलिस सत्यापन (Police Status):</span>
                                          <span className={`font-extrabold uppercase tracking-wide text-[9px] px-2 py-0.5 rounded ${item.police_verification_status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                                            {item.police_verification_status === 'verified' ? 'पूर्ण (Verified)' : 'लंबित (Pending)'}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {item.occupancy_status === 'Rented' && item.is_legacy_bachelor && (
                                      <div className="flex flex-col border-t border-white/5 pt-2 mt-1 animate-fadeIn">
                                        <span className="text-[9px] uppercase text-amber-500 font-bold">🛡️ विरासत श्रेणी (Legacy Category):</span>
                                        <span className="font-bold text-amber-400 mt-0.5 text-[10px] flex flex-col gap-0.5 text-left">
                                          <span>विरासत अविवाहित किरायेदार (Legacy Bachelor)</span>
                                          <span className="text-[9px] text-slate-300 font-medium font-mono">संदर्भ: {item.exemption_ref || 'घोषणा-पत्र संलग्न'}</span>
                                        </span>
                                      </div>
                                    )}

                                    {/* Pet owned status badge */}
                                    <div className="flex flex-col border-t border-white/5 pt-2 mt-1 animate-fadeIn">
                                      <span className="text-[9px] uppercase text-slate-500 font-bold">पालतू जानवर (Pet Status):</span>
                                      <span className="font-bold text-slate-200 mt-0.5 text-[11px] flex items-center gap-1">
                                        {item.has_pet 
                                          ? <span className="text-violet-400">🐾 {item.pet_details || 'हाँ (Yes)'}</span> 
                                          : <span className="text-slate-500">🚫 कोई पालतू पशु नहीं (No Pets)</span>}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scale-Friendly Fluid Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <span className="text-xs text-slate-400 font-semibold">
                  Page <span className="text-slate-200 font-extrabold">{currentPage}</span> of <span className="text-slate-200 font-extrabold">{totalPages}</span>
                </span>
                
                <div className="flex items-center gap-1">
                  {/* Previous button */}
                  <button
                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ◀ Prev
                  </button>

                  {/* Page number buttons */}
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => paginate(num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        currentPage === num
                          ? 'bg-brand-600 text-white shadow-premium'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  {/* Next button */}
                  <button
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <Users size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई सदस्य नहीं मिला</h3>
          <p className="text-xs text-slate-400 mt-1">कृपया अपनी खोज को बदलें या एक नया सदस्य पंजीकृत करें।</p>
        </div>
      )}

      {/* Edit User Modal - Comprehensive Administrative Portal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 text-slate-300 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin flex flex-col gap-4">
            <button onClick={() => setEditUser(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-1.5">
              <span>📝</span> सदस्य का विवरण संपादित करें (Edit Member Portal)
            </h3>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
              {/* SECTION 1: Profile picture */}
              <div className="flex items-center gap-3.5 bg-slate-950/40 border border-white/5 rounded-2xl p-3">
                <div className="w-14 h-14 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center overflow-hidden shrink-0 relative group">
                  {editUser.profile_picture ? (
                    <img src={editUser.profile_picture} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-brand-400">👤</span>
                  )}
                  {editUser.profile_picture && (
                    <button 
                      type="button" 
                      onClick={() => setEditUser({ ...editUser, profile_picture: '' })} 
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
                    id="edit-profile-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditUser({ ...editUser, profile_picture: reader.result }); // Base64 string
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-profile-upload"
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition-colors shadow-premium w-fit"
                  >
                    नया फोटो बदलें / अपलोड करें
                  </label>
                  <p className="text-[9px] text-slate-500">PNG, JPG या GIF। फोटो सीधे डेटाबेस में सहेजी जाएगी।</p>
                </div>
              </div>

              {/* SECTION 2: Basic Contact Fields */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-left">👤 बुनियादी जानकारी (Basic Info)</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">पूरा नाम (Full Name)</label>
                    <input type="text" required value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">फ़ोन नंबर (Phone)</label>
                    <input type="tel" value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">ईमेल पता (Email Address)</label>
                    <input type="email" required value={editUser.email || ''} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">आधार नंबर (Aadhaar Number)</label>
                    <input type="text" placeholder="1234 5678 9012" value={editUser.aadhaar_number || ''} onChange={(e) => setEditUser({ ...editUser, aadhaar_number: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">जेंडर (Gender)</label>
                    <select value={editUser.gender || 'Male'} onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:border-brand-500 outline-none">
                      <option value="Male">पुरुष (Male)</option>
                      <option value="Female">महिला (Female)</option>
                      <option value="Other">अन्य (Other)</option>
                    </select>
                  </div>
                </div>

                {/* Admin Password Override Upgraded */}
                <div className="flex flex-col gap-3 mt-1 border-t border-white/5 pt-3 text-left w-full">
                  <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">🔒 पासवर्ड प्रबंधन (Resident Password Management)</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">लॉगिन पासवर्ड बदलें (New Password)</label>
                      <div className="relative">
                        <input 
                          type={showAdminEditPassword ? "text" : "password"} 
                          placeholder="बदलाव न करने के लिए खाली छोड़ें" 
                          value={editUser.password || ''} 
                          onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} 
                          className="bg-slate-950 border border-white/10 rounded-xl pl-3 pr-20 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none w-full" 
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setShowAdminEditPassword(!showAdminEditPassword)}
                            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                            title={showAdminEditPassword ? "छिपाएं" : "दिखाएं"}
                          >
                            {showAdminEditPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newRand = generateRandomPassword();
                              setEditUser({ ...editUser, password: newRand });
                              setShowAdminEditPassword(true);
                            }}
                            className="text-brand-400 hover:text-brand-300 transition-colors p-1"
                            title="सुरक्षित रैंडम पासवर्ड जनरेट करें"
                          >
                            <Sparkles size={13} />
                          </button>
                        </div>
                      </div>
                      {editUser.password && editUser.password.length < 6 && (
                        <span className="text-[9px] text-rose-400 mt-0.5">⚠️ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 justify-end pb-1.5">
                      {editUser.password ? (
                        <div className="flex items-center gap-2 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              const shareText = `माँ कौशल्या अपार्टमेंट (RWA):\nनिवासी: ${editUser.name}\nफ्लैट: ${editUser.flat_no || 'N/A'}\nलॉगिन ईमेल: ${editUser.email}\nआपका नया पासवर्ड है: ${editUser.password}\nकृपया तुरंत लॉगिन करें।`;
                              navigator.clipboard.writeText(shareText);
                              setCopiedPasswordText(true);
                              setTimeout(() => setCopiedPasswordText(false), 2000);
                            }}
                            className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/25 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            {copiedPasswordText ? (
                              <><Check size={11} className="text-emerald-400" /> कॉपी हो गया!</>
                            ) : (
                              <><Copy size={11} /> विवरण कॉपी करें</>
                            )}
                          </button>
                          <a
                            href={`https://wa.me/${editUser.phone ? editUser.phone.replace(/[^0-9]/g, '') : ''}?text=${encodeURIComponent(
                              `माँ कौशल्या अपार्टमेंट (RWA):\nनिवासी: ${editUser.name}\nलॉगिन ईमेल: ${editUser.email}\nआपका नया पासवर्ड है: ${editUser.password}\nकृपया तुरंत लॉगिन करें।`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                          >
                            WhatsApp शेयर
                          </a>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-500 italic">
                          * यदि आप इस सदस्य का लॉगिन पासवर्ड रीसेट करना चाहते हैं, तो नया पासवर्ड दर्ज करें या ✨ आइकॉन पर क्लिक करके जनरेट करें।
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Flat & Occupancy Details */}
              <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-left">🏢 फ्लैट व कब्जा स्थिति (Flat & Occupancy Details)</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">भूमिका (Role)</label>
                    <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:border-brand-500 outline-none">
                      <option value="Resident">निवासी (Resident)</option>
                      <option value="Committee">समिति सदस्य (Committee Member)</option>
                      <option value="Admin">मुख्य एडमिन (Admin)</option>
                      <option value="Security">सुरक्षा (Security)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">आवंटित फ्लैट (Flat No.)</label>
                    <select disabled={editUser.role !== 'Resident'} required={editUser.role === 'Resident'} value={editUser.flat_no || ''} onChange={(e) => setEditUser({ ...editUser, flat_no: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:border-brand-500 outline-none disabled:opacity-40">
                      <option value="">कोई नहीं</option>
                      {SOCIETY_FLATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">प्रवेश तिथि (Move-in Date)</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={editUser.move_in_date ? editUser.move_in_date.substring(0, 10) : ''} 
                        onChange={(e) => setEditUser({ ...editUser, move_in_date: e.target.value })} 
                        onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                        className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none w-full cursor-pointer [color-scheme:dark]" 
                      />
                      <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {editUser.role === 'Resident' && (
                  <div className="flex flex-col gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 text-left">कब्जा स्थिति (Occupancy Status)</label>
                        <select
                          value={editUser.occupancy_status || 'Self-Occupied'}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setEditUser({ ...editUser, occupancy_status: newStatus });
                          }}
                          className="bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:border-brand-500 outline-none"
                        >
                          <option value="Self-Occupied">स्व-कब्जा (Self-Occupied)</option>
                          <option value="Rented">किराये पर (Rented)</option>
                          <option value="Vacant">खाली (Vacant)</option>
                        </select>
                        {editUser.occupancy_status === 'Vacant' && (
                          <div className="mt-1 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] text-amber-400 flex items-start gap-1.5">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>सेव करने पर फ्लैट नंबर, मालिक विवरण और पट्टा जानकारी स्वचालित हट जाएगी। (Flat number and lease details will be cleared automatically)</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 text-left">पट्टा अवधि (Lease Period)</label>
                        <input type="text" placeholder="उदा: 11 months" disabled={editUser.occupancy_status !== 'Rented'} value={editUser.lease_duration || ''} onChange={(e) => setEditUser({ ...editUser, lease_duration: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none disabled:opacity-40" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 text-left">पट्टा समाप्ति तिथि (Lease Expiry)</label>
                        <div className="relative">
                          <input
                            type="date"
                            disabled={editUser.occupancy_status !== 'Rented'}
                            value={editUser.lease_expiry_date ? editUser.lease_expiry_date.substring(0, 10) : ''}
                            onChange={(e) => setEditUser({ ...editUser, lease_expiry_date: e.target.value })}
                            onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
                            className="bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none w-full cursor-pointer [color-scheme:dark] disabled:opacity-40"
                          />
                          <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Edit Pets Information Subform */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl animate-fadeIn text-left mt-3">
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xl">🐾</span>
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] font-bold uppercase text-slate-200">पालतू जानवर (Pet Owned?)</label>
                          <p className="text-[9px] text-slate-400">क्या परिवार के पास कोई पालतू पशु है?</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 w-fit">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="edit-has-pet"
                              checked={editUser.has_pet === true}
                              onChange={() => setEditUser({ ...editUser, has_pet: true })}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>हाँ (Yes)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                            <input
                              type="radio"
                              name="edit-has-pet"
                              checked={editUser.has_pet === false}
                              onChange={() => setEditUser({ ...editUser, has_pet: false, pet_details: '' })}
                              className="accent-brand-500 w-4 h-4 cursor-pointer"
                            />
                            <span>नहीं (No)</span>
                          </label>
                        </div>

                        {editUser.has_pet && (
                          <div className="flex-1 flex flex-col gap-1 w-full animate-fadeIn">
                            <input
                              type="text"
                              required
                              placeholder="पालतू पशु का प्रकार व संख्या (जैसे: 1 कुत्ता, 2 बिल्लियां)"
                              value={editUser.pet_details || ''}
                              onChange={(e) => setEditUser({ ...editUser, pet_details: e.target.value })}
                              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-500 outline-none w-full transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {editUser.occupancy_status === 'Rented' && (
                      <div className="flex flex-col gap-3.5 border-t border-white/5 pt-3 mt-1 animate-fadeIn">
                        {/* Tenant Type selection */}
                        <div className="flex flex-col gap-1 animate-fadeIn mb-2">
                          <label className="text-xs font-bold uppercase text-slate-400">किरायेदार का प्रकार (Tenant Type)</label>
                          <select
                            value={editUser.tenant_type || 'Family'}
                            onChange={(e) => setEditUser({ ...editUser, tenant_type: e.target.value })}
                            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors appearance-none"
                          >
                            <option value="Family">परिवार (Family)</option>
                            <option value="Bachelor">बैचलर / फ्लैटमेट्स (Bachelor)</option>
                          </select>
                        </div>
                        {/* Tenant Category Toggle for RWA Admin Override */}
                        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-fadeIn text-left">
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xl">🛡️</span>
                            <div className="flex flex-col gap-0.5">
                              <label className="text-xs font-bold uppercase text-slate-200">किरायेदार श्रेणी (Tenant Category)</label>
                              <p className="text-[10px] text-slate-400">विरासत अविवाहित किरायेदार (Legacy Bachelor)?</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name="edit-is-legacy"
                                  checked={editUser.is_legacy_bachelor === false}
                                  onChange={() => setEditUser({ ...editUser, is_legacy_bachelor: false, exemption_ref: '' })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>सामान्य परिवार (Family)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                                <input
                                  type="radio"
                                  name="edit-is-legacy"
                                  checked={editUser.is_legacy_bachelor === true}
                                  onChange={() => setEditUser({ ...editUser, is_legacy_bachelor: true })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>विरासत अविवाहित (Legacy Bachelor)</span>
                              </label>
                            </div>

                            {editUser.is_legacy_bachelor && (
                              <div className="flex-1 flex flex-col gap-1 w-full animate-fadeIn">
                                <input
                                  type="text"
                                  required
                                  placeholder="घोषणा-पत्र संदर्भ क्रमांक व दिनांक (उदा: RWA-2024-U72)"
                                  value={editUser.exemption_ref || ''}
                                  onChange={(e) => setEditUser({ ...editUser, exemption_ref: e.target.value })}
                                  className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none w-full transition-colors"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lease Agreement and Police Verification switches for Renter (Edit) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl animate-fadeIn text-left mb-2 mt-3">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-slate-300">किराया एग्रीमेंट (Lease Agreement Submitted?)</label>
                            <div className="flex items-center gap-4 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name="edit-lease-agreement"
                                  checked={editUser.lease_agreement_submitted === true}
                                  onChange={() => setEditUser({ ...editUser, lease_agreement_submitted: true })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>हाँ (Yes)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                                <input
                                  type="radio"
                                  name="edit-lease-agreement"
                                  checked={editUser.lease_agreement_submitted === false}
                                  onChange={() => setEditUser({ ...editUser, lease_agreement_submitted: false })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>नहीं (No)</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-slate-300">पुलिस सत्यापन (Police Verification Status)</label>
                            <div className="flex items-center gap-4 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 w-fit">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  name="edit-police-verification"
                                  checked={editUser.police_verification_status === 'verified'}
                                  onChange={() => setEditUser({ ...editUser, police_verification_status: 'verified' })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>सत्यापित (Verified)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none border-l border-white/10 pl-4">
                                <input
                                  type="radio"
                                  name="edit-police-verification"
                                  checked={editUser.police_verification_status === 'pending'}
                                  onChange={() => setEditUser({ ...editUser, police_verification_status: 'pending' })}
                                  className="accent-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span>लंबित (Pending)</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 text-left">फ्लैट मालिक का नाम (Owner Name)</label>
                            <input type="text" required value={editUser.owner_name || ''} onChange={(e) => setEditUser({ ...editUser, owner_name: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 text-left">मालिक का फोन (Owner Phone)</label>
                            <input type="tel" required value={editUser.owner_phone || ''} onChange={(e) => setEditUser({ ...editUser, owner_phone: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 4: Emergency Contacts */}
              <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-left">🚨 आपातकालीन संपर्क (Emergency Contacts)</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">संपर्क व्यक्ति का नाम (Emergency Name)</label>
                    <input type="text" placeholder="आपातकालीन संपर्क नाम" value={editUser.emergency_contact_name || ''} onChange={(e) => setEditUser({ ...editUser, emergency_contact_name: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 text-left">आपातकालीन फ़ोन (Emergency Phone)</label>
                    <input type="tel" placeholder="+9198765432" value={editUser.emergency_contact_phone || ''} onChange={(e) => setEditUser({ ...editUser, emergency_contact_phone: e.target.value })} className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:border-brand-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Family & Vehicles Subforms */}
              {editUser.role === 'Resident' && (
                <>
                  {/* Family Members Subform */}
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-left">👨‍👩‍👧‍👦 परिवार के सदस्य विवरण (Family Details)</p>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400">कुल सदस्य आकार:</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="15" 
                          value={editUser.family_members || ''} 
                          onChange={handleEditFamilyMembersChange} 
                          className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-brand-300 font-bold outline-none w-16 text-center focus:border-brand-500" 
                        />
                      </div>
                    </div>

                    {editUser.family_member_names_arr && editUser.family_member_names_arr.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-brand-500/5 border border-brand-500/20 rounded-2xl animate-fadeIn">
                        {editUser.family_member_names_arr.map((member, idx) => (
                          <div key={idx} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2">
                            <p className="text-[9px] font-extrabold uppercase text-brand-400 tracking-wider text-left">सदस्य {idx + 1}</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-bold uppercase text-slate-500 text-left">नाम (Name)</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="पूरा नाम"
                                  value={member.name || ''}
                                  onChange={(e) => handleEditFamilyMemberChange(idx, 'name', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-brand-500 outline-none w-full"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-bold uppercase text-slate-500 text-left">फ़ोन (Phone)</label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="मोबाइल नंबर"
                                  value={member.phone || ''}
                                  onChange={(e) => handleEditFamilyMemberChange(idx, 'phone', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-brand-500 outline-none w-full"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-bold uppercase text-slate-500 text-left">जेंडर</label>
                                <select
                                  value={member.gender || 'Male'}
                                  onChange={(e) => handleEditFamilyMemberChange(idx, 'gender', e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2 py-2 text-slate-200 text-[10px] focus:border-brand-500 outline-none w-full appearance-none"
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
                    ) : (
                      <p className="text-[10px] text-slate-500 italic text-left">कोई परिवार सदस्य सूची नहीं है। परिवार आकार बढ़ाकर नाम दर्ज करें।</p>
                    )}
                  </div>

                  {/* Vehicles Registered Subform */}
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-left">🚗 पंजीकृत वाहन विवरण (Registered Vehicles)</p>
                      <button
                        type="button"
                        onClick={handleEditAddVehicle}
                        className="text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/20 transition-colors"
                      >
                        + वाहन जोड़ें (Add Vehicle)
                      </button>
                    </div>

                    {editUser.vehicles_arr && editUser.vehicles_arr.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-fadeIn">
                        {editUser.vehicles_arr.map((veh, idx) => (
                          <div key={idx} className="flex flex-col gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                              <select
                                value={veh.type}
                                onChange={(e) => handleEditVehicleChange(idx, 'type', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-emerald-500 outline-none w-1/3"
                              >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike / Scooty</option>
                              </select>
                              <input
                                type="text"
                                required
                                placeholder="उदा: CG04 AB 1234"
                                value={veh.number}
                                onChange={(e) => handleEditVehicleChange(idx, 'number', e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[10px] focus:border-emerald-500 outline-none flex-1 font-mono uppercase"
                              />
                              <button
                                type="button"
                                onClick={() => handleEditRemoveVehicle(idx)}
                                className="text-rose-400 hover:text-rose-300 text-xs px-2 py-1 hover:bg-rose-500/10 rounded"
                              >
                                ✕
                              </button>
                            </div>
                            
                            {/* Sticker Issued Checkbox */}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-slate-300 hover:text-white transition-colors w-fit self-end">
                              <input
                                type="checkbox"
                                checked={veh.sticker === true}
                                onChange={(e) => handleEditVehicleChange(idx, 'sticker', e.target.checked)}
                                className="accent-brand-500 w-3.5 h-3.5 cursor-pointer"
                              />
                              <span>🎫 स्टीकर जारी (Sticker Issued)</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic text-left">कोई पंजीकृत वाहन नहीं है।</p>
                    )}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setEditUser(null)} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase shadow-premium transition-all"
                >
                  सहेजें (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">क्या आप सुनिश्चित हैं?</h3>
            <p className="text-xs text-slate-400 mb-6">यह सदस्य स्थायी रूप से सिस्टम से हटा दिया जाएगा। यह कार्रवाई पूर्ववत नहीं की जा सकती।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteUserId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
                रद्द करें
              </button>
              <button onClick={handleDeleteUser} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-premium hover:shadow-premium-hover">
                हाँ, हटाएँ (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-300">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
              {/* Premium Detailed Profile Avatar */}
              <div className="w-14 h-14 rounded-full border border-white/10 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 shadow-premium">
                {selectedUser.profile_picture ? (
                  <img src={selectedUser.profile_picture} alt={selectedUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold uppercase">
                    {(selectedUser.name || ' ')[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wide">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{getRoleHindi(selectedUser.role)} | {selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-left">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">फोन नंबर</span>
                <span className="text-slate-200 mt-1">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">जेंडर (Gender)</span>
                <span className="text-slate-200 mt-1">{selectedUser.gender === 'Male' ? 'पुरुष (Male)' : selectedUser.gender === 'Female' ? 'महिला (Female)' : selectedUser.gender === 'Other' ? 'अन्य (Other)' : 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">फ्लैट नंबर</span>
                <span className="text-brand-300 font-bold mt-1">{selectedUser.flat_no || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">कब्जा स्थिति</span>
                <span className="text-slate-200 mt-1">{selectedUser.occupancy_status || 'Self-Occupied'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">पंजीकरण तिथि</span>
                <span className="text-slate-200 mt-1">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            {selectedUser.role === 'Resident' && selectedUser.occupancy_status === 'Rented' && (
              <div className="mt-5 p-4 rounded-xl bg-sky-950/20 border border-sky-500/10 text-left animate-fadeIn flex flex-col gap-3">
                <div>
                  <h4 className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider mb-2">फ्लैट किरायेदार व सत्यापन विवरण (Tenant Verification Status)</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      📜 एग्रीमेंट: 
                      <span className={`font-extrabold uppercase tracking-wide text-[8px] px-1.5 py-0.5 rounded ${selectedUser.lease_agreement_submitted ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                        {selectedUser.lease_agreement_submitted ? 'जमा है (Yes)' : 'लंबित (No)'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      👮 पुलिस सत्यापन: 
                      <span className={`font-extrabold uppercase tracking-wide text-[8px] px-1.5 py-0.5 rounded ${selectedUser.police_verification_status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                        {selectedUser.police_verification_status === 'verified' ? 'पूर्ण (Verified)' : 'लंबित (Pending)'}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <h4 className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider mb-2">फ्लैट मालिक की जानकारी (Owner Details)</h4>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>नाम: <span className="text-white font-semibold">{selectedUser.owner_name || 'N/A'}</span></span>
                    <span>संपर्क: <span className="text-white font-semibold">{selectedUser.owner_phone || 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            )}

            {selectedUser.role === 'Resident' && selectedUser.occupancy_status === 'Rented' && selectedUser.is_legacy_bachelor && (
              <div className="mt-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-left animate-fadeIn">
                <h4 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🛡️ RWA विरासत किरायेदार प्रमाण (Legacy Tenant Approval)</span>
                </h4>
                <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                  यह किरायेदार पूर्व नियमों के तहत पंजीकृत अविवाहित श्रेणी में रहने हेतु RWA द्वारा अधिकृत घोषित किया गया है।
                </p>
                <div className="text-xs text-slate-300">
                  <span>घोषणा-पत्र संदर्भ: <span className="text-white font-semibold">{selectedUser.exemption_ref || 'घोषणा-पत्र संलग्न (Approved)'}</span></span>
                </div>
              </div>
            )}
            {/* Extended Details */}
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3 text-xs text-left">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">पंजीकरण अतिरिक्त विवरण (Registration Details)</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">आधार नंबर</span>
                  <span className="text-slate-300 font-semibold">{selectedUser.aadhaar_number || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">आपातकालीन संपर्क</span>
                  <span className="text-slate-300 font-semibold">
                    {selectedUser.emergency_contact_name || 'N/A'}
                    {selectedUser.emergency_contact_phone ? ` - ${selectedUser.emergency_contact_phone}` : ''}
                  </span>
                </div>
              </div>

              {selectedUser.role === 'Resident' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">प्रवेश तिथि (Move-in)</span>
                      <span className="text-slate-300 font-semibold">{selectedUser.move_in_date ? new Date(selectedUser.move_in_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {selectedUser.occupancy_status === 'Rented' && (
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">पट्टा अवधि (Lease)</span>
                        <span className="text-slate-300 font-semibold">{selectedUser.lease_duration || 'N/A'}</span>
                      </div>
                    )}
                    {selectedUser.occupancy_status === 'Rented' && selectedUser.lease_expiry_date && (
                      <div className="flex flex-col col-span-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">पट्टा समाप्ति तिथि (Lease Expiry)</span>
                        <span className={`font-semibold text-sm ${new Date(selectedUser.lease_expiry_date) < new Date() ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {new Date(selectedUser.lease_expiry_date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {new Date(selectedUser.lease_expiry_date) < new Date() && ' ⚠️ समाप्त'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Paltoo Pashu details in Detailed Modal */}
                  <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">पालतू जानवर (Pet Status)</span>
                    <span className="text-slate-300 font-bold text-xs mt-0.5 flex items-center gap-1">
                      {selectedUser.has_pet 
                        ? <span className="text-violet-400">🐾 {selectedUser.pet_details || 'हाँ (Yes)'}</span> 
                        : <span className="text-slate-500">🚫 कोई पालतू पशु नहीं (No Pets)</span>}
                    </span>
                  </div>

                  {/* Family Members names and phones */}
                  <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">परिवार के सदस्य ({selectedUser.family_members || 0})</span>
                    {selectedUser.family_member_names ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(() => {
                          try {
                            const names = typeof selectedUser.family_member_names === 'string'
                              ? JSON.parse(selectedUser.family_member_names)
                              : selectedUser.family_member_names;
                            return Array.isArray(names) && names.length > 0 ? (
                              names.map((n, i) => {
                                if (typeof n === 'object' && n !== null) {
                                  return (
                                    <span key={i} className="text-[10px] px-2.5 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-xl font-semibold flex items-center gap-1.5 animate-fadeIn">
                                      👤 {n.name} <span className="text-slate-500">|</span> <span className="text-slate-400 font-bold">📞 {n.phone || 'N/A'}</span>
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span key={i} className="text-[10px] px-2 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-xl font-semibold animate-fadeIn">👤 {n}</span>
                                  );
                                }
                              })
                            ) : <span className="text-slate-500 italic text-[10px]">कोई नाम नहीं</span>;
                          } catch (e) {
                            return <span className="text-slate-300">{selectedUser.family_member_names}</span>;
                          }
                        })()}
                      </div>
                    ) : <span className="text-slate-500 italic text-[10px]">कोई जानकारी नहीं</span>}
                  </div>

                  {/* Vehicles */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">पंजीकृत वाहन</span>
                    {selectedUser.vehicles ? (
                      <div className="flex flex-col gap-2 mt-1">
                        {(() => {
                          try {
                            const vehiclesList = typeof selectedUser.vehicles === 'string'
                              ? JSON.parse(selectedUser.vehicles)
                              : selectedUser.vehicles;
                            return Array.isArray(vehiclesList) && vehiclesList.length > 0 ? (
                              vehiclesList.map((v, i) => (
                                <span key={i} className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg font-bold flex items-center justify-between gap-2.5">
                                  <span className="flex items-center gap-1">
                                    🚗 {v.type === 'Car' ? 'Four-Wheeler' : 'Two-Wheeler'}: <span className="text-white font-mono">{v.number}</span>
                                  </span>
                                  
                                  {v.sticker ? (
                                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/30 uppercase font-black">
                                      🎫 Sticker Ok
                                    </span>
                                  ) : (
                                    <span className="text-[8px] bg-rose-500/20 text-rose-400 px-1 py-0.5 rounded border border-rose-500/30 uppercase font-black">
                                      ⚠️ No Sticker
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : <span className="text-slate-500 italic text-[10px]">कोई वाहन नहीं</span>;
                          } catch (e) {
                            return <span className="text-slate-300">{selectedUser.vehicles}</span>;
                          }
                        })()}
                      </div>
                    ) : <span className="text-slate-500 italic text-[10px]">कोई जानकारी नहीं</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Directory;
