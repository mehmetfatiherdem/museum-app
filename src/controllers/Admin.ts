import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Admin from '../models/Admin';

const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) throw new Error('User not found');

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) throw new Error('wrong password');

    res.json({ message: admin.confirmLogin() });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { loginAdmin };
