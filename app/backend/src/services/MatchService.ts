import Team from '../database/models/TeamModel';
import Match from '../database/models/MatchModel';
import TeamService from './TeamService';
import { MatchType } from '../types/MatchType';

type DefaultResponse = {
  num?: number;
  message?: string;
  result?: Match;
};

export default class MatchService {
  public static equalTeamsMessage = 'It is not possible to create a match with two equal teams';
  public static noTeamMessage = 'There is no team with such id!';

  static async getMatchesInProgress() {
    return Match.findAll({
      where: {
        inProgress: 1,
      },
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
  }

  static async getMatchesNotInProgress() {
    return Match.findAll({
      where: {
        inProgress: false,
      },
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    }) as unknown as Promise<MatchType[]>;
  }

  static async getMatches(inProgress: string | undefined) {
    if (inProgress === 'true') return this.getMatchesInProgress();

    if (inProgress === 'false') return this.getMatchesNotInProgress();

    return Match.findAll({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
  }

  static async finishMatch(matchId: number) {
    Match.update({ inProgress: false }, { where: { id: matchId } });
    return { message: 'Finished' };
  }

  static async updateMatch(matchId: number, homeTeamGoals: number, awayTeamGoals: number) {
    Match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id: matchId } },
    );
    return { message: 'Updated' };
  }

  static async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<DefaultResponse> {
    if (homeTeamId === awayTeamId) return { num: 422, message: MatchService.equalTeamsMessage };

    const homeTeam = await TeamService.checkTeamExists(homeTeamId);
    const awayTeam = await TeamService.checkTeamExists(awayTeamId);

    if (!homeTeam || !awayTeam) return { num: 404, message: MatchService.noTeamMessage };

    const response = await Match.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });

    return { result: response };
  }
}
