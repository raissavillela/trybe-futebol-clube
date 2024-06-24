import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  public static async getTeams(req: Request, res: Response) {
    const teams = await TeamService.getTeams();
    res.status(200).json(teams);
  }

  public static async getTeam(req: Request, res: Response) {
    const { id } = req.params;
    const team = await TeamService.getTeam(Number(id));
    res.status(200).json(team);
  }
}
