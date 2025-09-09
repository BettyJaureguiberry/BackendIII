import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Health check', () => {
  it('GET /health should return 200', async () => {
    const res = await request(app).get('/health');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.match(/conectado/i);
    expect(res.body).to.have.property('dbState', 1);
    expect(res.body).to.have.property('timestamp');
  });
});