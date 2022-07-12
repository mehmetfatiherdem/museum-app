import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signUp = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  try {
    checkMissingFields([name, lastName, email, password]);

    const user = await User.create({
      name,
      lastName,
      email,
      password,
      favoriteMuseums: [],
    });

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  try {
    checkMissingFields([email, password]);

    const user = await User.findOne({ email });

    if (!user) throw new Error('No registered account found with this email');

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error('Wrong password');

    const cookieAge = 24 * 3600; // Default cookie expiry time is 1 day

    const token = await jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: cookieAge }
    );

    res.cookie('token', token, {
      maxAge: rememberMe ? cookieAge * 14 * 1000 : cookieAge * 1000,
      httpOnly: true,
    });

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

const signOut = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'signed out' });
};



export {
  signUp,
  signIn,
  signOut,
};
