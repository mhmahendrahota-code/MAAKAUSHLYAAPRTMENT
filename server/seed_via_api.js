/**
 * 🧪 LIVE API SEED SCRIPT
 * माँ कौशल्या अपार्टमेंट - Live Server पर Test Data Insert
 * 
 * यह script live server की API का use करके सभी resident types के test cases डालता है।
 * 
 * Run: node seed_via_api.js
 * 
 * Prerequisites:
 *  - Node.js installed
 *  - Live server running at LIVE_URL
 *  - Admin credentials correct
 */

import fetch from 'node:http';
import https from 'node:https';

const LIVE_URL = 'https://maakaushlyaaprtment.onrender.com';
const ADMIN_EMAIL = 'admin@maakaushalya.com';
const ADMIN_PASSWORD = 'password123';

// Helper: HTTP/HTTPS fetch
function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : fetch;
    
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + (parsed.search || ''),
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = lib.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─────────────────────────────────────────────
// STEP 1: Admin Login
// ─────────────────────────────────────────────
async function adminLogin() {
  console.log('🔐 Admin login...');
  const res = await makeRequest(`${LIVE_URL}/api/auth/login`, { method: 'POST' }, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  if (res.status !== 200 || !res.body.success) {
    throw new Error(`Login failed: ${JSON.stringify(res.body)}`);
  }

  const token = res.body.token;
  // Get cookie
  const cookie = (res.headers['set-cookie'] || []).join('; ');
  console.log('✅ Admin login successful\n');
  return { token, cookie };
}

// ─────────────────────────────────────────────
// STEP 2: Register each test resident via /api/auth/register
// ─────────────────────────────────────────────
async function registerResident(token, cookie, resident) {
  const res = await makeRequest(
    `${LIVE_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': cookie
      }
    },
    resident
  );
  return res;
}

// ─────────────────────────────────────────────
// STEP 3: Approve user by ID
// ─────────────────────────────────────────────
async function approveUser(token, cookie, userId) {
  const res = await makeRequest(
    `${LIVE_URL}/api/users/approve/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': cookie
      }
    }
  );
  return res;
}

