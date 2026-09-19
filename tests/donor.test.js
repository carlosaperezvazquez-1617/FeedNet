const request = require('supertest');
const app = require('../src/app');

describe('Módulo de donantes', () => {
  let tokenAdmin;
  let tokenUsuario;
  let donorId;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'admin2',
      password: 'Password123',
      role: 'administrador',
    });
    await request(app).post('/api/auth/register').send({
      username: 'usuario2',
      password: 'Password123',
      role: 'usuario',
    });

    const loginAdmin = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin2', password: 'Password123' });
    tokenAdmin = loginAdmin.body.token;

    const loginUsuario = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usuario2', password: 'Password123' });
    tokenUsuario = loginUsuario.body.token;
  });

  it('rechaza acceso sin token', async () => {
    const res = await request(app).get('/api/donors');
    expect(res.statusCode).toBe(401);
  });

  it('crea un donante con token válido', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ nombre: 'Juan Pérez', email: 'juan@example.com', monto: 500 });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Juan Pérez');
    donorId = res.body.id;
  });

  it('rechaza creación con datos incompletos', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ nombre: 'Sin datos' });
    expect(res.statusCode).toBe(400);
  });

  it('lista los donantes', async () => {
    const res = await request(app)
      .get('/api/donors')
      .set('Authorization', `Bearer ${tokenUsuario}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('obtiene un donante por id', async () => {
    const res = await request(app)
      .get(`/api/donors/${donorId}`)
      .set('Authorization', `Bearer ${tokenUsuario}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(donorId);
  });

  it('devuelve 404 si el donante no existe', async () => {
    const res = await request(app)
      .get('/api/donors/no-existe')
      .set('Authorization', `Bearer ${tokenUsuario}`);
    expect(res.statusCode).toBe(404);
  });

  it('rechaza actualización de un usuario sin rol administrador', async () => {
    const res = await request(app)
      .put(`/api/donors/${donorId}`)
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ monto: 999 });
    expect(res.statusCode).toBe(403);
  });

  it('permite actualización a un administrador', async () => {
    const res = await request(app)
      .put(`/api/donors/${donorId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ monto: 999 });
    expect(res.statusCode).toBe(200);
    expect(res.body.monto).toBe(999);
  });

  it('rechaza eliminación de un usuario sin rol administrador', async () => {
    const res = await request(app)
      .delete(`/api/donors/${donorId}`)
      .set('Authorization', `Bearer ${tokenUsuario}`);
    expect(res.statusCode).toBe(403);
  });

  it('permite eliminación a un administrador', async () => {
    const res = await request(app)
      .delete(`/api/donors/${donorId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(204);
  });
});