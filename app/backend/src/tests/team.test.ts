import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do Teams', () => {
  it('should return a list of teams', async () => {
    sinon.stub(Team, 'findAll').resolves([
      {
        id: 1,
        name: 'Team 1',
      },
      {
        id: 2,
        name: 'Team 2',
      },
    ] as any);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0].name).to.be.eq('Team 1');
    expect(response.body[1].id).to.be.eq(2);
    expect(response.body[1].name).to.be.eq('Team 2');
  });

  it('should return a team', async () => {
    sinon.stub(Team, 'findByPk').resolves({
      id: 1,
      name: 'Team 1',
    } as any);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('object');
    expect(response.body.id).to.be.eq(1);
    expect(response.body.name).to.be.eq('Team 1');
  });
});