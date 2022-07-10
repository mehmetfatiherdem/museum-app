import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const testAdminAuth = async (req: Request, res: Response) => {
  res.json({ message: 'you are admin yaaaaaaaaaaay' });
};

const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email });
    if (!admin) throw new Error('User not found');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('wrong password');

    const cookieAge = 24 * 3600; // Default cookie expiry time is 1 day

    const token = await jwt.sign(
      {
        id: admin.id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: cookieAge }
    );

    res.cookie('token', token, {
      maxAge: cookieAge,
      httpOnly: true,
    });

    res.json({ message: admin.serializedForLogin() });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { loginAdmin, testAdminAuth };
