import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User';

const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email });
    if (!admin) throw new Error('User not found');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('wrong password');

    res.json({ message: admin.serializedForLogin() });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { loginAdmin };
