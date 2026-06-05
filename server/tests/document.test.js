// server/tests/document.test.js
import request from 'supertest';
import app from '../../server/server.js';
import { getDb } from '../config/db.js';

describe('Society Documents API', () => {
  let adminCookie;
  let residentCookie;
  let createdDocId;

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

  test('GET /api/documents without token fails', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/documents with Resident token succeeds', async () => {
    const res = await request(app)
      .get('/api/documents')
      .set('Cookie', residentCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/documents as Resident should fail (RBAC check)', async () => {
    const res = await request(app)
      .post('/api/documents')
      .set('Cookie', residentCookie)
      .send({
        title: 'अवैध परीक्षण दस्तावेज़',
        englishTitle: 'Invalid Test Document',
        description: 'Should fail',
        category: 'Rules',
        fileType: 'PDF',
        fileSize: '100 KB',
        fileName: 'test_file'
      });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/documents as Admin should succeed', async () => {
    const res = await request(app)
      .post('/api/documents')
      .set('Cookie', adminCookie)
      .send({
        title: 'अग्निशमन दिशानिर्देश पत्र',
        englishTitle: 'Fire Safety Guidelines',
        description: 'Fire escape routes and safety compliance details.',
        category: 'Safety',
        fileType: 'PDF',
        fileSize: '320 KB',
        fileName: 'fire_safety_guidelines_2026',
        fileContent: 'RklSRSBTRUNVUklUWSBDT01QTElBTkNFIEJBU0U2NA==',
        isInteractive: false
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    createdDocId = res.body.data.id;
  });

  test('DELETE /api/documents/:id as Resident should fail (RBAC check)', async () => {
    const res = await request(app)
      .delete(`/api/documents/${createdDocId}`)
      .set('Cookie', residentCookie);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /api/documents/:id as Admin should succeed', async () => {
    const res = await request(app)
      .delete(`/api/documents/${createdDocId}`)
      .set('Cookie', adminCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  afterAll(async () => {
    const pool = getDb();
    if (pool) {
      await pool.end();
    }
  });
});
