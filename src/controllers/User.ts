import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../helpers/type';

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
    if (!match) throw new Error('wrong password');

    const cookieAge = 24 * 3600; // Default cookie expiry time is 1 day

    const token = await jwt.sign(
      {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.lastName,
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

const favMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  try {
    checkMissingFields([museumId]);

    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    if (user.favoriteMuseums.includes(museumId)) {
      throw new Error('Museum already in favorites');
    }

    user.favoriteMuseums.push(museumId);
    await user.save();

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

const removeFavMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  try {
    checkMissingFields([museumId]);

    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    if (!user.favoriteMuseums.includes(museumId)) {
      throw new Error('Museum not in favorites');
    }

    user.favoriteMuseums.splice(user.favoriteMuseums.indexOf(museumId), 1);
    await user.save();

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { signUp, signIn, signOut, favMuseum, removeFavMuseum };
