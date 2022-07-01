import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';
const saltRounds = 10;

const signUp = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  try {
    checkMissingFields([name, lastName, email, password]);

    //TODO: move this to a service or hash pre save
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      lastName,
      email,
      passwordHash,
      favoriteMuseums: [],
    });

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

export { signUp };
