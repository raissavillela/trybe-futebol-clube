import MatchService from './MatchService';
import { MatchType } from '../types/MatchType';
import { TeamType } from '../types/TeamType';

export default class LeaderbordService {
  static async getHomeLeaderboard() {
    const generalMatches = await MatchService.getMatchesNotInProgress();
    const matches = LeaderbordService.makeHomeLeaderboard(generalMatches);
    const leaderboard = await LeaderbordService.updateLeaderboard(await matches);
    const sortedLeaderboard = await LeaderbordService.sortLeaderboard(leaderboard);
    return sortedLeaderboard;
  }

  static async getAwayLeaderboard() {
    const generalMatches = await MatchService.getMatchesNotInProgress();
    const matches = LeaderbordService.makeAwayLeaderboard(generalMatches);
    const leaderboard = await LeaderbordService.updateLeaderboard(await matches);
    const sortedLeaderboard = await LeaderbordService.sortLeaderboard(leaderboard);
    return sortedLeaderboard;
  }

  static async getLeaderboard() {
    const generalMatches = await MatchService.getMatchesNotInProgress();
    const matches = LeaderbordService.makeLeaderboard(generalMatches);
    const leaderboard = await LeaderbordService.updateLeaderboard(await matches);
    const sortedLeaderboard = await LeaderbordService.sortLeaderboard(leaderboard);
    return sortedLeaderboard;
  }

  static updateLeaderboard(leaderboard: TeamType[]) {
    const newLeaderboard = [...leaderboard];
    leaderboard.forEach((team) => {
      const teamIndex = newLeaderboard.findIndex((t) => t.name === team.name);
      newLeaderboard[teamIndex].goalsBalance = team.goalsFavor - team.goalsOwn;
      newLeaderboard[teamIndex]
        .efficiency = Number(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2));
    });