// ─────────────────────────────────────────────
// TEST RESIDENTS DATA
// ─────────────────────────────────────────────
const TEST_RESIDENTS = [
  {
    _tc: 'TC-01', _approve: true,
    name: 'टेस्ट TC01 - रमेश वर्मा (Self-Occupied+Pet)',
    email: 'tc01.selfoccupied.pet@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-101', phone: '9000000001',
    occupancyStatus: 'Self-Occupied', tenantType: 'Family',
    familyMembers: 3,
    familyMemberNames: JSON.stringify([
      { name: 'सुनीता वर्मा', phone: '9000000011', gender: 'Female' },
      { name: 'अर्जुन वर्मा', phone: '9000000012', gender: 'Male' }
    ]),
    vehicles: JSON.stringify([{ type: 'Car', number: 'CG 04 TC 0001', sticker: true }]),
    moveInDate: '2020-03-15', aadhaarNumber: '1111 2222 3333',
    emergencyContactName: 'विजय वर्मा', emergencyContactPhone: '9000000099',
    hasPet: true, petDetails: '1 Golden Retriever (Tommy)',
  },
  {
    _tc: 'TC-02', _approve: true,
    name: 'टेस्ट TC02 - अनिल शर्मा (Max Vehicles)',
    email: 'tc02.selfoccupied.vehicles@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-102', phone: '9000000002',
    occupancyStatus: 'Self-Occupied', tenantType: 'Family',
    familyMembers: 2,
    vehicles: JSON.stringify([
      { type: 'Car', number: 'CG 04 TC 0002', sticker: true },
      { type: 'Bike', number: 'CG 04 TC 0022', sticker: true },
      { type: 'Bike', number: 'CG 04 TC 0023', sticker: false }
    ]),
    moveInDate: '2019-11-01', hasPet: false,
  },
  {
    _tc: 'TC-03', _approve: true,
    name: 'टेस्ट TC03 - विकास गुप्ता (Minimal)',
    email: 'tc03.selfoccupied.minimal@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-103', phone: '9000000003',
    occupancyStatus: 'Self-Occupied',
  },
  {
    _tc: 'TC-04', _approve: true,
    name: 'टेस्ट TC04 - प्रिया सिंह (Female Owner)',
    email: 'tc04.selfoccupied.female@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Female',
    flatNo: 'G-104', phone: '9000000004',
    occupancyStatus: 'Self-Occupied', tenantType: 'Family',
    familyMembers: 1,
    vehicles: JSON.stringify([{ type: 'Bike', number: 'CG 04 TC 0041', sticker: true }]),
    moveInDate: '2022-01-10', hasPet: true, petDetails: '2 Persian Cats',
  },
  {
    _tc: 'TC-05', _approve: true,
    name: 'टेस्ट TC05 - सुरेश यादव (Family Tenant)',
    email: 'tc05.rented.family@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-105', phone: '9000000005',
    occupancyStatus: 'Rented', tenantType: 'Family',
    ownerName: 'मोहन लाल (Absent Owner)', ownerPhone: '9000000051',
    familyMembers: 4,
    moveInDate: '2023-06-01', leaseDuration: '11 months',
    leaseAgreementSubmitted: false,
  },
  {
    _tc: 'TC-06', _approve: true,
    name: 'टेस्ट TC06 - दीपक तिवारी (Lease Submitted)',
    email: 'tc06.rented.leasesub@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-106', phone: '9000000006',
    occupancyStatus: 'Rented', tenantType: 'Family',
    ownerName: 'सुभाष चंद्र (Absent Owner)', ownerPhone: '9000000061',
    familyMembers: 2,
    vehicles: JSON.stringify([{ type: 'Bike', number: 'CG 04 TC 0061', sticker: false }]),
    moveInDate: '2024-01-15', leaseDuration: '24 months',
    leaseAgreementSubmitted: true,
    aadhaarNumber: '4444 5555 6666',
    emergencyContactName: 'रमेश तिवारी', emergencyContactPhone: '9000000063',
  },
  {
    _tc: 'TC-07', _approve: true,
    name: 'टेस्ट TC07 - अमित कुमार (Bachelor Verified)',
    email: 'tc07.bachelor.verified@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-107', phone: '9000000007',
    occupancyStatus: 'Rented', tenantType: 'Bachelor',
    ownerName: 'राज किशोर (Absent Owner)', ownerPhone: '9000000071',
    familyMembers: 2,
    moveInDate: '2024-03-01', leaseDuration: '11 months',
    leaseAgreementSubmitted: true,
    aadhaarNumber: '7777 8888 9999',
    isLegacyBachelor: false,
  },
  {
    _tc: 'TC-08', _approve: true,
    name: 'टेस्ट TC08 - राजेश पटेल (Bachelor Pending)',
    email: 'tc08.bachelor.pending@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-108', phone: '9000000008',
    occupancyStatus: 'Rented', tenantType: 'Bachelor',
    ownerName: 'श्याम सुंदर (Absent Owner)', ownerPhone: '9000000081',
    familyMembers: 3,
    moveInDate: '2025-12-01', leaseDuration: '11 months',
    leaseAgreementSubmitted: false,
    isLegacyBachelor: false,
  },
  {
    _tc: 'TC-09', _approve: true,
    name: 'टेस्ट TC09 - करीम खान (Legacy Bachelor)',
    email: 'tc09.bachelor.legacy@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-109', phone: '9000000009',
    occupancyStatus: 'Rented', tenantType: 'Bachelor',
    ownerName: 'अहमद खान (Absent Owner)', ownerPhone: '9000000091',
    familyMembers: 2,
    moveInDate: '2018-05-01', leaseDuration: '11 months',
    leaseAgreementSubmitted: true,
    aadhaarNumber: '2222 3333 4444',
    isLegacyBachelor: true,
    exemptionRef: 'RWA-2018-LEG-U001 (AGM Approved: 15-Apr-2018)',
  },
  {
    _tc: 'TC-10', _approve: true,
    name: 'टेस्ट TC10 - राहुल सोनी (Lease Expiring Soon)',
    email: 'tc10.rented.expiring@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Male',
    flatNo: 'G-110', phone: '9000000010',
    occupancyStatus: 'Rented', tenantType: 'Family',
    ownerName: 'महेश सोनी (Absent Owner)', ownerPhone: '9000000101',
    familyMembers: 1,
    moveInDate: '2025-07-01', leaseDuration: '11 months',
    leaseAgreementSubmitted: true,
  },
  {
    _tc: 'TC-11', _approve: false,  // Pending - no approval needed
    name: 'टेस्ट TC11 - नया निवासी (Pending Approval)',
    email: 'tc11.pending.approval@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Resident', gender: 'Female',
    flatNo: 'H-201', phone: '9000000011',
    occupancyStatus: 'Self-Occupied',
  },
  {
    _tc: 'TC-12', _approve: true,
    name: 'टेस्ट TC12 - टेस्ट समिति सदस्य (Committee)',
    email: 'tc12.committee@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Committee', gender: 'Female',
    phone: '9000000012',
  },
  {
    _tc: 'TC-13', _approve: true,
    name: 'टेस्ट TC13 - टेस्ट गार्ड (Security Guard)',
    email: 'tc13.security@test.maakaushalya.com',
    password: 'TestPass@2026',
    role: 'Security', gender: 'Male',
    phone: '9000000013',
  },
];

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function run() {
  console.log('\n🧪 ========================================');
  console.log('   LIVE API TEST DATA SEEDER');
  console.log('   माँ कौशल्या अपार्टमेंट');
  console.log('=========================================\n');
  console.log(`🌐 Target: ${LIVE_URL}`);
  console.log(`📋 Total Test Cases: ${TEST_RESIDENTS.length}\n`);

  const { token, cookie } = await adminLogin();

  let success = 0, skipped = 0, failed = 0;
  const results = [];

  for (const tc of TEST_RESIDENTS) {
    const { _tc, _approve, ...payload } = tc;

    try {
      const res = await registerResident(token, cookie, payload);

      if (res.status === 201 && res.body.success) {
        const userId = res.body.data?.id;
        let approveStatus = '⏳ Pending';

        // Auto-approve if needed
        if (_approve && userId) {
          const approveRes = await approveUser(token, cookie, userId);
          if (approveRes.status === 200) {
            approveStatus = '✅ Approved';
          } else {
            approveStatus = '⚠️ Approval failed';
          }
        }

        console.log(`✅ ${_tc} CREATED | ${payload.name.substring(0, 40)}`);
        console.log(`   📧 ${payload.email} | ID: ${userId} | ${approveStatus}`);
        results.push({ tc: _tc, status: 'created', id: userId, name: payload.name });
        success++;

      } else if (res.status === 400 && res.body.message?.includes('already exists')) {
        console.log(`⏭️  ${_tc} SKIPPED (already exists): ${payload.name.substring(0, 35)}`);
        skipped++;
      } else {
        console.log(`❌ ${_tc} FAILED: ${payload.name.substring(0, 35)}`);
        console.log(`   HTTP ${res.status}: ${res.body.message || JSON.stringify(res.body)}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${_tc} ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log('\n=========================================');
  console.log(`✅ Created : ${success}`);
  console.log(`⏭️  Skipped : ${skipped}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log('=========================================');
  console.log(`\n🔐 Password for all test accounts: TestPass@2026`);
  console.log(`🌐 Directory: ${LIVE_URL}/directory`);
}

run().catch(console.error);
