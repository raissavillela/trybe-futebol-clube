import Team from '../database/models/TeamModel';

export default class TeamService {
  public static getTeams() {
    return Team.findAll();
  }

  public static getTeam(id: number) {
    return Team.findByPk(id);
  }

  public static checkTeamExists(id: number) {
    return Team.findByPk(id);
  }
}
