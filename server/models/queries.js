import { query, isFallback, mockDb, saveMockDb } from '../config/db.js';

export const queries = {
  // --- USERS ---
  findUserByEmail: async (email) => {
    if (isFallback()) {
      return mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  },

  findUserById: async (id) => {
    if (isFallback()) {
      return mockDb.users.find(u => u.id === parseInt(id)) || null;
    }
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  createUser: async ({ name, email, passwordHash, role, gender, flatNo, phone, occupancyStatus, tenantType, ownerName, ownerPhone, aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration, leaseAgreementSubmitted, emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails, isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes, isApproved }) => {
    if (isFallback()) {
      const newUser = {
        id: mockDb.users.length + 1,
        name,
        email,
        password_hash: passwordHash,
        role,
        gender: gender || 'Male',
        flat_no: flatNo || null,
        phone: phone || null,
        occupancy_status: occupancyStatus || 'Self-Occupied',
        tenant_type: tenantType || 'Family',
        owner_name: ownerName || null,
        owner_phone: ownerPhone || null,
        aadhaar_number: aadhaarNumber || null,
        family_members: familyMembers || null,
        family_member_names: familyMemberNames || null,
        vehicles: vehicles || null,
        move_in_date: moveInDate || null,
        lease_duration: leaseDuration || null,
        lease_agreement_submitted: leaseAgreementSubmitted !== undefined ? leaseAgreementSubmitted : false,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_phone: emergencyContactPhone || null,
        profile_picture: profilePicture || null,
        has_pet: hasPet || false,
        pet_details: petDetails || null,
        is_legacy_bachelor: isLegacyBachelor || false,
        exemption_ref: exemptionRef || null,
        police_verification_status: policeVerificationStatus || 'pending',
        police_verification_date: policeVerificationDate || null,
        noc_document_ref: nocDocumentRef || null,
        bachelor_notes: bachelorNotes || null,
        is_approved: isApproved !== undefined ? isApproved : true,
        created_at: new Date()
      };
      mockDb.users.push(newUser);
      return newUser;
    }
    const res = await query(
      `INSERT INTO users (name, email, password_hash, role, gender, flat_no, phone, occupancy_status, tenant_type, owner_name, owner_phone, aadhaar_number, family_members, family_member_names, vehicles, move_in_date, lease_duration, lease_agreement_submitted, emergency_contact_name, emergency_contact_phone, profile_picture, has_pet, pet_details, is_legacy_bachelor, exemption_ref, police_verification_status, police_verification_date, noc_document_ref, bachelor_notes, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *`,
      [name, email, passwordHash, role, gender || 'Male', flatNo || null, phone || null, occupancyStatus || 'Self-Occupied', tenantType || 'Family', ownerName || null, ownerPhone || null, aadhaarNumber || null, familyMembers || null, familyMemberNames || null, vehicles || null, moveInDate || null, leaseDuration || null, leaseAgreementSubmitted !== undefined ? leaseAgreementSubmitted : false, emergencyContactName || null, emergencyContactPhone || null, profilePicture || null, hasPet || false, petDetails || null, isLegacyBachelor || false, exemptionRef || null, policeVerificationStatus || 'pending', policeVerificationDate || null, nocDocumentRef || null, bachelorNotes || null, isApproved !== undefined ? isApproved : true]
    );
    return res.rows[0];
  },

  getAllUsers: async () => {
    if (isFallback()) {
      return mockDb.users;
    }
    const res = await query('SELECT id, name, email, role, gender, flat_no, phone, occupancy_status, tenant_type, owner_name, owner_phone, aadhaar_number, family_members, family_member_names, vehicles, move_in_date, lease_duration, lease_agreement_submitted, emergency_contact_name, emergency_contact_phone, profile_picture, has_pet, pet_details, is_legacy_bachelor, exemption_ref, police_verification_status, police_verification_date, noc_document_ref, bachelor_notes, is_approved, created_at FROM users ORDER BY id ASC');
    return res.rows;
  },

  updateUser: async (id, { name, email, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone, aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseDuration, leaseAgreementSubmitted, emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails, isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes, isApproved, passwordHash }) => {
    if (isFallback()) {
      const idx = mockDb.users.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        mockDb.users[idx] = {
          ...mockDb.users[idx],
          name,
          email,
          phone: phone || null,
          role,
          gender: gender || mockDb.users[idx].gender || 'Male',
          flat_no: flatNo || null,
          occupancy_status: occupancyStatus || 'Self-Occupied',
          tenant_type: tenantType || 'Family',
          owner_name: ownerName || null,
          owner_phone: ownerPhone || null,
          aadhaar_number: aadhaarNumber || null,
          family_members: familyMembers || null,
          family_member_names: familyMemberNames || null,
          vehicles: vehicles || null,
          move_in_date: moveInDate || null,
          lease_duration: leaseDuration || null,
          lease_agreement_submitted: leaseAgreementSubmitted !== undefined ? leaseAgreementSubmitted : (mockDb.users[idx].lease_agreement_submitted || false),
          emergency_contact_name: emergencyContactName || null,
          emergency_contact_phone: emergencyContactPhone || null,
          profile_picture: profilePicture || null,
          has_pet: hasPet || false,
          pet_details: petDetails || null,
          is_legacy_bachelor: isLegacyBachelor || false,
          exemption_ref: exemptionRef || null,
          police_verification_status: policeVerificationStatus || mockDb.users[idx].police_verification_status || 'pending',
          police_verification_date: policeVerificationDate || mockDb.users[idx].police_verification_date || null,
          noc_document_ref: nocDocumentRef || mockDb.users[idx].noc_document_ref || null,
          bachelor_notes: bachelorNotes || mockDb.users[idx].bachelor_notes || null,
          is_approved: isApproved !== undefined ? isApproved : (mockDb.users[idx].is_approved !== false)
        };
        if (passwordHash) {
          mockDb.users[idx].password_hash = passwordHash;
        }
        return mockDb.users[idx];
      }
      return null;
    }
    if (passwordHash) {
      const res = await query(
        `UPDATE users SET 
          name = $1, email = $2, phone = $3, role = $4, gender = $5, flat_no = $6, 
          occupancy_status = $7, tenant_type = $8, owner_name = $9, owner_phone = $10, 
          aadhaar_number = $11, family_members = $12, family_member_names = $13, 
          vehicles = $14, move_in_date = $15, lease_duration = $16, lease_agreement_submitted = $17,
          emergency_contact_name = $18, emergency_contact_phone = $19, 
          profile_picture = $20, has_pet = $21, pet_details = $22, 
          is_legacy_bachelor = $23, exemption_ref = $24,
          police_verification_status = $25, police_verification_date = $26,
          noc_document_ref = $27, bachelor_notes = $28, is_approved = $29,
          password_hash = $30
        WHERE id = $31 RETURNING *`,
        [name, email, phone || null, role, gender || 'Male', flatNo || null, occupancyStatus || 'Self-Occupied', tenantType || 'Family', ownerName || null, ownerPhone || null, aadhaarNumber || null, familyMembers || null, familyMemberNames || null, vehicles || null, moveInDate || null, leaseDuration || null, leaseAgreementSubmitted !== undefined ? leaseAgreementSubmitted : false, emergencyContactName || null, emergencyContactPhone || null, profilePicture || null, hasPet || false, petDetails || null, isLegacyBachelor || false, exemptionRef || null, policeVerificationStatus || 'pending', policeVerificationDate || null, nocDocumentRef || null, bachelorNotes || null, isApproved !== undefined ? isApproved : true, passwordHash, id]
      );
      return res.rows[0] || null;
    } else {
      const res = await query(
        `UPDATE users SET 
          name = $1, email = $2, phone = $3, role = $4, gender = $5, flat_no = $6, 
          occupancy_status = $7, tenant_type = $8, owner_name = $9, owner_phone = $10, 
          aadhaar_number = $11, family_members = $12, family_member_names = $13, 
          vehicles = $14, move_in_date = $15, lease_duration = $16, lease_agreement_submitted = $17,
          emergency_contact_name = $18, emergency_contact_phone = $19, 
          profile_picture = $20, has_pet = $21, pet_details = $22, 
          is_legacy_bachelor = $23, exemption_ref = $24,
          police_verification_status = $25, police_verification_date = $26,
          noc_document_ref = $27, bachelor_notes = $28, is_approved = $29
        WHERE id = $30 RETURNING *`,
        [name, email, phone || null, role, gender || 'Male', flatNo || null, occupancyStatus || 'Self-Occupied', tenantType || 'Family', ownerName || null, ownerPhone || null, aadhaarNumber || null, familyMembers || null, familyMemberNames || null, vehicles || null, moveInDate || null, leaseDuration || null, leaseAgreementSubmitted !== undefined ? leaseAgreementSubmitted : false, emergencyContactName || null, emergencyContactPhone || null, profilePicture || null, hasPet || false, petDetails || null, isLegacyBachelor || false, exemptionRef || null, policeVerificationStatus || 'pending', policeVerificationDate || null, nocDocumentRef || null, bachelorNotes || null, isApproved !== undefined ? isApproved : true, id]
      );
      return res.rows[0] || null;
    }
  },

  deleteUser: async (id) => {
    if (isFallback()) {
      const idx = mockDb.users.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        const deleted = mockDb.users[idx];
        mockDb.users.splice(idx, 1);
        return deleted;
      }
      return null;
    }
    const res = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  approveUser: async (id) => {
    if (isFallback()) {
      const idx = mockDb.users.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        mockDb.users[idx].is_approved = true;
        return mockDb.users[idx];
      }
      return null;
    }
    const res = await query('UPDATE users SET is_approved = true WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  updateUserCredentials: async (id, email, passwordHash) => {
    if (isFallback()) {
      const idx = mockDb.users.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        mockDb.users[idx].email = email;
        if (passwordHash) {
          mockDb.users[idx].password_hash = passwordHash;
        }
        return mockDb.users[idx];
      }
      return null;
    }
    if (passwordHash) {
      const res = await query('UPDATE users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING *', [email, passwordHash, id]);
      return res.rows[0] || null;
    } else {
      const res = await query('UPDATE users SET email = $1 WHERE id = $2 RETURNING *', [email, id]);
      return res.rows[0] || null;
    }
  },

  // --- BACHELOR TENANT ALERT SYSTEM ---
  getBachelorAlerts: async () => {
    if (isFallback()) {
      return mockDb.users.filter(u => u.tenant_type === 'Bachelor');
    }
    const res = await query(
      `SELECT id, name, email, flat_no, phone, move_in_date, lease_duration, 
              is_legacy_bachelor, exemption_ref, police_verification_status, 
              police_verification_date, noc_document_ref, bachelor_notes 
       FROM users 
       WHERE tenant_type = 'Bachelor' 
       ORDER BY move_in_date DESC`
    );
    return res.rows;
  },

  updateBachelorVerification: async (id, { status, date, nocRef, notes }) => {
    if (isFallback()) {
      const idx = mockDb.users.findIndex(u => u.id === parseInt(id));
      if (idx !== -1) {
        mockDb.users[idx].police_verification_status = status || mockDb.users[idx].police_verification_status;
        mockDb.users[idx].police_verification_date = date !== undefined ? date : mockDb.users[idx].police_verification_date;
        mockDb.users[idx].noc_document_ref = nocRef !== undefined ? nocRef : mockDb.users[idx].noc_document_ref;
        mockDb.users[idx].bachelor_notes = notes !== undefined ? notes : mockDb.users[idx].bachelor_notes;
        return mockDb.users[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE users SET 
        police_verification_status = COALESCE($1, police_verification_status),
        police_verification_date = COALESCE($2, police_verification_date),
        noc_document_ref = COALESCE($3, noc_document_ref),
        bachelor_notes = COALESCE($4, bachelor_notes)
       WHERE id = $5 AND tenant_type = 'Bachelor' RETURNING *`,
      [status || null, date || null, nocRef || null, notes || null, id]
    );
    return res.rows[0] || null;
  },

  // --- NOTICES ---
  getNotices: async () => {
    if (isFallback()) {
      // Hydrate with creator details
      return mockDb.notices.map(n => {
        const creator = mockDb.users.find(u => u.id === n.created_by);
        return {
          ...n,
          creator_name: creator ? creator.name : 'System'
        };
      }).sort((a, b) => b.created_at - a.created_at);
    }
    const res = await query(
      `SELECT n.*, u.name as creator_name 
       FROM notices n 
       LEFT JOIN users u ON n.created_by = u.id 
       ORDER BY n.created_at DESC`
    );
    return res.rows;
  },

  createNotice: async ({ title, content, createdBy }) => {
    if (isFallback()) {
      const newNotice = {
        id: mockDb.notices.length + 1,
        title,
        content,
        created_by: parseInt(createdBy),
        created_at: new Date()
      };
      mockDb.notices.push(newNotice);
      const creator = mockDb.users.find(u => u.id === parseInt(createdBy));
      return { ...newNotice, creator_name: creator ? creator.name : 'Admin' };
    }
    const res = await query(
      `INSERT INTO notices (title, content, created_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, content, createdBy]
    );
    // Fetch with joined creator
    const noticeId = res.rows[0].id;
    const details = await query(
      `SELECT n.*, u.name as creator_name 
       FROM notices n 
       LEFT JOIN users u ON n.created_by = u.id 
       WHERE n.id = $1`,
      [noticeId]
    );
    return details.rows[0];
  },

  // --- MAINTENANCE BILLS ---
  getBillsByResident: async (residentId) => {
    if (isFallback()) {
      return mockDb.bills.filter(b => b.resident_id === parseInt(residentId)).sort((a, b) => b.created_at - a.created_at);
    }
    const res = await query('SELECT * FROM bills WHERE resident_id = $1 ORDER BY created_at DESC', [residentId]);
    return res.rows;
  },

  getAllBills: async () => {
    if (isFallback()) {
      return mockDb.bills.map(b => {
        const resident = mockDb.users.find(u => u.id === b.resident_id);
        return {
          ...b,
          resident_name: resident ? resident.name : 'Unknown',
          flat_no: resident ? resident.flat_no : 'N/A'
        };
      }).sort((a, b) => b.created_at - a.created_at);
    }
    const res = await query(
      `SELECT b.*, u.name as resident_name, u.flat_no 
       FROM bills b 
       JOIN users u ON b.resident_id = u.id 
       ORDER BY b.created_at DESC`
    );
    return res.rows;
  },

  createBill: async ({ residentId, amount, billingMonth, dueDate }) => {
    if (isFallback()) {
      const newBill = {
        id: mockDb.bills.length + 1,
        resident_id: parseInt(residentId),
        amount: parseFloat(amount),
        status: 'unpaid',
        billing_month: billingMonth,
        due_date: new Date(dueDate),
        created_at: new Date()
      };
      mockDb.bills.push(newBill);
      const resident = mockDb.users.find(u => u.id === parseInt(residentId));
      return {
        ...newBill,
        resident_name: resident ? resident.name : 'Unknown',
        flat_no: resident ? resident.flat_no : 'N/A'
      };
    }
    const res = await query(
      `INSERT INTO bills (resident_id, amount, billing_month, due_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [residentId, amount, billingMonth, dueDate]
    );
    const billId = res.rows[0].id;
    const details = await query(
      `SELECT b.*, u.name as resident_name, u.flat_no 
       FROM bills b 
       JOIN users u ON b.resident_id = u.id 
       WHERE b.id = $1`,
      [billId]
    );
    return details.rows[0];
  },

  payBill: async (billId, paymentReference) => {
    if (isFallback()) {
      const idx = mockDb.bills.findIndex(b => b.id === parseInt(billId));
      if (idx !== -1) {
        mockDb.bills[idx].status = 'paid';
        mockDb.bills[idx].paid_at = new Date();
        mockDb.bills[idx].payment_reference = paymentReference;
        return mockDb.bills[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE bills 
       SET status = 'paid', paid_at = CURRENT_TIMESTAMP, payment_reference = $1 
       WHERE id = $2 RETURNING *`,
      [paymentReference, billId]
    );
    return res.rows[0] || null;
  },

  // --- TICKETS ---
  getTicketsByResident: async (residentId) => {
    if (isFallback()) {
      return mockDb.tickets.filter(t => t.created_by === parseInt(residentId)).sort((a, b) => b.created_at - a.created_at);
    }
    const res = await query('SELECT * FROM tickets WHERE created_by = $1 ORDER BY created_at DESC', [residentId]);
    return res.rows;
  },

  getAllTickets: async () => {
    if (isFallback()) {
      return mockDb.tickets.map(t => {
        const creator = mockDb.users.find(u => u.id === t.created_by);
        return {
          ...t,
          creator_name: creator ? creator.name : 'Unknown',
          flat_no: creator ? creator.flat_no : 'N/A'
        };
      }).sort((a, b) => b.created_at - a.created_at);
    }
    const res = await query(
      `SELECT t.*, u.name as creator_name, u.flat_no 
       FROM tickets t 
       JOIN users u ON t.created_by = u.id 
       ORDER BY t.created_at DESC`
    );
    return res.rows;
  },

  createTicket: async ({ title, description, category, createdBy }) => {
    if (isFallback()) {
      const newTicket = {
        id: mockDb.tickets.length + 1,
        title,
        description,
        category,
        status: 'open',
        created_by: parseInt(createdBy),
        created_at: new Date(),
        updated_at: new Date()
      };
      mockDb.tickets.push(newTicket);
      return newTicket;
    }
    const res = await query(
      `INSERT INTO tickets (title, description, category, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, category, createdBy]
    );
    return res.rows[0];
  },

  updateTicketStatus: async (ticketId, status) => {
    if (isFallback()) {
      const idx = mockDb.tickets.findIndex(t => t.id === parseInt(ticketId));
      if (idx !== -1) {
        mockDb.tickets[idx].status = status;
        mockDb.tickets[idx].updated_at = new Date();
        return mockDb.tickets[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE tickets 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, ticketId]
    );
    return res.rows[0] || null;
  },

  // --- VISITOR LOGS ---
  getVisitorLogs: async () => {
    if (isFallback()) {
      return mockDb.visitor_logs.map(l => {
        const guard = mockDb.users.find(u => u.id === l.logged_by);
        return {
          ...l,
          logged_by_name: guard ? guard.name : 'Security'
        };
      }).sort((a, b) => b.check_in - a.check_in);
    }
    const res = await query(
      `SELECT v.*, u.name as logged_by_name 
       FROM visitor_logs v 
       LEFT JOIN users u ON v.logged_by = u.id 
       ORDER BY v.check_in DESC`
    );
    return res.rows;
  },

  createVisitorLog: async ({ name, phone, purpose, gender, flatNo, loggedBy }) => {
    if (isFallback()) {
      const newLog = {
        id: mockDb.visitor_logs.length + 1,
        name,
        phone,
        purpose,
        gender: gender || 'Male',
        flat_no: flatNo,
        check_in: new Date(),
        check_out: null,
        logged_by: parseInt(loggedBy)
      };
      mockDb.visitor_logs.push(newLog);
      const guard = mockDb.users.find(u => u.id === parseInt(loggedBy));
      return { ...newLog, logged_by_name: guard ? guard.name : 'Security' };
    }
    const res = await query(
      `INSERT INTO visitor_logs (name, phone, purpose, gender, flat_no, logged_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, phone, purpose, gender || 'Male', flatNo, loggedBy]
    );
    const logId = res.rows[0].id;
    const details = await query(
      `SELECT v.*, u.name as logged_by_name 
       FROM visitor_logs v 
       LEFT JOIN users u ON v.logged_by = u.id 
       WHERE v.id = $1`,
      [logId]
    );
    return details.rows[0];
  },

  checkoutVisitor: async (logId) => {
    if (isFallback()) {
      const idx = mockDb.visitor_logs.findIndex(l => l.id === parseInt(logId));
      if (idx !== -1) {
        mockDb.visitor_logs[idx].check_out = new Date();
        return mockDb.visitor_logs[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE visitor_logs 
       SET check_out = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [logId]
    );
    return res.rows[0] || null;
  },

  // --- COMMITTEE MEMBERS ---
  getCommitteeMembers: async () => {
    if (isFallback()) {
      return [...mockDb.committee_members].sort((a, b) => a.display_order - b.display_order);
    }
    const res = await query('SELECT * FROM committee_members ORDER BY display_order ASC, name ASC');
    return res.rows;
  },

  createCommitteeMember: async ({ name, designation, phone, email, flatNo, displayOrder }) => {
    if (isFallback()) {
      const newMember = {
        id: mockDb.committee_members.length > 0 ? Math.max(...mockDb.committee_members.map(m => m.id)) + 1 : 1,
        name,
        designation,
        phone: phone || null,
        email: email || null,
        flat_no: flatNo || null,
        display_order: parseInt(displayOrder) || 0,
        created_at: new Date()
      };
      mockDb.committee_members.push(newMember);
      return newMember;
    }
    const res = await query(
      `INSERT INTO committee_members (name, designation, phone, email, flat_no, display_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, designation, phone || null, email || null, flatNo || null, displayOrder || 0]
    );
    return res.rows[0];
  },

  updateCommitteeMember: async (id, { name, designation, phone, email, flatNo, displayOrder }) => {
    if (isFallback()) {
      const idx = mockDb.committee_members.findIndex(m => m.id === parseInt(id));
      if (idx !== -1) {
        mockDb.committee_members[idx] = {
          ...mockDb.committee_members[idx],
          name,
          designation,
          phone: phone || null,
          email: email || null,
          flat_no: flatNo || null,
          display_order: parseInt(displayOrder) || 0
        };
        return mockDb.committee_members[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE committee_members 
       SET name = $1, designation = $2, phone = $3, email = $4, flat_no = $5, display_order = $6 
       WHERE id = $7 RETURNING *`,
      [name, designation, phone || null, email || null, flatNo || null, displayOrder || 0, id]
    );
    return res.rows[0] || null;
  },

  deleteCommitteeMember: async (id) => {
    if (isFallback()) {
      const idx = mockDb.committee_members.findIndex(m => m.id === parseInt(id));
      if (idx !== -1) {
        const deleted = mockDb.committee_members[idx];
        mockDb.committee_members.splice(idx, 1);
        return deleted;
      }
      return null;
    }
    const res = await query('DELETE FROM committee_members WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  // --- HELPLINES / EMERGENCY CONTACTS ---
  getHelplines: async () => {
    if (isFallback()) {
      return [...mockDb.helplines].sort((a, b) => a.display_order - b.display_order);
    }
    const res = await query('SELECT * FROM helplines ORDER BY display_order ASC, title ASC');
    return res.rows;
  },

  createHelpline: async ({ title, number, note, displayOrder }) => {
    if (isFallback()) {
      const newHelpline = {
        id: mockDb.helplines.length > 0 ? Math.max(...mockDb.helplines.map(h => h.id)) + 1 : 1,
        title,
        number,
        note: note || null,
        display_order: parseInt(displayOrder) || 0,
        created_at: new Date()
      };
      mockDb.helplines.push(newHelpline);
      return newHelpline;
    }
    const res = await query(
      `INSERT INTO helplines (title, number, note, display_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, number, note || null, displayOrder || 0]
    );
    return res.rows[0];
  },

  updateHelpline: async (id, { title, number, note, displayOrder }) => {
    if (isFallback()) {
      const idx = mockDb.helplines.findIndex(h => h.id === parseInt(id));
      if (idx !== -1) {
        mockDb.helplines[idx] = {
          ...mockDb.helplines[idx],
          title,
          number,
          note: note || null,
          display_order: parseInt(displayOrder) || 0
        };
        return mockDb.helplines[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE helplines 
       SET title = $1, number = $2, note = $3, display_order = $4 
       WHERE id = $5 RETURNING *`,
      [title, number, note || null, displayOrder || 0, id]
    );
    return res.rows[0] || null;
  },

  deleteHelpline: async (id) => {
    if (isFallback()) {
      const idx = mockDb.helplines.findIndex(h => h.id === parseInt(id));
      if (idx !== -1) {
        const deleted = mockDb.helplines[idx];
        mockDb.helplines.splice(idx, 1);
        return deleted;
      }
      return null;
    }
    const res = await query('DELETE FROM helplines WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  },

  // --- GALLERY EVENTS / NEWS CMS ---
  getGalleryEvents: async () => {
    if (isFallback()) {
      return [...mockDb.gallery_events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    }
    const res = await query('SELECT * FROM gallery_events ORDER BY event_date DESC, created_at DESC');
    return res.rows;
  },

  createGalleryEvent: async ({ title, content, imageUrl, eventDate }) => {
    if (isFallback()) {
      const newEvent = {
        id: mockDb.gallery_events.length > 0 ? Math.max(...mockDb.gallery_events.map(e => e.id)) + 1 : 1,
        title,
        content: content || null,
        image_url: imageUrl || null,
        event_date: eventDate ? new Date(eventDate) : new Date(),
        created_at: new Date()
      };
      mockDb.gallery_events.push(newEvent);
      saveMockDb();
      return newEvent;
    }
    const res = await query(
      `INSERT INTO gallery_events (title, content, image_url, event_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content || null, imageUrl || null, eventDate || new Date()]
    );
    return res.rows[0];
  },

  updateGalleryEvent: async (id, { title, content, imageUrl, eventDate }) => {
    if (isFallback()) {
      const idx = mockDb.gallery_events.findIndex(e => e.id === parseInt(id));
      if (idx !== -1) {
        mockDb.gallery_events[idx] = {
          ...mockDb.gallery_events[idx],
          title,
          content: content || null,
          image_url: imageUrl || null,
          event_date: eventDate ? new Date(eventDate) : new Date()
        };
        saveMockDb();
        return mockDb.gallery_events[idx];
      }
      return null;
    }
    const res = await query(
      `UPDATE gallery_events 
       SET title = $1, content = $2, image_url = $3, event_date = $4 
       WHERE id = $5 RETURNING *`,
      [title, content || null, imageUrl || null, eventDate || new Date(), id]
    );
    return res.rows[0] || null;
  },

  deleteGalleryEvent: async (id) => {
    if (isFallback()) {
      const idx = mockDb.gallery_events.findIndex(e => e.id === parseInt(id));
      if (idx !== -1) {
        const deleted = mockDb.gallery_events[idx];
        mockDb.gallery_events.splice(idx, 1);
        saveMockDb();
        return deleted;
      }
      return null;
    }
    const res = await query('DELETE FROM gallery_events WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  }
};
