import { Request, Response, NextFunction } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class AuthMiddleware {
  public static async validateFields(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next();
  }

  public static async validateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      const newToken = token.split(' ')[1];
      const verified = JwtUtils.verify(newToken);
      req.body.userId = Number(verified.id);
    } catch (err) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    next();
  }
}
