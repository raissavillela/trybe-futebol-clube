import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/MatchModel';

import JwtUtils from '../utils/JwtUtils';

import { before } from 'mocha';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa o Teams', () => {
  let token: string;

  afterEach(() => {
    sinon.restore();
  });

  before(
    async () => {
      const payload = { id: 1 };
      token = JwtUtils.generateToken(payload);
    }
  );

  it('Testa se retorna uma lista de partidas', async () => {
    sinon.stub(Match, 'findAll').resolves([
      {
        id: 1,
        homeTeamId: 14,
        homeTeamGoals: 2,
        awayTeamId: 4,
        awayTeamGoals: 1,
        inProgress: false,
      },
      {
        id: 2,
        homeTeamId: 14,
        homeTeamGoals: 2,
        awayTeamId: 4,
        awayTeamGoals: 1,
        inProgress: false,
      },
    ] as any);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0]).to.have.property('homeTeamId');
    expect(response.body[0].homeTeamId).to.be.eq(14);
    expect(response.body[0]).to.have.property('homeTeamGoals');
    expect(response.body[0].homeTeamGoals).to.be.eq(2);
    expect(response.body[0]).to.have.property('awayTeamId');
    expect(response.body[0].awayTeamId).to.be.eq(4);
    expect(response.body[0]).to.have.property('awayTeamGoals');
    expect(response.body[0].awayTeamGoals).to.be.eq(1);
    expect(response.body[0]).to.have.property('inProgress');
    expect(response.body[0].inProgress).to.be.eq(false);
  });

  it('Testa se retorna uma de lista de partidas em andamento', async () => {
    sinon.stub(Match, 'findAll').resolves([
      {
        id: 1,
        homeTeamId: 14,
        homeTeamGoals: 2,
        awayTeamId: 4,
        awayTeamGoals: 1,
        inProgress: true,
      },
      {
        id: 2,
        homeTeamId: 14,
        homeTeamGoals: 2,
        awayTeamId: 4,
        awayTeamGoals: 1,
        inProgress: true,
      },
    ] as any);

    const response = await chai.request(app).get('/matches?inProgress=true');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0]).to.have.property('homeTeamId');
    expect(response.body[0].homeTeamId).to.be.eq(14);
    expect(response.body[0]).to.have.property('homeTeamGoals');
    expect(response.body[0].homeTeamGoals).to.be.eq(2);
    expect(response.body[0]).to.have.property('awayTeamId');
    expect(response.body[0].awayTeamId).to.be.eq(4);
    expect(response.body[0]).to.have.property('awayTeamGoals');
    expect(response.body[0].awayTeamGoals).to.be.eq(1);
    expect(response.body[0]).to.have.property('inProgress');
    expect(response.body[0].inProgress).to.be.eq(true);
  });

  it('Testa se a partida finalizou', async () => {
    sinon.stub(Match, 'findByPk').resolves({
      id: 38,
      homeTeamId: 14,
      homeTeamGoals: 2,
      awayTeamId: 4,
      awayTeamGoals: 1,
      inProgress: false,
      update: () => Promise.resolve(),
    } as any);

    const response = await chai.request(app).patch('/matches/1/finish').set('Authorization', `Bearer ${token}`);

    expect(response.body).to.be.have.property('message');
    expect(response.body.message).to.be.eq('Finished');
    expect(response.status).to.be.eq(200);
  });

  it('Testa se atualiza a partida', async () => {
    sinon.stub(Match, 'findByPk').resolves({
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamGoals: 1,
      awayTeamGoals: 2,
      inProgress: false,
      update: () => Promise.resolve(),
    } as any);

    const response = await chai.request(app).patch('/matches/1').send({
      homeScore: 2,
      awayScore: 1,
    }).set('Authorization', `Bearer ${token}`);

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.eq('Updated');
  });

  it('Testa se retorna mensagem de erro ao tentar criar partida com o mesmo time', async () => {
    sinon.stub(Match, 'create').resolves({
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamGoals: 1,
      awayTeamGoals: 2,
      inProgress: false,
    } as any);

    const response = await chai.request(app).post('/matches').send(
      {
        homeTeamId: 1,
        awayTeamId: 1,
        homeScore: 1,
        awayScore: 2,
      },
    ).set('Authorization', `Bearer ${token}`
    );

    expect(response.status).to.be.eq(422);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.eq('It is not possible to create a match with two equal teams');
  });

  it('Testa se uma partida é criada', async () => {
    sinon.stub(Match, 'create').resolves({
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamGoals: 1,
      awayTeamGoals: 2,
    } as any);

    const response = await chai.request(app).post('/matches').send(
      {
        homeTeamId: 1,
        awayTeamId: 2,
        homeScore: 1,
        awayScore: 2,
      },
    ).set('Authorization', `Bearer ${token}`);

    expect(response.status).to.be.eq(201);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('id');
    expect(response.body.id).to.be.eq(1);
    expect(response.body).to.have.property('homeTeamId');
    expect(response.body.homeTeamId).to.be.eq(1);
    expect(response.body).to.have.property('awayTeamId');
    expect(response.body.awayTeamId).to.be.eq(2);
    expect(response.body).to.have.property('homeTeamGoals');
    expect(response.body.homeTeamGoals).to.be.eq(1);
    expect(response.body).to.have.property('awayTeamGoals');
    expect(response.body.awayTeamGoals).to.be.eq(2);
  });
});
