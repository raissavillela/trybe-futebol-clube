import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import LeaderbordService from '../services/LeaderbordService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do Leaderboard', () => {
  it('Testa se retorna uma lista de times', async () => {
    sinon.stub(LeaderbordService, 'makeLeaderboard').resolves([
      {
        id: 1,
        teamName: 'team1',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
      {
        id: 2,
        teamName: 'team2',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
    ] as any);

    const response = await chai.request(app).get('/leaderboard');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0]).to.have.property('teamName');
    expect(response.body[0].teamName).to.be.eq('team1');
    expect(response.body[0]).to.have.property('points');
    expect(response.body[0].points).to.be.eq(3);
    expect(response.body[0]).to.have.property('goalsScored');
    expect(response.body[0].goalsScored).to.be.eq(2);
    expect(response.body[0]).to.have.property('goalsConceded');
    expect(response.body[0].goalsConceded).to.be.eq(1);
    expect(response.body[0]).to.have.property('goalDifference');
    expect(response.body[0].goalDifference).to.be.eq(1);
    expect(response.body[0]).to.have.property('matchesPlayed');
    expect(response.body[0].matchesPlayed).to.be.eq(1);
  });

  it('Testa de retorna o leaderboard com apenas home games', async () => {
    sinon.stub(LeaderbordService, 'makeHomeLeaderboard').resolves([
      {
        id: 1,
        teamName: 'team1',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
      {
        id: 2,
        teamName: 'team2',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
    ] as any);

    const response = await chai.request(app).get('/leaderboard/home');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0]).to.have.property('teamName');
    expect(response.body[0].teamName).to.be.eq('team1');
    expect(response.body[0]).to.have.property('points');
    expect(response.body[0].points).to.be.eq(3);
    expect(response.body[0]).to.have.property('goalsScored');
    expect(response.body[0].goalsScored).to.be.eq(2);
    expect(response.body[0]).to.have.property('goalsConceded');
    expect(response.body[0].goalsConceded).to.be.eq(1);
    expect(response.body[0]).to.have.property('goalDifference');
    expect(response.body[0].goalDifference).to.be.eq(1);
    expect(response.body[0]).to.have.property('matchesPlayed');
    expect(response.body[0].matchesPlayed).to.be.eq(1);
  });

  it('Testa se retorna o leaderboard com apenas away games', async () => {
    sinon.stub(LeaderbordService, 'makeAwayLeaderboard').resolves([
      {
        id: 1,
        teamName: 'team1',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
      {
        id: 2,
        teamName: 'team2',
        points: 3,
        goalsScored: 2,
        goalsConceded: 1,
        goalDifference: 1,
        matchesPlayed: 1,
      },
    ] as any);

    const response = await chai.request(app).get('/leaderboard/away');

    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0].id).to.be.eq(1);
    expect(response.body[0]).to.have.property('teamName');
    expect(response.body[0].teamName).to.be.eq('team1');
    expect(response.body[0]).to.have.property('points');
    expect(response.body[0].points).to.be.eq(3);
    expect(response.body[0]).to.have.property('goalsScored');
    expect(response.body[0].goalsScored).to.be.eq(2);
    expect(response.body[0]).to.have.property('goalsConceded');
    expect(response.body[0].goalsConceded).to.be.eq(1);
    expect(response.body[0]).to.have.property('goalDifference');
    expect(response.body[0].goalDifference).to.be.eq(1);
    expect(response.body[0]).to.have.property('matchesPlayed');
    expect(response.body[0].matchesPlayed).to.be.eq(1);
  });
});
