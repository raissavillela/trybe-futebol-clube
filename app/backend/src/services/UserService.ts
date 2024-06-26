import * as bcrypt from 'bcryptjs';
import User from '../database/models/UserModel';
import JwtUtils from '../utils/JwtUtils';

export default class UserService {
  public static async login(email: string, password: string) {
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) return { num: 401, message: 'Invalid email or password' };

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) return { num: 401, message: 'Invalid email or password' };

    const token = JwtUtils.generateToken({ id: foundUser.id });

    return { num: 200, token };
  }

  public static async getUserRole(id: number) {
    const foundUser = await User.findByPk(id);

    return { num: 200, role: foundUser?.role };
  }
}
