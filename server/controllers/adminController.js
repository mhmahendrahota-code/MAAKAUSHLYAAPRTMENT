import { queries } from '../models/queries.js';
import bcrypt from 'bcryptjs';

// @desc    Get aggregated RWA admin stats and features in one API round-trip
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin / Committee)
export const getDashboardStats = async (req, res, next) => {
  try {
    const { getDb, isFallback, mockDb } = await import('../config/db.js');

    let residentsCount = 0;
    let openTicketsCount = 0;
    let activeVisitorsCount = 0;
    let totalFundsCollected = 0.00;
    let totalDuesUnpaid = 0.00;
    let totalEventsCount = 0;
    let bachelorAlerts = [];
    let featureFlags = [];

    if (isFallback()) {
      // Sirf active + non-vacant residents count karo
      residentsCount = mockDb.users.filter(u =>
        u.role === 'Resident' &&
        u.is_approved !== false &&
        u.occupancy_status !== 'Vacant'
      ).length;
      openTicketsCount = mockDb.tickets.filter(t => t.status !== 'resolved').length;
      activeVisitorsCount = mockDb.visitor_logs.filter(v => !v.check_out).length;
      totalFundsCollected = mockDb.bills.filter(b => b.status === 'paid').reduce((s, b) => s + parseFloat(b.amount || 0), 0);
      totalDuesUnpaid = mockDb.bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + parseFloat(b.amount || 0), 0);
      totalEventsCount = mockDb.gallery_events.length;
      bachelorAlerts = mockDb.users.filter(u => u.tenant_type === 'Bachelor');
      featureFlags = mockDb.feature_flags || [];
    } else {
      const db = getDb();
      if (!db) {
        throw new Error('Database connection is uninitialized');
      }

      // Execute SQL aggregated queries in parallel
      // Helper to safely execute queries and return a default if they fail (e.g. missing column/table during migration)
      const safeQuery = async (queryText, defaultResult) => {
        try {
          return await db.query(queryText);
        } catch (err) {
          console.warn(`Dashboard safeQuery failed: ${queryText}`, err.message);
          return { rows: [defaultResult] };
        }
      };

      const [
        residentsRes,
        ticketsRes,
        visitorsRes,
        fundsRes,
        duesRes,
        eventsRes,
        bachelorsRes,
        featuresRes
      ] = await Promise.all([
        safeQuery("SELECT COUNT(*)::INTEGER FROM users WHERE role = 'Resident' AND is_approved = true AND occupancy_status != 'Vacant'", { count: 0 }),
        safeQuery("SELECT COUNT(*)::INTEGER FROM tickets WHERE status != 'resolved'", { count: 0 }),
        safeQuery("SELECT COUNT(*)::INTEGER FROM visitor_logs WHERE check_out IS NULL", { count: 0 }),
        safeQuery("SELECT COALESCE(SUM(amount), 0.00)::DECIMAL FROM bills WHERE status = 'paid'", { coalesce: 0 }),
        safeQuery("SELECT COALESCE(SUM(amount), 0.00)::DECIMAL FROM bills WHERE status = 'unpaid'", { coalesce: 0 }),
        safeQuery("SELECT COUNT(*)::INTEGER FROM gallery_events", { count: 0 }),
        safeQuery("SELECT * FROM users WHERE tenant_type = 'Bachelor' ORDER BY move_in_date DESC", {}).then(res => ({ rows: res.rows || [] })),
        safeQuery("SELECT * FROM feature_flags ORDER BY feature_key ASC", {}).then(res => ({ rows: res.rows || [] }))
      ]);

      residentsCount = residentsRes.rows[0].count;
      openTicketsCount = ticketsRes.rows[0].count;
      activeVisitorsCount = visitorsRes.rows[0].count;
      totalFundsCollected = parseFloat(fundsRes.rows[0].coalesce);
      totalDuesUnpaid = parseFloat(duesRes.rows[0].coalesce);
      totalEventsCount = eventsRes.rows[0].count;
      bachelorAlerts = bachelorsRes.rows;
      featureFlags = featuresRes.rows;
      
      // Auto-heal missing feature flags (if table is empty or missing newly added flags)
      try {
        const { mockDb } = await import('../config/db.js');
        if (mockDb.feature_flags && mockDb.feature_flags.length > featureFlags.length) {
          for (const flag of mockDb.feature_flags) {
            await db.query(
              `INSERT INTO feature_flags (feature_key, feature_name, is_active)
               VALUES ($1::VARCHAR, $2::VARCHAR, $3::BOOLEAN) ON CONFLICT (feature_key) DO NOTHING`,
              [flag.feature_key, flag.feature_name, flag.is_active]
            );
          }
          const healedFeaturesRes = await db.query("SELECT * FROM feature_flags ORDER BY feature_key ASC");
          featureFlags = healedFeaturesRes.rows || [];
          console.log("🛡️ Auto-healed missing feature flags during dashboard fetch.");
        }
      } catch (healErr) {
        console.warn("⚠️ Failed to auto-heal feature flags:", healErr.message);
      }
    }

    // Process bachelor Alerts lease calculations matching userController logic
    const processedBachelors = bachelorAlerts.map(bachelor => {
      let isExpiringSoon = false;
      let daysUntilExpiry = null;
      let expiresAt = null;

      if (bachelor.move_in_date && bachelor.lease_duration) {
        const durationStr = bachelor.lease_duration.toLowerCase();
        let months = 11;
        const match = durationStr.match(/(\d+)/);
        if (match) months = parseInt(match[1], 10);
        
        const startDate = new Date(bachelor.move_in_date);
        const expiryDate = new Date(startDate.setMonth(startDate.getMonth() + months));
        expiresAt = expiryDate;
        
        const diffTime = expiryDate.getTime() - new Date().getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= -30;
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
      stats: {
        activeResidents: residentsCount,
        openComplaints: openTicketsCount,
        activeVisitors: activeVisitorsCount,
        totalFunds: totalFundsCollected,
        unpaidAmount: totalDuesUnpaid,
        galleryCount: totalEventsCount,
        bachelorAlerts: processedBachelors
      },
      features: featureFlags
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all society expense ledger transactions
// @route   GET /api/admin/expenses
// @access  Private (Admin / Committee)
export const getExpenses = async (req, res, next) => {
  try {
    const list = await queries.getExpenses();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new society expenditure transaction
// @route   POST /api/admin/expenses
// @access  Private (Admin / Committee)
export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, expenseDate, vendor, description, referenceNo } = req.body;

    if (!amount || !category) {
      res.status(400);
      throw new Error('Please provide amount and category for this expenditure');
    }

    const expense = await queries.createExpense({
      amount: parseFloat(amount),
      category,
      expenseDate,
      vendor,
      description,
      referenceNo
    });

    // Record audit trail if action by admin
    if (req.user && req.user.role === 'Admin') {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'CREATE',
        targetTable: 'society_expenses',
        recordId: expense.id,
        newValue: JSON.stringify(expense)
      });
    }

    res.status(201).json({
      success: true,
      message: 'Society expense recorded successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recorded society expense transaction
// @route   DELETE /api/admin/expenses/:id
// @access  Private (Admin / Committee)
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error('Please provide expense transaction ID');
    }

    const deleted = await queries.deleteExpense(id);

    if (!deleted) {
      res.status(404);
      throw new Error('Expense transaction record not found');
    }

    if (req.user && req.user.role === 'Admin') {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'DELETE',
        targetTable: 'society_expenses',
        recordId: id,
        oldValue: JSON.stringify(deleted)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense transaction deleted from ledger',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import bulk users inside single database transaction / mock bulk write
// @route   POST /api/admin/users/bulk-import
// @access  Private (Admin / Committee)
export const bulkImportUsers = async (req, res, next) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      res.status(400);
      throw new Error('Please provide an array of user objects to import');
    }

    const { getDb, isFallback } = await import('../config/db.js');
    const importedUsers = [];

    // Pre-hash default password to save CPU cycles
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);

    if (isFallback()) {
      // In-memory simulation import
      for (const u of users) {
        if (!u.name || !u.email) {
          res.status(400);
          throw new Error('Name and email are required for all users in the import list');
        }
        
        const created = await queries.createUser({
          ...u,
          passwordHash: defaultPasswordHash,
          isApproved: true
        });
        importedUsers.push(created);
      }
    } else {
      const db = getDb();
      if (!db) {
        throw new Error('Database pool uninitialized');
      }

      // Execute import under explicit transaction
      await db.query('BEGIN');
      try {
        for (const u of users) {
          if (!u.name || !u.email) {
            throw new Error('Name and email are required for all users in the import list');
          }

          const created = await queries.createUser({
            name: u.name,
            email: u.email,
            passwordHash: defaultPasswordHash,
            role: u.role || 'Resident',
            gender: u.gender || 'Male',
            flatNo: u.flatNo || null,
            phone: u.phone || null,
            occupancyStatus: u.occupancyStatus || 'Self-Occupied',
            tenantType: u.tenantType || 'Family',
            ownerName: u.ownerName || null,
            ownerPhone: u.ownerPhone || null,
            aadhaarNumber: u.aadhaarNumber || null,
            familyMembers: u.familyMembers || null,
            familyMemberNames: u.familyMemberNames || null,
            vehicles: u.vehicles || null,
            moveInDate: u.moveInDate || null,
            leaseDuration: u.leaseDuration || null,
            leaseAgreementSubmitted: u.leaseAgreementSubmitted || false,
            emergencyContactName: u.emergencyContactName || null,
            emergencyContactPhone: u.emergencyContactPhone || null,
            profilePicture: u.profilePicture || null,
            hasPet: u.hasPet || false,
            petDetails: u.petDetails || null,
            isLegacyBachelor: u.isLegacyBachelor || false,
            exemptionRef: u.exemptionRef || null,
            policeVerificationStatus: u.policeVerificationStatus || 'pending',
            policeVerificationDate: u.policeVerificationDate || null,
            nocDocumentRef: u.nocDocumentRef || null,
            bachelorNotes: u.bachelorNotes || null,
            isApproved: true
          });
          importedUsers.push(created);
        }
        await db.query('COMMIT');
      } catch (txnErr) {
        await db.query('ROLLBACK');
        throw txnErr;
      }
    }

    // Write audit log trail
    if (req.user && req.user.role === 'Admin') {
      await queries.createAuditLog({
        adminId: req.user.id,
        actionType: 'CREATE',
        targetTable: 'users',
        recordId: 'BULK-CSV-IMPORT',
        newValue: `Successfully bulk-imported ${importedUsers.length} resident members.`
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully bulk-imported ${importedUsers.length} resident accounts`,
      count: importedUsers.length,
      data: importedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated data for reports
// @route   GET /api/admin/reports
// @access  Private (Admin / Committee)
export const getReportData = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    const { getDb, isFallback, mockDb } = await import('../config/db.js');
    let data = [];

    // Filter by date helper for fallback
    const isWithinDate = (dateStr, start, end) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (start && d < new Date(start)) return false;
      // Adding 1 day to end date to make it inclusive of the end date
      if (end) {
        const e = new Date(end);
        e.setDate(e.getDate() + 1);
        if (d >= e) return false;
      }
      return true;
    };

    if (isFallback()) {
      switch (type) {
        case 'financial':
          data = {
            collections: mockDb.bills.filter(b => b.status === 'paid' && isWithinDate(b.paid_date || b.due_date, startDate, endDate)),
            expenses: (mockDb.society_expenses || []).filter(e => isWithinDate(e.expense_date, startDate, endDate))
          };
          break;
        case 'defaulters': {
          const unpaidBills = mockDb.bills.filter(b => b.status === 'unpaid' && new Date(b.due_date) < new Date());
          data = unpaidBills.map(b => {
            const user = mockDb.users.find(u => u.id === b.resident_id) || {};
            return { ...b, user_name: user.name, flat_no: user.flat_no, phone: user.phone };
          });
          break;
        }
        case 'visitor_logs':
          data = mockDb.visitor_logs.filter(v => isWithinDate(v.check_in, startDate, endDate));
          break;
        case 'occupancy':
          data = {
            total: mockDb.users.length,
            bachelors: mockDb.users.filter(u => u.tenant_type === 'Bachelor'),
            families: mockDb.users.filter(u => u.tenant_type === 'Family'),
            selfOccupied: mockDb.users.filter(u => u.occupancy_status === 'Self-Occupied'),
            rented: mockDb.users.filter(u => u.occupancy_status === 'Rented'),
            vacant: mockDb.users.filter(u => u.occupancy_status === 'Vacant')
          };
          break;
        default:
          res.status(400);
          throw new Error('Invalid report type');
      }
    } else {
      const db = getDb();
      if (!db) throw new Error('Database pool uninitialized');

      // Helper to append date filters
      let dateFilter = '';
      let queryParams = [];
      if (startDate && endDate) {
        dateFilter = ` AND date_column >= $1 AND date_column < $2::date + interval '1 day' `;
        queryParams = [startDate, endDate];
      } else if (startDate) {
        dateFilter = ` AND date_column >= $1 `;
        queryParams = [startDate];
      } else if (endDate) {
        dateFilter = ` AND date_column < $1::date + interval '1 day' `;
        queryParams = [endDate];
      }

      switch (type) {
        case 'financial': {
          const colsQuery = `SELECT * FROM bills WHERE status = 'paid'` + dateFilter.replace(/date_column/g, 'COALESCE(paid_date, due_date)');
          const expQuery = `SELECT * FROM society_expenses WHERE 1=1` + (dateFilter ? dateFilter.replace(/date_column/g, 'expense_date') : '');
          const [colsRes, expRes] = await Promise.all([
            db.query(colsQuery, queryParams),
            db.query(expQuery, queryParams)
          ]);
          data = {
            collections: colsRes.rows,
            expenses: expRes.rows
          };
          break;
        }
        case 'defaulters': {
          const defQuery = `
            SELECT b.*, u.name as user_name, u.flat_no, u.phone 
            FROM bills b
            JOIN users u ON b.resident_id = u.id
            WHERE b.status = 'unpaid' AND b.due_date < CURRENT_DATE
          `;
          const defRes = await db.query(defQuery);
          data = defRes.rows;
          break;
        }
        case 'visitor_logs': {
          const visQuery = `SELECT * FROM visitor_logs WHERE 1=1` + (dateFilter ? dateFilter.replace(/date_column/g, 'check_in') : '');
          const visRes = await db.query(visQuery, queryParams);
          data = visRes.rows;
          break;
        }
        case 'occupancy': {
          const occRes = await db.query(`
            SELECT occupancy_status, tenant_type, COUNT(*) 
            FROM users 
            GROUP BY occupancy_status, tenant_type
          `);
          const usersRes = await db.query(`SELECT id, name, flat_no, phone, occupancy_status, tenant_type FROM users`);
          data = {
            summary: occRes.rows,
            users: usersRes.rows
          };
          break;
        }
        default:
          res.status(400);
          throw new Error('Invalid report type');
      }
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

