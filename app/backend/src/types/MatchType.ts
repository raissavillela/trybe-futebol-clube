import Team from '../database/models/TeamModel';

export type MatchType = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamGoals: number;
  awayTeamGoals: number;
  homeTeamId: number;
  awayTeamId: number;
  inProgress: boolean;
};
