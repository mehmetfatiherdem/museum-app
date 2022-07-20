import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin)
    return res.status(422).json({
      message: 'No admin user found with the specified credentials',
    });

  const match = await bcrypt.compare(password, admin.password);

  if (!match) return res.status(422).json({ message: 'Wrong password' });

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

  return res.json({ message: admin.serializedForLogin() });
};

export { loginAdmin };
