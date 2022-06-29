import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User';
const saltRounds = 10;

const signUp = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;
  //TODO: move this to a helper
  try {
    if (!name || !lastName || !email || !password)
      throw new Error('there are missing fields!');

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
