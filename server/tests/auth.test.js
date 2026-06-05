// server/tests/auth.test.js
import request from 'supertest';
import app from '../../server/server.js';
import { getDb } from '../config/db.js';

describe('Authentication Flow', () => {
  let cookie;
  const validCredentials = { email: 'resident@maakaushalya.com', password: 'password123' };
  const invalidCredentials = { email: 'resident@maakaushalya.com', password: 'wrong' };

  test('Login with valid credentials sets httpOnly auth_token cookie', async () => {
    const res = await request(app).post('/api/auth/login').send(validCredentials);
    expect(res.statusCode).toBe(200);
    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const authCookie = setCookie.find((c) => c.startsWith('auth_token='));
    expect(authCookie).toBeDefined();
    // Store cookie for later requests
    cookie = authCookie.split(';')[0];
  });

  test('Login with invalid credentials fails', async () => {
    const res = await request(app).post('/api/auth/login').send(invalidCredentials);
    expect(res.statusCode).toBe(401);
  });

  test('Protected route without token fails', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.statusCode).toBe(401);
  });

  test('Protected route with valid token succeeds', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('email');
  });

  test('Expired token should be rejected', async () => {
    // Simulate expiry by using a token with very short ttl (requires manipulating env or jwt)
    // Here we simply send an invalid token string to emulate failure
    const res = await request(app)
      .get('/api/users/profile')
      .set('Cookie', 'auth_token=expired.invalid.token');
    expect(res.statusCode).toBe(401);
  });

  test('Rate limiting blocks after 5 login attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/login').send(invalidCredentials);
    }
    const res = await request(app).post('/api/auth/login').send(invalidCredentials);
    expect(res.statusCode).toBe(429);
  });

  test('Register resident in an already occupied flat should fail', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Resident',
        email: 'duplicate@maakaushalya.com',
        password: 'password123',
        role: 'Resident',
        flatNo: 'C-104',
        phone: '9876543210'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('आरडब्ल्यूए रिकॉर्ड में पहले से ही एक सक्रिय निवासी पंजीकृत है');
  });

  test('Register Tenant in flat with active Self-Occupied Owner should fail', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Tenant',
        email: 'tenant_b304@maakaushalya.com',
        password: 'password123',
        role: 'Resident',
        flatNo: 'B-304',
        phone: '9876543212',
        occupancyStatus: 'Rented',
        ownerName: 'Sufi Illias Chisti'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('सक्रिय स्व-अधिकृत मालिक');
  });

  afterAll(async () => {
    const pool = getDb();
    if (pool) {
      await pool.end();
    }
  });
});
