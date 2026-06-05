import { queries } from '../models/queries.js';
import bcrypt from 'bcryptjs';

// @desc    Get current logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and sanitized by the 'protect' middleware
    res.status(200).json({
      success: true,
      token: req.cookies?.auth_token || (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null),
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get directory listing of all society members
// @route   GET /api/users/directory
// @access  Private
export const getSocietyDirectory = async (req, res, next) => {
  try {
    const allUsers = await queries.getAllUsers();
    
    const hasFullAccess = req.user && (req.user.role === 'Admin' || req.user.role === 'Committee');

    // Format a directory of residents and admins, hiding sensitive credentials & masking PII
    const directory = allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: hasFullAccess ? user.email : (user.email ? user.email.split('@')[0].slice(0, 2) + '***@' + user.email.split('@')[1] : null),
      role: user.role,
      gender: user.gender,
      flat_no: user.flat_no,
      phone: hasFullAccess ? user.phone : (user.phone ? 'XXXXXX' + user.phone.trim().slice(-4) : null),
      occupancy_status: user.occupancy_status,
      tenant_type: user.tenant_type,
      owner_name: user.owner_name,
      owner_phone: hasFullAccess ? user.owner_phone : (user.owner_phone ? 'XXXXXX' + user.owner_phone.trim().slice(-4) : null),
      aadhaar_number: hasFullAccess ? user.aadhaar_number : (user.aadhaar_number ? 'XXXX XXXX ' + user.aadhaar_number.trim().slice(-4) : null),
      family_members: user.family_members,
      family_member_names: hasFullAccess ? user.family_member_names : null,
      vehicles: hasFullAccess ? user.vehicles : null,
      move_in_date: user.move_in_date,
      lease_expiry_date: user.lease_expiry_date,
      lease_duration: user.lease_duration,
      lease_agreement_submitted: user.lease_agreement_submitted,
      emergency_contact_name: hasFullAccess ? user.emergency_contact_name : null,
      emergency_contact_phone: hasFullAccess ? user.emergency_contact_phone : null,
      profile_picture: user.profile_picture,
      has_pet: user.has_pet,
      pet_details: user.pet_details,
      is_legacy_bachelor: user.is_legacy_bachelor,
      exemption_ref: user.exemption_ref,
      police_verification_status: user.police_verification_status,
      police_verification_date: user.police_verification_date,
      noc_document_ref: user.noc_document_ref,
      bachelor_notes: hasFullAccess ? user.bachelor_notes : null,
      is_approved: user.is_approved,
      created_at: user.created_at
    }));

    res.status(200).json({
      success: true,
      count: directory.length,
      data: directory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's profile data (Admin only)
// @route   PUT /api/users/update
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const {
      userId, name, email, password, phone, role, gender, flatNo, occupancyStatus, tenantType, ownerName, ownerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate, leaseExpiryDate, leaseDuration, leaseAgreementSubmitted,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes
    } = req.body;

    if (!userId || !name || !email || !role) {
      res.status(400);
      throw new Error('userId, name, email, and role are required');
    }

    let passwordHash = null;
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    // Business Rule: यदि status Vacant है या role non-Resident है तो flat_no null होना चाहिए
    const isNonResident = role === 'Admin' || role === 'Committee' || role === 'Security';
    const resolvedFlatNo = (isNonResident || occupancyStatus === 'Vacant') ? null : flatNo;
    const resolvedOwnerName = (isNonResident || occupancyStatus === 'Vacant') ? null : ownerName;
    const resolvedOwnerPhone = (isNonResident || occupancyStatus === 'Vacant') ? null : ownerPhone;
    const resolvedLeaseDuration = (isNonResident || occupancyStatus === 'Vacant') ? null : leaseDuration;
    const resolvedLeaseExpiryDate = (isNonResident || occupancyStatus === 'Vacant') ? null : leaseExpiryDate;

    const updatedUser = await queries.updateUser(userId, {
      name, email, phone, role, gender,
      flatNo: resolvedFlatNo,
      occupancyStatus, tenantType,
      ownerName: resolvedOwnerName,
      ownerPhone: resolvedOwnerPhone,
      aadhaarNumber, familyMembers, familyMemberNames, vehicles, moveInDate,
      leaseExpiryDate: resolvedLeaseExpiryDate,
      leaseDuration: resolvedLeaseDuration,
      leaseAgreementSubmitted,
      emergencyContactName, emergencyContactPhone, profilePicture, hasPet, petDetails,
      isLegacyBachelor, exemptionRef, policeVerificationStatus, policeVerificationDate, nocDocumentRef, bachelorNotes,
      passwordHash
    });

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user from the directory (Admin only)
// @route   DELETE /api/users/delete/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const deletedUser = await queries.deleteUser(id);

    if (!deletedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bachelor tenants for alert monitoring (Admin only)
// @route   GET /api/users/bachelor-alerts
// @access  Private (Admin)
export const getBachelorAlerts = async (req, res, next) => {
  try {
    const alerts = await queries.getBachelorAlerts();
    
    // Add logic to determine lease expiry
    const processedAlerts = alerts.map(bachelor => {
      let isExpiringSoon = false;
      let daysUntilExpiry = null;
      let expiresAt = null;

      if (bachelor.move_in_date && bachelor.lease_duration) {
        // Simple heuristic: assuming lease_duration is something like "11 months"
        const durationStr = bachelor.lease_duration.toLowerCase();
        let months = 11; // default
        const match = durationStr.match(/(\d+)/);
        if (match) months = parseInt(match[1], 10);
        
        const startDate = new Date(bachelor.move_in_date);
        const expiryDate = new Date(startDate.setMonth(startDate.getMonth() + months));
        expiresAt = expiryDate;
        
        const diffTime = expiryDate.getTime() - new Date().getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= -30; // Within 30 days or expired recently
      }

      return {
        ...bachelor,
        is_expiring_soon: isExpiringSoon,
        days_until_expiry: daysUntilExpiry,
        expires_at: expiresAt
      };
    });

    res.status(200).json({
      success: true,
      count: processedAlerts.length,
      data: processedAlerts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bachelor tenant's police verification status (Admin only)
// @route   PUT /api/users/bachelor-verification/:id
// @access  Private (Admin)
export const updateBachelorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, date, nocRef, notes } = req.body;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const updated = await queries.updateBachelorVerification(id, { status, date, nocRef, notes });

    if (!updated) {
      res.status(404);
      throw new Error('Bachelor tenant not found');
    }

    res.status(200).json({
      success: true,
      message: 'Verification status updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a newly registered user account (Admin only)
// @route   PUT /api/users/:id/approve
// @access  Private (Admin)
export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const approved = await queries.approveUser(id);

    if (!approved) {
      res.status(404);
      throw new Error('User account not found');
    }

    res.status(200).json({
      success: true,
      message: 'Account approved successfully',
      data: approved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Checkout/Vacate a resident (Admin/Committee only)
// @route   PUT /api/users/checkout/:id
// @access  Private (Admin/Committee)
export const checkoutUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('User ID is required');
    }

    const checkedOut = await queries.checkoutUser(id);

    if (!checkedOut) {
      res.status(404);
      throw new Error('User account not found');
    }

    res.status(200).json({
      success: true,
      message: 'Resident checked out successfully, flat is now vacant',
      data: checkedOut
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's email/password (Own account update)
// @route   PUT /api/users/update-profile
// @access  Private
export const updateOwnProfile = async (req, res, next) => {
  try {
    const { email, password, currentPassword } = req.body;
    const userId = req.user.id;

    if (!email) {
      res.status(400);
      throw new Error('Email/UserID is required');
    }

    if (!currentPassword) {
      res.status(400);
      throw new Error('सुरक्षा सत्यापन के लिए आपका वर्तमान पासवर्ड आवश्यक है (Current password is required to verify identity)');
    }

    // Fetch full user record including password hash
    const user = await queries.findUserById(userId);
    if (!user) {
      res.status(404);
      throw new Error('यूजर अकाउंट नहीं मिला (User account not found)');
    }

    // Verify current password match
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      res.status(401);
      throw new Error('वर्तमान पासवर्ड गलत है (Incorrect current password)');
    }

    let passwordHash = null;
    if (password) {
      if (password.length < 6) {
        res.status(400);
        throw new Error('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (New password must be at least 6 characters long)');
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await queries.updateUserCredentials(userId, email, passwordHash);

    if (!updated) {
      res.status(404);
      throw new Error('User account not found');
    }

    res.status(200).json({
      success: true,
      message: 'Profile credentials updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete database dump or paginated table records (Admin only)
// @route   GET /api/users/db-inspect
// @access  Private (Admin Only)
export const getFullDatabaseDump = async (req, res, next) => {
  try {
    const { getDb, isFallback, mockDb } = await import('../config/db.js');
    const { table, page, limit, search } = req.query;

    const allowedTables = ['users', 'bills', 'tickets', 'notices', 'visitor_logs', 'committee_members', 'helplines', 'gallery_events', 'feature_flags', 'society_expenses', 'audit_logs'];

    // If table is requested specifically, return paginated/filtered subset
    if (table) {
      if (!allowedTables.includes(table)) {
        res.status(400);
        throw new Error(`Unauthorized or invalid table name: '${table}'`);
      }

      const pgNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const offset = (pgNum - 1) * limitNum;

      if (isFallback()) {
        let list = [...(mockDb[table] || [])];
        
        // Local filter logic
        if (search) {
          const q = search.toLowerCase().trim();
          list = list.filter(item => {
            return Object.values(item).some(val => 
              val !== null && val !== undefined && String(val).toLowerCase().includes(q)
            );
          });
        }

        // Sorting by ID or key
        if (table === 'feature_flags') {
          list.sort((a, b) => a.feature_key.localeCompare(b.feature_key));
        } else {
          list.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        const paginatedList = list.slice(offset, offset + limitNum);
        return res.status(200).json({
          success: true,
          mode: 'fallback',
          table,
          page: pgNum,
          limit: limitNum,
          totalCount: list.length,
          data: paginatedList
        });
      } else {
        const db = getDb();
        if (!db) {
          throw new Error('Database connection is uninitialized');
        }

        let queryText = `SELECT * FROM "${table}"`;
        let countText = `SELECT COUNT(*) FROM "${table}"`;
        let queryParams = [];
        let countParams = [];

        // Build simple text search query condition
        if (search) {
          queryText += ` WHERE row_to_json("${table}")::text iLike $1`;
          countText += ` WHERE row_to_json("${table}")::text iLike $1`;
          queryParams.push(`%${search}%`);
          countParams.push(`%${search}%`);
        }

        if (table === 'feature_flags') {
          queryText += ` ORDER BY feature_key ASC`;
        } else {
          queryText += ` ORDER BY id DESC`;
        }

        queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limitNum, offset);

        const [dataRes, countRes] = await Promise.all([
          db.query(queryText, queryParams),
          db.query(countText, countParams)
        ]);

        return res.status(200).json({
          success: true,
          mode: 'postgres',
          table,
          page: pgNum,
          limit: limitNum,
          totalCount: parseInt(countRes.rows[0].count, 10),
          data: dataRes.rows
        });
      }
    }

    // Default: return fallback all tables dump or limited rows for Postgres
    if (isFallback()) {
      return res.status(200).json({
        success: true,
        mode: 'fallback',
        users: mockDb.users,
        bills: mockDb.bills,
        tickets: mockDb.tickets,
        notices: mockDb.notices,
        visitor_logs: mockDb.visitor_logs,
        committee_members: mockDb.committee_members,
        helplines: mockDb.helplines,
        gallery_events: mockDb.gallery_events,
        society_expenses: mockDb.society_expenses || [],
        audit_logs: mockDb.audit_logs || []
      });
    }

    const db = getDb();
    if (!db) {
      throw new Error('Database connection pool is uninitialized.');
    }

    // Return limited snapshot of all tables to prevent network/memory spikes
    const [
      usersRes,
      billsRes,
      ticketsRes,
      noticesRes,
      visitorsRes,
      committeeRes,
      helplinesRes,
      galleryRes,
      expensesRes,
      auditsRes
    ] = await Promise.all([
      db.query("SELECT * FROM users ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM bills ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM tickets ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM notices ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM visitor_logs ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM committee_members ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM helplines ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM gallery_events ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM society_expenses ORDER BY id ASC LIMIT 100"),
      db.query("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100")
    ]);

    res.status(200).json({
      success: true,
      mode: 'postgres',
      users: usersRes.rows,
      bills: billsRes.rows,
      tickets: ticketsRes.rows,
      notices: noticesRes.rows,
      visitor_logs: visitorsRes.rows,
      committee_members: committeeRes.rows,
      helplines: helplinesRes.rows,
      gallery_events: galleryRes.rows,
      society_expenses: expensesRes.rows,
      audit_logs: auditsRes.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific database record in any table (Admin only)
// @route   PUT /api/users/db-inspect/:table/:id
// @access  Private (Admin Only)
export const updateDatabaseRecord = async (req, res, next) => {
  try {
    const { table, id } = req.params;
    const body = req.body;
    const { getDb, isFallback, mockDb, saveMockDb } = await import('../config/db.js');

    const allowedTables = ['users', 'bills', 'tickets', 'notices', 'visitor_logs', 'committee_members', 'helplines', 'gallery_events', 'feature_flags', 'society_expenses', 'audit_logs'];
    if (!allowedTables.includes(table)) {
      res.status(400);
      throw new Error(`Unauthorized or invalid table name: '${table}'`);
    }

    let oldValue = null;
    let updatedRecord = null;

    if (isFallback()) {
      const idx = mockDb[table].findIndex(item => item.id === parseInt(id) || (table === 'feature_flags' && item.feature_key === id));
      if (idx === -1) {
        res.status(404);
        throw new Error(`Record with ID '${id}' not found in table '${table}'`);
      }
      
      oldValue = { ...mockDb[table][idx] };

      // Keep structural integrity (keep id and created_at if present)
      mockDb[table][idx] = {
        ...mockDb[table][idx],
        ...body,
        id: mockDb[table][idx].id,
        created_at: mockDb[table][idx].created_at
      };
      
      updatedRecord = mockDb[table][idx];
      saveMockDb();
    } else {
      const db = getDb();
      if (!db) {
        throw new Error('Database connection is uninitialized');
      }

      // Fetch oldValue before update
      const existingRes = (table === 'feature_flags')
        ? await db.query(`SELECT * FROM "${table}" WHERE feature_key = $1`, [id])
        : await db.query(`SELECT * FROM "${table}" WHERE id = $1`, [parseInt(id)]);
      
      if (existingRes.rows[0]) {
        oldValue = existingRes.rows[0];
      }

      // Dynamic SQL update builder
      const fields = Object.keys(body).filter(k => k !== 'id' && k !== 'created_at');
      if (fields.length === 0) {
        res.status(400);
        throw new Error('No update fields provided');
      }

      const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
      const values = fields.map(f => body[f]);
      
      let queryText;
      let queryParams;
      if (table === 'feature_flags') {
        queryText = `UPDATE "${table}" SET ${setClause} WHERE feature_key = $${fields.length + 1} RETURNING *`;
        queryParams = [...values, id];
      } else {
        queryText = `UPDATE "${table}" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        queryParams = [...values, parseInt(id)];
      }

      const queryRes = await db.query(queryText, queryParams);
      updatedRecord = queryRes.rows[0];
    }

    if (!updatedRecord) {
      res.status(404);
      throw new Error(`Record with ID '${id}' not found in table '${table}'`);
    }

    // Write audit trail
    if (req.user) {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'UPDATE',
        targetTable: table,
        recordId: id,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: JSON.stringify(updatedRecord)
      });
    }

    res.status(200).json({
      success: true,
      message: `Record ${id} updated in table '${table}'`,
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a specific database record in any table (Admin only)
// @route   POST /api/users/db-inspect/:table
// @access  Private (Admin Only)
export const createDatabaseRecord = async (req, res, next) => {
  try {
    const { table } = req.params;
    const body = req.body;
    const { getDb, isFallback, mockDb, saveMockDb } = await import('../config/db.js');

    const allowedTables = ['users', 'bills', 'tickets', 'notices', 'visitor_logs', 'committee_members', 'helplines', 'gallery_events', 'feature_flags', 'society_expenses', 'audit_logs'];
    if (!allowedTables.includes(table)) {
      res.status(400);
      throw new Error(`Unauthorized or invalid table name: '${table}'`);
    }

    let createdRecord = null;

    if (isFallback()) {
      const nextId = mockDb[table].length > 0 ? Math.max(...mockDb[table].map(item => item.id || 0)) + 1 : 1;
      createdRecord = {
        ...body,
        id: nextId,
        created_at: new Date()
      };
      
      mockDb[table].push(createdRecord);
      saveMockDb();
    } else {
      const db = getDb();
      if (!db) {
        throw new Error('Database connection is uninitialized');
      }

      const fields = Object.keys(body).filter(k => k !== 'id' && k !== 'created_at');
      const valuePlaceholders = fields.map((_, i) => `$${i + 1}`).join(', ');
      const values = fields.map(f => body[f]);

      const queryText = `INSERT INTO "${table}" (${fields.map(f => `"${f}"`).join(', ')}) VALUES (${valuePlaceholders}) RETURNING *`;
      const queryRes = await db.query(queryText, values);
      createdRecord = queryRes.rows[0];
    }

    // Write audit trail
    if (req.user && createdRecord) {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'CREATE',
        targetTable: table,
        recordId: createdRecord.id || createdRecord.feature_key || 'N/A',
        newValue: JSON.stringify(createdRecord)
      });
    }

    res.status(201).json({
      success: true,
      message: `New record created in table '${table}'`,
      data: createdRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific database record in any table (Admin only)
// @route   DELETE /api/users/db-inspect/:table/:id
// @access  Private (Admin Only)
export const deleteDatabaseRecord = async (req, res, next) => {
  try {
    const { table, id } = req.params;
    const { getDb, isFallback, mockDb, saveMockDb } = await import('../config/db.js');

    const allowedTables = ['users', 'bills', 'tickets', 'notices', 'visitor_logs', 'committee_members', 'helplines', 'gallery_events', 'feature_flags', 'society_expenses', 'audit_logs'];
    if (!allowedTables.includes(table)) {
      res.status(400);
      throw new Error(`Unauthorized or invalid table name: '${table}'`);
    }

    let deletedRecord = null;

    if (isFallback()) {
      const idx = mockDb[table].findIndex(item => item.id === parseInt(id));
      if (idx === -1) {
        res.status(404);
        throw new Error(`Record with ID '${id}' not found in table '${table}'`);
      }
      
      deletedRecord = mockDb[table][idx];
      mockDb[table].splice(idx, 1);
      saveMockDb();
    } else {
      const db = getDb();
      if (!db) {
        throw new Error('Database connection is uninitialized');
      }

      const queryText = `DELETE FROM "${table}" WHERE id = $1 RETURNING *`;
      const queryRes = await db.query(queryText, [parseInt(id)]);
      deletedRecord = queryRes.rows[0];
    }

    if (!deletedRecord) {
      res.status(404);
      throw new Error(`Record with ID '${id}' not found in table '${table}'`);
    }

    // Write audit trail
    if (req.user) {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'DELETE',
        targetTable: table,
        recordId: id,
        oldValue: JSON.stringify(deletedRecord)
      });
    }

    res.status(200).json({
      success: true,
      message: `Record ${id} deleted from table '${table}'`,
      data: deletedRecord
    });
  } catch (error) {
    next(error);
  }
};
