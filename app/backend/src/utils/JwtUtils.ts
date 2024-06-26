import * as jwt from 'jsonwebtoken';

type JwtPayload = {
  id: number
};

export default class JwtUtils {
  static secret = process.env.JWT_SECRET || 'jwt_secret';

  public static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JwtUtils.secret);
  }

  public static verify(token: string): JwtPayload {
    return jwt.verify(token, JwtUtils.secret) as JwtPayload;
  }
}
