import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/db.js';
import { expect } from 'chai';

before(async () => {
  await connectDB();
});

after(async () => {
  await disconnectDB();
});


describe('Health endpoint', () => {
  it('GET /health should return 200 and status ok', async () => {
    const res = await request(app).get('/health');
    console.log(res.body); // para ver qué devuelve
    expect(res.status).to.equal(200);
    expect(res.body.status).to.match(/conectado/i);
    expect(res.body.dbState).to.equal(1);
    expect(res.body).to.have.property('timestamp');
  });
});