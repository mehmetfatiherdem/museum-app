import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signUp = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  if (checkMissingFields([name, lastName, email, password]))
    return res
      .status(422)
      .json({ message: 'There are missing fields in the body!' });

  try {
    const user = await User.create({
      name,
      lastName,
      email,
      password,
      favoriteMuseums: [],
    });

    return res.status(201).json(user.serializedForLogin());
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  if (checkMissingFields([email, password]))
    return res
      .status(422)
      .json({ message: 'There are missing fields in the body!' });

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(422)
      .json({ message: 'No user found with the specified email' });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(422).json({ message: 'Wrong password' });

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

  return res.json(user.serializedForLogin());
};

const signOut = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'signed out' });
};

const getUsers = async (req: Request, res: Response) => {
  const users = await User.find().where('role').equals('normal');

  return res.json(users.map((user) => user.serializedForUserEndpoints()));
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user)
    return res
      .status(422)
      .json({ message: 'No user found with the specified ID' });

  return res.json(user.serializedForUserEndpoints());
};

export { signUp, signIn, signOut, getUsers, getUser };
