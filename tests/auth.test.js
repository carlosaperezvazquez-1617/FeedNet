const request = require('supertest');
const app = require('../src/app');

describe('Autenticación', () => {
  const credenciales = { username: 'admin1', password: 'Password123' };

  it('registra un nuevo usuario', async () => {
    const res = await request(app).post('/api/auth/register').send({
      ...credenciales,
      role: 'administrador',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(credenciales.username);
    expect(res.body.role).toBe('administrador');
  });

  it('rechaza registro duplicado', async () => {
    const res = await request(app).post('/api/auth/register').send(credenciales);
    expect(res.statusCode).toBe(409);
  });

  it('rechaza registro sin contraseña', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'x' });
    expect(res.statusCode).toBe(400);
  });

  it('hace login correctamente y devuelve un token', async () => {
    const res = await request(app).post('/api/auth/login').send(credenciales);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rechaza login con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: credenciales.username, password: 'incorrecta' });
    expect(res.statusCode).toBe(401);
  });

  it('rechaza login de usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'no-existe', password: 'x' });
    expect(res.statusCode).toBe(401);
  });
});