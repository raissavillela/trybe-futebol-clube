import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const response = await UserService.login(email, password);

    return res.status(response.num).json(response.token
      ? { token: response.token } : { message: response.message });
  }

  public static async getUserRole(req: Request, res: Response) {
    const id = req.body.userId;

    const response = await UserService.getUserRole(id);

    return res.status(response.num).json({ role: response.role });
  }
}
