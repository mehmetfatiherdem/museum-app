import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';

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

export { signUp };
