// server/tests/submission.test.js
import request from 'supertest';
import app from '../../server/server.js';
import { getDb } from '../config/db.js';

describe('Form Submissions API', () => {
  let adminCookie;
  let residentCookie;
  let createdSubmissionId;

  const adminCredentials = { email: 'admin@maakaushalya.com', password: 'password123' };
  const residentCredentials = { email: 'resident@maakaushalya.com', password: 'password123' };

  beforeAll(async () => {
    // Login as Admin to get cookie
    const adminRes = await request(app).post('/api/auth/login').send(adminCredentials);
    const adminSetCookie = adminRes.headers['set-cookie'];
    if (adminSetCookie) {
      adminCookie = adminSetCookie.find((c) => c.startsWith('auth_token=')).split(';')[0];
    }

    // Login as Resident to get cookie
    const residentRes = await request(app).post('/api/auth/login').send(residentCredentials);
    const residentSetCookie = residentRes.headers['set-cookie'];
    if (residentSetCookie) {
      residentCookie = residentSetCookie.find((c) => c.startsWith('auth_token=')).split(';')[0];
    }
  });

  test('POST /api/documents/submissions without token should fail', async () => {
    const res = await request(app).post('/api/documents/submissions').send({
      formType: 'noc',
      flatNo: 'B-304',
      submissionData: { nocName: 'Test Resident', nocFlat: 'B-304', nocPurpose: 'Renovation', nocDetails: 'Need NOC' }
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/documents/submissions as Resident should succeed', async () => {
    const res = await request(app)
      .post('/api/documents/submissions')
      .set('Cookie', residentCookie)
      .send({
        formType: 'noc',
        flatNo: 'B-304',
        submissionData: { nocName: 'Sufi Illias Chisti', nocFlat: 'B-304', nocPurpose: 'Renovation', nocDetails: 'Please approve apartment repaint NOC' }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.form_type).toBe('noc');
    expect(res.body.data.status).toBe('pending');
    createdSubmissionId = res.body.data.id;
  });

  test('POST /api/documents/submissions with vehicle limits exceeded should fail', async () => {
    const res = await request(app)
      .post('/api/documents/submissions')
      .set('Cookie', residentCookie)
      .send({
        formType: 'universal_resident',
        flatNo: 'B-304',
        submissionData: {
          univName: 'Sufi Illias Chisti',
          univFlatNo: 'B-304',
          univVehiclesList: [
            { type: 'Car', number: 'CG 04 1234' },
            { type: 'Car', number: 'CG 04 5678' }
          ]
        }
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('प्रति फ्लैट अधिकतम 1 कार की अनुमति है');
  });

  test('GET /api/documents/submissions without token should fail', async () => {
    const res = await request(app).get('/api/documents/submissions');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/documents/submissions as Resident should retrieve resident\'s own submissions', async () => {
    const res = await request(app)
      .get('/api/documents/submissions')
      .set('Cookie', residentCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Resident id 2
    res.body.data.forEach(sub => {
      expect(sub.user_id).toBe(2);
    });
  });

  test('GET /api/documents/submissions as Admin should retrieve all submissions', async () => {
    const res = await request(app)
      .get('/api/documents/submissions')
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const sub = res.body.data.find(s => s.id === createdSubmissionId);
    expect(sub).toBeDefined();
  });

  test('PUT /api/documents/submissions/:id/status as Resident should fail (RBAC Admin-only)', async () => {
    const res = await request(app)
      .put(`/api/documents/submissions/${createdSubmissionId}/status`)
      .set('Cookie', residentCookie)
      .send({ status: 'approved' });
    expect(res.statusCode).toBe(403);
  });

  test('PUT /api/documents/submissions/:id/status as Admin should succeed and update status', async () => {
    const res = await request(app)
      .put(`/api/documents/submissions/${createdSubmissionId}/status`)
      .set('Cookie', adminCookie)
      .send({ status: 'approved' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('approved');
  });

  afterAll(async () => {
    const pool = getDb();
    if (pool) {
      await pool.end();
    }
  });
});
