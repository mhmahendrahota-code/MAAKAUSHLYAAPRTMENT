/**
 * 🧪 COMPREHENSIVE TEST SEED SCRIPT
 * माँ कौशल्या अपार्टमेंट - सभी Resident Types के लिए Test Data
 * 
 * Run: node seed_test_residents.js
 * 
 * Covers:
 *  TC-01: Self-Occupied Owner (Family) - पालतू जानवर के साथ
 *  TC-02: Self-Occupied Owner (Family) - वाहनों के साथ
 *  TC-03: Self-Occupied Owner - बिना किसी extra data के (minimal)
 *  TC-04: Self-Occupied Owner (महिला निवासी)
 *  TC-05: Rented - Family Tenant (किरायेदार - परिवार)
 *  TC-06: Rented - Family Tenant - Lease Agreement submitted
 *  TC-07: Rented - Bachelor Tenant - Police Verified ✅
 *  TC-08: Rented - Bachelor Tenant - Police Pending ⏳
 *  TC-09: Rented - Bachelor Tenant - Legacy/Exemption वाला
 *  TC-10: Rented - Tenant with lease expiry soon
 *  TC-11: Vacant Flat (Checked-out resident)
 *  TC-12: Pending Approval (unapproved registration)
 *  TC-13: Non-Resident - Admin role
 *  TC-14: Non-Resident - Committee member
 *  TC-15: Non-Resident - Security Guard
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false }
});

// Default password for all test accounts: TestPass@2026
const DEFAULT_PASSWORD = 'TestPass@2026';

async function hashPass() {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(DEFAULT_PASSWORD, salt);
}

// ─────────────────────────────────────────────
// TEST CASES DEFINITION
// ─────────────────────────────────────────────
const TEST_RESIDENTS = [

  // ══════════════════════════════
  // SELF-OCCUPIED OWNERS
  // ══════════════════════════════

  {
    _tc: 'TC-01',
    _desc: 'Self-Occupied Owner - With Pet & Emergency Contact',
    name: 'टेस्ट TC01 - रमेश वर्मा (Self-Occupied)',
    email: 'tc01.selfoccupied.pet@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-101',
    phone: '9000000001',
    occupancy_status: 'Self-Occupied',
    tenant_type: 'Family',
    family_members: 3,
    family_member_names: JSON.stringify([
      { name: 'सुनीता वर्मा', phone: '9000000011', gender: 'Female' },
      { name: 'अर्जुन वर्मा', phone: '9000000012', gender: 'Male' }
    ]),
    vehicles: JSON.stringify([
      { type: 'Car', number: 'CG 04 TC 0001', sticker: true }
    ]),
    move_in_date: '2020-03-15',
    aadhaar_number: '1111 2222 3333',
    emergency_contact_name: 'विजय वर्मा',
    emergency_contact_phone: '9000000099',
    has_pet: true,
    pet_details: '1 Golden Retriever (Tommy)',
    is_approved: true,
  },

  {
    _tc: 'TC-02',
    _desc: 'Self-Occupied Owner - Max Vehicles (1 Car + 2 Bikes)',
    name: 'टेस्ट TC02 - अनिल शर्मा (Max Vehicles)',
    email: 'tc02.selfoccupied.vehicles@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-102',
    phone: '9000000002',
    occupancy_status: 'Self-Occupied',
    tenant_type: 'Family',
    family_members: 2,
    family_member_names: JSON.stringify([
      { name: 'कमला शर्मा', phone: '9000000021', gender: 'Female' }
    ]),
    vehicles: JSON.stringify([
      { type: 'Car', number: 'CG 04 TC 0002', sticker: true },
      { type: 'Bike', number: 'CG 04 TC 0022', sticker: true },
      { type: 'Bike', number: 'CG 04 TC 0023', sticker: false }
    ]),
    move_in_date: '2019-11-01',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-03',
    _desc: 'Self-Occupied Owner - Minimal Data (no pet, no vehicles)',
    name: 'टेस्ट TC03 - विकास गुप्ता (Minimal)',
    email: 'tc03.selfoccupied.minimal@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-103',
    phone: '9000000003',
    occupancy_status: 'Self-Occupied',
    tenant_type: 'Family',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-04',
    _desc: 'Self-Occupied Owner - Female Resident',
    name: 'टेस्ट TC04 - प्रिया सिंह (Female Owner)',
    email: 'tc04.selfoccupied.female@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Female',
    flat_no: 'G-104',
    phone: '9000000004',
    occupancy_status: 'Self-Occupied',
    tenant_type: 'Family',
    family_members: 1,
    family_member_names: JSON.stringify([
      { name: 'राहुल सिंह', phone: '9000000041', gender: 'Male' }
    ]),
    vehicles: JSON.stringify([
      { type: 'Bike', number: 'CG 04 TC 0041', sticker: true }
    ]),
    move_in_date: '2022-01-10',
    has_pet: true,
    pet_details: '2 Persian Cats',
    is_approved: true,
  },

  // ══════════════════════════════
  // RENTED - FAMILY TENANTS
  // ══════════════════════════════

  {
    _tc: 'TC-05',
    _desc: 'Rented - Family Tenant (किरायेदार परिवार) - Basic',
    name: 'टेस्ट TC05 - सुरेश यादव (Family Tenant)',
    email: 'tc05.rented.family@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-105',
    phone: '9000000005',
    occupancy_status: 'Rented',
    tenant_type: 'Family',
    owner_name: 'मोहन लाल (Absent Owner)',
    owner_phone: '9000000051',
    family_members: 4,
    family_member_names: JSON.stringify([
      { name: 'रेखा यादव', phone: '9000000052', gender: 'Female' },
      { name: 'राहुल यादव', phone: '', gender: 'Male' },
      { name: 'पूजा यादव', phone: '', gender: 'Female' }
    ]),
    move_in_date: '2023-06-01',
    lease_duration: '11 months',
    lease_expiry_date: '2024-05-01',
    lease_agreement_submitted: false,
    police_verification_status: 'pending',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-06',
    _desc: 'Rented - Family Tenant - Lease Submitted ✅',
    name: 'टेस्ट TC06 - दीपक तिवारी (Lease Submitted)',
    email: 'tc06.rented.leasesub@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-106',
    phone: '9000000006',
    occupancy_status: 'Rented',
    tenant_type: 'Family',
    owner_name: 'सुभाष चंद्र (Absent Owner)',
    owner_phone: '9000000061',
    family_members: 2,
    family_member_names: JSON.stringify([
      { name: 'पायल तिवारी', phone: '9000000062', gender: 'Female' }
    ]),
    vehicles: JSON.stringify([
      { type: 'Bike', number: 'CG 04 TC 0061', sticker: false }
    ]),
    move_in_date: '2024-01-15',
    lease_duration: '24 months',
    lease_expiry_date: '2026-01-15',
    lease_agreement_submitted: true,
    police_verification_status: 'verified',
    police_verification_date: '2024-01-20',
    aadhaar_number: '4444 5555 6666',
    emergency_contact_name: 'रमेश तिवारी',
    emergency_contact_phone: '9000000063',
    has_pet: false,
    is_approved: true,
  },

  // ══════════════════════════════
  // RENTED - BACHELOR TENANTS
  // ══════════════════════════════

  {
    _tc: 'TC-07',
    _desc: 'Rented - Bachelor Tenant - Police VERIFIED ✅',
    name: 'टेस्ट TC07 - अमित कुमार (Bachelor Verified)',
    email: 'tc07.bachelor.verified@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-107',
    phone: '9000000007',
    occupancy_status: 'Rented',
    tenant_type: 'Bachelor',
    owner_name: 'राज किशोर (Absent Owner)',
    owner_phone: '9000000071',
    family_members: 2,
    family_member_names: JSON.stringify([
      { name: 'संजय कुमार (Flatmate)', phone: '9000000072', gender: 'Male' }
    ]),
    move_in_date: '2024-03-01',
    lease_duration: '11 months',
    lease_expiry_date: '2025-02-28',
    lease_agreement_submitted: true,
    police_verification_status: 'verified',
    police_verification_date: '2024-03-05',
    noc_document_ref: 'NOC/2024/G107',
    aadhaar_number: '7777 8888 9999',
    is_legacy_bachelor: false,
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-08',
    _desc: 'Rented - Bachelor Tenant - Police PENDING ⏳',
    name: 'टेस्ट TC08 - राजेश पटेल (Bachelor Pending)',
    email: 'tc08.bachelor.pending@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-108',
    phone: '9000000008',
    occupancy_status: 'Rented',
    tenant_type: 'Bachelor',
    owner_name: 'श्याम सुंदर (Absent Owner)',
    owner_phone: '9000000081',
    family_members: 3,
    family_member_names: JSON.stringify([
      { name: 'विनोद पटेल (Flatmate)', phone: '9000000082', gender: 'Male' },
      { name: 'कमल पटेल (Flatmate)', phone: '9000000083', gender: 'Male' }
    ]),
    move_in_date: '2025-12-01',
    lease_duration: '11 months',
    lease_expiry_date: '2026-11-30',
    lease_agreement_submitted: false,
    police_verification_status: 'pending',
    is_legacy_bachelor: false,
    has_pet: false,
    is_approved: true,
    bachelor_notes: 'नए किरायेदार - पुलिस सत्यापन बाकी है। 3 flatmates हैं।',
  },

  {
    _tc: 'TC-09',
    _desc: 'Rented - Bachelor - LEGACY EXEMPTION (पुराना exemption)',
    name: 'टेस्ट TC09 - करीम खान (Legacy Bachelor)',
    email: 'tc09.bachelor.legacy@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-109',
    phone: '9000000009',
    occupancy_status: 'Rented',
    tenant_type: 'Bachelor',
    owner_name: 'अहमद खान (Absent Owner)',
    owner_phone: '9000000091',
    family_members: 2,
    family_member_names: JSON.stringify([
      { name: 'सलीम खान (Flatmate)', phone: '9000000092', gender: 'Male' }
    ]),
    move_in_date: '2018-05-01',
    lease_duration: '11 months',
    lease_expiry_date: '2019-04-30',
    lease_agreement_submitted: true,
    police_verification_status: 'verified',
    police_verification_date: '2018-05-10',
    noc_document_ref: 'NOC/2018/G109',
    is_legacy_bachelor: true,
    exemption_ref: 'RWA-2018-LEG-U001 (AGM Approved: 15-Apr-2018)',
    bachelor_notes: 'पुराना किरायेदार, AGM में विशेष छूट दी गई। 2018 से निवास।',
    aadhaar_number: '2222 3333 4444',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-10',
    _desc: 'Rented - Family Tenant - LEASE EXPIRING SOON ⚠️ (30 दिन में)',
    name: 'टेस्ट TC10 - राहुल सोनी (Lease Expiring Soon)',
    email: 'tc10.rented.expiring@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: 'G-110',
    phone: '9000000010',
    occupancy_status: 'Rented',
    tenant_type: 'Family',
    owner_name: 'महेश सोनी (Absent Owner)',
    owner_phone: '9000000101',
    family_members: 1,
    move_in_date: '2025-07-01',
    lease_duration: '11 months',
    // Expiry in ~20 days from June 2026
    lease_expiry_date: '2026-06-25',
    lease_agreement_submitted: true,
    police_verification_status: 'verified',
    police_verification_date: '2025-07-05',
    has_pet: false,
    is_approved: true,
  },

  // ══════════════════════════════
  // VACANT / CHECKED-OUT
  // ══════════════════════════════

  {
    _tc: 'TC-11',
    _desc: 'Vacant - Previously Rented, now checked out (Vacated)',
    name: 'टेस्ट TC11 - पुराना किरायेदार (Vacated/Checked-Out)',
    email: 'tc11.vacant.checkedout@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Male',
    flat_no: null,  // flat_no cleared on checkout
    phone: '9000000011',
    occupancy_status: 'Vacant',
    tenant_type: 'Family',
    has_pet: false,
    is_approved: false,  // checkout sets is_approved = false
  },

  // ══════════════════════════════
  // PENDING APPROVAL (unapproved)
  // ══════════════════════════════

  {
    _tc: 'TC-12',
    _desc: 'Self-Registration - Pending Admin Approval',
    name: 'टेस्ट TC12 - नया निवासी (Pending Approval)',
    email: 'tc12.pending.approval@test.maakaushalya.com',
    role: 'Resident',
    gender: 'Female',
    flat_no: 'H-201',
    phone: '9000000012',
    occupancy_status: 'Self-Occupied',
    tenant_type: 'Family',
    has_pet: false,
    is_approved: false,  // pending admin approval
  },

  // ══════════════════════════════
  // NON-RESIDENT ROLES
  // ══════════════════════════════

  {
    _tc: 'TC-13',
    _desc: 'Admin Role (Non-Resident)',
    name: 'टेस्ट TC13 - टेस्ट एडमिन (Test Admin)',
    email: 'tc13.admin@test.maakaushalya.com',
    role: 'Admin',
    gender: 'Male',
    flat_no: null,
    phone: '9000000013',
    occupancy_status: 'Self-Occupied',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-14',
    _desc: 'Committee Member Role (Non-Resident)',
    name: 'टेस्ट TC14 - टेस्ट समिति सदस्य (Test Committee)',
    email: 'tc14.committee@test.maakaushalya.com',
    role: 'Committee',
    gender: 'Female',
    flat_no: null,
    phone: '9000000014',
    occupancy_status: 'Self-Occupied',
    has_pet: false,
    is_approved: true,
  },

  {
    _tc: 'TC-15',
    _desc: 'Security Guard Role (Non-Resident)',
    name: 'टेस्ट TC15 - टेस्ट गार्ड (Test Security)',
    email: 'tc15.security@test.maakaushalya.com',
    role: 'Security',
    gender: 'Male',
    flat_no: null,
    phone: '9000000015',
    occupancy_status: 'Self-Occupied',
    has_pet: false,
    is_approved: true,
  },
];

// ─────────────────────────────────────────────
// INSERT FUNCTION
// ─────────────────────────────────────────────
async function seedTestResidents() {
  const passwordHash = await hashPass();
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  console.log('\n🧪 ============================');
  console.log('   RESIDENT TEST DATA SEEDING');
  console.log('============================\n');
  console.log(`🔐 Default Password for all accounts: ${DEFAULT_PASSWORD}\n`);

  for (const tc of TEST_RESIDENTS) {
    const { _tc, _desc, ...data } = tc;
    try {
      // Check if already exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1', [data.email]
      );
      if (existing.rows.length > 0) {
        console.log(`⏭️  ${_tc} SKIPPED (already exists): ${data.name}`);
        skipCount++;
        continue;
      }

      // Insert
      await pool.query(`
        INSERT INTO users (
          name, email, password_hash, role, gender, flat_no, phone,
          occupancy_status, tenant_type,
          owner_name, owner_phone,
          aadhaar_number, family_members, family_member_names,
          vehicles, move_in_date, lease_expiry_date, lease_duration,
          lease_agreement_submitted,
          emergency_contact_name, emergency_contact_phone,
          has_pet, pet_details,
          is_legacy_bachelor, exemption_ref,
          police_verification_status, police_verification_date,
          noc_document_ref, bachelor_notes,
          is_approved
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9,
          $10, $11,
          $12, $13, $14,
          $15, $16, $17, $18,
          $19,
          $20, $21,
          $22, $23,
          $24, $25,
          $26, $27,
          $28, $29,
          $30
        )
      `, [
        data.name,
        data.email,
        passwordHash,
        data.role,
        data.gender || 'Male',
        data.flat_no || null,
        data.phone || null,
        data.occupancy_status || 'Self-Occupied',
        data.tenant_type || 'Family',
        data.owner_name || null,
        data.owner_phone || null,
        data.aadhaar_number || null,
        data.family_members || null,
        data.family_member_names || null,
        data.vehicles || null,
        data.move_in_date || null,
        data.lease_expiry_date || null,
        data.lease_duration || null,
        data.lease_agreement_submitted !== undefined ? data.lease_agreement_submitted : false,
        data.emergency_contact_name || null,
        data.emergency_contact_phone || null,
        data.has_pet || false,
        data.pet_details || null,
        data.is_legacy_bachelor || false,
        data.exemption_ref || null,
        data.police_verification_status || 'pending',
        data.police_verification_date || null,
        data.noc_document_ref || null,
        data.bachelor_notes || null,
        data.is_approved !== undefined ? data.is_approved : true,
      ]);

      console.log(`✅ ${_tc} CREATED: ${data.name}`);
      console.log(`   📌 ${_desc}`);
      console.log(`   📧 ${data.email} | 🏠 ${data.flat_no || 'N/A (Non-Resident)'} | Role: ${data.role}`);
      console.log('');
      successCount++;

    } catch (err) {
      console.error(`❌ ${_tc} ERROR: ${data.name}`);
      console.error(`   ${err.message}\n`);
      errorCount++;
    }
  }

  console.log('============================');
  console.log(`✅ Created  : ${successCount}`);
  console.log(`⏭️  Skipped  : ${skipCount}`);
  console.log(`❌ Errors   : ${errorCount}`);
  console.log('============================');
  console.log('\n📋 SUMMARY OF TEST ACCOUNTS:');
  console.log('─────────────────────────────────────────────────────────');
  console.log('TC   | Role      | Type              | Flat  | Status');
  console.log('─────────────────────────────────────────────────────────');
  console.log('TC01 | Resident  | Self-Occupied+Pet | G-101 | Approved');
  console.log('TC02 | Resident  | Self-Occupied+Car | G-102 | Approved');
  console.log('TC03 | Resident  | Self-Occupied Min | G-103 | Approved');
  console.log('TC04 | Resident  | Self-Occupied F   | G-104 | Approved');
  console.log('TC05 | Resident  | Rented Family     | G-105 | Approved');
  console.log('TC06 | Resident  | Rented+Lease Sub  | G-106 | Approved');
  console.log('TC07 | Resident  | Bachelor Verified | G-107 | Approved');
  console.log('TC08 | Resident  | Bachelor Pending  | G-108 | Approved');
  console.log('TC09 | Resident  | Bachelor Legacy   | G-109 | Approved');
  console.log('TC10 | Resident  | Lease Expiring    | G-110 | Approved');
  console.log('TC11 | Resident  | Vacant/Checked-out| NULL  | Unapproved');
  console.log('TC12 | Resident  | Pending Approval  | H-201 | Pending ⏳');
  console.log('TC13 | Admin     | Non-Resident      | NULL  | Approved');
  console.log('TC14 | Committee | Non-Resident      | NULL  | Approved');
  console.log('TC15 | Security  | Non-Resident      | NULL  | Approved');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`\n🔐 Password for ALL accounts: ${DEFAULT_PASSWORD}`);
  console.log('🌐 Login at: https://maakaushlyaaprtment.onrender.com\n');

  await pool.end();
}

seedTestResidents().catch(err => {
  console.error('Fatal error:', err);
  pool.end();
  process.exit(1);
});
