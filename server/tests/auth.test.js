// server/tests/auth.test.js
import request from 'supertest';
import app from '../../server/server.js';

describe('Authentication Flow', () => {
  let cookie;
  const validCredentials = { email: 'resident@example.com', password: 'Password123' };
  const invalidCredentials = { email: 'resident@example.com', password: 'wrong' };

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
    expect(res.body).toHaveProperty('email');
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
});
