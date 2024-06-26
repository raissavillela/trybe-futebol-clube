import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/UserModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do Login', () => {
  it('Testa se ao tentar fazer login retorna user not found', async () => {
    const user = {
      email: 'email@example.com',
      password: 'password',
    }

    sinon.stub(User, 'findOne').resolves(null);

    const response = await chai.request(app).post('/login').send(user);

    expect(response.status).to.be.eq(401);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.eq('Invalid email or password');
  });
});
