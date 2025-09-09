import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import { expect } from 'chai';
import { connectDB, disconnectDB } from '../src/db.js';

before(async () => {
  await connectDB();
});

after(async () => {
  await disconnectDB();
});

let token;
let userId;
let petId;
let adoptionId;

describe('Adoption Endpoints', () => {
  before(async () => {
    // Crear usuario con email único
    const uniqueEmail = `bettytester+${Date.now()}@example.com`;

    const userRes = await request(app).post('/api/users/register').send({
      first_name: 'Betty',
      last_name: 'Tester',
      email: uniqueEmail,
      password: 'test123'
    });

    if (userRes.status !== 201) {
      console.error("❌ Falló el registro:", userRes.body);
    }

    expect(userRes.status).to.equal(201);
    expect(userRes.body).to.have.property('payload');
    expect(userRes.body.payload).to.have.property('_id');
    userId = userRes.body.payload._id;

    // Login con el mismo email
    const loginRes = await request(app).post('/api/users/login').send({
      email: uniqueEmail,
      password: 'test123'
    });

    if (loginRes.status !== 200) {
      console.error("❌ Falló el login:", loginRes.body);
    }

    expect(loginRes.body).to.have.property('token');
    token = loginRes.body.token;

    // Crear mascota
    const petRes = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna',
        specie: 'dog',
        birthDate: '2022-01-01'
      });

    if (!petRes.body.payload) {
      console.error("❌ Falló la creación de mascota:", petRes.body);
    }

    expect(petRes.status).to.equal(200);
    expect(petRes.body.payload).to.have.property('_id');
    petId = petRes.body.payload._id;

    // Crear adopción
    const adoptionRes = await request(app)
      .post(`/api/adoptions/${userId}/${petId}`)
      .set('Authorization', `Bearer ${token}`);

    if (!adoptionRes.body.payload) {
      console.error("❌ Falló la creación de adopción:", adoptionRes.body);
    }

    expect(adoptionRes.status).to.equal(200);
    expect(adoptionRes.body).to.have.property('payload');
    expect(adoptionRes.body.payload).to.have.property('_id');
    adoptionId = adoptionRes.body.payload._id;
  });

  it('GET /api/adoptions - debería devolver todas las adopciones', async () => {
    const res = await request(app)
      .get('/api/adoptions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.an('array');
  });

  it('GET /api/adoptions/:aid - debería devolver una adopción específica', async () => {
    const res = await request(app)
      .get(`/api/adoptions/${adoptionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload._id).to.equal(adoptionId);
  });

  it('GET /api/adoptions/:aid - debería fallar si la adopción no existe', async () => {
    const res = await request(app)
      .get('/api/adoptions/64f000000000000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.match(/not found/i);
  });

  it('DELETE /api/adoptions/:aid - debería eliminar una adopción existente', async () => {
    const res = await request(app)
      .delete(`/api/adoptions/${adoptionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
  });

  it('DELETE /api/adoptions/:aid - debería fallar si la adopción no existe', async () => {
    const res = await request(app)
      .delete('/api/adoptions/64f000000000000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.match(/not found/i);
  });
});