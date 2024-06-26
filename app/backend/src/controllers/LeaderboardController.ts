import { Request, Response } from 'express';
import LeaderbordService from '../services/LeaderbordService';

export default class LeaderboardController {
  static async getHomeLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await LeaderbordService.getHomeLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }

  static async getAwayLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await LeaderbordService.getAwayLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }

  static async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await LeaderbordService.getLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (error) {
      return res.status(500).json({ error: 'Failed' });
    }
  }
}
