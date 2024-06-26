import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  static async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    try {
      const matches = await MatchService.getMatches(inProgress as string | undefined);
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await MatchService.finishMatch(Number(id));
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const response = await MatchService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }

  static async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const response = await MatchService
        .createMatch(Number(homeTeamId), Number(awayTeamId), homeTeamGoals, awayTeamGoals);

      if (response.num) {
        return res.status(response.num).json({ message: response.message });
      }

      return res.status(201).json(response.result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }
}