    return newLeaderboard;
  }

  static async sortLeaderboard(leaderboard: TeamType[]) {
    const newLeaderboard = [...leaderboard];
    newLeaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
      if (b.goalsBalance !== a.goalsBalance
        && b.goalsBalance !== undefined && a.goalsBalance !== undefined) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });

    return newLeaderboard;
  }

  static async makeHomeLeaderboard(matches: MatchType[]): Promise<TeamType[]> {
    let leaderboard: TeamType[] = [];

    matches.forEach((match) => {
      // const { homeTeam, awayTeam } = match;
      const { homeTeam } = match;

      if (!LeaderbordService.checkTeamExistence(homeTeam.teamName, leaderboard)) {
        LeaderbordService.insertHomeTeam(leaderboard, match, homeTeam.teamName);
      } else {
        leaderboard = LeaderbordService
          .updateExistingTeam(leaderboard, match, homeTeam.teamName, true);
      }

      // if (!LeaderbordService.checkTeamExistence(awayTeam.teamName, leaderboard)) {
      //   LeaderbordService.insertAwayTeam(leaderboard, match, awayTeam.teamName);
      // } else {
      //   leaderboard = LeaderbordService
      //     .updateExistingTeam(leaderboard, match, awayTeam.teamName, false);
      // }
    });

    return leaderboard;
  }

  static async makeAwayLeaderboard(matches: MatchType[]): Promise<TeamType[]> {
    let leaderboard: TeamType[] = [];

    matches.forEach((match) => {
      const { awayTeam } = match;

      if (!LeaderbordService.checkTeamExistence(awayTeam.teamName, leaderboard)) {
        LeaderbordService.insertAwayTeam(leaderboard, match, awayTeam.teamName);
      } else {
        leaderboard = LeaderbordService
          .updateExistingTeam(leaderboard, match, awayTeam.teamName, false);
      }
    });

    return leaderboard;
  }

  static async makeLeaderboard(matches: MatchType[]): Promise<TeamType[]> {
    let leaderboard: TeamType[] = [];

    matches.forEach((match) => {
      const { homeTeam, awayTeam } = match;

      if (!LeaderbordService.checkTeamExistence(homeTeam.teamName, leaderboard)) {
        LeaderbordService.insertHomeTeam(leaderboard, match, homeTeam.teamName);
      } else {
        leaderboard = LeaderbordService
          .updateExistingTeam(leaderboard, match, homeTeam.teamName, true);
      }

      if (!LeaderbordService.checkTeamExistence(awayTeam.teamName, leaderboard)) {
        LeaderbordService.insertAwayTeam(leaderboard, match, awayTeam.teamName);
      } else {
        leaderboard = LeaderbordService
          .updateExistingTeam(leaderboard, match, awayTeam.teamName, false);
      }
    });

    return leaderboard;
  }

  static checkTeamExistence(teamName: string, leaderboard: TeamType[]) {
    const teamFound = leaderboard.find((team) => team.name === teamName);
    return teamFound !== undefined;
  }

  static updateExistingTeam(leaderboard: TeamType[], m: MatchType, tName: string, home: boolean) {
    const { homeTeamGoals, awayTeamGoals } = m;
    const teamIndex = leaderboard.findIndex((team) => team.name === tName);
    const newLeaderboard = [...leaderboard];
    let response;

    if (home) {
      response = LeaderbordService
        .updateHomeTeamLeaderboard(homeTeamGoals, awayTeamGoals, teamIndex, newLeaderboard);
    } else {
      response = LeaderbordService
        .updateAwayTeamLeaderboard(homeTeamGoals, awayTeamGoals, teamIndex, newLeaderboard);
    }

    return response;
  }

  static insertHomeTeam(leaderboard: TeamType[], match: MatchType, teamName: string) {
    const { homeTeamGoals, awayTeamGoals } = match;
    const teamData: TeamType = { name: teamName,
      totalPoints: 0,
      totalGames: 1,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0 };
    teamData.totalVictories = homeTeamGoals > awayTeamGoals ? 1 : 0;
    teamData.totalDraws = homeTeamGoals === awayTeamGoals ? 1 : 0;
    teamData.totalLosses = homeTeamGoals < awayTeamGoals ? 1 : 0;
    teamData.goalsFavor = homeTeamGoals;
    teamData.goalsOwn = awayTeamGoals;
    teamData.totalPoints = LeaderbordService.updateTotalPoints(homeTeamGoals, awayTeamGoals, 0);

    leaderboard.push(teamData);
  }

  static insertAwayTeam(leaderboard: TeamType[], match: MatchType, teamName: string) {
    const { homeTeamGoals, awayTeamGoals } = match;
    const teamData: TeamType = { name: teamName,
      totalGames: 1,
      totalPoints: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      totalDraws: 0,
      totalLosses: 0,
      totalVictories: 0 };
    teamData.totalVictories = awayTeamGoals > homeTeamGoals ? 1 : 0;
    teamData.totalDraws = awayTeamGoals === homeTeamGoals ? 1 : 0;
    teamData.totalLosses = awayTeamGoals < homeTeamGoals ? 1 : 0;
    teamData.goalsFavor = awayTeamGoals;
    teamData.goalsOwn = homeTeamGoals;
    teamData.totalPoints = LeaderbordService.updateTotalPoints(awayTeamGoals, homeTeamGoals, 0);

    leaderboard.push(teamData);
  }

  static updateHomeTeamLeaderboard(
    hTGoals: number,
    aTGoals: number,
    teamIndex: number,
    leaderboard: TeamType[],
  ) {
    const newLeaderboard = [...leaderboard];
    newLeaderboard[teamIndex].totalGames += 1;
    newLeaderboard[teamIndex].totalVictories += hTGoals > aTGoals ? 1 : 0;
    newLeaderboard[teamIndex].totalDraws += hTGoals === aTGoals ? 1 : 0;
    newLeaderboard[teamIndex].totalLosses += hTGoals < aTGoals ? 1 : 0;
    newLeaderboard[teamIndex].goalsFavor += hTGoals;
    newLeaderboard[teamIndex].goalsOwn += aTGoals;
    newLeaderboard[teamIndex].totalPoints = LeaderbordService
      .updateTotalPoints(hTGoals, aTGoals, newLeaderboard[teamIndex].totalPoints);

    return newLeaderboard;
  }

  static updateAwayTeamLeaderboard(
    hTGoals: number,
    aTGoals: number,
    teamIndex: number,
    leaderboard: TeamType[],
  ) {
    const newLeaderboard = [...leaderboard];
    newLeaderboard[teamIndex].totalGames += 1;
    newLeaderboard[teamIndex].totalVictories += aTGoals > hTGoals ? 1 : 0;
    newLeaderboard[teamIndex].totalDraws += aTGoals === hTGoals ? 1 : 0;
    newLeaderboard[teamIndex].totalLosses += aTGoals < hTGoals ? 1 : 0;
    newLeaderboard[teamIndex].goalsFavor += aTGoals;
    newLeaderboard[teamIndex].goalsOwn += hTGoals;
    newLeaderboard[teamIndex].totalPoints = LeaderbordService
      .updateTotalPoints(aTGoals, hTGoals, newLeaderboard[teamIndex].totalPoints);

    return newLeaderboard;
  }

  static updateTotalPoints(
    homeTeamGoals: number,
    awayTeamGoals: number,
    totalPoints: number,
  ) {
    let updatedPoints = totalPoints;
    if (homeTeamGoals > awayTeamGoals) {
      updatedPoints += 3;
    } else if (homeTeamGoals === awayTeamGoals) {
      updatedPoints += 1;
    }

    return updatedPoints;
  }
}
